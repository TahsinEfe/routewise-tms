import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Navigation, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

interface SingleOrderMapProps {
  orderId: number;
  pickupAddress: string;
  destinationAddress: string;
  orderDate: string;
}

const SingleOrderMap: React.FC<SingleOrderMapProps> = ({ 
  orderId, 
  pickupAddress, 
  destinationAddress, 
  orderDate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptAdded, setScriptAdded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingMethod, setLoadingMethod] = useState<'callback' | 'direct' | 'iframe'>('callback');
  const [animatedVehicle, setAnimatedVehicle] = useState<any>(null);

  // Clean up function
  const cleanupMap = () => {
    // Clean up animated vehicle
    if (animatedVehicle && animatedVehicle.cleanup) {
      animatedVehicle.cleanup();
    }
    setAnimatedVehicle(null);

    const mapElement = document.getElementById(`single-order-map-${orderId}`);
    if (mapElement) {
      mapElement.innerHTML = '';
    }
    
    // Remove existing scripts
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    existingScripts.forEach(script => script.remove());
    
    // Clean up global callbacks
    if (window.initGoogleMaps) {
      delete window.initGoogleMaps;
    }
    if (window.gm_authFailure) {
      delete window.gm_authFailure;
    }
  };

  // Error handling
  useEffect(() => {
    const handleGoogleMapsError = (error: any) => {
      console.error('Google Maps API Error:', error);
      
      if (error.error === 'BillingNotEnabledMapError') {
        setMapError('billing');
      } else if (error.error === 'ApiNotActivatedMapError') {
        setMapError('activation');
      } else if (error.error === 'InvalidKeyMapError') {
        setMapError('invalid_key');
      } else if (error.error === 'RefererNotAllowedMapError') {
        setMapError('referer');
      } else if (error.error === 'QuotaExceededError') {
        setMapError('quota');
      } else {
        setMapError('general');
      }
    };

    // Global error handler
    window.gm_authFailure = () => handleGoogleMapsError({ error: 'InvalidKeyMapError' });
    
    // Enhanced console error monitoring
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('BillingNotEnabledMapError')) {
        handleGoogleMapsError({ error: 'BillingNotEnabledMapError' });
      } else if (errorMessage.includes('ApiNotActivatedMapError')) {
        handleGoogleMapsError({ error: 'ApiNotActivatedMapError' });
      } else if (errorMessage.includes('QuotaExceededError')) {
        handleGoogleMapsError({ error: 'QuotaExceededError' });
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
      delete window.gm_authFailure;
    };
  }, []);

  // Load Google Maps with different methods
  const loadGoogleMapsScript = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'demo_key_please_replace') {
      setMapError('no_key');
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      setScriptAdded(true);
      setTimeout(() => initializeMap(), 100);
      return;
    }

    try {
      if (loadingMethod === 'callback') {
        await loadWithCallback(apiKey);
      } else if (loadingMethod === 'direct') {
        await loadDirectly(apiKey);
      } else if (loadingMethod === 'iframe') {
        loadWithIframe();
        return;
      }
    } catch (error) {
      console.error('Failed to load Google Maps:', error);
      if (retryCount < 2) {
        // Try different loading method
        const nextMethod = loadingMethod === 'callback' ? 'direct' : 
                          loadingMethod === 'direct' ? 'iframe' : 'callback';
        setLoadingMethod(nextMethod);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          setMapError(null);
          setMapLoaded(false);
          setScriptAdded(false);
        }, 1000);
      } else {
        setMapError('script_load');
      }
    }
  };

  const loadWithCallback = (apiKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      window.initGoogleMaps = () => {
        setMapLoaded(true);
        setScriptAdded(true);
        resolve();
        setTimeout(() => initializeMap(), 100);
      };
      
      script.onerror = () => reject(new Error('Script load failed'));
      
      document.head.appendChild(script);
      
      // Timeout
      setTimeout(() => {
        if (!mapLoaded) {
          reject(new Error('Callback timeout'));
        }
      }, 15000);
    });
  };

  const loadDirectly = (apiKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait for Google Maps to be available
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogle);
            setMapLoaded(true);
            setScriptAdded(true);
            resolve();
            setTimeout(() => initializeMap(), 100);
          }
        }, 100);
        
        // Timeout for checking
        setTimeout(() => {
          clearInterval(checkGoogle);
          if (!mapLoaded) {
            reject(new Error('Google Maps not available'));
          }
        }, 10000);
      };
      
      script.onerror = () => reject(new Error('Script load failed'));
      
      document.head.appendChild(script);
    });
  };

  const loadWithIframe = () => {
    const mapElement = document.getElementById(`single-order-map-${orderId}`);
    if (!mapElement) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    // Create iframe with embed API as fallback
    const pickupQuery = encodeURIComponent(pickupAddress);
    const destinationQuery = encodeURIComponent(destinationAddress);
    
    mapElement.innerHTML = `
      <div class="w-full h-full relative">
        <iframe
          width="100%"
          height="100%"
          style="border:0; border-radius: 8px;"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${pickupQuery}&destination=${destinationQuery}&mode=driving">
        </iframe>
        <div class="absolute top-2 left-2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-xs">
          <span class="text-green-600">📍 ${pickupAddress}</span> → <span class="text-red-600">🏁 ${destinationAddress}</span>
        </div>
      </div>
    `;
    
    setMapLoaded(true);
    setMapError(null);
  };

  // Main loading effect
  useEffect(() => {
    if (isOpen && !mapLoaded && !scriptAdded && !mapError) {
      loadGoogleMapsScript();
    } else if (isOpen && mapLoaded && !mapError && loadingMethod !== 'iframe') {
      setTimeout(() => initializeMap(), 100);
    }
  }, [isOpen, mapLoaded, scriptAdded, mapError, loadingMethod]);

  // Cleanup on unmount and when dialog closes
  useEffect(() => {
    return () => {
      cleanupMap();
    };
  }, [orderId]);

  useEffect(() => {
    if (!isOpen && animatedVehicle) {
      if (animatedVehicle.cleanup) {
        animatedVehicle.cleanup();
      }
      setAnimatedVehicle(null);
    }
  }, [isOpen, animatedVehicle]);

  // Function to create animated vehicle between pickup and destination
  const createAnimatedVehicle = (map: any, start: any, end: any) => {
    const vehicleIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="12" width="28" height="18" rx="3" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <circle cx="12" cy="32" r="4" fill="#374151"/>
          <circle cx="28" cy="32" r="4" fill="#374151"/>
          <rect x="8" y="14" width="24" height="10" rx="2" fill="#60a5fa"/>
          <circle cx="12" cy="32" r="2" fill="#9ca3af"/>
          <circle cx="28" cy="32" r="2" fill="#9ca3af"/>
          <rect x="10" y="16" width="20" height="6" rx="1" fill="#dbeafe"/>
          <text x="20" y="21" text-anchor="middle" font-size="10" fill="#1e40af" font-family="Arial" font-weight="bold">🚛</text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20)
    };

    const vehicle = new window.google.maps.Marker({
      map: map,
      position: start,
      icon: vehicleIcon,
      title: `Vehicle for Order ${orderId}`,
      zIndex: 1000
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 15px; max-width: 300px;">
          <h3 style="margin: 0 0 10px 0; color: #3b82f6; font-size: 16px;">🚛 Vehicle in Transit</h3>
          <p style="margin: 0 0 8px 0; font-weight: bold;">Order ID: ${orderId}</p>
          <p style="margin: 0 0 8px 0;"><strong>Status:</strong> <span style="color: #f59e0b;">En Route</span></p>
          <p style="margin: 0;">Delivery in progress...</p>
        </div>
      `
    });

    vehicle.addListener('click', () => {
      infoWindow.open(map, vehicle);
    });

    // Animate vehicle between start and end points
    let progress = 0;
    const duration = 15000; // 15 seconds for one complete journey
    const stepTime = 100; // Update every 100ms for smoother animation
    let animationId: number;

    const animate = () => {
      progress += stepTime / duration;
      
      if (progress > 1) {
        progress = 0; // Reset animation
      }

      // Calculate current position using smooth interpolation
      const lat = start.lat() + (end.lat() - start.lat()) * progress;
      const lng = start.lng() + (end.lng() - start.lng()) * progress;
      
      vehicle.setPosition(new window.google.maps.LatLng(lat, lng));
      
      // Continue animation
      animationId = window.setTimeout(animate, stepTime);
    };

    // Start animation
    animate();

    // Store cleanup function
    vehicle.cleanup = () => {
      if (animationId) {
        clearTimeout(animationId);
      }
      vehicle.setMap(null);
    };

    return vehicle;
  };

  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps not available');
      setMapError('not_available');
      return;
    }

    const mapElement = document.getElementById(`single-order-map-${orderId}`);
    if (!mapElement) {
      console.warn('Map element not found');
      return;
    }

    try {
      // Default center (Istanbul, Turkey)
      const map = new window.google.maps.Map(mapElement, {
        zoom: 10,
        center: { lat: 41.0082, lng: 28.9784 },
        mapTypeId: 'roadmap',
        gestureHandling: 'greedy',
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      });

      const bounds = new window.google.maps.LatLngBounds();
      const geocoder = new window.google.maps.Geocoder();
      let markersAdded = 0;
      let pickupLocation: any = null;
      let destinationLocation: any = null;

      // Geocode pickup address
      if (pickupAddress) {
        geocoder.geocode({ address: pickupAddress }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const pickupMarker = new window.google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              title: `ORD-${orderId} - Pickup`,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#22c55e"/>
                    <circle cx="12" cy="9" r="3" fill="white"/>
                    <text x="12" y="13" text-anchor="middle" fill="black" font-size="10" font-weight="bold">P</text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(32, 32)
              }
            });

            const pickupInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 15px; max-width: 300px;">
                  <h3 style="margin: 0 0 10px 0; color: #22c55e; font-size: 16px;">📍 Pickup Location</h3>
                  <p style="margin: 0 0 8px 0; font-weight: bold;">Order: ORD-${orderId}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${orderDate}</p>
                  <p style="margin: 0; line-height: 1.4;"><strong>Address:</strong> ${pickupAddress}</p>
                </div>
              `
            });

            pickupMarker.addListener('click', () => {
              pickupInfoWindow.open(map, pickupMarker);
            });

            bounds.extend(results[0].geometry.location);
            markersAdded++;
            pickupLocation = results[0].geometry.location;
            
            // Check if we have both locations to create route and vehicle
            if (pickupLocation && destinationLocation) {
              createRouteAndVehicle(map, pickupLocation, destinationLocation);
            }
            
            if (markersAdded === 2 || !destinationAddress) {
              fitMapBounds();
            }
          } else {
            console.warn('Pickup geocoding failed:', status);
          }
        });
      }

      // Geocode destination address
      if (destinationAddress) {
        geocoder.geocode({ address: destinationAddress }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const destinationMarker = new window.google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              title: `ORD-${orderId} - Destination`,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ef4444"/>
                    <circle cx="12" cy="9" r="3" fill="white"/>
                    <text x="12" y="13" text-anchor="middle" fill="black" font-size="10" font-weight="bold">D</text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(32, 32)
              }
            });

            const destinationInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 15px; max-width: 300px;">
                  <h3 style="margin: 0 0 10px 0; color: #ef4444; font-size: 16px;">🏁 Destination</h3>
                  <p style="margin: 0 0 8px 0; font-weight: bold;">Order: ORD-${orderId}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${orderDate}</p>
                  <p style="margin: 0; line-height: 1.4;"><strong>Address:</strong> ${destinationAddress}</p>
                </div>
              `
            });

            destinationMarker.addListener('click', () => {
              destinationInfoWindow.open(map, destinationMarker);
            });

            bounds.extend(results[0].geometry.location);
            markersAdded++;
            destinationLocation = results[0].geometry.location;
            
            // Check if we have both locations to create route and vehicle
            if (pickupLocation && destinationLocation) {
              createRouteAndVehicle(map, pickupLocation, destinationLocation);
            }
            
            if (markersAdded === 2 || !pickupAddress) {
              fitMapBounds();
            }
          } else {
            console.warn('Destination geocoding failed:', status);
          }
        });
      }

      // Function to create route line and animated vehicle
      const createRouteAndVehicle = (map: any, pickup: any, destination: any) => {
        // Draw route line
        const routePath = new window.google.maps.Polyline({
          path: [pickup, destination],
          geodesic: true,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map: map
        });

        // Create animated vehicle
        const vehicle = createAnimatedVehicle(map, pickup, destination);
        setAnimatedVehicle(vehicle);
      };

      const fitMapBounds = () => {
        setTimeout(() => {
          if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
            
            const listener = window.google.maps.event.addListener(map, 'bounds_changed', () => {
              if (map.getZoom() > 15) {
                map.setZoom(15);
              }
              window.google.maps.event.removeListener(listener);
            });
          }
        }, 1000);
      };

      if (!pickupAddress && !destinationAddress) {
        fitMapBounds();
      }

    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setMapError('initialization');
    }
  };

  const retryMapLoad = () => {
    cleanupMap();
    setMapError(null);
    setMapLoaded(false);
    setScriptAdded(false);
    setRetryCount(0);
    setLoadingMethod('callback');
  };

  const tryAlternativeMethod = () => {
    cleanupMap();
    setMapError(null);
    setMapLoaded(false);
    setScriptAdded(false);
    setLoadingMethod('iframe');
    setRetryCount(0);
  };

  const getErrorContent = () => {
    const commonButtons = (
      <div className="flex gap-2 justify-center mt-4">
        <Button onClick={retryMapLoad} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Yeniden Dene
        </Button>
        <Button onClick={tryAlternativeMethod} variant="default" size="sm">
          <MapPin className="w-4 h-4 mr-2" />
          Alternatif Yöntem
        </Button>
      </div>
    );

    switch (mapError) {
      case 'billing':
        return (
          <div className="text-center p-8 space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Faturalandırma Etkinleştirilmemiş</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Google Maps API'sı için faturalandırma etkinleştirilmelidir.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                <strong>Çözüm:</strong> Google Cloud Console'da faturalandırmayı etkinleştirin.
              </p>
              <a 
                href="https://console.cloud.google.com/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 text-sm"
              >
                Google Cloud Billing <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {commonButtons}
          </div>
        );
      
      case 'activation':
        return (
          <div className="text-center p-8 space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">API Etkinleştirilmemiş</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Maps JavaScript API etkinleştirilmelidir.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                <strong>Çözüm:</strong> Google Cloud Console'da Maps JavaScript API'sını etkinleştirin.
              </p>
              <a 
                href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 text-sm"
              >
                Maps JavaScript API'sını Etkinleştir <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {commonButtons}
          </div>
        );

      default:
        return (
          <div className="text-center p-8 space-y-4">
            <AlertTriangle className="w-12 h-12 text-blue-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Harita Yükleme Sorunu</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Farklı yükleme yöntemleri deneniyor...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Yöntem: {loadingMethod} | Deneme: {retryCount + 1}
              </p>
            </div>
            {commonButtons}
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <MapPin className="w-3 h-3 mr-1" />
          View on Map
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Order ORD-{orderId} Route Map
          </DialogTitle>
          <DialogDescription>
            Pickup and destination locations for this order
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Route Info */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="font-medium text-green-700 dark:text-green-400">Pickup Location</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">{pickupAddress}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="font-medium text-red-700 dark:text-red-400">Destination</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">{destinationAddress}</p>
            </div>
          </div>
          
          {/* Map Container */}
          <div 
            className="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            style={{ minHeight: '400px' }}
          >
            {mapError ? (
              getErrorContent()
            ) : (
              <>
                <div 
                  id={`single-order-map-${orderId}`}
                  className="w-full h-full rounded-lg"
                />
                {!mapLoaded && (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p>Harita yükleniyor...</p>
                      <p className="text-xs mt-1">Yöntem: {loadingMethod}</p>
                      {retryCount > 0 && <p className="text-xs">Deneme: {retryCount + 1}</p>}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SingleOrderMap; 