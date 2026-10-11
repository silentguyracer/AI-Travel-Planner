'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { TripPlan } from '@/types/travel';
import { Plane, Compass, Clock, Wind, Gauge, MapPin, ArrowRight, RotateCw, Globe as GlobeIcon, Zap } from 'lucide-react';
import { gsap } from 'gsap';

interface GlobeFlightPath3DProps {
  trip: TripPlan;
}

interface HubCity {
  name: string;
  country: string;
  lat: number;
  lng: number;
  code: string;
}

const GLOBAL_ORIGIN_HUBS: HubCity[] = [
  { name: 'New York (JFK)', country: 'USA', lat: 40.6413, lng: -73.7781, code: 'JFK' },
  { name: 'London (LHR)', country: 'UK', lat: 51.4700, lng: -0.4543, code: 'LHR' },
  { name: 'Tokyo (HND)', country: 'Japan', lat: 35.5494, lng: 139.7798, code: 'HND' },
  { name: 'Paris (CDG)', country: 'France', lat: 49.0097, lng: 2.5479, code: 'CDG' },
  { name: 'Dubai (DXB)', country: 'UAE', lat: 25.2532, lng: 55.3657, code: 'DXB' },
  { name: 'Singapore (SIN)', country: 'Singapore', lat: 1.3644, lng: 103.9915, code: 'SIN' },
  { name: 'Sydney (SYD)', country: 'Australia', lat: -33.9399, lng: 151.1753, code: 'SYD' },
  { name: 'Mumbai (BOM)', country: 'India', lat: 19.0896, lng: 72.8656, code: 'BOM' },
];

// Haversine distance in KM
function getGreatCircleDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function GlobeFlightPath3D({ trip }: GlobeFlightPath3DProps) {
  const [selectedHub, setSelectedHub] = useState<HubCity>(GLOBAL_ORIGIN_HUBS[0]);
  const [cruisingAltitude] = useState(36000); // ft
  const [machSpeed] = useState(0.82); // Mach ~880 km/h
  const [isRotating, setIsRotating] = useState(true);
  const [currentUtc, setCurrentUtc] = useState<Date>(new Date());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const rotationAngleRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const destCoords = trip.centerCoordinates || { lat: 48.8566, lng: 2.3522 };

  // Calculate distance & flight time
  const distanceKm = useMemo(() => {
    return Math.round(
      getGreatCircleDistance(
        selectedHub.lat,
        selectedHub.lng,
        destCoords.lat,
        destCoords.lng
      )
    );
  }, [selectedHub, destCoords]);

  const distanceNm = Math.round(distanceKm * 0.539957);
  const flightHours = Math.floor(distanceKm / 850);
  const flightMins = Math.round(((distanceKm / 850) - flightHours) * 60);

  // Live clocks update
  useEffect(() => {
    const timer = setInterval(() => setCurrentUtc(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP entrance
  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, []);

  // 3D Orthographic Rotating Globe Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 500;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    const radius = Math.min(width, height) * 0.38;
    const centerX = width / 2;
    const centerY = height / 2;

    let flightProgress = 0;

    // Convert spherical lat/lng to orthographic 2D projection
    const project = (lat: number, lng: number, rotY: number) => {
      const phi = (lat * Math.PI) / 180;
      const theta = ((lng + rotY) * Math.PI) / 180;

      // Check if on visible hemisphere
      const cosVal = Math.cos(phi) * Math.cos(theta);
      const isVisible = cosVal > -0.15;

      const x = centerX + radius * Math.cos(phi) * Math.sin(theta);
      const y = centerY - radius * Math.sin(phi);

      return { x, y, isVisible, depth: cosVal };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isRotating) {
        rotationAngleRef.current += 0.25;
      }
      flightProgress = (flightProgress + 0.004) % 1;

      const rot = rotationAngleRef.current;

      // 1. Globe Atmosphere Outer Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.85,
        centerX,
        centerY,
        radius * 1.25
      );
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      glowGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.12)');
      glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 2. Globe Sphere Body (Deep Ocean)
      const oceanGrad = ctx.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.35,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      oceanGrad.addColorStop(0, '#1e293b');
      oceanGrad.addColorStop(0.7, '#0f172a');
      oceanGrad.addColorStop(1, '#020617');

      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Sphere border ring
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Latitude & Longitude Graticule Grid Lines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
      ctx.lineWidth = 0.8;

      // Parallels (Latitude rings)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lng = -180; lng <= 180; lng += 8) {
          const p = project(lat, lng, rot);
          if (p.isVisible) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Meridians (Longitude rings)
      for (let lng = 0; lng < 360; lng += 45) {
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 6) {
          const p = project(lat, lng, rot);
          if (p.isVisible) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 4. Interpolate Great Circle Arc points
      const arcSteps = 60;
      const arcPoints: { x: number; y: number; isVisible: boolean }[] = [];

      for (let i = 0; i <= arcSteps; i++) {
        const t = i / arcSteps;
        // Linear interpolation on lat/lng (approximation of great circle for display)
        const curLat = selectedHub.lat + (destCoords.lat - selectedHub.lat) * t;
        const curLng = selectedHub.lng + (destCoords.lng - selectedHub.lng) * t;

        // Arc elevation curvature (lift off globe)
        const elevation = Math.sin(t * Math.PI) * 0.18;
        const phi = (curLat * Math.PI) / 180;
        const theta = ((curLng + rot) * Math.PI) / 180;

        const effectiveRadius = radius * (1 + elevation);
        const x = centerX + effectiveRadius * Math.cos(phi) * Math.sin(theta);
        const y = centerY - effectiveRadius * Math.sin(phi);
        const isVisible = Math.cos(phi) * Math.cos(theta) > -0.2;

        arcPoints.push({ x, y, isVisible });
      }

      // Draw Flight Path Trajectory
      ctx.beginPath();
      let arcStarted = false;
      for (const pt of arcPoints) {
        if (pt.isVisible) {
          if (!arcStarted) {
            ctx.moveTo(pt.x, pt.y);
            arcStarted = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          arcStarted = false;
        }
      }
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Origin Hub Point
      const origPt = project(selectedHub.lat, selectedHub.lng, rot);
      if (origPt.isVisible) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(origPt.x, origPt.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(selectedHub.code, origPt.x + 8, origPt.y + 3);
      }

      // 6. Destination Point
      const destPt = project(destCoords.lat, destCoords.lng, rot);
      if (destPt.isVisible) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(destPt.x, destPt.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Target pulse ring
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(destPt.x, destPt.y, 11 + Math.sin(Date.now() * 0.005) * 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(trip.destination.split(',')[0], destPt.x + 9, destPt.y + 3);
      }

      // 7. Animated Aircraft along Arc
      const planeIndex = Math.floor(flightProgress * (arcPoints.length - 1));
      const planePt = arcPoints[planeIndex];
      if (planePt && planePt.isVisible) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(planePt.x, planePt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Trail glow
        ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.beginPath();
        ctx.arc(planePt.x, planePt.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedHub, destCoords, isRotating, trip.destination]);

  return (
    <div
      ref={containerRef}
      className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <GlobeIcon className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
              Great Circle Telemetry HUD
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Global Flight Trajectory:</span>
            <span className="text-sky-400">{selectedHub.code}</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="text-amber-400">{trip.destination.split(',')[0]}</span>
          </h3>
        </div>

        {/* Origin Selector Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400">Departure Hub:</span>
          <select
            value={selectedHub.code}
            onChange={(e) => {
              const found = GLOBAL_ORIGIN_HUBS.find((h) => h.code === e.target.value);
              if (found) setSelectedHub(found);
            }}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer focus:border-sky-400 transition-colors"
          >
            {GLOBAL_ORIGIN_HUBS.map((hub) => (
              <option key={hub.code} value={hub.code} className="bg-slate-900 text-white">
                {hub.name} ({hub.code})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
              isRotating
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Globe Orbit"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Globe Canvas + Telemetry Flight Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left: 3D Canvas Viewport */}
        <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-2 relative flex items-center justify-center min-h-[360px] overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-[360px] block cursor-grab active:cursor-grabbing" />
          <div className="absolute bottom-3 left-4 text-[10px] text-slate-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ORTHOGRAPHIC 3D PROJECTION · GEODESIC ARC</span>
          </div>
        </div>

        {/* Right: Avionics & Flight Telemetry Cards */}
        <div className="lg:col-span-5 space-y-3">
          {/* Flight Distance Metric */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Great Circle Distance</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">HAVERSINE</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {distanceKm.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-sky-400">km</span>
              <span className="text-xs text-slate-500 font-mono">({distanceNm.toLocaleString()} NM)</span>
            </div>
          </div>

          {/* Duration & Speed */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Est. Non-Stop</span>
              </div>
              <p className="text-xl font-black text-white font-mono">
                {flightHours}h {flightMins}m
              </p>
              <p className="text-[10px] text-slate-500">Commercial Long-Haul</p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cruising Speed</span>
              </div>
              <p className="text-xl font-black text-white font-mono">
                M {machSpeed}
              </p>
              <p className="text-[10px] text-slate-500">~880 km/h (FL360)</p>
            </div>
          </div>

          {/* Altitude Profile Bar */}
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cruising Altitude Profile</span>
              </span>
              <span className="font-mono text-indigo-400 font-bold">{cruisingAltitude.toLocaleString()} FT</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500"
                style={{ width: '85%' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Takeoff</span>
              <span>Climb</span>
              <span>FL360 Cruise</span>
              <span>Descent</span>
              <span>Touchdown</span>
            </div>
          </div>

          {/* Dual Timezone Clocks */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-sky-950/40 border border-sky-800/40 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase text-sky-400">{selectedHub.code} Time</p>
              <p className="text-base font-black text-white font-mono mt-0.5">
                {currentUtc.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{selectedHub.name}</p>
            </div>

            <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase text-amber-400">Target Dest. Time</p>
              <p className="text-base font-black text-white font-mono mt-0.5">
                {currentUtc.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{trip.destination}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
