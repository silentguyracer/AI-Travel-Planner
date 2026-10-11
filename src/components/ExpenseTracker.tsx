'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, PieChart, ShoppingBag, Utensils, Plane, Building, Tag } from 'lucide-react';
import { parseUsdAmount } from '@/lib/currency';

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: 'food' | 'transport' | 'lodging' | 'activities' | 'shopping' | 'other';
  date: string;
}

interface ExpenseTrackerProps {
  tripId: string;
  destination: string;
  totalEstimatedBudgetStr: string;
}

const CATEGORY_ICONS = {
  food: Utensils,
  transport: Plane,
  lodging: Building,
  activities: Tag,
  shopping: ShoppingBag,
  other: DollarSign,
};

export default function ExpenseTracker({
  tripId,
  destination,
  totalEstimatedBudgetStr,
}: ExpenseTrackerProps) {
  const storageKey = `wanderai_expenses_${tripId}`;
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('food');

  const budgetEstimateNumber = parseUsdAmount(totalEstimatedBudgetStr) || 1500;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setExpenses(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, [storageKey]);

  const saveToLocalStorage = (items: ExpenseItem[]) => {
    setExpenses(items);
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!desc.trim() || isNaN(num) || num <= 0) return;

    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      description: desc.trim(),
      amount: num,
      category,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [newItem, ...expenses];
    saveToLocalStorage(updated);
    setDesc('');
    setAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    saveToLocalStorage(updated);
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = Math.max(0, budgetEstimateNumber - totalSpent);
  const percentSpent = Math.min(100, Math.round((totalSpent / budgetEstimateNumber) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Trip Expense Tracker
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Track Real Expenses for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Log your actual receipts on the road to stay under budget
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Spent</span>
            <span className="text-lg font-black text-slate-900">${totalSpent.toLocaleString()}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-right">
            <span className="text-[10px] text-emerald-700 uppercase font-bold block">Remaining</span>
            <span className="text-lg font-black text-emerald-800">${remainingBudget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700">Budget Consumed ({percentSpent}%)</span>
          <span className="text-slate-500">Target Estimate: ${budgetEstimateNumber.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentSpent > 90
                ? 'bg-rose-500'
                : percentSpent > 70
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${percentSpent}%` }}
          />
        </div>
      </div>

      {/* Add New Expense Form */}
      <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/80">
        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Expense Name
          </label>
          <input
            type="text"
            required
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="e.g. Ramen lunch, Metro pass, Souvenirs..."
            className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Category
          </label>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseItem['category'])}
              className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none capitalize"
            >
              <option value="food">Food</option>
              <option value="transport">Transit</option>
              <option value="lodging">Lodging</option>
              <option value="activities">Activities</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* Expenses Table / List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Logged Expenses ({expenses.length})
        </h4>

        {expenses.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No expenses logged yet. Add your first item above!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {expenses.map((exp) => {
              const IconComponent = CATEGORY_ICONS[exp.category] || DollarSign;
              return (
                <div
                  key={exp.id}
                  className="p-3.5 bg-white hover:bg-slate-50/80 flex items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{exp.description}</p>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {exp.category} • {exp.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900 text-sm">
                      ${exp.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      title="Remove expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
