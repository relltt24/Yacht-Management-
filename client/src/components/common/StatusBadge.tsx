import React from 'react';

type StatusType =
  | 'Available' | 'Chartered' | 'Maintenance' | 'In Transit'
  | 'Active' | 'On Leave' | 'Training'
  | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Overdue'
  | 'Pending' | 'Confirmed'
  | 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Order'
  | 'Valid' | 'Expiring Soon' | 'Expired';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      // Yacht status
      'Available': 'bg-green-100 text-green-700',
      'Chartered': 'bg-blue-100 text-blue-700',
      'Maintenance': 'bg-yellow-100 text-yellow-700',
      'In Transit': 'bg-purple-100 text-purple-700',

      // Crew status
      'Active': 'bg-green-100 text-green-700',
      'On Leave': 'bg-gray-100 text-gray-700',
      'Training': 'bg-blue-100 text-blue-700',

      // Maintenance/Task status
      'Scheduled': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-gray-100 text-gray-700',
      'Overdue': 'bg-red-100 text-red-700',

      // Booking status
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Confirmed': 'bg-green-100 text-green-700',

      // Inventory status
      'In Stock': 'bg-green-100 text-green-700',
      'Low Stock': 'bg-yellow-100 text-yellow-700',
      'Out of Stock': 'bg-red-100 text-red-700',
      'On Order': 'bg-blue-100 text-blue-700',

      // Certification status
      'Valid': 'bg-green-100 text-green-700',
      'Expiring Soon': 'bg-yellow-100 text-yellow-700',
      'Expired': 'bg-red-100 text-red-700',
    };

    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${getStatusColor(status)} ${sizeClasses[size]}`}
    >
      {status}
    </span>
  );
}
