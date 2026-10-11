'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Scale } from 'lucide-react';
import LuggageWeightCalculator from './LuggageWeightCalculator';

interface PackingCustomizerProps {
  tripId: string;
  destination: string;
  defaultPackingList: string[];
}

interface PackingItem {
  id: string;
  text: string;
  category: 'essentials' | 'clothing' | 'electronics' | 'health';
  packed: boolean;
}

export default function PackingCustomizer({
  tripId,
  destination,
  defaultPackingList,
}: PackingCustomizerProps) {
  const storageKey = `wanderai_packing_${tripId}`;
  const [items, setItems] = useState<PackingItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`wanderai_packing_${tripId}`);
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return defaultPackingList.map((str, idx) => ({
      id: `pack-${idx}`,
      text: str,
      category:
        str.toLowerCase().includes('shoe') || str.toLowerCase().includes('cloth') || str.toLowerCase().includes('jacket')
          ? 'clothing'
          : str.toLowerCase().includes('power') || str.toLowerCase().includes('adapter') || str.toLowerCase().includes('charger')
          ? 'electronics'
          : 'essentials',
      packed: false,
    }));
  });
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('essentials');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [subMode, setSubMode] = useState<'checklist' | 'physics'>('checklist');

  const saveItems = (updated: PackingItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const togglePacked = (id: string) => {
    const updated = items.map((it) => (it.id === id ? { ...it, packed: !it.packed } : it));
    saveItems(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      category: newItemCategory,
      packed: false,
    };

    saveItems([...items, newItem]);
    setNewItemText('');
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((it) => it.id !== id);
    saveItems(updated);
  };

  const packedCount = items.filter((i) => i.packed).length;
  const progressPercent = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((it) => it.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Sub-mode Switcher */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 max-w-md">
        <button
          type="button"
          onClick={() => setSubMode('checklist')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            subMode === 'checklist'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-indigo-600" />
          <span>Luggage Checklist</span>
        </button>

        <button
          type="button"
          onClick={() => setSubMode('physics')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            subMode === 'physics'
              ? 'bg-white text-amber-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-600" />
          <span>Weight & Penalty Radar</span>
        </button>
      </div>

      {subMode === 'physics' ? (
        <LuggageWeightCalculator destination={destination} />
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Interactive Packing Checklist
              </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Pack for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Check off essentials, add custom gear, and track luggage readiness
          </p>
        </div>

        {/* Progress Badge */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700">
            {progressPercent}%
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Luggage Status</span>
            <span className="text-xs font-bold text-slate-900">
              {packedCount} of {items.length} Packed
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddItem} className="flex flex-wrap gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom item (e.g. Passport, Camera, Sunscreen)..."
          className="flex-1 min-w-[200px] px-3.5 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as PackingItem['category'])}
          className="px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none capitalize font-medium text-slate-700"
        >
          <option value="essentials">Essentials & Docs</option>
          <option value="clothing">Clothing & Shoes</option>
          <option value="electronics">Electronics & Tech</option>
          <option value="health">Health & Toiletries</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
        {['all', 'essentials', 'clothing', 'electronics', 'health'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => togglePacked(item.id)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
              item.packed
                ? 'bg-slate-50 border-slate-200 text-slate-400'
                : 'bg-white hover:bg-indigo-50/40 border-slate-200/90 text-slate-800 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {item.packed ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0" />
              )}
              <span
                className={`text-xs sm:text-sm font-medium truncate ${
                  item.packed ? 'line-through text-slate-400' : ''
                }`}
              >
                {item.text}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md capitalize">
                {item.category}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
      )}
    </div>
  );
}
