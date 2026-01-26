import React, { useState } from 'react';
import {
  Gavel,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  Users,
  Calendar,
  Ship,
  FileText,
  MessageSquare,
  ChevronRight,
  Star,
  Award,
  TrendingDown,
  Eye,
} from 'lucide-react';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState } from '../components/common';

interface Bid {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  vendorJobs: number;
  amount: number;
  timeline: string;
  proposal: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  attachments: number;
}

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  yachtId: string;
  yachtName: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: 'open' | 'reviewing' | 'awarded' | 'completed' | 'cancelled';
  bidsCount: number;
  bids: Bid[];
  createdAt: string;
  preferredDate: string;
  location: string;
}

const sampleRequests: ServiceRequest[] = [
  {
    id: 'sr1',
    title: 'Engine Service & Oil Change',
    description: 'Annual engine service including oil change, filter replacement, and general inspection. Two CAT C32 engines.',
    category: 'Maintenance',
    yachtId: 'y1',
    yachtName: 'Azure Dreams',
    budgetMin: 3000,
    budgetMax: 5000,
    deadline: '2024-09-15',
    status: 'open',
    bidsCount: 4,
    createdAt: '2024-09-01',
    preferredDate: '2024-09-10',
    location: 'Newport Beach, CA',
    bids: [
      {
        id: 'b1',
        vendorId: 'v1',
        vendorName: 'Marine Tech Solutions',
        vendorRating: 4.9,
        vendorJobs: 342,
        amount: 4200,
        timeline: '2-3 days',
        proposal: 'Complete engine service package including genuine CAT parts, oil change, all filters, and comprehensive diagnostic report.',
        submittedAt: '2024-09-02',
        status: 'pending',
        attachments: 2,
      },
      {
        id: 'b2',
        vendorId: 'v2',
        vendorName: 'Pacific Marine Services',
        vendorRating: 4.7,
        vendorJobs: 189,
        amount: 3850,
        timeline: '3-4 days',
        proposal: 'Full service with OEM equivalent parts. Includes labor, parts, and disposal fees. 90-day warranty.',
        submittedAt: '2024-09-03',
        status: 'pending',
        attachments: 1,
      },
      {
        id: 'b3',
        vendorId: 'v3',
        vendorName: 'Newport Engine Works',
        vendorRating: 4.8,
        vendorJobs: 267,
        amount: 4500,
        timeline: '2 days',
        proposal: 'Premium service with genuine parts, priority scheduling, and 1-year warranty on all work performed.',
        submittedAt: '2024-09-02',
        status: 'pending',
        attachments: 3,
      },
      {
        id: 'b4',
        vendorId: 'v4',
        vendorName: 'Budget Marine Repair',
        vendorRating: 4.2,
        vendorJobs: 78,
        amount: 2900,
        timeline: '4-5 days',
        proposal: 'Basic service package with aftermarket parts. Labor included. 30-day warranty.',
        submittedAt: '2024-09-04',
        status: 'pending',
        attachments: 0,
      },
    ],
  },
  {
    id: 'sr2',
    title: 'Hull Cleaning & Bottom Paint',
    description: 'Complete hull cleaning, inspection, and bottom paint application. Currently hauled at Newport Shipyard.',
    category: 'Cleaning',
    yachtId: 'y1',
    yachtName: 'Azure Dreams',
    budgetMin: 8000,
    budgetMax: 12000,
    deadline: '2024-09-20',
    status: 'reviewing',
    bidsCount: 3,
    createdAt: '2024-09-05',
    preferredDate: '2024-09-18',
    location: 'Newport Shipyard',
    bids: [
      {
        id: 'b5',
        vendorId: 'v5',
        vendorName: 'Premier Marine Coatings',
        vendorRating: 4.9,
        vendorJobs: 156,
        amount: 10500,
        timeline: '5-7 days',
        proposal: 'Full hull prep, Interlux Micron bottom paint, zincs replacement, and running gear inspection.',
        submittedAt: '2024-09-06',
        status: 'pending',
        attachments: 4,
      },
      {
        id: 'b6',
        vendorId: 'v6',
        vendorName: 'Ocean Blue Yacht Services',
        vendorRating: 4.6,
        vendorJobs: 98,
        amount: 9200,
        timeline: '6-8 days',
        proposal: 'Complete bottom job with Sea Hawk paint. Includes haul-out coordination and launch.',
        submittedAt: '2024-09-07',
        status: 'pending',
        attachments: 2,
      },
    ],
  },
  {
    id: 'sr3',
    title: 'Navigation System Upgrade',
    description: 'Upgrade chartplotter and radar systems. Looking for Garmin or Raymarine solutions.',
    category: 'Electronics',
    yachtId: 'y2',
    yachtName: 'Ocean Serenity',
    budgetMin: 15000,
    budgetMax: 25000,
    deadline: '2024-10-01',
    status: 'awarded',
    bidsCount: 2,
    createdAt: '2024-08-20',
    preferredDate: '2024-09-25',
    location: 'Marina del Rey, CA',
    bids: [
      {
        id: 'b7',
        vendorId: 'v7',
        vendorName: 'NavCom Electronics',
        vendorRating: 4.9,
        vendorJobs: 276,
        amount: 22500,
        timeline: '3-4 days',
        proposal: 'Garmin GPSMAP 8616xsv with GMR Fantom radar. Full installation and integration with existing systems.',
        submittedAt: '2024-08-22',
        status: 'accepted',
        attachments: 5,
      },
    ],
  },
];

export default function Bids() {
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'completed'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBidDetailModal, setShowBidDetailModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'reviewing': return 'bg-blue-100 text-blue-700';
      case 'awarded': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredRequests = sampleRequests.filter((req) => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'active') return matchesSearch && (req.status === 'open' || req.status === 'reviewing');
    if (activeTab === 'completed') return matchesSearch && (req.status === 'awarded' || req.status === 'completed');
    return matchesSearch;
  });

  const handleAcceptBid = (bid: Bid) => {
    console.log('Accepting bid:', bid);
    setShowBidDetailModal(false);
    setSelectedBid(null);
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Bids & Quotes" subtitle="Manage service requests and vendor bids" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Gavel className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleRequests.filter(r => r.status === 'open' || r.status === 'reviewing').length}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bids Received</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleRequests.reduce((acc, r) => acc + r.bidsCount, 0)}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Awarded</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleRequests.filter(r => r.status === 'awarded').length}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Savings</p>
              <p className="text-2xl font-bold text-gray-900">18%</p>
            </div>
          </Card>
        </div>

        {/* Tabs and Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {[
              { id: 'requests', label: 'All Requests' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-ocean-100 text-ocean-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>
            <Button onClick={() => setShowCreateModal(true)} icon={<Plus className="w-4 h-4" />}>
              New Request
            </Button>
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Gavel className="w-8 h-8 text-gray-400" />}
              title="No service requests"
              description="Create a request to start receiving bids from vendors"
              action={{ label: 'Create Request', onClick: () => setShowCreateModal(true) }}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Ship className="w-4 h-4" />
                        {request.yachtName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {request.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${request.budgetMin.toLocaleString()} - ${request.budgetMax.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {request.bidsCount} bids
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                      icon={<Eye className="w-4 h-4" />}
                    >
                      View Bids
                    </Button>
                  </div>
                </div>

                {/* Bids Preview */}
                {request.bids.length > 0 && request.status !== 'awarded' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3">Recent Bids</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {request.bids.slice(0, 3).map((bid) => (
                        <div
                          key={bid.id}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedBid(bid);
                            setSelectedRequest(request);
                            setShowBidDetailModal(true);
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{bid.vendorName}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs">{bid.vendorRating}</span>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-ocean-600">${bid.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{bid.timeline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* View All Bids Modal */}
      <Modal
        isOpen={!!selectedRequest && !showBidDetailModal}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest?.title || 'Service Request'}
        size="xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Request Details */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-3">{selectedRequest.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Ship className="w-4 h-4" />
                  {selectedRequest.yachtName}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Budget: ${selectedRequest.budgetMin.toLocaleString()} - ${selectedRequest.budgetMax.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Deadline: {selectedRequest.deadline}
                </span>
              </div>
            </div>

            {/* Bids List */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {selectedRequest.bids.length} Bids Received
              </h3>
              <div className="space-y-4">
                {selectedRequest.bids
                  .sort((a, b) => a.amount - b.amount)
                  .map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`p-4 border rounded-xl ${
                        index === 0 ? 'border-ocean-300 bg-ocean-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy-500 to-ocean-500 flex items-center justify-center text-white font-bold">
                            {bid.vendorName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{bid.vendorName}</h4>
                              {index === 0 && (
                                <span className="px-2 py-0.5 bg-ocean-500 text-white text-xs rounded">
                                  Lowest Bid
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                {bid.vendorRating}
                              </span>
                              <span>{bid.vendorJobs} jobs completed</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${bid.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{bid.timeline}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-3 mb-4">{bid.proposal}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {bid.attachments} attachments
                          </span>
                          <span>Submitted {bid.submittedAt}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<MessageSquare className="w-4 h-4" />}
                          >
                            Message
                          </Button>
                          {bid.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptBid(bid)}
                              icon={<CheckCircle2 className="w-4 h-4" />}
                            >
                              Accept Bid
                            </Button>
                          )}
                          {bid.status === 'accepted' && (
                            <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg">
                              <CheckCircle2 className="w-4 h-4" />
                              Accepted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Request Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Service Request"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g., Engine Service, Hull Cleaning..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                <option value="">Select category...</option>
                <option value="maintenance">Maintenance & Repair</option>
                <option value="cleaning">Cleaning & Detailing</option>
                <option value="electronics">Electronics</option>
                <option value="interior">Interior</option>
                <option value="safety">Safety Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yacht</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                <option value="1">Azure Dreams</option>
                <option value="2">Ocean Serenity</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Describe the service you need in detail..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Min ($)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Max ($)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bid Deadline</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="Where is the yacht located?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button icon={<Gavel className="w-4 h-4" />}>
              Post Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
