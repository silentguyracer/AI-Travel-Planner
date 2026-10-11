'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Moon, Sun, Compass, Plane, Globe, Sliders } from 'lucide-react';

export type BackgroundTheme = 'aurora' | 'sunset' | 'radar' | 'zen';

interface InteractiveBackgroundProps {
  currentTheme?: BackgroundTheme;
  onThemeChange?: (theme: BackgroundTheme) => void;
}

export default function InteractiveBackground({
  currentTheme: propTheme,
  onThemeChange,
}: InteractiveBackgroundProps) {
  const [theme, setTheme] = useState<BackgroundTheme>(propTheme || 'aurora');
  const [showControls, setShowControls] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const animFrameRef = useRef<number | null>(null);

  // Sync theme if controlled
  useEffect(() => {
    if (propTheme) setTheme(propTheme);
  }, [propTheme]);

  const handleSelectTheme = (newTheme: BackgroundTheme) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  // Canvas particle / flight route animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes representing global waypoints / stars
    const particleCount = Math.min(Math.floor(width / 32), 45);
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors =
      theme === 'sunset'
        ? ['#fb923c', '#f43f5e', '#fbbf24', '#f87171']
        : theme === 'radar'
        ? ['#38bdf8', '#0ea5e9', '#0284c7', '#34d399']
        : theme === 'zen'
        ? ['#94a3b8', '#cbd5e1', '#64748b']
        : ['#818cf8', '#6366f1', '#38bdf8', '#a855f7', '#ec4899'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.35 + 0.15,
        alpha: Math.random() * 0.35 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Interactive mouse listener
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.targetX = e.clientX;
      mousePos.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let planeAngle = 0;

    const render = () => {
      // Smooth mouse interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Render interactive mouse light spotlight
      if (mousePos.current.x > 0 && mousePos.current.y > 0) {
        const radGrad = ctx.createRadialGradient(
          mousePos.current.x,
          mousePos.current.y,
          0,
          mousePos.current.x,
          mousePos.current.y,
          380
        );

        if (theme === 'sunset') {
          radGrad.addColorStop(0, 'rgba(251, 146, 60, 0.09)');
          radGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.04)');
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else if (theme === 'radar') {
          radGrad.addColorStop(0, 'rgba(56, 189, 248, 0.11)');
          radGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.05)');
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else if (theme === 'zen') {
          radGrad.addColorStop(0, 'rgba(148, 163, 184, 0.06)');
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          radGrad.addColorStop(0, 'rgba(99, 102, 241, 0.11)');
          radGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.05)');
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse proximity interaction: gently push particles away from cursor
        const dx = p.x - mousePos.current.x;
        const dy = p.y - mousePos.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby points to form flight routes / constellations
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distNodes < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - distNodes / 140) * 0.15;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw subtle animated globe flight path arc across the background
      planeAngle += 0.003;
      const orbitCenterX = width * 0.85;
      const orbitCenterY = height * 0.25;
      const orbitRadius = Math.min(width * 0.22, 220);

      const planeX = orbitCenterX + Math.cos(planeAngle) * orbitRadius;
      const planeY = orbitCenterY + Math.sin(planeAngle) * (orbitRadius * 0.45);

      // Trailing jet contrail
      ctx.beginPath();
      ctx.arc(orbitCenterX, orbitCenterY, orbitRadius, planeAngle - 0.7, planeAngle);
      ctx.strokeStyle =
        theme === 'sunset'
          ? 'rgba(251, 146, 60, 0.12)'
          : theme === 'radar'
          ? 'rgba(56, 189, 248, 0.16)'
          : 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Subtle plane dot
      ctx.beginPath();
      ctx.arc(planeX, planeY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'sunset' ? '#f43f5e' : '#6366f1';
      ctx.globalAlpha = 0.6;
      ctx.fill();

      ctx.globalAlpha = 1.0;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [theme]);

  return (
    <>
      {/* 1. Fluid Ambient Gradient Mesh (Base Layer) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000">
        {theme === 'aurora' && (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-indigo-400/12 via-purple-400/8 to-transparent blur-3xl animate-float-slow" />
            <div
              className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-sky-400/12 via-teal-300/8 to-transparent blur-3xl animate-pulse-glow"
              style={{ animationDuration: '8s' }}
            />
            <div className="absolute bottom-[-15%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-t from-pink-400/10 via-indigo-300/6 to-transparent blur-3xl" />
          </>
        )}

        {theme === 'sunset' && (
          <>
            <div className="absolute top-[-5%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-amber-400/15 via-rose-400/10 to-transparent blur-3xl animate-float-slow" />
            <div
              className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-orange-400/14 via-red-400/8 to-transparent blur-3xl animate-pulse-glow"
              style={{ animationDuration: '9s' }}
            />
            <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-t from-yellow-300/10 via-amber-200/5 to-transparent blur-3xl" />
          </>
        )}

        {theme === 'radar' && (
          <>
            <div className="absolute top-[-10%] left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-transparent blur-3xl animate-float-slow" />
            <div className="absolute bottom-[-10%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-emerald-400/12 via-teal-500/8 to-transparent blur-3xl" />
            {/* Subtle radar circular rings */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] border border-sky-400/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] border border-sky-400/5 rounded-full pointer-events-none" />
          </>
        )}

        {theme === 'zen' && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/90 to-slate-100/50" />
        )}
      </div>

      {/* 2. Interactive HTML5 Canvas (Flight routes, particles & cursor glow) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-90 transition-opacity duration-700"
      />

      {/* 3. Floating Interactive Atmosphere Switcher Button (Bottom-Right or Floating) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {showControls && (
          <div className="bg-white/95 backdrop-blur-xl p-2.5 rounded-2xl shadow-2xl border border-slate-200/90 animate-scale-in-fade flex flex-col gap-1.5 text-xs text-slate-700 min-w-[170px]">
            <div className="px-2 py-1 font-bold text-[10px] uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Interactive Mood</span>
              <Sparkles className="w-3 h-3 text-indigo-500" />
            </div>

            <button
              onClick={() => handleSelectTheme('aurora')}
              className={`w-full px-2.5 py-1.5 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'aurora'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🌌</span>
                <span>Cosmic Aurora</span>
              </span>
              {theme === 'aurora' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
            </button>

            <button
              onClick={() => handleSelectTheme('sunset')}
              className={`w-full px-2.5 py-1.5 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'sunset'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🌅</span>
                <span>Sunset Glow</span>
              </span>
              {theme === 'sunset' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
            </button>

            <button
              onClick={() => handleSelectTheme('radar')}
              className={`w-full px-2.5 py-1.5 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'radar'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>✈️</span>
                <span>Flight Radar</span>
              </span>
              {theme === 'radar' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
            </button>

            <button
              onClick={() => handleSelectTheme('zen')}
              className={`w-full px-2.5 py-1.5 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'zen'
                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🌿</span>
                <span>Clean Zen</span>
              </span>
              {theme === 'zen' && <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
            </button>
          </div>
        )}

        <button
          onClick={() => setShowControls((prev) => !prev)}
          className="p-3 bg-white/90 hover:bg-white backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 text-slate-700 hover:text-indigo-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-xs font-bold cursor-pointer group"
          title="Interactive Travel Ambience & Theme"
        >
          <div className="w-6 h-6 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          </div>
          <span className="hidden sm:inline">Ambience</span>
        </button>
      </div>
    </>
  );
}
