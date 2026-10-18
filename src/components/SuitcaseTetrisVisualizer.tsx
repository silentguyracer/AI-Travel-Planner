'use client';

import React, { useState } from 'react';
import {
  Luggage,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Sparkles,
  Check,
  Plus,
  Trash2,
  X,
  Layers,
  Battery,
  Droplet,
  Info
} from 'lucide-react';
import { TripPlan } from '@/types/travel';

interface SuitcaseTetrisVisualizerProps {
  trip: TripPlan;
  isOpen: boolean;
  onClose: () => void;
}

interface PackedItem {
  id: string;
  name: string;
  compartment: 'main' | 'mesh' | 'tech' | 'toiletries';
  weightKg: number;
  volumeL: number;
  isLiquid?: boolean;
  isLithium?: boolean;
}

export default function SuitcaseTetrisVisualizer({ trip, isOpen, onClose }: SuitcaseTetrisVisualizerProps) {
  const [luggageType, setLuggageType] = useState<'carryon' | 'checked'>('carryon');

  const maxWeightKg = luggageType === 'carryon' ? 10 : 23;
  const maxVolumeL = luggageType === 'carryon' ? 42 : 85;

  const [items, setItems] = useState<PackedItem[]>([
    { id: '1', name: 'Walking Sneakers', compartment: 'main', weightKg: 0.9, volumeL: 5.0 },
    { id: '2', name: 'Waterproof Shell Jacket', compartment: 'main', weightKg: 0.6, volumeL: 3.5 },
    { id: '3', name: '3x Travel Chinos / Pants', compartment: 'main', weightKg: 1.2, volumeL: 4.5 },
    { id: '4', name: '5x Merino Wool T-Shirts', compartment: 'mesh', weightKg: 0.8, volumeL: 3.0 },
    { id: '5', name: 'Undergarments & Socks Pack', compartment: 'mesh', weightKg: 0.5, volumeL: 2.2 },
    { id: '6', name: 'MacBook Air + Charger', compartment: 'tech', weightKg: 1.4, volumeL: 2.0, isLithium: true },
    { id: '7', name: '20,000mAh Power Bank', compartment: 'tech', weightKg: 0.4, volumeL: 0.6, isLithium: true },
    { id: '8', name: 'TSA 80ml Sunscreen & Wash', compartment: 'toiletries', weightKg: 0.4, volumeL: 0.8, isLiquid: true },
    { id: '9', name: 'Compact First Aid & Meds', compartment: 'toiletries', weightKg: 0.3, volumeL: 0.7 },
  ]);

  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemComp, setNewItemComp] = useState<'main' | 'mesh' | 'tech' | 'toiletries'>('main');

  const totalWeight = parseFloat(items.reduce((sum, item) => sum + item.weightKg, 0).toFixed(1));
  const totalVolume = parseFloat(items.reduce((sum, item) => sum + item.volumeL, 0).toFixed(1));

  const weightPercentage = Math.min(100, Math.round((totalWeight / maxWeightKg) * 100));
  const volumePercentage = Math.min(100, Math.round((totalVolume / maxVolumeL) * 100));

  // Balance calculation (Main basin vs Upper mesh)
  const mainWeight = items.filter(i => i.compartment === 'main').reduce((s, i) => s + i.weightKg, 0);
  const topWeight = items.filter(i => i.compartment === 'mesh').reduce((s, i) => s + i.weightKg, 0);
  const isBottomHeavy = mainWeight >= topWeight; // Optimal for rolling suitcases

  // TSA Rules Compliance Check
  const hasLiquidViolation = items.some(i => i.isLiquid && i.volumeL > 1.2 && luggageType === 'carryon');
  const hasLithiumCheckedViolation = items.some(i => i.isLithium && luggageType === 'checked');

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: PackedItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      compartment: newItemComp,
      weightKg: 0.5,
      volumeL: 2.0
    };
    setItems([...items, newItem]);
    setNewItemName('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">3D Suitcase Tetris & Weight Distribution</h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Aero-Compliance
                </span>
              </div>
              <p className="text-xs text-slate-400">Optimize luggage compartments, balance center of gravity, and check TSA 3-1-1 rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bag Selection & Status Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLuggageType('carryon')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                luggageType === 'carryon'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Carry-On Roller (10 kg / 42L)
            </button>
            <button
              onClick={() => setLuggageType('checked')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                luggageType === 'checked'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Checked Bag (23 kg / 85L)
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Weight Fill</span>
              <span className={`font-bold ${totalWeight > maxWeightKg ? 'text-red-400' : 'text-emerald-400'}`}>
                {totalWeight} / {maxWeightKg} kg ({weightPercentage}%)
              </span>
            </div>
            <div className="w-px h-7 bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Volume Capacity</span>
              <span className={`font-bold ${totalVolume > maxVolumeL ? 'text-red-400' : 'text-indigo-300'}`}>
                {totalVolume} / {maxVolumeL} L ({volumePercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Safety & Compliance Alerts */}
        {hasLithiumCheckedViolation && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <strong>FAA / IATA Safety Hazard:</strong> Lithium-ion batteries and power banks are prohibited in checked baggage. Keep them in your carry-on tech sleeve!
            </div>
          </div>
        )}

        {/* Suitcase Visual Cross-Section Matrix */}
        <div className="border-2 border-indigo-500/40 bg-slate-950 rounded-3xl p-5 mb-6 relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Suitcase Internal Layout (Wheels at Bottom)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              isBottomHeavy ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {isBottomHeavy ? '✓ Optimal Center of Gravity' : '⚠️ Top-Heavy (Risk of Tipping)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Side: Upper Mesh Compartment */}
            <div className="bg-slate-900/80 border border-dashed border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Upper Mesh Compression Zip
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Folded Apparel</span>
                </div>
                <div className="space-y-1.5">
                  {items.filter(i => i.compartment === 'mesh').map(i => (
                    <div key={i.id} className="flex items-center justify-between bg-slate-800/60 px-2.5 py-1.5 rounded-lg text-xs">
                      <span className="text-slate-200">{i.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{i.weightKg} kg</span>
                        <button onClick={() => handleRemoveItem(i.id)} className="text-slate-500 hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Padded Tech Compartment */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    <Battery className="w-3.5 h-3.5" /> Padded Electronics Sleeve
                  </span>
                  <span className="text-[10px] text-sky-400 font-mono">Carry-On Only</span>
                </div>
                <div className="space-y-1.5">
                  {items.filter(i => i.compartment === 'tech').map(i => (
                    <div key={i.id} className="flex items-center justify-between bg-sky-950/40 border border-sky-800/30 px-2.5 py-1.5 rounded-lg text-xs">
                      <span className="text-sky-200">{i.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-sky-400">{i.weightKg} kg</span>
                        <button onClick={() => handleRemoveItem(i.id)} className="text-slate-500 hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Main Heavy Cargo Basin */}
            <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5" /> Main Basin (Heavy Items)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Shoes & Denim</span>
                </div>
                <div className="space-y-1.5">
                  {items.filter(i => i.compartment === 'main').map(i => (
                    <div key={i.id} className="flex items-center justify-between bg-slate-800/60 px-2.5 py-1.5 rounded-lg text-xs">
                      <span className="text-slate-200">{i.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{i.weightKg} kg</span>
                        <button onClick={() => handleRemoveItem(i.id)} className="text-slate-500 hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toiletry Pouch */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5" /> TSA 3-1-1 Toiletries Pouch
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Max 100ml / 3.4oz</span>
                </div>
                <div className="space-y-1.5">
                  {items.filter(i => i.compartment === 'toiletries').map(i => (
                    <div key={i.id} className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/30 px-2.5 py-1.5 rounded-lg text-xs">
                      <span className="text-emerald-200">{i.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-400">{i.weightKg} kg</span>
                        <button onClick={() => handleRemoveItem(i.id)} className="text-slate-500 hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Item Bar */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="Add custom gear (e.g. Hiking Boots, Camera Lens)..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500/60"
          />

          <select
            value={newItemComp}
            onChange={(e) => setNewItemComp(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-hidden"
          >
            <option value="main">Main Basin (Heavy)</option>
            <option value="mesh">Upper Mesh (Apparel)</option>
            <option value="tech">Electronics Sleeve</option>
            <option value="toiletries">Toiletries & Liquids</option>
          </select>

          <button
            onClick={handleAddItem}
            disabled={!newItemName.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Pack Item
          </button>
        </div>
      </div>
    </div>
  );
}
