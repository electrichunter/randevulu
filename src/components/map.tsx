'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { getCoordinatesWithFallback } from '@/lib/geocoding'

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapProps {
    pos?: [number, number]
    popupText?: string
    address?: string
    city?: string
    district?: string
}

export default function Map({ pos, popupText, address, city, district }: MapProps) {
    const [coordinates, setCoordinates] = useState<[number, number]>(pos || [39.9334, 32.8597])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCoordinates = async () => {
            // If address details provided, use geocoding
            if (address || city || district) {
                const result = await getCoordinatesWithFallback(address, city, district)
                setCoordinates([result.lat, result.lng])
            } else if (pos) {
                setCoordinates(pos)
            }
            setLoading(false)
        }

        fetchCoordinates()
    }, [pos, address, city, district])

    if (loading) {
        return <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">Harita yükleniyor...</div>
    }

    return (
        <MapContainer
            center={coordinates}
            zoom={15}
            scrollWheelZoom={false}
            className="h-[300px] w-full rounded-lg z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coordinates}>
                {popupText && <Popup>{popupText}</Popup>}
            </Marker>
        </MapContainer>
    )
}
