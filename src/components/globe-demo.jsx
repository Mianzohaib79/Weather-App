import React from "react";
import { World } from "./ui/globe";

export function GlobeDemo() {
    const globeConfig = {
        pointSize: 1,
        globeColor: "#0b192e", // Deep Rich Royal Blue
        showAtmosphere: true,
        atmosphereColor: "#3b82f6", // Vibrant Cyan/Blue Glow
        atmosphereAltitude: 0.15,
        emissive: "#0f2b5c", // Sphere Base Lighting
        emissiveIntensity: 0.8,
        shininess: 0.9,
        polygonColor: "rgba(56, 189, 248, 0.7)",
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1200,
        arcLength: 0.5,
        rings: 6,
        maxRings: 4,
        autoRotate: true,
        autoRotateSpeed: 1.0,
    };

    // Active Network Routes
    const sampleArcs = [
        { order: 1, startLat: -15.7938, startLng: -47.8827, endLat: 38.7222, endLng: -9.1393, arcAlt: 0.15, color: "#38bdf8" },
        { order: 1, startLat: -15.7938, startLng: -47.8827, endLat: 28.6139, endLng: 77.2090, arcAlt: 0.25, color: "#818cf8" },
        { order: 2, startLat: 51.5073, startLng: -0.1277, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: "#06b6d4" },
        { order: 2, startLat: 40.7127, startLng: -74.0059, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.35, color: "#38bdf8" },
        { order: 3, startLat: 34.0522, startLng: -118.2436, endLat: -33.8688, endLng: 151.2092, arcAlt: 0.4, color: "#a855f7" },
        { order: 3, startLat: 31.5204, startLng: 74.3587, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.2, color: "#60a5fa" },
        { order: 4, startLat: 22.3193, startLng: 114.1694, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.25, color: "#22d3ee" },
    ];

    return (
        <div className="flex items-center justify-center h-full w-full">
            <World globeConfig={globeConfig} data={sampleArcs} />
        </div>
    );
}