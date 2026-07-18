// ============================================================
// Portfolio Page — Investment portfolio view
// ============================================================

import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, TrendingUp, TrendingDown, Wallet, Trash2, PiggyBank, Building, Banknote } from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
// Button import removed — not used in this view

import { MoneyCounter } from '../../components/animations/MoneyCounter';
import { PageTransition } from '../../components/ui/PageTransition';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const COLORS = [
  '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#a855f7',
];

export function PortfolioPage() {
  const game = useGame();

  // Prepare pie chart data
  const allocationEntries = [
    { name: 'Cash', value: game.portfolioAllocation.cash },
    { name: 'Emergency', value: game.portfolioAllocation.emergencyFund },
    { name: 'Stocks', value: game.portfolioAllocation.stocks },
    { name: 'Mutual Funds', value: game.portfolioAllocation.mutualFunds },
    { name: 'Gold', value: game.portfolioAllocation.gold },
    { name: 'Property', value: game.portfolioAllocation.property },
    { name: 'Business', value: game.portfolioAllocation.business },
    { name: 'FD', value: game.portfolioAllocation.fixedDeposit },
    { name: 'Bonds', value: game.portfolioAllocation.governmentBond },
    { name: 'Crypto', value: game.portfolioAllocation.crypto },
  ].filter((e) => e.value > 0);

  // Net worth history for area chart
  const chartData = game.netWorthHistory.map((entry) => ({
    year: `Y${entry.year}`,
    value: entry.amount,
  }));

  return (
    <PageTransition className="pb-24 px-4 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <h1 className="text-2xl font-bold text-white font-poppins flex items-center gap-2">
          <PieChartIcon size={24} className="text-purple-400" /> Portfolio
        </h1>
        <p className="text-sm text-slate-400 mt-1">Your financial overview</p>
      </motion.div>

      {/* Net Worth Card */}
      <Card variant="gradient" padding="lg" className="mb-4 text-center">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Net Worth</p>
        <MoneyCounter
          amount={game.netWorth}
          className="text-3xl font-extrabold text-white"
        />
        {game.netWorthHistory.length > 1 && (
          <div className="flex items-center justify-center gap-1 mt-1">
            {game.netWorth >= (game.netWorthHistory[game.netWorthHistory.length - 2]?.amount || 0) ? (
              <TrendingUp size={14} className="text-emerald-400" />
            ) : (
              <TrendingDown size={14} className="text-red-400" />
            )}
            <span className={`text-sm font-semibold ${
              game.netWorth >= (game.netWorthHistory[game.netWorthHistory.length - 2]?.amount || 0)
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}>
              {formatCurrency(
                game.netWorth - (game.netWorthHistory[game.netWorthHistory.length - 2]?.amount || 0),
                true
              )} this year
            </span>
          </div>
        )}
      </Card>

      {/* ===== Financial Overview ===== */}
      <Card variant="gradient" padding="md" className="mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Financial Overview
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Wallet size={14} />, label: 'Cash', value: game.cash, color: 'text-emerald-400' },
            { icon: <PiggyBank size={14} />, label: 'Emergency Fund', value: game.emergencyFund, color: 'text-blue-400' },
            { icon: <Building size={14} />, label: 'Assets', value: game.totalInvestmentValue, color: 'text-purple-400' },
            { icon: <Banknote size={14} />, label: 'Loans', value: game.loans, color: 'text-red-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={item.color}>{item.icon}</span>
              <div>
                <p className="text-[10px] text-slate-500">{item.label}</p>
                <p className={`text-sm font-bold ${item.color}`}>
                  {formatCurrency(item.value, true)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Net Worth Growth Chart */}
      {chartData.length > 1 && (
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Growth Over Time
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => {
                    if (v >= 10000000) return `${(v / 10000000).toFixed(0)}Cr`;
                    if (v >= 100000) return `${(v / 100000).toFixed(0)}L`;
                    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
                    return v.toString();
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(value) => [formatCurrency(value as number, true), 'Net Worth']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#netWorthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Allocation Pie Chart */}
      {allocationEntries.length > 0 && (
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Asset Allocation
          </h3>
          <div className="h-48 flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={allocationEntries}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {allocationEntries.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1.5">
              {allocationEntries.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-slate-400 flex-1">{entry.name}</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(entry.value, true)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Active Investments */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Active Investments ({game.investments.length})
        </h3>
        {game.investments.length === 0 ? (
          <Card variant="default" padding="lg" className="text-center">
            <Wallet size={32} className="text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No investments yet. Start investing!</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {game.investments.map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card variant={inv.returns >= 0 ? 'highlight' : 'danger'} padding="sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{inv.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant={inv.returns >= 0 ? 'success' : 'danger'}
                          size="sm"
                        >
                          {formatPercent(inv.returns)}
                        </Badge>
                        <span className="text-[10px] text-slate-500">
                          Invested Y{inv.yearInvested}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        {formatCurrency(inv.currentValue, true)}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Cost: {formatCurrency(inv.amountInvested, true)}
                      </p>
                    </div>
                    <button
                      onClick={() => game.sellInvestment(inv.id)}
                      className="ml-2 p-2 rounded-xl hover:bg-white/10 text-slate-500 hover:text-red-400 transition-colors"
                      title="Sell"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <Card variant="default" padding="md">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Investment Stats
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-500">Total Invested</p>
            <p className="font-bold text-white">
              {formatCurrency(game.investments.reduce((s, i) => s + i.amountInvested, 0), true)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Current Value</p>
            <p className="font-bold text-emerald-400">
              {formatCurrency(game.totalInvestmentValue, true)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Total Gains</p>
            <p className={`font-bold ${game.stats.totalInvestmentGains >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(game.stats.totalInvestmentGains, true)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Scam Losses</p>
            <p className="font-bold text-red-400">
              {formatCurrency(game.stats.totalScamLoss, true)}
            </p>
          </div>
        </div>
      </Card>
    </PageTransition>
  );
}
