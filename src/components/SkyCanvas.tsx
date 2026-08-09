"use client";

import { useEffect, useRef } from "react";

export function SkyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Atmospheric State
    const timeInHours = 9.0; // 09:00 AM fixed for now
    let cloudList: any[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initClouds();
    };

    const initClouds = () => {
      cloudList = [];
      const cloudCount = Math.floor(canvas.width / 180) + 3;
      for (let i = 0; i < cloudCount; i++) {
        cloudList.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.45) + 30,
          scale: 0.6 + Math.random() * 0.8,
          speed: 0.2 + Math.random() * 0.35,
          opacity: 0.55 + Math.random() * 0.35,
          puffs: [
            { dx: 0, dy: 0, r: 35 },
            { dx: 25, dy: -10, r: 40 },
            { dx: 50, dy: -5, r: 32 },
            { dx: 75, dy: 5, r: 28 },
            { dx: 35, dy: 10, r: 30 },
          ],
        });
      }
    };

    const getSunPosition = () => {
      const progress = (timeInHours - 6) / 12; // 0 (6 AM) to 1 (6 PM)
      const clamped = Math.max(0, Math.min(1, progress));
      const startX = canvas.width * 0.12;
      const endX = canvas.width * 0.88;
      const sunX = startX + (endX - startX) * clamped;

      const arcAngle = Math.PI * clamped;
      const arcHeight = canvas.height * 0.52;
      const groundY = canvas.height * 0.72;
      const sunY = groundY - Math.sin(arcAngle) * arcHeight;

      return { x: sunX, y: sunY, progress: clamped };
    };

    const drawSky = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      
      if (timeInHours < 8) {
        grad.addColorStop(0, '#fde68a');
        grad.addColorStop(0.35, '#f97316');
        grad.addColorStop(0.7, '#38bdf8');
        grad.addColorStop(1, '#15803d');
      } else if (timeInHours <= 15) {
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(0.4, '#38bdf8');
        grad.addColorStop(0.75, '#bae6fd');
        grad.addColorStop(1, '#16a34a');
      } else if (timeInHours <= 18) {
        grad.addColorStop(0, '#4c1d95');
        grad.addColorStop(0.3, '#c026d3');
        grad.addColorStop(0.65, '#ea580c');
        grad.addColorStop(0.85, '#f59e0b');
        grad.addColorStop(1, '#14532d');
      } else {
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#064e3b');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawSunAndRays = (sunPos: {x: number, y: number}) => {
      ctx.save();
      const maxRayRadius = Math.max(canvas.width, canvas.height) * 0.65;
      const rayGrad = ctx.createRadialGradient(sunPos.x, sunPos.y, 10, sunPos.x, sunPos.y, maxRayRadius);
      
      rayGrad.addColorStop(0, 'rgba(255, 255, 240, 0.95)');
      rayGrad.addColorStop(0.08, 'rgba(251, 191, 36, 0.75)');
      rayGrad.addColorStop(0.25, 'rgba(249, 115, 22, 0.45)');
      rayGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.2)');
      rayGrad.addColorStop(0.8, 'rgba(194, 65, 12, 0.05)');
      rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.arc(sunPos.x, sunPos.y, maxRayRadius, 0, Math.PI * 2);
      ctx.fill();

      const rayCount = 12;
      const timeTicks = Date.now() * 0.0005;
      ctx.globalAlpha = 0.18;
      for (let i = 0; i < rayCount; i++) {
        const angle = (Math.PI * 2 / rayCount) * i + Math.sin(timeTicks + i);
        const rayWidth = 0.12 + Math.sin(i * 1.5) * 0.05;
        
        ctx.fillStyle = 'rgba(254, 240, 138, 0.6)';
        ctx.beginPath();
        ctx.moveTo(sunPos.x, sunPos.y);
        ctx.arc(sunPos.x, sunPos.y, maxRayRadius * 0.8, angle - rayWidth, angle + rayWidth);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.arc(sunPos.x, sunPos.y, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawClouds = () => {
      ctx.save();
      cloudList.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x - 120 > canvas.width) {
          cloud.x = -150;
          cloud.y = Math.random() * (canvas.height * 0.45) + 30;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
        ctx.beginPath();

        cloud.puffs.forEach((p: any) => {
          const px = cloud.x + p.dx * cloud.scale;
          const py = cloud.y + p.dy * cloud.scale;
          const pr = p.r * cloud.scale;
          ctx.moveTo(px + pr, py);
          ctx.arc(px, py, pr, 0, Math.PI * 2);
        });

        ctx.fill();
      });
      ctx.restore();
    };

    const drawCropsHorizon = () => {
      ctx.save();
      const horizonY = canvas.height * 0.72;
      const timeTicks = Date.now() * 0.002;

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(0, horizonY);
      ctx.quadraticCurveTo(canvas.width * 0.35, horizonY - 45, canvas.width * 0.7, horizonY - 20);
      ctx.quadraticCurveTo(canvas.width * 0.85, horizonY - 10, canvas.width, horizonY - 35);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(0, horizonY + 20);
      ctx.quadraticCurveTo(canvas.width * 0.5, horizonY - 15, canvas.width, horizonY + 25);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      const cropSpacing = 16;
      const cropRows = Math.ceil(canvas.width / cropSpacing);
      ctx.fillStyle = '#22c55e';

      for (let i = 0; i < cropRows; i++) {
        const cx = i * cropSpacing;
        const sway = Math.sin(timeTicks + i * 0.3) * 6;
        const cy = horizonY + 40;

        ctx.beginPath();
        ctx.moveTo(cx, canvas.height);
        ctx.quadraticCurveTo(cx + sway, cy + 20, cx + sway * 1.5, cy);
        ctx.quadraticCurveTo(cx + 8, cy + 20, cx + cropSpacing, canvas.height);
        ctx.fill();
      }

      ctx.restore();
    };

    const renderAtmosphere = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sunPos = getSunPosition();
      drawSky();
      drawSunAndRays(sunPos);
      drawClouds();
      drawCropsHorizon();

      animationFrameId = requestAnimationFrame(renderAtmosphere);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    renderAtmosphere();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
