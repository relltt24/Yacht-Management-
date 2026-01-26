import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  CreditCard,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Download,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  RefreshCw,
} from 'lucide-react';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState } from '../components/common';

interface Transaction {
  id: string;
  type: 'payment' | 'deposit' | 'withdrawal' | 'refund';
  recipient: string;
  recipientType: 'crew' | 'vendor' | 'marina' | 'self';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  date: string;
  reference: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
  expiryMonth?: number;
  expiryYear?: number;
}

interface Payee {
  id: string;
  name: string;
  type: 'crew' | 'vendor';
  email: string;
  accountStatus: 'verified' | 'pending' | 'unverified';
  totalPaid: number;
  lastPayment?: string;
}

const sampleTransactions: Transaction[] = [
  {
    id: 'txn_001',
    type: 'payment',
    recipient: 'Captain John Smith',
    recipientType: 'crew',
    amount: 8500,
    currency: 'USD',
    status: 'completed',
    description: 'Monthly salary - September 2024',
    date: '2024-09-01',
    reference: 'PAY-2024-0901-001',
  },
  {
    id: 'txn_002',
    type: 'payment',
    recipient: 'Marine Tech Solutions',
    recipientType: 'vendor',
    amount: 3250,
    currency: 'USD',
    status: 'completed',
    description: 'Engine maintenance service',
    date: '2024-08-28',
    reference: 'PAY-2024-0828-001',
  },
  {
    id: 'txn_003',
    type: 'payment',
    recipient: 'Chef Maria Garcia',
    recipientType: 'crew',
    amount: 6200,
    currency: 'USD',
    status: 'pending',
    description: 'Monthly salary - September 2024',
    date: '2024-09-01',
    reference: 'PAY-2024-0901-002',
  },
  {
    id: 'txn_004',
    type: 'deposit',
    recipient: 'Wallet Top-up',
    recipientType: 'self',
    amount: 50000,
    currency: 'USD',
    status: 'completed',
    description: 'Bank transfer deposit',
    date: '2024-08-25',
    reference: 'DEP-2024-0825-001',
  },
  {
    id: 'txn_005',
    type: 'payment',
    recipient: 'Newport Harbor Marina',
    recipientType: 'marina',
    amount: 1850,
    currency: 'USD',
    status: 'completed',
    description: 'Slip rental - September',
    date: '2024-09-01',
    reference: 'PAY-2024-0901-003',
  },
];

const samplePaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_001',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
    expiryMonth: 12,
    expiryYear: 2026,
  },
  {
    id: 'pm_002',
    type: 'bank',
    last4: '6789',
    bankName: 'Chase Bank',
    isDefault: false,
  },
];

const samplePayees: Payee[] = [
  {
    id: 'payee_001',
    name: 'Captain John Smith',
    type: 'crew',
    email: 'john.smith@email.com',
    accountStatus: 'verified',
    totalPaid: 102000,
    lastPayment: '2024-09-01',
  },
  {
    id: 'payee_002',
    name: 'Chef Maria Garcia',
    type: 'crew',
    email: 'maria.garcia@email.com',
    accountStatus: 'verified',
    totalPaid: 74400,
    lastPayment: '2024-09-01',
  },
  {
    id: 'payee_003',
    name: 'Marine Tech Solutions',
    type: 'vendor',
    email: 'billing@marinetechsolutions.com',
    accountStatus: 'verified',
    totalPaid: 45600,
    lastPayment: '2024-08-28',
  },
  {
    id: 'payee_004',
    name: 'Blue Ocean Supplies',
    type: 'vendor',
    email: 'accounts@blueocean.com',
    accountStatus: 'pending',
    totalPaid: 12300,
    lastPayment: '2024-08-15',
  },
];

export default function Wallet() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payees' | 'methods'>('overview');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const walletBalance = 127450.00;
  const pendingPayments = 6200.00;
  const monthlySpend = 19800.00;

  const filteredTransactions = sampleTransactions.filter((txn) => {
    const matchesSearch = txn.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      case 'refund':
        return <ArrowDownLeft className="w-4 h-4 text-blue-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const handlePayment = () => {
    // In production, this would call Stripe API
    console.log('Processing payment:', { payee: selectedPayee, amount: paymentAmount, description: paymentDescription });
    setShowPayModal(false);
    setSelectedPayee(null);
    setPaymentAmount('');
    setPaymentDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Wallet" subtitle="Manage payments, payroll, and transactions" />

      <div className="p-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-navy-800 to-navy-900 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-navy-200 text-sm font-medium">Available Balance</p>
                <p className="text-3xl font-bold mt-1">${walletBalance.toLocaleString()}</p>
                <p className="text-navy-300 text-sm mt-2">USD</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <WalletIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="bg-ocean-500 hover:bg-ocean-600 text-white"
                icon={<Send className="w-4 h-4" />}
                onClick={() => setShowPayModal(true)}
              >
                Send Payment
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowDepositModal(true)}
              >
                Add Funds
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${pendingPayments.toLocaleString()}</p>
                <p className="text-yellow-600 text-sm mt-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  1 payment processing
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${monthlySpend.toLocaleString()}</p>
                <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  12% less than last month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'payees', label: 'Payees' },
            { id: 'methods', label: 'Payment Methods' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-ocean-500 text-ocean-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('transactions')}>
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {sampleTransactions.slice(0, 5).map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        txn.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {getTransactionIcon(txn.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{txn.recipient}</p>
                        <p className="text-xs text-gray-500">{txn.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        txn.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {txn.type === 'deposit' ? '+' : '-'}${txn.amount.toLocaleString()}
                      </p>
                      <StatusBadge status={txn.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Pay */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Pay</h3>
              <div className="space-y-3">
                {samplePayees.filter(p => p.accountStatus === 'verified').slice(0, 4).map((payee) => (
                  <div
                    key={payee.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedPayee(payee);
                      setShowPayModal(true);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        payee.type === 'crew' ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}>
                        {payee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{payee.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{payee.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" icon={<Send className="w-4 h-4" />}>
                      Pay
                    </Button>
                  </div>
                ))}
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
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                >
                  <option value="all">All Types</option>
                  <option value="payment">Payments</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="refund">Refunds</option>
                </select>
                <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
                  Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">{txn.date}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(txn.type)}
                          <span className="text-sm font-medium text-gray-900">{txn.recipient}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{txn.description}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 font-mono">{txn.reference}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={txn.status} size="sm" />
                      </td>
                      <td className={`px-4 py-4 text-sm font-semibold text-right ${
                        txn.type === 'deposit' || txn.type === 'refund' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {txn.type === 'deposit' || txn.type === 'refund' ? '+' : '-'}${txn.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'payees' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Manage Payees</h3>
              <Button icon={<Plus className="w-4 h-4" />}>Add Payee</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {samplePayees.map((payee) => (
                <div key={payee.id} className="p-4 border border-gray-200 rounded-xl hover:border-ocean-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        payee.type === 'crew' ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}>
                        {payee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{payee.name}</p>
                        <p className="text-sm text-gray-500">{payee.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payee.accountStatus === 'verified'
                        ? 'bg-green-100 text-green-700'
                        : payee.accountStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {payee.accountStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Total Paid</p>
                      <p className="font-semibold text-gray-900">${payee.totalPaid.toLocaleString()}</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Send className="w-4 h-4" />}
                      onClick={() => {
                        setSelectedPayee(payee);
                        setShowPayModal(true);
                      }}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'methods' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Payment Methods</h3>
                <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />}>
                  Add Method
                </Button>
              </div>

              <div className="space-y-4">
                {samplePaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-xl ${
                      method.isDefault ? 'border-ocean-300 bg-ocean-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          method.type === 'card' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          <CreditCard className={`w-5 h-5 ${
                            method.type === 'card' ? 'text-blue-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {method.type === 'card' ? method.brand : method.bankName} •••• {method.last4}
                          </p>
                          {method.type === 'card' && (
                            <p className="text-sm text-gray-500">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </p>
                          )}
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-ocean-100 text-ocean-700 text-xs font-medium rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Stripe Connect</h3>
              <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Stripe Connected</p>
                    <p className="text-sm text-white/80">Account verified and active</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 mb-4">
                  Your Stripe account is connected for secure payment processing. All transactions are encrypted and PCI compliant.
                </p>
                <Button size="sm" className="bg-white/20 text-white hover:bg-white/30">
                  Manage Stripe Settings
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Send Payment Modal */}
      <Modal
        isOpen={showPayModal}
        onClose={() => {
          setShowPayModal(false);
          setSelectedPayee(null);
          setPaymentAmount('');
          setPaymentDescription('');
        }}
        title="Send Payment"
        size="md"
      >
        <div className="space-y-4">
          {!selectedPayee ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Payee</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {samplePayees.filter(p => p.accountStatus === 'verified').map((payee) => (
                  <div
                    key={payee.id}
                    onClick={() => setSelectedPayee(payee)}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-ocean-300 cursor-pointer transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      payee.type === 'crew' ? 'bg-emerald-500' : 'bg-violet-500'
                    }`}>
                      {payee.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payee.name}</p>
                      <p className="text-xs text-gray-500">{payee.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    selectedPayee.type === 'crew' ? 'bg-emerald-500' : 'bg-violet-500'
                  }`}>
                    {selectedPayee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedPayee.name}</p>
                    <p className="text-sm text-gray-500">{selectedPayee.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 text-2xl border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="e.g., Monthly salary, Service payment..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                  {samplePaymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.type === 'card' ? method.brand : method.bankName} •••• {method.last4}
                      {method.isDefault ? ' (Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-ocean-50 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Payment Amount</span>
                  <span className="font-medium">${parseFloat(paymentAmount || '0').toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-ocean-200">
                  <span>Total</span>
                  <span className="text-ocean-600">${parseFloat(paymentAmount || '0').toLocaleString()}</span>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => {
              if (selectedPayee) {
                setSelectedPayee(null);
              } else {
                setShowPayModal(false);
              }
            }}>
              {selectedPayee ? 'Back' : 'Cancel'}
            </Button>
            {selectedPayee && (
              <Button
                onClick={handlePayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                icon={<Send className="w-4 h-4" />}
              >
                Send ${parseFloat(paymentAmount || '0').toLocaleString()}
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Add Funds to Wallet"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 text-2xl border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1000, 5000, 10000, 25000].map((amount) => (
              <button
                key={amount}
                className="py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-ocean-300 hover:bg-ocean-50 transition-colors"
              >
                ${amount.toLocaleString()}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
              {samplePaymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.type === 'card' ? method.brand : method.bankName} •••• {method.last4}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowDepositModal(false)}>
              Cancel
            </Button>
            <Button icon={<Plus className="w-4 h-4" />}>
              Add Funds
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
