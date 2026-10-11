'use client';

import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, ShoppingBag, Utensils, Plane, Building, Users, Receipt } from 'lucide-react';
import { parseUsdAmount } from '@/lib/currency';
import GroupExpenseSplitter from './GroupExpenseSplitter';

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
  activities: DollarSign,
  shopping: ShoppingBag,
  other: DollarSign,
};

export default function ExpenseTracker({
  tripId,
  destination,
  totalEstimatedBudgetStr,
}: ExpenseTrackerProps) {
  const storageKey = `wanderai_expenses_${tripId}`;

  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'group'>('personal');

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`wanderai_expenses_${tripId}`);
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('food');

  const budgetEstimateNumber = parseUsdAmount(totalEstimatedBudgetStr) || 1500;

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
    <div className="space-y-6">
      {/* Sub-navigation tabs: Personal vs Group Splitter */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 max-w-md">
        <button
          type="button"
          onClick={() => setActiveSubTab('personal')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'personal'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-indigo-600" />
          <span>Personal Receipts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('group')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'group'
              ? 'bg-white text-purple-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-purple-600" />
          <span>Group Splitter (Who Owes Who)</span>
        </button>
      </div>

      {activeSubTab === 'group' ? (
        <GroupExpenseSplitter tripId={tripId} destination={destination} />
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Personal Trip Expense Tracker
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                Track Real Expenses for {destination}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Log your actual receipts on the road to stay under your estimated budget.
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
              <span className="text-slate-500">Estimated Total: ${budgetEstimateNumber.toLocaleString()}</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  percentSpent > 90
                    ? 'bg-rose-500'
                    : percentSpent > 70
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${percentSpent}%` }}
              />
            </div>
          </div>

          {/* Add Expense Form */}
          <form
            onSubmit={handleAddExpense}
            className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Log New Expense</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lunch at Ramen Alley, Metro Pass"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseItem['category'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none cursor-pointer capitalize"
                >
                  <option value="food">Food & Dining</option>
                  <option value="transport">Transport</option>
                  <option value="lodging">Lodging</option>
                  <option value="activities">Activities</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Expense</span>
              </button>
            </div>
          </form>

          {/* Expenses List */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Logged Expenses ({expenses.length})
            </span>

            {expenses.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No expenses logged yet. Add your first receipt above to track spending!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 overflow-hidden">
                {expenses.map((item) => {
                  const CategoryIcon = CATEGORY_ICONS[item.category] || DollarSign;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{item.description}</div>
                          <div className="text-[11px] text-slate-400 capitalize">
                            {item.category} • {item.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-sm">
                          ${item.amount.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(item.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
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
      )}
    </div>
  );
}
