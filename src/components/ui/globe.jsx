"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

extend({ ThreeGlobe: ThreeGlobe });

const cameraZ = 300;

export function Globe({ globeConfig = {}, data = [] }) {
    const globeRef = useRef(null);
    const groupRef = useRef();
    const [isInitialized, setIsInitialized] = useState(false);

    const defaultProps = {
        pointSize: 1,
        atmosphereColor: "#3b82f6",
        showAtmosphere: true,
        atmosphereAltitude: 0.15,
        polygonColor: "rgba(56, 189, 248, 0.7)",
        globeColor: "#0b192e",
        emissive: "#0f2b5c",
        emissiveIntensity: 0.8,
        shininess: 0.9,
        arcTime: 1200,
        arcLength: 0.5,
        rings: 1,
        maxRings: 3,
        ...globeConfig,
    };

    useEffect(() => {
        if (!globeRef.current && groupRef.current) {
            globeRef.current = new ThreeGlobe();
            groupRef.current.add(globeRef.current);

            fetch("https://raw.githubusercontent.com/vasturiano/three-globe/master/example/country-polygons/ne_110m_admin_0_countries.geojson")
                .then((res) => res.json())
                .then((countries) => {
                    if (globeRef.current) {
                        globeRef.current
                            .hexPolygonsData(countries.features)
                            .hexPolygonResolution(3)
                            .hexPolygonMargin(0.7)
                            .hexPolygonColor(() => "rgba(56, 189, 248, 0.75)");
                    }
                })
                .catch((err) => console.log("Map load error:", err));

            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (!globeRef.current || !isInitialized) return;

        const globeMaterial = globeRef.current.globeMaterial();
        globeMaterial.color = new Color(defaultProps.globeColor);
        globeMaterial.emissive = new Color(defaultProps.emissive);
        globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
        globeMaterial.shininess = defaultProps.shininess;
    }, [
        isInitialized,
        defaultProps.globeColor,
        defaultProps.emissive,
        defaultProps.emissiveIntensity,
        defaultProps.shininess,
    ]);

    useEffect(() => {
        if (!globeRef.current || !isInitialized || !data.length) return;

        let points = [];
        for (let i = 0; i < data.length; i++) {
            const arc = data[i];
            points.push({
                size: defaultProps.pointSize,
                order: arc.order,
                color: arc.color,
                lat: arc.startLat,
                lng: arc.startLng,
            });
            points.push({
                size: defaultProps.pointSize,
                order: arc.order,
                color: arc.color,
                lat: arc.endLat,
                lng: arc.endLng,
            });
        }

        const filteredPoints = points.filter(
            (v, i, a) =>
                a.findIndex((v2) => ["lat", "lng"].every((k) => v2[k] === v[k])) === i
        );

        globeRef.current
            .showAtmosphere(defaultProps.showAtmosphere)
            .atmosphereColor(defaultProps.atmosphereColor)
            .atmosphereAltitude(defaultProps.atmosphereAltitude);

        // Precise Continuous Arcs
        globeRef.current
            .arcsData(data)
            .arcStartLat((d) => d.startLat * 1)
            .arcStartLng((d) => d.startLng * 1)
            .arcEndLat((d) => d.endLat * 1)
            .arcEndLng((d) => d.endLng * 1)
            .arcColor((e) => e.color)
            .arcAltitude((e) => e.arcAlt * 1)
            .arcStroke(() => 0.6)
            .arcDashLength(0.5)
            .arcDashInitialGap((e) => (e.order % 2) * 1)
            .arcDashGap(2)
            .arcDashAnimateTime(() => 1200);

        // Small Clean Dots
        globeRef.current
            .pointsData(filteredPoints)
            .pointColor((e) => e.color)
            .pointsMerge(true)
            .pointAltitude(0.01)
            .pointRadius(2);

        // Subtle Rings
        globeRef.current
            .ringsData([])
            .ringColor(() => defaultProps.atmosphereColor)
            .ringMaxRadius(defaultProps.maxRings)
            .ringPropagationSpeed(2)
            .ringRepeatPeriod(1000);
    }, [
        isInitialized,
        data,
        defaultProps.pointSize,
        defaultProps.showAtmosphere,
        defaultProps.atmosphereColor,
        defaultProps.atmosphereAltitude,
        defaultProps.polygonColor,
        defaultProps.maxRings,
    ]);

    useEffect(() => {
        if (!globeRef.current || !isInitialized || !data.length) return;

        const interval = setInterval(() => {
            if (!globeRef.current) return;

            const activeRings = data.slice(0, 5).map((d) => ({
                lat: d.startLat,
                lng: d.startLng,
                color: d.color,
            }));

            globeRef.current.ringsData(activeRings);
        }, 1500);

        return () => clearInterval(interval);
    }, [isInitialized, data]);

    return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
    const { gl, size, camera } = useThree();

    useEffect(() => {
        if (size.width > 0 && size.height > 0) {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.setSize(size.width, size.height);
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
        }
    }, [gl, size, camera]);

    return null;
}

export function World(props) {
    const { globeConfig = {} } = props;
    const scene = new Scene();
    scene.fog = new Fog(0x020617, 400, 2000);

    return (
        <div className="w-full h-full relative min-h-[400px]">
            <Canvas scene={scene} camera={{ fov: 50, near: 180, far: 1800, position: [0, 0, cameraZ] }}>
                <WebGLRendererConfig />
                <ambientLight color={globeConfig.ambientLight || "#38bdf8"} intensity={1.2} />
                <directionalLight
                    color={globeConfig.directionalLeftLight || "#ffffff"}
                    position={new Vector3(-400, 100, 400)}
                    intensity={1.2}
                />
                <directionalLight
                    color={globeConfig.directionalTopLight || "#ffffff"}
                    position={new Vector3(-200, 500, 200)}
                    intensity={1.2}
                />
                <pointLight
                    color={globeConfig.pointLight || "#ffffff"}
                    position={new Vector3(-200, 500, 200)}
                    intensity={1.2}
                />
                <Globe {...props} />
                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    minDistance={cameraZ}
                    maxDistance={cameraZ}
                    autoRotateSpeed={globeConfig.autoRotateSpeed || 1.0}
                    autoRotate={true}
                    minPolarAngle={Math.PI / 3.5}
                    maxPolarAngle={Math.PI - Math.PI / 3}
                />
            </Canvas>
        </div>
    );
}