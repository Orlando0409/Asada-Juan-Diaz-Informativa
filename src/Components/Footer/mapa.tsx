import { useEffect, useRef, useState } from "react";

export default function Mapa() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [shouldLoadMap, setShouldLoadMap] = useState(false);

    useEffect(() => {
      if (!mapRef.current || globalThis.window === undefined) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setShouldLoadMap(true);
            observer.disconnect();
          }
        },
        { rootMargin: "120px" }
      );

      observer.observe(mapRef.current);

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      let mapInstance: { remove: () => void } | null = null;
      if (!shouldLoadMap || !mapRef.current || globalThis.window === undefined) return;

      const initMap = async () => {
        await import("leaflet/dist/leaflet.css");
        const leafletModule = await import("leaflet");
        const L = leafletModule.default;

        if (!mapRef.current || mapRef.current.childNodes.length > 0) return;

        const map = L.map(mapRef.current).setView([10.167399, -85.540736], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        }).addTo(map);
        L.marker([10.167399, -85.540736]).addTo(map).bindPopup("ASADA Juan Díaz");

        mapInstance = map;
      };

      void initMap();

      return () => {
        mapInstance?.remove();
      };
    }, [shouldLoadMap]);

  return (
    <section aria-label="Mapa de ubicación de ASADA Juan Díaz" className="w-full h-[250px]">
      <div
        ref={mapRef}
        id="map"
        className="w-full h-full z-1"
      />
    </section>
  );
}
