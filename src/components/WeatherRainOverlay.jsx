import React, { useEffect, useRef } from "react";

export function WeatherRainOverlay({
    weatherCondition,
    isTesting = false,
    speedMultiplier = 1,
}) {
    const canvasRef = useRef(null);

    const cond = String(weatherCondition || "").toLowerCase();
    const isRaining =
        isTesting ||
        cond.includes("rain") ||
        cond.includes("drizzle") ||
        cond.includes("thunderstorm") ||
        cond.includes("shower");

    useEffect(() => {
        if (!isRaining) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        const drops = [];
        const maxDrops = 140;

        for (let i = 0; i < maxDrops; i++) {
            drops.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: Math.random() * 25 + 15,
                speed: (Math.random() * 8 + 10) * speedMultiplier,
            });
        }

        let lastTime = performance.now();

        const draw = (currentTime) => {
            // Calculate delta time so lag in parent components doesn't break rain smoothness
            const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
            lastTime = currentTime;

            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = "rgba(186, 230, 253, 0.6)";
            ctx.lineWidth = 1.2;
            ctx.lineCap = "round";

            const factor = delta * 60; // Normalize frame speed

            for (let i = 0; i < maxDrops; i++) {
                const d = drops[i];
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - d.length * 0.1, d.y + d.length);
                ctx.stroke();

                d.y += d.speed * factor;
                d.x -= d.speed * 0.1 * factor;

                if (d.y > height) {
                    d.y = -d.length;
                    d.x = Math.random() * width;
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        animationFrameId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isRaining, speedMultiplier]);

    if (!isRaining) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-5 h-full w-full"
        />
    );
}
