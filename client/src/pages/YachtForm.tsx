import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Ship, Save } from 'lucide-react';
import { yachtApi } from '../api';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import { Card, Button } from '../components/common';
import { Yacht } from '../types';

const defaultYacht: Partial<Yacht> = {
  name: '',
  type: 'Motor',
  length: 0,
  lengthUnit: 'ft',
  capacity: 0,
  status: 'Available',
  location: '',
  dailyRate: 0,
  weeklyRate: 0,
  yearBuilt: new Date().getFullYear(),
  manufacturer: '',
  model: '',
  hullMaterial: '',
  fuelCapacity: 0,
  waterCapacity: 0,
  cruisingSpeed: 0,
  maxSpeed: 0,
  amenities: [],
  description: '',
};

export default function YachtForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { refreshYachts } = useApp();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<Yacht>>(defaultYacht);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      yachtApi.getById(Number(id))
        .then((yacht) => setFormData(yacht))
        .catch((err) => {
          console.error('Failed to fetch yacht:', err);
          navigate('/yachts');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenityInput.trim()],
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await yachtApi.update(Number(id), formData);
      } else {
        await yachtApi.create(formData as Omit<Yacht, 'id' | 'createdAt' | 'updatedAt'>);
      }
      await refreshYachts();
      navigate('/yachts');
    } catch (error) {
      console.error('Failed to save yacht:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={isEdit ? 'Edit Yacht' : 'Add New Yacht'}
        subtitle={isEdit ? `Editing ${formData.name}` : 'Add a new yacht to your fleet'}
      />

      <div className="p-6">
        <button
          onClick={() => navigate('/yachts')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Yachts
        </button>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Ship className="w-5 h-5 text-ocean-600" />
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yacht Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    placeholder="Enter yacht name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    >
                      <option value="Motor">Motor</option>
                      <option value="Sailing">Sailing</option>
                      <option value="Catamaran">Catamaran</option>
                      <option value="Mega">Mega</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Chartered">Chartered</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="In Transit">In Transit</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Length *</label>
                    <div className="flex">
                      <input
                        type="number"
                        name="length"
                        value={formData.length}
                        onChange={handleChange}
                        required
                        min="0"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                      <select
                        name="lengthUnit"
                        value={formData.lengthUnit}
                        onChange={handleChange}
                        className="px-3 py-2 border border-l-0 border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      >
                        <option value="ft">ft</option>
                        <option value="m">m</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      placeholder="Guest capacity"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    placeholder="Current location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    placeholder="Describe the yacht..."
                  />
                </div>
              </div>
            </Card>

            {/* Specifications & Pricing */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                      <input
                        type="number"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hull Material</label>
                      <input
                        type="text"
                        name="hullMaterial"
                        value={formData.hullMaterial}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cruising Speed (knots)</label>
                      <input
                        type="number"
                        name="cruisingSpeed"
                        value={formData.cruisingSpeed}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Speed (knots)</label>
                      <input
                        type="number"
                        name="maxSpeed"
                        value={formData.maxSpeed}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate ($)</label>
                    <input
                      type="number"
                      name="dailyRate"
                      value={formData.dailyRate}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate ($)</label>
                    <input
                      type="number"
                      name="weeklyRate"
                      value={formData.weeklyRate}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    placeholder="Add amenity..."
                  />
                  <Button type="button" onClick={handleAddAmenity} variant="secondary">
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.amenities?.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-ocean-100 text-ocean-700 rounded-full text-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="ml-1 text-ocean-500 hover:text-ocean-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => navigate('/yachts')}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>
              {isEdit ? 'Save Changes' : 'Add Yacht'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
