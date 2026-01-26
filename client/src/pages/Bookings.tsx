import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Search,
  User,
  Mail,
  Phone,
  Ship,
  DollarSign,
  Users,
  MapPin,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { bookingApi } from '../api';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState, LoadingSpinner } from '../components/common';
import { Booking } from '../types';

const statuses = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function Bookings() {
  const navigate = useNavigate();
  const { bookings, yachts, loading, refreshBookings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: number, newStatus: Booking['status']) => {
    setUpdating(true);
    try {
      await bookingApi.update(id, { status: newStatus });
      await refreshBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getYacht = (yachtId: number) => yachts.find((y) => y.id === yachtId);

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Calculate stats
  const activeCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'Completed' || b.status === 'In Progress')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading bookings..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Bookings" subtitle="Manage yacht charters and reservations" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 rounded-lg">
              <Calendar className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
              ))}
            </select>

            <Button onClick={() => navigate('/bookings/new')} icon={<Plus className="w-4 h-4" />}>
              New Booking
            </Button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Calendar className="w-8 h-8 text-gray-400" />}
              title="No bookings found"
              description={searchQuery || statusFilter !== 'All'
                ? "Try adjusting your filters"
                : "Get started by creating a new booking"
              }
              action={{ label: 'New Booking', onClick: () => navigate('/bookings/new') }}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const yacht = getYacht(booking.yachtId);
              const duration = calculateDuration(booking.startDate, booking.endDate);

              return (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Client Info */}
                    <div className="flex items-center gap-4 lg:w-1/4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-semibold">
                        {booking.clientName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.clientName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{booking.clientEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Yacht & Dates */}
                    <div className="lg:w-1/3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Ship className="w-4 h-4 text-ocean-600" />
                        <span className="font-medium text-gray-900">{yacht?.name || 'Unknown Yacht'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {booking.startDate} - {booking.endDate}
                        </span>
                        <span className="text-ocean-600 font-medium">{duration} days</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{booking.guests} guests</span>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="lg:w-1/4">
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <DollarSign className="w-5 h-5" />
                        {booking.totalAmount?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <StatusBadge
                          status={booking.depositPaid ? 'Confirmed' : 'Pending'}
                          size="sm"
                        />
                        <span className="text-gray-500">
                          Deposit: ${booking.depositAmount?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3 lg:w-auto lg:ml-auto">
                      <StatusBadge status={booking.status} />

                      <div className="flex items-center gap-2">
                        {booking.status === 'Pending' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                            loading={updating}
                          >
                            Confirm
                          </Button>
                        )}
                        {booking.status === 'Confirmed' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleStatusUpdate(booking.id, 'In Progress')}
                            loading={updating}
                          >
                            Start Charter
                          </Button>
                        )}
                        {booking.status === 'In Progress' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                            loading={updating}
                          >
                            Complete
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBooking(null);
        }}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Client</h4>
                <p className="font-semibold text-gray-900">{selectedBooking.clientName}</p>
                <p className="text-sm text-gray-600">{selectedBooking.clientEmail}</p>
                <p className="text-sm text-gray-600">{selectedBooking.clientPhone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Yacht</h4>
                <p className="font-semibold text-gray-900">
                  {getYacht(selectedBooking.yachtId)?.name || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Dates</h4>
                <p className="text-gray-900">{selectedBooking.startDate} - {selectedBooking.endDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Guests</h4>
                <p className="text-gray-900">{selectedBooking.guests}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h4>
                <p className="text-2xl font-bold text-gray-900">
                  ${selectedBooking.totalAmount?.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Deposit</h4>
                <p className="text-gray-900">
                  ${selectedBooking.depositAmount?.toLocaleString()}
                  {selectedBooking.depositPaid && (
                    <span className="ml-2 text-green-600 text-sm">(Paid)</span>
                  )}
                </p>
              </div>
            </div>

            {selectedBooking.specialRequests && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Special Requests</h4>
                <p className="text-gray-700">{selectedBooking.specialRequests}</p>
              </div>
            )}

            {selectedBooking.itinerary && selectedBooking.itinerary.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Itinerary</h4>
                <div className="space-y-2">
                  {selectedBooking.itinerary.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <MapPin className="w-4 h-4 text-ocean-600" />
                      <div>
                        <p className="font-medium text-gray-900">{stop.location}</p>
                        <p className="text-sm text-gray-500">{stop.date} - {stop.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
              <Button onClick={() => navigate(`/bookings/${selectedBooking.id}/edit`)}>
                Edit Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
