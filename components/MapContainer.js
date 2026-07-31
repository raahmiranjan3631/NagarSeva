"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapContainer({ reports = [], center = [12.9716, 77.5946], zoom = 13 }) {
  useEffect(() => {
    // Fix default marker icon issues in Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    const map = L.map("leaflet-map-element", {
      center: center,
      zoom: zoom,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    // Add Markers
    reports.forEach((r) => {
      if (r.lat && r.lng) {
        const marker = L.marker([r.lat, r.lng]).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 2px;">
            <strong style="color: #003fb1; display: block; font-size: 14px; margin-bottom: 4px;">${r.title}</strong>
            <span style="background: #dfe9fa; color: #003fb1; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase;">
              ${r.category.replace("_", " ")}
            </span>
            <p style="font-size: 11px; margin: 6px 0 0 0; color: #434654;">${r.address || ""}</p>
          </div>
        `);
      }
    });

    return () => {
      map.remove();
    };
  }, [reports, center, zoom]);

  return <div id="leaflet-map-element" className="w-full h-full min-h-[300px]" />;
}
