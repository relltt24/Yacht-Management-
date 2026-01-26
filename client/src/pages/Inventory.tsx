import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  RefreshCw,
  BarChart,
  Boxes,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { inventoryApi } from '../api';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState, LoadingSpinner } from '../components/common';
import { Inventory as InventoryType } from '../types';

const categories = ['All', 'Safety', 'Navigation', 'Provisions', 'Maintenance', 'Guest Amenities', 'Fuel & Fluids'];
const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'On Order'];

export default function Inventory() {
  const navigate = useNavigate();
  const { inventory, yachts, loading, refreshInventory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<InventoryType | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState(0);
  const [restocking, setRestocking] = useState(false);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRestock = async () => {
    if (!selectedItem || restockQuantity <= 0) return;
    setRestocking(true);
    try {
      await inventoryApi.restock(selectedItem.id, selectedItem.quantity + restockQuantity);
      await refreshInventory();
      setShowRestockModal(false);
      setSelectedItem(null);
      setRestockQuantity(0);
    } catch (error) {
      console.error('Failed to restock item:', error);
    } finally {
      setRestocking(false);
    }
  };

  const getYacht = (yachtId: number | null) => {
    if (!yachtId) return null;
    return yachts.find((y) => y.id === yachtId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Low Stock':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'Out of Stock':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'On Order':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Calculate stats
  const inStockCount = inventory.filter((i) => i.status === 'In Stock').length;
  const lowStockCount = inventory.filter((i) => i.status === 'Low Stock').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'Out of Stock').length;
  const totalValue = inventory.reduce((sum, i) => sum + (i.cost * i.quantity), 0);

  // Group by category for summary
  const categoryStats = categories.slice(1).map((cat) => ({
    name: cat,
    count: inventory.filter((i) => i.category === cat).length,
    lowStock: inventory.filter((i) => i.category === cat && i.status === 'Low Stock').length,
  }));

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading inventory..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Inventory" subtitle="Manage yacht supplies and equipment" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Boxes className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inStockCount}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <BarChart className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
                <p className="text-sm text-yellow-700">
                  {lowStockCount} items are running low and need to be restocked soon.
                  {outOfStockCount > 0 && ` ${outOfStockCount} items are out of stock.`}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setStatusFilter('Low Stock')}
              >
                View Items
              </Button>
            </div>
          </Card>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
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

            <Button onClick={() => navigate('/inventory/new')} icon={<Plus className="w-4 h-4" />}>
              Add Item
            </Button>
          </div>
        </div>

        {/* Inventory Table */}
        {filteredInventory.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Package className="w-8 h-8 text-gray-400" />}
              title="No inventory items found"
              description={searchQuery || categoryFilter !== 'All' || statusFilter !== 'All'
                ? "Try adjusting your filters"
                : "Get started by adding your first inventory item"
              }
              action={{ label: 'Add Item', onClick: () => navigate('/inventory/new') }}
            />
          </Card>
        ) : (
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => {
                    const yacht = getYacht(item.yachtId);
                    const stockLevel = item.minQuantity > 0
                      ? (item.quantity / item.minQuantity) * 100
                      : 100;

                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Package className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              {item.supplier && (
                                <p className="text-xs text-gray-500">Supplier: {item.supplier}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.quantity} {item.unit}
                            </p>
                            <div className="mt-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  stockLevel >= 50 ? 'bg-green-500' :
                                  stockLevel >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(stockLevel, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500">Min: {item.minQuantity}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{item.location || 'N/A'}</p>
                          {yacht && (
                            <p className="text-xs text-gray-500">{yacht.name}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <StatusBadge status={item.status} size="sm" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">${item.cost.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            Total: ${(item.cost * item.quantity).toFixed(2)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setRestockQuantity(item.minQuantity - item.quantity > 0
                                  ? item.minQuantity - item.quantity
                                  : 10);
                                setShowRestockModal(true);
                              }}
                              icon={<RefreshCw className="w-4 h-4" />}
                            >
                              Restock
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/inventory/${item.id}/edit`)}
                            >
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Restock Modal */}
      <Modal
        isOpen={showRestockModal}
        onClose={() => {
          setShowRestockModal(false);
          setSelectedItem(null);
          setRestockQuantity(0);
        }}
        title="Restock Item"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedItem.name}</p>
              <p className="text-sm text-gray-500">
                Current: {selectedItem.quantity} {selectedItem.unit} | Min: {selectedItem.minQuantity} {selectedItem.unit}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity to Add
              </label>
              <input
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                New total: {selectedItem.quantity + restockQuantity} {selectedItem.unit}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRestockModal(false);
                  setSelectedItem(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRestock}
                loading={restocking}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Restock
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
