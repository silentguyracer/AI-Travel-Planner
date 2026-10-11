'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Plus,
  Trash2,
  Receipt,
  Share2,
  Check,
  Split,
  CircleDollarSign
} from 'lucide-react';

export interface GroupMember {
  id: string;
  name: string;
  avatarColor: string;
}

export interface GroupExpense {
  id: string;
  description: string;
  amount: number;
  paidById: string;
  splitAmongIds: string[]; // member IDs sharing this bill
  date: string;
}

export interface DebtSettlement {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  amount: number;
}

interface GroupExpenseSplitterProps {
  tripId: string;
  destination: string;
}

const AVATAR_COLORS = [
  'bg-indigo-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-sky-500 text-white',
  'bg-purple-500 text-white',
  'bg-teal-500 text-white',
  'bg-orange-500 text-white',
];

export default function GroupExpenseSplitter({
  tripId,
  destination,
}: GroupExpenseSplitterProps) {
  const membersKey = `wanderai_members_${tripId}`;
  const expensesKey = `wanderai_groupexpenses_${tripId}`;

  // Default members
  const [members, setMembers] = useState<GroupMember[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`wanderai_members_${tripId}`);
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [
      { id: 'm-1', name: 'Me (You)', avatarColor: AVATAR_COLORS[0] },
      { id: 'm-2', name: 'Alex', avatarColor: AVATAR_COLORS[1] },
      { id: 'm-3', name: 'Sam', avatarColor: AVATAR_COLORS[2] },
    ];
  });

  const [groupExpenses, setGroupExpenses] = useState<GroupExpense[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`wanderai_groupexpenses_${tripId}`);
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [];
  });

  // New member form
  const [newMemberName, setNewMemberName] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);

  // New expense form
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState<string>('m-1');
  const [splitAmongIds, setSplitAmongIds] = useState<string[]>(['m-1', 'm-2', 'm-3']);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(membersKey, JSON.stringify(members));
    } catch {
      // ignore
    }
  }, [members, membersKey]);

  useEffect(() => {
    try {
      localStorage.setItem(expensesKey, JSON.stringify(groupExpenses));
    } catch {
      // ignore
    }
  }, [groupExpenses, expensesKey]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newMember: GroupMember = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      avatarColor: AVATAR_COLORS[members.length % AVATAR_COLORS.length],
    };
    const updated = [...members, newMember];
    setMembers(updated);
    setSplitAmongIds((prev) => [...prev, newMember.id]);
    setNewMemberName('');
    setIsAddingMember(false);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setGroupExpenses((prev) =>
      prev.filter((e) => e.paidById !== id).map((e) => ({
        ...e,
        splitAmongIds: e.splitAmongIds.filter((mid) => mid !== id),
      }))
    );
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!desc.trim() || isNaN(val) || val <= 0 || splitAmongIds.length === 0) return;

    const newExp: GroupExpense = {
      id: `ge-${Date.now()}`,
      description: desc.trim(),
      amount: val,
      paidById,
      splitAmongIds,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
    };

    setGroupExpenses((prev) => [newExp, ...prev]);
    setDesc('');
    setAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    setGroupExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleSplitMember = (id: string) => {
    setSplitAmongIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Compute balances
  // Net Balance = (Total Paid) - (Total Share Consumed)
  const balances: Record<string, { paid: number; share: number; net: number }> = {};
  members.forEach((m) => {
    balances[m.id] = { paid: 0, share: 0, net: 0 };
  });

  groupExpenses.forEach((exp) => {
    if (balances[exp.paidById]) {
      balances[exp.paidById].paid += exp.amount;
    }
    const perPersonShare = exp.amount / (exp.splitAmongIds.length || 1);
    exp.splitAmongIds.forEach((uid) => {
      if (balances[uid]) {
        balances[uid].share += perPersonShare;
      }
    });
  });

  members.forEach((m) => {
    balances[m.id].net = balances[m.id].paid - balances[m.id].share;
  });

  // Optimal Settlement Algorithm (Greedy Debt Simplification)
  const settlements: DebtSettlement[] = [];
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  members.forEach((m) => {
    const net = balances[m.id]?.net || 0;
    if (net < -0.01) {
      debtors.push({ id: m.id, amount: -net });
    } else if (net > 0.01) {
      creditors.push({ id: m.id, amount: net });
    }
  });

  // Sort descending
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let dIdx = 0;
  let cIdx = 0;
  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const settleAmt = Math.min(debtor.amount, creditor.amount);

    if (settleAmt > 0.01) {
      const fromName = members.find((m) => m.id === debtor.id)?.name || 'Someone';
      const toName = members.find((m) => m.id === creditor.id)?.name || 'Someone';
      settlements.push({
        fromId: debtor.id,
        toId: creditor.id,
        fromName,
        toName,
        amount: Math.round(settleAmt * 100) / 100,
      });
    }

    debtor.amount -= settleAmt;
    creditor.amount -= settleAmt;

    if (debtor.amount <= 0.01) dIdx++;
    if (creditor.amount <= 0.01) cIdx++;
  }

  const totalGroupSpend = groupExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleCopyWhatsAppSummary = () => {
    let summaryText = `✈️ *${destination} - Group Expense Settlement*\n`;
    summaryText += `💰 *Total Group Spend:* $${totalGroupSpend.toFixed(2)}\n\n`;
    summaryText += `📊 *Net Balances:*\n`;
    members.forEach((m) => {
      const b = balances[m.id];
      const sign = b.net >= 0 ? '+' : '-';
      summaryText += `• ${m.name}: Paid $${b.paid.toFixed(2)} | Share $${b.share.toFixed(2)} (${sign}$${Math.abs(b.net).toFixed(2)})\n`;
    });

    summaryText += `\n🤝 *Who Owes Who (Settlement Plan):*\n`;
    if (settlements.length === 0) {
      summaryText += `All even! No pending debts.\n`;
    } else {
      settlements.forEach((s) => {
        summaryText += `👉 ${s.fromName} owes ${s.toName}: $${s.amount.toFixed(2)}\n`;
      });
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Group Bill Splitter & Debt Settler
            </span>
            <span className="text-xs font-medium text-slate-500">
              {members.length} Travelers
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Split Group Bills for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Log group meals, bullet trains, and hotels. The algorithm automatically calculates the fewest transactions to settle all debts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyWhatsAppSummary}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              copiedSummary
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {copiedSummary ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy WhatsApp Settlement'}</span>
          </button>
        </div>
      </div>

      {/* Travel Buddies Manager */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Travel Companions</span>
          </span>
          <button
            type="button"
            onClick={() => setIsAddingMember(!isAddingMember)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isAddingMember ? 'Close' : 'Add Companion'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-2xs text-xs font-semibold"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${m.avatarColor}`}
              >
                {m.name.charAt(0)}
              </div>
              <span>{m.name}</span>
              {members.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(m.id)}
                  className="text-slate-400 hover:text-rose-500 ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {isAddingMember && (
          <form onSubmit={handleAddMember} className="flex items-center gap-2 pt-2 animate-in fade-in">
            <input
              type="text"
              placeholder="Companion name (e.g. Jordan)"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
            >
              Add
            </button>
          </form>
        )}
      </div>

      {/* Add Group Bill Form */}
      <form
        onSubmit={handleAddExpense}
        className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-4"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Record New Shared Bill</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Izakaya Dinner, Taxi, Shinkansen"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Total Amount ($)
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
              Paid By
            </label>
            <select
              value={paidById}
              onChange={(e) => setPaidById(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none cursor-pointer"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Split Among Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1.5">
            Split Equally Among ({splitAmongIds.length} selected):
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {members.map((m) => {
              const isIncluded = splitAmongIds.includes(m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => toggleSplitMember(m.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    isIncluded
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <Check className={`w-3 h-3 ${isIncluded ? 'opacity-100' : 'opacity-0'}`} />
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bill</span>
          </button>
        </div>
      </form>

      {/* Settlement Debt Resolution Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balances Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Balances Overview
            </span>
            <span className="text-xs font-extrabold text-slate-900">
              Total: ${totalGroupSpend.toFixed(2)}
            </span>
          </div>

          <div className="space-y-2">
            {members.map((m) => {
              const b = balances[m.id];
              const isPositive = b.net > 0.01;
              const isNegative = b.net < -0.01;
              return (
                <div
                  key={m.id}
                  className="bg-white p-3 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${m.avatarColor}`}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[10px] text-slate-400">
                        Paid: ${b.paid.toFixed(0)} • Share: ${b.share.toFixed(0)}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`font-black ${
                      isPositive
                        ? 'text-emerald-600'
                        : isNegative
                        ? 'text-rose-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {isPositive ? `+$${b.net.toFixed(2)}` : isNegative ? `-$${Math.abs(b.net).toFixed(2)}` : '$0.00'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimized Settlement Graph */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Split className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Optimized Settlement Plan
              </span>
            </div>
            <span className="text-xs text-indigo-300">
              {settlements.length} payment{settlements.length === 1 ? '' : 's'} needed
            </span>
          </div>

          {settlements.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              🎉 All balances are settled up or no shared bills have been logged yet!
            </div>
          ) : (
            <div className="space-y-2.5">
              {settlements.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <span className="font-bold text-rose-300">{s.fromName}</span>
                    <span className="text-slate-400 text-[11px]">pays</span>
                    <span className="font-bold text-emerald-300">{s.toName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-black text-amber-300 text-sm">
                    <CircleDollarSign className="w-4 h-4" />
                    <span>${s.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shared Bills Log */}
      {groupExpenses.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recorded Bills ({groupExpenses.length})
          </span>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 overflow-hidden">
            {groupExpenses.map((exp) => {
              const payer = members.find((m) => m.id === exp.paidById)?.name || 'Someone';
              return (
                <div
                  key={exp.id}
                  className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{exp.description}</div>
                      <div className="text-[11px] text-slate-400">
                        Paid by <span className="font-semibold text-slate-600">{payer}</span> • Split with {exp.splitAmongIds.length} person(s) • {exp.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-sm">
                      ${exp.amount.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
