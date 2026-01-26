import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ship,
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Ruler,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { yachtApi } from '../api';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState, LoadingSpinner } from '../components/common';
import { Yacht } from '../types';

const yachtTypes = ['All', 'Motor', 'Sailing', 'Catamaran', 'Mega'];
const yachtStatuses = ['All', 'Available', 'Chartered', 'Maintenance', 'In Transit'];

export default function Yachts() {
  const navigate = useNavigate();
  const { yachts, loading, refreshYachts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredYachts = yachts.filter((yacht) => {
    const matchesSearch =
      yacht.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      yacht.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || yacht.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || yacht.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async () => {
    if (!selectedYacht) return;
    setDeleting(true);
    try {
      await yachtApi.delete(selectedYacht.id);
      await refreshYachts();
      setShowDeleteModal(false);
      setSelectedYacht(null);
    } catch (error) {
      console.error('Failed to delete yacht:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading yachts..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Yachts" subtitle="Manage your fleet of yachts" />

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search yachts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {yachtTypes.map((type) => (
                <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {yachtStatuses.map((status) => (
                <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
              ))}
            </select>

            <Button onClick={() => navigate('/yachts/new')} icon={<Plus className="w-4 h-4" />}>
              Add Yacht
            </Button>
          </div>
        </div>

        {/* Yacht Grid */}
        {filteredYachts.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Ship className="w-8 h-8 text-gray-400" />}
              title="No yachts found"
              description={searchQuery || typeFilter !== 'All' || statusFilter !== 'All'
                ? "Try adjusting your filters"
                : "Get started by adding your first yacht"
              }
              action={{ label: 'Add Yacht', onClick: () => navigate('/yachts/new') }}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredYachts.map((yacht) => (
              <Card key={yacht.id} className="hover:shadow-md transition-shadow" padding="none">
                {/* Yacht Image */}
                <div className="h-48 bg-gradient-to-br from-ocean-400 to-ocean-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Ship className="w-16 h-16 text-white/50" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={yacht.status} />
                  </div>
                </div>

                {/* Yacht Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{yacht.name}</h3>
                      <p className="text-sm text-gray-500">{yacht.type} Yacht</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setSelectedYacht(yacht)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {selectedYacht?.id === yacht.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              navigate(`/yachts/${yacht.id}`);
                              setSelectedYacht(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/yachts/${yacht.id}/edit`);
                              setSelectedYacht(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Ruler className="w-4 h-4" />
                      <span>{yacht.length} {yacht.lengthUnit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{yacht.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{yacht.location || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Daily Rate</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${yacht.dailyRate?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/yachts/${yacht.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedYacht(null);
        }}
        title="Delete Yacht"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedYacht?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedYacht(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
