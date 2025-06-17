import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Navigation } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OrderMapsProps {
  orders: any[];
  companyId?: number;
}

const OrderMaps: React.FC<OrderMapsProps> = ({ orders, companyId }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [animatedVehicles, setAnimatedVehicles] = useState<any[]>([]);

  // Filter orders by company
  const filteredOrders = orders.filter(order => 
    !companyId || order.companyId === companyId || order.companyId === user?.companyId
  );

  // Load Google Maps script
  useEffect(() => {
    if (isOpen && !mapLoaded) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else if (isOpen && mapLoaded) {
      initializeMap();
    }
  }, [isOpen, mapLoaded]);

  // Cleanup animated vehicles when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setAnimatedVehicles([]);
    }
  }, [isOpen]);

  // Function to create animated vehicle
  const createAnimatedVehicle = (map: any, start: any, end: any, orderId: number) => {
    const vehicleIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="24" height="16" rx="2" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <circle cx="10" cy="26" r="3" fill="#374151"/>
          <circle cx="22" cy="26" r="3" fill="#374151"/>
          <rect x="6" y="10" width="20" height="8" rx="1" fill="#60a5fa"/>
          <circle cx="10" cy="26" r="1.5" fill="#9ca3af"/>
          <circle cx="22" cy="26" r="1.5" fill="#9ca3af"/>
          <text x="16" y="16" text-anchor="middle" font-size="8" fill="white" font-family="Arial">🚛</text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    };

    const vehicle = new window.google.maps.Marker({
      map: map,
      position: start,
      icon: vehicleIcon,
      title: `Vehicle for Order ${orderId} (Pending)`
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 5px 0; color: #3b82f6;">🚛 Vehicle in Transit</h3>
          <p style="margin: 0 0 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 0 0 5px 0;"><strong>Status:</strong> <span style="color: #f59e0b;">Pending</span></p>
          <p style="margin: 0;">Delivery in progress...</p>
        </div>
      `
    });

    vehicle.addListener('click', () => {
      infoWindow.open(map, vehicle);
    });

    // Animate vehicle between start and end points
    let progress = 0;
    const duration = 10000; // 10 seconds for one complete journey
    const stepTime = 50; // Update every 50ms

    const animate = () => {
      progress += stepTime / duration;
      
      if (progress > 1) {
        progress = 0; // Reset animation
      }

      // Calculate current position using linear interpolation
      const lat = start.lat() + (end.lat() - start.lat()) * progress;
      const lng = start.lng() + (end.lng() - start.lng()) * progress;
      
      vehicle.setPosition(new window.google.maps.LatLng(lat, lng));
      
      // Continue animation
      setTimeout(animate, stepTime);
    };

    // Start animation
    animate();

    return vehicle;
  };

  const initializeMap = () => {
    if (!window.google || !window.google.maps) return;

    const mapElement = document.getElementById('order-map');
    if (!mapElement) return;

    // Default center (Istanbul, Turkey)
    const map = new window.google.maps.Map(mapElement, {
      zoom: 10,
      center: { lat: 41.0082, lng: 28.9784 },
      mapTypeId: 'roadmap'
    });

    const bounds = new window.google.maps.LatLngBounds();
    const geocoder = new window.google.maps.Geocoder();
    const pendingOrdersData: any[] = []; // Store data for pending orders

    // Add markers for each order
    filteredOrders.forEach((order, index) => {
      const isPending = order.status === 'PENDING' || order.orderStatus === 'PENDING';
      
      // Store pending order data for later processing
      if (isPending) {
        pendingOrdersData.push(order);
      }
      
      // Geocode pickup address
      if (order.pickupAddress) {
        geocoder.geocode({ address: order.pickupAddress }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const pickupMarker = new window.google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              title: `ORD-${order.orderId} - Pickup`,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#22c55e"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24)
              }
            });

            const pickupInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 5px 0; color: #22c55e;">📍 Pickup Location</h3>
                  <p style="margin: 0 0 5px 0;"><strong>Order:</strong> ORD-${order.orderId}</p>
                  <p style="margin: 0 0 5px 0;"><strong>Status:</strong> ${isPending ? '<span style="color: #f59e0b;">Pending</span>' : order.status || 'N/A'}</p>
                  <p style="margin: 0 0 5px 0;"><strong>Date:</strong> ${order.pickupDate}</p>
                  <p style="margin: 0;"><strong>Address:</strong> ${order.pickupAddress}</p>
                </div>
              `
            });

            pickupMarker.addListener('click', () => {
              pickupInfoWindow.open(map, pickupMarker);
            });

            bounds.extend(results[0].geometry.location);
            
            // Store pickup location for pending orders
            if (isPending) {
              order.pickupLocation = results[0].geometry.location;
            }
          }
        });
      }

      // Geocode destination address
      if (order.destinationAddress) {
        geocoder.geocode({ address: order.destinationAddress }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const destinationMarker = new window.google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              title: `ORD-${order.orderId} - Destination`,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ef4444"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24)
              }
            });

            const destinationInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 5px 0; color: #ef4444;">🏁 Destination</h3>
                  <p style="margin: 0 0 5px 0;"><strong>Order:</strong> ORD-${order.orderId}</p>
                  <p style="margin: 0 0 5px 0;"><strong>Status:</strong> ${isPending ? '<span style="color: #f59e0b;">Pending</span>' : order.status || 'N/A'}</p>
                  <p style="margin: 0 0 5px 0;"><strong>Date:</strong> ${order.deliveryDate}</p>
                  <p style="margin: 0;"><strong>Address:</strong> ${order.destinationAddress}</p>
                </div>
              `
            });

            destinationMarker.addListener('click', () => {
              destinationInfoWindow.open(map, destinationMarker);
            });

            bounds.extend(results[0].geometry.location);
            
            // Store destination location and create route for pending orders
            if (isPending) {
              order.destinationLocation = results[0].geometry.location;
              
              // Check if both pickup and destination are available
              if (order.pickupLocation && order.destinationLocation) {
                // Draw route line
                const routePath = new window.google.maps.Polyline({
                  path: [order.pickupLocation, order.destinationLocation],
                  geodesic: true,
                  strokeColor: '#f59e0b',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                  map: map
                });

                // Create animated vehicle
                const vehicle = createAnimatedVehicle(
                  map, 
                  order.pickupLocation, 
                  order.destinationLocation, 
                  order.orderId
                );
                
                // Store vehicle reference
                setAnimatedVehicles(prev => [...prev, vehicle]);
              }
            }
          }
        });
      }
    });

    // Fit map to show all markers
    setTimeout(() => {
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      }
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          View on Map
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]" aria-describedby="maps-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Order Locations Map
          </DialogTitle>
          <DialogDescription id="maps-description">
            Pickup and destination locations for company orders
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-6 p-3 bg-gray-50 rounded-lg flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm">Pickup Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm">Destination Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span className="text-sm">Pending Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🚛</span>
              <span className="text-sm">Vehicles in Transit</span>
            </div>
            <div className="text-sm text-gray-600">
              Total Orders: {filteredOrders.length} | Pending: {filteredOrders.filter(o => o.status === 'PENDING' || o.orderStatus === 'PENDING').length}
            </div>
          </div>
          
          {/* Map Container */}
          <div 
            id="order-map" 
            className="w-full h-96 rounded-lg border"
            style={{ minHeight: '400px' }}
          >
            {!mapLoaded && (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading map...
              </div>
            )}
          </div>

          {/* Environmental Notice */}
          {import.meta.env.DEV && !import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Google Maps API key is required for map functionality. 
                Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderMaps; 