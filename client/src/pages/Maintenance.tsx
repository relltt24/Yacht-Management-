import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Plus,
  Search,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  Ship,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { maintenanceApi } from '../api';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState, LoadingSpinner } from '../components/common';
import { Maintenance as MaintenanceType } from '../types';

const types = ['All', 'Routine', 'Repair', 'Emergency', 'Inspection', 'Upgrade'];
const statuses = ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue'];
const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];

export default function Maintenance() {
  const navigate = useNavigate();
  const { maintenance, yachts, loading, refreshMaintenance } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredMaintenance = maintenance.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleDelete = async () => {
    if (!selectedMaintenance) return;
    setDeleting(true);
    try {
      await maintenanceApi.delete(selectedMaintenance.id);
      await refreshMaintenance();
      setShowDeleteModal(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error('Failed to delete maintenance record:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: MaintenanceType['status']) => {
    try {
      await maintenanceApi.update(id, { status: newStatus });
      await refreshMaintenance();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getYacht = (yachtId: number) => yachts.find((y) => y.id === yachtId);

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Low: 'text-green-600 bg-green-100',
      Medium: 'text-yellow-600 bg-yellow-100',
      High: 'text-orange-600 bg-orange-100',
      Critical: 'text-red-600 bg-red-100',
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  // Calculate stats
  const scheduledCount = maintenance.filter((m) => m.status === 'Scheduled').length;
  const inProgressCount = maintenance.filter((m) => m.status === 'In Progress').length;
  const overdueCount = maintenance.filter((m) => m.status === 'Overdue').length;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading maintenance records..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Maintenance" subtitle="Track and manage yacht maintenance" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledCount}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Wrench className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {maintenance.filter((m) => m.status === 'Completed').length}
              </p>
            </div>
          </Card>
        </div>

        {/* AI Predictions Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">AI Predictive Maintenance</h3>
              <p className="text-sm text-white/80">
                Our AI analyzes usage patterns, weather data, and historical records to predict maintenance needs
                before issues occur. This helps reduce downtime and prevent costly repairs.
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              onClick={() => navigate('/analytics')}
            >
              View Predictions
            </Button>
          </div>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search maintenance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {types.map((type) => (
                <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>{priority === 'All' ? 'All Priorities' : priority}</option>
              ))}
            </select>

            <Button onClick={() => navigate('/maintenance/new')} icon={<Plus className="w-4 h-4" />}>
              Schedule Maintenance
            </Button>
          </div>
        </div>

        {/* Maintenance List */}
        {filteredMaintenance.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Wrench className="w-8 h-8 text-gray-400" />}
              title="No maintenance records found"
              description={searchQuery || typeFilter !== 'All' || statusFilter !== 'All'
                ? "Try adjusting your filters"
                : "Get started by scheduling maintenance"
              }
              action={{ label: 'Schedule Maintenance', onClick: () => navigate('/maintenance/new') }}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMaintenance.map((item) => {
              const yacht = getYacht(item.yachtId);
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getPriorityColor(item.priority)}`}>
                      <Wrench className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            {yacht && (
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <Ship className="w-4 h-4" />
                                {yacht.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {item.scheduledDate}
                            </span>
                            <span className="text-sm text-gray-500">{item.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.status} />
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      )}

                      {item.aiPrediction && (
                        <div className="bg-purple-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-purple-700 mb-1">
                            <Sparkles className="w-4 h-4" />
                            AI Insight
                          </div>
                          <p className="text-sm text-purple-600">{item.aiPrediction.recommendedAction}</p>
                          <p className="text-xs text-purple-500 mt-1">
                            Confidence: {(item.aiPrediction.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          {item.estimatedCost && (
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              Est: ${item.estimatedCost.toLocaleString()}
                            </span>
                          )}
                          {item.assignedTo && (
                            <span className="text-sm text-gray-600">
                              Assigned to: {item.assignedTo}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status === 'Scheduled' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'In Progress')}
                            >
                              Start Work
                            </Button>
                          )}
                          {item.status === 'In Progress' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'Completed')}
                            >
                              Mark Complete
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/maintenance/${item.id}/edit`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMaintenance(null);
        }}
        title="Delete Maintenance Record"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this maintenance record? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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
