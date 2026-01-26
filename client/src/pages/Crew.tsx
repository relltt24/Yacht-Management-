import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Award,
  Ship,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { crewApi } from '../api';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState, LoadingSpinner } from '../components/common';
import { Crew as CrewType } from '../types';

const positions = ['All', 'Captain', 'First Mate', 'Engineer', 'Chef', 'Steward', 'Deckhand'];
const statuses = ['All', 'Active', 'On Leave', 'Training', 'Available'];

export default function Crew() {
  const navigate = useNavigate();
  const { crew, yachts, loading, refreshCrew } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCrew, setSelectedCrew] = useState<CrewType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredCrew = crew.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === 'All' || member.position === positionFilter;
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    return matchesSearch && matchesPosition && matchesStatus;
  });

  const handleDelete = async () => {
    if (!selectedCrew) return;
    setDeleting(true);
    try {
      await crewApi.delete(selectedCrew.id);
      await refreshCrew();
      setShowDeleteModal(false);
      setSelectedCrew(null);
    } catch (error) {
      console.error('Failed to delete crew member:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getAssignedYacht = (yachtId: number | null) => {
    if (!yachtId) return null;
    return yachts.find((y) => y.id === yachtId);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading crew..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Crew" subtitle="Manage your crew members" />

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crew..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>{pos === 'All' ? 'All Positions' : pos}</option>
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

            <Button onClick={() => navigate('/crew/new')} icon={<Plus className="w-4 h-4" />}>
              Add Crew
            </Button>
          </div>
        </div>

        {/* Crew Grid */}
        {filteredCrew.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Users className="w-8 h-8 text-gray-400" />}
              title="No crew members found"
              description={searchQuery || positionFilter !== 'All' || statusFilter !== 'All'
                ? "Try adjusting your filters"
                : "Get started by adding your first crew member"
              }
              action={{ label: 'Add Crew', onClick: () => navigate('/crew/new') }}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrew.map((member) => {
              const assignedYacht = getAssignedYacht(member.assignedYachtId);
              return (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-lg">
                        {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{member.position}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setSelectedCrew(selectedCrew?.id === member.id ? null : member)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {selectedCrew?.id === member.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              navigate(`/crew/${member.id}`);
                              setSelectedCrew(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/crew/${member.id}/edit`);
                              setSelectedCrew(null);
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

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone || 'No phone'}</span>
                    </div>
                    {assignedYacht && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Ship className="w-4 h-4" />
                        <span>{assignedYacht.name}</span>
                      </div>
                    )}
                  </div>

                  {member.certifications && member.certifications.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <Award className="w-3 h-3" />
                        Certifications
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.certifications.slice(0, 3).map((cert, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs"
                          >
                            {cert.name}
                          </span>
                        ))}
                        {member.certifications.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                            +{member.certifications.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <StatusBadge status={member.status} />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/crew/${member.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCrew(null);
        }}
        title="Delete Crew Member"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedCrew?.firstName} {selectedCrew?.lastName}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedCrew(null);
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
