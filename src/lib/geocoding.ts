// Geocoding helper using OpenStreetMap Nominatim API (Free)

interface GeocodeResult {
    lat: number;
    lng: number;
}

/**
 * Geocode an address using Nominatim (OpenStreetMap)
 * @param address Full address string or components
 * @param city City name
 * @param district District name (optional)
 * @returns Coordinates {lat, lng} or null if not found
 */
export async function geocodeAddress(
    address?: string,
    city?: string,
    district?: string
): Promise<GeocodeResult | null> {
    try {
        // Build search query
        const parts = [];
        if (address) parts.push(address);
        if (district) parts.push(district);
        if (city) parts.push(city);
        parts.push('Türkiye'); // Always add Turkey to narrow results

        const query = parts.join(', ');

        if (!query || query === 'Türkiye') return null;

        // Nominatim API endpoint
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=tr`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Randevulu/1.0' // Nominatim requires User-Agent
            }
        });

        if (!response.ok) {
            console.error('Geocoding API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

/**
 * Get coordinates with fallback to static city/district data
 */
export async function getCoordinatesWithFallback(
    address?: string,
    city?: string,
    district?: string
): Promise<GeocodeResult> {
    // Try dynamic geocoding first
    const result = await geocodeAddress(address, city, district);
    if (result) return result;

    // Fallback to static data (from city-coordinates.ts)
    const { getCityCoordinates } = await import('./city-coordinates');
    return getCityCoordinates(city || 'Ankara', district);
}
