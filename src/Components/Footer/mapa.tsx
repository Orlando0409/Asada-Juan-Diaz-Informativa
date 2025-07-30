import { useEffect, useRef } from "react";
import L from "leaflet";

export default function Mapa() {
    
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {


    if   (typeof window !== "undefined" &&
    mapRef.current &&
    mapRef.current.childNodes.length === 0) {
    const map = L.map(mapRef.current).setView([10.167399, -85.540736], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.marker([10.167399, -85.540736]).addTo(map).bindPopup("ASADA Juan Díaz").openPopup();
    }
  }, []);
  return (
    <div 
    ref={mapRef}
    id="map"
    className="w-full h-full min-w-[100px] min-h-[150px] max-w-xs max-h-xs lg:max-w-[500px] lg:max-h-md aspect-[4/2] z-1">
    </div>
  );
}
