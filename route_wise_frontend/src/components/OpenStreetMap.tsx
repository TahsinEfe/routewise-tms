import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Navigation, Route, RefreshCw } from 'lucide-react';

interface OpenStreetMapProps {
  orderId: number;
  pickupAddress: string;
  destinationAddress: string;
  orderDate: string;
  onDistanceCalculated?: (distance: number) => void;
}

// Custom marker icons
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px; 
        height: 30px; 
        background-color: ${color}; 
        border: 2px solid white; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-weight: bold; 
        color: white; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        font-size: 12px;
      ">${label}</div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const pickupIcon = createCustomIcon('#22c55e', 'P');
const destinationIcon = createCustomIcon('#ef4444', 'D');

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ 
  orderId, 
  pickupAddress, 
  destinationAddress, 
  orderDate,
  onDistanceCalculated 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.0082, 28.9784]); // Istanbul default
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);

  // Geocoding function using Nominatim (OpenStreetMap's geocoding service)
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return [lat, lon];
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Route calculation using OpenRouteService (free alternative to Google Directions)
  const calculateRoute = async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
    try {
      // Using a simple great circle route as fallback since OpenRouteService requires API key
      // For production, you can use OpenRouteService, GraphHopper, or other routing services
      const latDiff = end[0] - start[0];
      const lonDiff = end[1] - start[1];
      const steps = 10;
      
      const route: [number, number][] = [];
      for (let i = 0; i <= steps; i++) {
        const lat = start[0] + (latDiff * i) / steps;
        const lon = start[1] + (lonDiff * i) / steps;
        route.push([lat, lon]);
      }
      
      return route;
    } catch (error) {
      console.error('Route calculation error:', error);
      return [start, end]; // Fallback to straight line
    }
  };

  // Load coordinates when dialog opens
  useEffect(() => {
    if (isOpen && (!pickupCoords || !destinationCoords)) {
      loadMapData();
    }
  }, [isOpen]);

  const loadMapData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Geocode addresses
      const [pickup, destination] = await Promise.all([
        geocodeAddress(pickupAddress),
        geocodeAddress(destinationAddress)
      ]);

      if (pickup) {
        setPickupCoords(pickup);
      }
      
      if (destination) {
        setDestinationCoords(destination);
      }

      // Calculate route and distance if both coordinates are available
      if (pickup && destination) {
        const route = await calculateRoute(pickup, destination);
        setRouteCoords(route);
        
        // Calculate real distance using Haversine formula
        const distance = calculateDistance(pickup, destination);
        setCalculatedDistance(distance);
        
        // Pass distance back to parent component
        if (onDistanceCalculated) {
          onDistanceCalculated(distance);
        }
        
        // Set map center to midpoint
        const centerLat = (pickup[0] + destination[0]) / 2;
        const centerLon = (pickup[1] + destination[1]) / 2;
        setMapCenter([centerLat, centerLon]);
      } else if (pickup) {
        setMapCenter(pickup);
      } else if (destination) {
        setMapCenter(destination);
      }

      if (!pickup && !destination) {
        setError('Adresler bulunamadı. Lütfen daha spesifik adresler girin.');
      }

    } catch (err) {
      setError('Harita verileri yüklenirken hata oluştu.');
      console.error('Map data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const retryLoad = () => {
    setError(null);
    setPickupCoords(null);
    setDestinationCoords(null);
    setRouteCoords([]);
    setCalculatedDistance(null);
    loadMapData();
  };

  const calculateZoom = (): number => {
    if (pickupCoords && destinationCoords) {
      const latDiff = Math.abs(pickupCoords[0] - destinationCoords[0]);
      const lonDiff = Math.abs(pickupCoords[1] - destinationCoords[1]);
      const maxDiff = Math.max(latDiff, lonDiff);
      
      if (maxDiff < 0.01) return 14;
      if (maxDiff < 0.05) return 12;
      if (maxDiff < 0.1) return 10;
      if (maxDiff < 0.5) return 8;
      return 6;
    }
    return 10;
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
            Pickup and destination locations using OpenStreetMap
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
              {pickupCoords && (
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                  {pickupCoords[0].toFixed(4)}, {pickupCoords[1].toFixed(4)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="font-medium text-red-700 dark:text-red-400">Destination</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">{destinationAddress}</p>
              {destinationCoords && (
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                  {destinationCoords[0].toFixed(4)}, {destinationCoords[1].toFixed(4)}
                </p>
              )}
            </div>
          </div>
          
          {/* Map Container */}
          <div 
            className="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden"
            style={{ minHeight: '400px' }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Harita yükleniyor...</p>
                  <p className="text-xs mt-1">OpenStreetMap kullanılıyor</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-center p-8">
                <div>
                  <Route className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Harita Hatası</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                  <Button onClick={retryLoad} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tekrar Dene
                  </Button>
                </div>
              </div>
            ) : (
              <MapContainer
                center={mapCenter}
                zoom={calculateZoom()}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Pickup Marker */}
                {pickupCoords && (
                  <Marker position={pickupCoords} icon={pickupIcon}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-green-700 mb-2">📍 Pickup Location</h3>
                        <p className="text-sm"><strong>Order:</strong> ORD-{orderId}</p>
                        <p className="text-sm"><strong>Date:</strong> {orderDate}</p>
                        <p className="text-sm"><strong>Address:</strong> {pickupAddress}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {pickupCoords[0].toFixed(4)}, {pickupCoords[1].toFixed(4)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* Destination Marker */}
                {destinationCoords && (
                  <Marker position={destinationCoords} icon={destinationIcon}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-red-700 mb-2">🏁 Destination</h3>
                        <p className="text-sm"><strong>Order:</strong> ORD-{orderId}</p>
                        <p className="text-sm"><strong>Date:</strong> {orderDate}</p>
                        <p className="text-sm"><strong>Address:</strong> {destinationAddress}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {destinationCoords[0].toFixed(4)}, {destinationCoords[1].toFixed(4)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* Route Line */}
                {routeCoords.length > 0 && (
                  <Polyline
                    positions={routeCoords}
                    color="#3b82f6"
                    weight={4}
                    opacity={0.7}
                    dashArray="10, 10"
                  />
                )}
              </MapContainer>
            )}
          </div>

          {/* Map Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
            <span>📍 OpenStreetMap | 🗺️ Nominatim Geocoding</span>
            {calculatedDistance && (
              <span>
                📏 {calculatedDistance.toFixed(1)} km
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenStreetMap; 