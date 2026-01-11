// Türkiye şehir koordinatları
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'ankara': { lat: 39.9334, lng: 32.8597 },
    'istanbul': { lat: 41.0082, lng: 28.9784 },
    'izmir': { lat: 38.4237, lng: 27.1428 },
    'antalya': { lat: 36.8969, lng: 30.7133 },
    'bursa': { lat: 40.1826, lng: 29.0665 },
    'adana': { lat: 37.0000, lng: 35.3213 },
    'gaziantep': { lat: 37.0662, lng: 37.3833 },
    'konya': { lat: 37.8746, lng: 32.4932 },
    'aksaray': { lat: 38.3687, lng: 34.0370 },
    'kayseri': { lat: 38.7312, lng: 35.4787 },
    'mersin': { lat: 36.8121, lng: 34.6415 },
    'eskişehir': { lat: 39.7767, lng: 30.5206 },
    'diyarbakır': { lat: 37.9144, lng: 40.2306 },
    'samsun': { lat: 41.2867, lng: 36.3300 },
    'denizli': { lat: 37.7765, lng: 29.0864 },
    'şanlıurfa': { lat: 37.1591, lng: 38.7969 },
    'adapazarı': { lat: 40.7569, lng: 30.4030 },
    'malatya': { lat: 38.3552, lng: 38.3095 },
    'kahramanmaraş': { lat: 37.5858, lng: 36.9371 },
    'erzurum': { lat: 39.9043, lng: 41.2678 },
    'van': { lat: 38.4891, lng: 43.4089 },
    'batman': { lat: 37.8812, lng: 41.1351 },
    'elazığ': { lat: 38.6748, lng: 39.2228 },
    'ağrı': { lat: 39.7191, lng: 43.0503 },
    'tekirdağ': { lat: 40.9833, lng: 27.5167 },
    'çanakkale': { lat: 40.1553, lng: 26.4142 },
    'trabzon': { lat: 41.0015, lng: 39.7178 },
    'balıkesir': { lat: 39.6484, lng: 27.8826 },
    'kütahya': { lat: 39.4242, lng: 29.9833 },
    'manisa': { lat: 38.6191, lng: 27.4289 },
    'aydın': { lat: 37.8560, lng: 27.8416 },
    'muğla': { lat: 37.2153, lng: 28.3636 },
};

// İlçe koordinatları (Bazı önemli ilçeler için)
export const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
    // Aksaray ilçeleri
    'güzelyurt': { lat: 38.2806, lng: 34.3764 },
    'ortaköy': { lat: 38.7333, lng: 34.0833 },
    'ağaçören': { lat: 38.3833, lng: 34.5167 },

    // Ankara ilçeleri
    'çankaya': { lat: 39.9187, lng: 32.8627 },
    'keçiören': { lat: 39.9697, lng: 32.8547 },
    'yenimahalle': { lat: 39.9667, lng: 32.7833 },
    'mamak': { lat: 39.9167, lng: 32.9167 },
    'etimesgut': { lat: 39.9500, lng: 32.6667 },

    // İstanbul ilçeleri
    'kadıköy': { lat: 40.9833, lng: 29.0333 },
    'beşiktaş': { lat: 41.0422, lng: 29.0061 },
    'şişli': { lat: 41.0602, lng: 28.9879 },
    'üsküdar': { lat: 41.0226, lng: 29.0121 },
    'fatih': { lat: 41.0192, lng: 28.9497 },

    // İzmir ilçeleri
    'konak': { lat: 38.4189, lng: 27.1287 },
    'bornova': { lat: 38.4622, lng: 27.2156 },
    'karşıyaka': { lat: 38.4597, lng: 27.1089 },
};

export function getCityCoordinates(city: string, district?: string): { lat: number; lng: number } {
    // Önce ilçeye bak
    if (district) {
        const normalizedDistrict = district.toLowerCase()
            .replace('ı', 'i')
            .replace('ğ', 'g')
            .replace('ü', 'u')
            .replace('ş', 's')
            .replace('ö', 'o')
            .replace('ç', 'c')
            .trim();

        if (DISTRICT_COORDINATES[normalizedDistrict]) {
            return DISTRICT_COORDINATES[normalizedDistrict];
        }
    }

    // İlçe bulunamazsa şehre bak
    const normalizedCity = city.toLowerCase()
        .replace('ı', 'i')
        .replace('ğ', 'g')
        .replace('ü', 'u')
        .replace('ş', 's')
        .replace('ö', 'o')
        .replace('ç', 'c')
        .trim();

    return CITY_COORDINATES[normalizedCity] || { lat: 39.9334, lng: 32.8597 }; // Default: Ankara
}
