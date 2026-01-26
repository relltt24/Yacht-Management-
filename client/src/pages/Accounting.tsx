import React, { useState } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Filter,
  Plus,
  Search,
  Ship,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  CreditCard,
  Banknote,
  FolderOpen,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal } from '../components/common';

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  yachtId: string;
  yachtName: string;
  vendor?: string;
  receipt?: boolean;
  status: 'cleared' | 'pending' | 'reconciled';
}

interface Budget {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

const sampleTransactions: Transaction[] = [
  { id: 't1', date: '2024-09-01', type: 'income', category: 'Charter Revenue', description: 'Charter - Johnson Family', amount: 45000, yachtId: 'y1', yachtName: 'Azure Dreams', status: 'cleared' },
  { id: 't2', date: '2024-09-01', type: 'expense', category: 'Crew Salaries', description: 'Monthly payroll - September', amount: 28500, yachtId: 'y1', yachtName: 'Azure Dreams', status: 'cleared' },
  { id: 't3', date: '2024-08-28', type: 'expense', category: 'Maintenance', description: 'Engine service', amount: 4200, yachtId: 'y1', yachtName: 'Azure Dreams', vendor: 'Marine Tech Solutions', receipt: true, status: 'reconciled' },
  { id: 't4', date: '2024-08-25', type: 'expense', category: 'Fuel', description: 'Diesel refuel - 800 gal', amount: 3200, yachtId: 'y1', yachtName: 'Azure Dreams', receipt: true, status: 'cleared' },
  { id: 't5', date: '2024-08-20', type: 'income', category: 'Charter Revenue', description: 'Charter - Corporate Event', amount: 32000, yachtId: 'y1', yachtName: 'Azure Dreams', status: 'reconciled' },
  { id: 't6', date: '2024-08-18', type: 'expense', category: 'Dockage', description: 'Marina slip - September', amount: 1850, yachtId: 'y1', yachtName: 'Azure Dreams', vendor: 'Newport Harbor Marina', receipt: true, status: 'cleared' },
  { id: 't7', date: '2024-08-15', type: 'expense', category: 'Provisioning', description: 'Charter provisions', amount: 2800, yachtId: 'y1', yachtName: 'Azure Dreams', vendor: 'Blue Ocean Provisions', receipt: true, status: 'cleared' },
  { id: 't8', date: '2024-08-10', type: 'expense', category: 'Insurance', description: 'Hull insurance - Q3', amount: 12500, yachtId: 'y1', yachtName: 'Azure Dreams', status: 'reconciled' },
  { id: 't9', date: '2024-08-05', type: 'income', category: 'Charter Revenue', description: 'Charter - Anniversary Trip', amount: 28000, yachtId: 'y2', yachtName: 'Ocean Serenity', status: 'cleared' },
  { id: 't10', date: '2024-08-01', type: 'expense', category: 'Crew Salaries', description: 'Monthly payroll - August', amount: 28500, yachtId: 'y1', yachtName: 'Azure Dreams', status: 'reconciled' },
];

const budgetData: Budget[] = [
  { category: 'Crew Salaries', budgeted: 30000, spent: 28500, remaining: 1500 },
  { category: 'Fuel', budgeted: 5000, spent: 3200, remaining: 1800 },
  { category: 'Maintenance', budgeted: 8000, spent: 4200, remaining: 3800 },
  { category: 'Dockage', budgeted: 2000, spent: 1850, remaining: 150 },
  { category: 'Provisioning', budgeted: 5000, spent: 2800, remaining: 2200 },
  { category: 'Insurance', budgeted: 15000, spent: 12500, remaining: 2500 },
];

const monthlyData = [
  { month: 'Mar', income: 65000, expenses: 52000 },
  { month: 'Apr', income: 78000, expenses: 48000 },
  { month: 'May', income: 92000, expenses: 55000 },
  { month: 'Jun', income: 115000, expenses: 62000 },
  { month: 'Jul', income: 125000, expenses: 58000 },
  { month: 'Aug', income: 105000, expenses: 65000 },
];

const expensesByCategory = [
  { name: 'Crew Salaries', value: 57000, color: '#3d6a96' },
  { name: 'Maintenance', value: 15200, color: '#4ecdc4' },
  { name: 'Fuel', value: 12800, color: '#f59e0b' },
  { name: 'Insurance', value: 12500, color: '#8b5cf6' },
  { name: 'Dockage', value: 5550, color: '#ef4444' },
  { name: 'Provisioning', value: 8400, color: '#10b981' },
];

export default function Accounting() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'reports'>('overview');
  const [selectedYacht, setSelectedYacht] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate totals
  const totalIncome = sampleTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = sampleTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;
  const profitMargin = ((netIncome / totalIncome) * 100).toFixed(1);

  const filteredTransactions = sampleTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYacht = selectedYacht === 'all' || t.yachtId === selectedYacht;
    return matchesSearch && matchesYacht;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Accounting" subtitle="Financial management for your fleet" />

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Income</p>
                <p className="text-3xl font-bold mt-1">${totalIncome.toLocaleString()}</p>
                <p className="text-green-200 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +15% vs last month
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold mt-1">${totalExpenses.toLocaleString()}</p>
                <p className="text-red-200 text-sm mt-2 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  -8% vs last month
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-navy-700 to-navy-800 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-navy-200 text-sm font-medium">Net Income</p>
                <p className="text-3xl font-bold mt-1">${netIncome.toLocaleString()}</p>
                <p className="text-ocean-300 text-sm mt-2">
                  {profitMargin}% profit margin
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Calculator className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${sampleTransactions.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                </p>
                <p className="text-yellow-600 text-sm mt-2">
                  {sampleTransactions.filter(t => t.status === 'pending').length} transactions
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Receipt className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'transactions', label: 'Transactions', icon: Receipt },
            { id: 'budgets', label: 'Budgets', icon: PieChart },
            { id: 'reports', label: 'Reports', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-ocean-500 text-ocean-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expenses Chart */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGradient)" name="Income" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expenseGradient)" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Expenses by Category */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Expenses by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                </RechartsPie>
              </ResponsiveContainer>
            </Card>

            {/* Recent Transactions */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('transactions')}>
                  View All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yacht</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sampleTransactions.slice(0, 5).map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{txn.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{txn.description}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {txn.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{txn.yachtName}</td>
                        <td className={`px-4 py-3 text-sm font-semibold text-right ${
                          txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'transactions' && (
          <Card>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedYacht}
                  onChange={(e) => setSelectedYacht(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                >
                  <option value="all">All Yachts</option>
                  <option value="y1">Azure Dreams</option>
                  <option value="y2">Ocean Serenity</option>
                </select>
                <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
                  Export
                </Button>
                <Button onClick={() => setShowAddModal(true)} icon={<Plus className="w-4 h-4" />}>
                  Add Transaction
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yacht</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">{txn.date}</td>
                      <td className="px-4 py-4">
                        <span className={`flex items-center gap-1 text-sm ${
                          txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {txn.type === 'income' ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                          {txn.vendor && (
                            <p className="text-xs text-gray-500">{txn.vendor}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {txn.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{txn.yachtName}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={txn.status} size="sm" />
                      </td>
                      <td className={`px-4 py-4 text-sm font-semibold text-right ${
                        txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Monthly Budget Overview</h3>
                <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />}>
                  Edit Budget
                </Button>
              </div>

              <div className="space-y-4">
                {budgetData.map((budget) => {
                  const percentUsed = (budget.spent / budget.budgeted) * 100;
                  const isOverBudget = percentUsed > 100;
                  const isNearLimit = percentUsed > 80 && percentUsed <= 100;

                  return (
                    <div key={budget.category} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{budget.category}</span>
                        <span className={`text-sm font-medium ${
                          isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          ${budget.spent.toLocaleString()} / ${budget.budgeted.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentUsed, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="text-gray-500">{percentUsed.toFixed(0)}% used</span>
                        <span className={`font-medium ${
                          isOverBudget ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {isOverBudget ? 'Over by' : 'Remaining:'} ${Math.abs(budget.remaining).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Profit & Loss Statement', description: 'Monthly P&L report', icon: FileText },
              { name: 'Expense Report', description: 'Detailed expense breakdown', icon: Receipt },
              { name: 'Charter Revenue Report', description: 'Revenue by charter', icon: Banknote },
              { name: 'Crew Payroll Report', description: 'Payroll summary', icon: CreditCard },
              { name: 'Tax Report', description: 'Tax-ready financials', icon: Calculator },
              { name: 'Year-to-Date Summary', description: 'YTD financial overview', icon: BarChart3 },
            ].map((report) => (
              <Card key={report.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-ocean-100 rounded-lg">
                    <report.icon className="w-6 h-6 text-ocean-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{report.name}</h4>
                    <p className="text-sm text-gray-500 mb-3">{report.description}</p>
                    <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Transaction"
        size="md"
      >
        <div className="space-y-4">
          {/* Type Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setTransactionType('expense')}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                transactionType === 'expense'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setTransactionType('income')}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                transactionType === 'income'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Income
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
              {transactionType === 'expense' ? (
                <>
                  <option value="">Select category...</option>
                  <option value="crew">Crew Salaries</option>
                  <option value="fuel">Fuel</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="dockage">Dockage</option>
                  <option value="provisioning">Provisioning</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </>
              ) : (
                <>
                  <option value="">Select category...</option>
                  <option value="charter">Charter Revenue</option>
                  <option value="sale">Equipment Sale</option>
                  <option value="other">Other Income</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yacht</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
              <option value="y1">Azure Dreams</option>
              <option value="y2">Ocean Serenity</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="Transaction description..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          {transactionType === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor (Optional)</label>
              <input
                type="text"
                placeholder="Vendor name..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button icon={<Plus className="w-4 h-4" />}>
              Add Transaction
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
