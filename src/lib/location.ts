// Maximum delivery radius in kilometers
export const MAX_DELIVERY_RADIUS = 50;

// Shop location in Avinashi, Tiruppur, Tamil Nadu, India
export const SHOP_LOCATION = {
  lat: 11.197708, // Avinashi, Tiruppur coordinates
  lng: 77.268123
};

/**
 * Calculate distance between two geographic points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Check if the user's location is within delivery radius
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @returns Boolean indicating if location is within delivery radius
 */
export function isWithinDeliveryRadius(userLat: number, userLng: number): boolean {
  const distance = calculateDistance(
    userLat,
    userLng,
    SHOP_LOCATION.lat,
    SHOP_LOCATION.lng
  );
  
  return distance <= MAX_DELIVERY_RADIUS;
}

/**
 * Get the user's current location
 * @returns Promise resolving to user's coordinates
 */
export function getCurrentLocation(): Promise<{lat: number, lng: number}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}

/**
 * Format the distance for display
 * @param distance Distance in kilometers
 * @returns Formatted string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}
