import React, { useState } from 'react';
import {
  Store,
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  CheckCircle2,
  Award,
  MessageSquare,
  FileText,
  DollarSign,
  Plus,
  Heart,
  Share2,
  ChevronRight,
  Briefcase,
  Shield,
  TrendingUp,
} from 'lucide-react';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState } from '../components/common';

interface Vendor {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  rating: number;
  reviews: number;
  location: string;
  distance?: string;
  phone: string;
  email: string;
  website?: string;
  verified: boolean;
  premium: boolean;
  services: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  responseTime: string;
  completedJobs: number;
  yearsInBusiness: number;
  certifications: string[];
  images: string[];
  availability: 'available' | 'busy' | 'unavailable';
  favorited?: boolean;
}

const categories = [
  { id: 'all', name: 'All Categories', icon: Store },
  { id: 'maintenance', name: 'Maintenance & Repair', icon: Briefcase },
  { id: 'provisioning', name: 'Provisioning', icon: Store },
  { id: 'cleaning', name: 'Cleaning & Detailing', icon: Store },
  { id: 'electronics', name: 'Electronics & Navigation', icon: Store },
  { id: 'interior', name: 'Interior & Upholstery', icon: Store },
  { id: 'safety', name: 'Safety Equipment', icon: Shield },
  { id: 'catering', name: 'Catering & Chef Services', icon: Store },
];

const sampleVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Marine Tech Solutions',
    category: 'maintenance',
    subcategory: 'Engine & Mechanical',
    description: 'Full-service marine engine repair and maintenance. Specializing in diesel engines, generators, and hydraulic systems.',
    rating: 4.9,
    reviews: 127,
    location: 'Newport Beach, CA',
    distance: '2.3 mi',
    phone: '+1 (949) 555-0100',
    email: 'service@marinetechsolutions.com',
    website: 'www.marinetechsolutions.com',
    verified: true,
    premium: true,
    services: ['Engine Repair', 'Generator Service', 'Hydraulics', 'Transmission', 'Fuel Systems'],
    priceRange: '$$$',
    responseTime: '< 2 hours',
    completedJobs: 342,
    yearsInBusiness: 15,
    certifications: ['Caterpillar Certified', 'Cummins Certified', 'MTU Authorized'],
    images: [],
    availability: 'available',
  },
  {
    id: 'v2',
    name: 'Blue Ocean Provisions',
    category: 'provisioning',
    subcategory: 'Food & Beverage',
    description: 'Premium yacht provisioning service. Fresh, organic, and gourmet selections delivered directly to your vessel.',
    rating: 4.8,
    reviews: 89,
    location: 'Marina del Rey, CA',
    distance: '5.1 mi',
    phone: '+1 (310) 555-0200',
    email: 'orders@blueoceanprovisions.com',
    website: 'www.blueoceanprovisions.com',
    verified: true,
    premium: false,
    services: ['Gourmet Food', 'Beverages', 'Organic Options', 'Specialty Diets', 'Last-minute Orders'],
    priceRange: '$$$$',
    responseTime: '< 4 hours',
    completedJobs: 256,
    yearsInBusiness: 8,
    certifications: ['USDA Organic Certified', 'Safe Food Handling'],
    images: [],
    availability: 'available',
  },
  {
    id: 'v3',
    name: 'Sparkle Marine Detailing',
    category: 'cleaning',
    subcategory: 'Exterior Cleaning',
    description: 'Professional yacht detailing and cleaning services. We make your vessel shine like new.',
    rating: 4.7,
    reviews: 64,
    location: 'Long Beach, CA',
    distance: '8.2 mi',
    phone: '+1 (562) 555-0300',
    email: 'info@sparklemarine.com',
    verified: true,
    premium: false,
    services: ['Wash & Wax', 'Hull Cleaning', 'Teak Restoration', 'Metal Polishing', 'Interior Detailing'],
    priceRange: '$$',
    responseTime: '< 24 hours',
    completedJobs: 189,
    yearsInBusiness: 6,
    certifications: ['Awlgrip Certified', 'Eco-Friendly Products'],
    images: [],
    availability: 'busy',
  },
  {
    id: 'v4',
    name: 'NavCom Electronics',
    category: 'electronics',
    subcategory: 'Navigation Systems',
    description: 'Marine electronics installation and repair. Radar, GPS, communication systems, and entertainment.',
    rating: 4.9,
    reviews: 98,
    location: 'San Diego, CA',
    distance: '45 mi',
    phone: '+1 (619) 555-0400',
    email: 'support@navcomelectronics.com',
    website: 'www.navcomelectronics.com',
    verified: true,
    premium: true,
    services: ['Radar Systems', 'GPS/Chartplotters', 'VHF/SSB Radio', 'AIS', 'Satellite TV/Internet'],
    priceRange: '$$$',
    responseTime: '< 8 hours',
    completedJobs: 276,
    yearsInBusiness: 12,
    certifications: ['Garmin Authorized', 'Raymarine Certified', 'NMEA 2000'],
    images: [],
    availability: 'available',
  },
  {
    id: 'v5',
    name: 'Coastal Canvas & Upholstery',
    category: 'interior',
    subcategory: 'Soft Goods',
    description: 'Custom canvas work, upholstery, and interior soft goods for luxury yachts.',
    rating: 4.6,
    reviews: 52,
    location: 'Huntington Beach, CA',
    distance: '12 mi',
    phone: '+1 (714) 555-0500',
    email: 'design@coastalcanvas.com',
    verified: true,
    premium: false,
    services: ['Custom Cushions', 'Bimini Tops', 'Enclosures', 'Carpet', 'Headliners'],
    priceRange: '$$$',
    responseTime: '< 24 hours',
    completedJobs: 134,
    yearsInBusiness: 20,
    certifications: ['Sunbrella Certified', 'Ultraleather Authorized'],
    images: [],
    availability: 'available',
  },
  {
    id: 'v6',
    name: 'Chef on Board',
    category: 'catering',
    subcategory: 'Private Chef',
    description: 'Professional private chef services for yacht charters. Customized menus for any occasion.',
    rating: 5.0,
    reviews: 43,
    location: 'Newport Beach, CA',
    distance: '1.8 mi',
    phone: '+1 (949) 555-0600',
    email: 'bookings@chefonboard.com',
    website: 'www.chefonboard.com',
    verified: true,
    premium: true,
    services: ['Private Chef', 'Event Catering', 'Menu Planning', 'Wine Pairing', 'Dietary Accommodations'],
    priceRange: '$$$$',
    responseTime: '< 1 hour',
    completedJobs: 187,
    yearsInBusiness: 10,
    certifications: ['Culinary Institute Graduate', 'ServSafe Certified'],
    images: [],
    availability: 'available',
  },
];

export default function VendorCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('rating');

  const filteredVendors = sampleVendors
    .filter((vendor) => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      if (sortBy === 'distance') return parseFloat(a.distance || '999') - parseFloat(b.distance || '999');
      return 0;
    });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'busy': return 'bg-yellow-100 text-yellow-700';
      case 'unavailable': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Vendor Catalog" subtitle="Find trusted service providers for your yacht" />

      <div className="p-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors, services, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-500 text-lg"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="distance">Nearest</option>
              </select>
              <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
                More Filters
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-ocean-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredVendors.length}</span> vendors found
          </p>
        </div>

        {/* Vendor Grid */}
        {filteredVendors.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Store className="w-8 h-8 text-gray-400" />}
              title="No vendors found"
              description="Try adjusting your search or filters"
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Card
                key={vendor.id}
                className="hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                padding="none"
                onClick={() => setSelectedVendor(vendor)}
              >
                {/* Vendor Header */}
                <div className="h-32 bg-gradient-to-br from-navy-600 to-ocean-600 relative">
                  {vendor.premium && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                      PREMIUM
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      {vendor.verified && (
                        <CheckCircle2 className="w-5 h-5 text-ocean-300" />
                      )}
                      <h3 className="text-lg font-bold text-white">{vendor.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{vendor.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{vendor.reviews} reviews</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getAvailabilityColor(vendor.availability)}`}>
                      {vendor.availability}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">{vendor.subcategory}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{vendor.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {vendor.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {vendor.responseTime}
                    </span>
                  </div>

                  {/* Services Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {vendor.services.slice(0, 3).map((service, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {service}
                      </span>
                    ))}
                    {vendor.services.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                        +{vendor.services.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{vendor.priceRange}</span>
                      <span className="text-sm text-gray-500">price range</span>
                    </div>
                    <Button size="sm" icon={<MessageSquare className="w-4 h-4" />}>
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Vendor Detail Modal */}
      <Modal
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        title=""
        size="xl"
      >
        {selectedVendor && (
          <div className="-m-6">
            {/* Header */}
            <div className="h-48 bg-gradient-to-br from-navy-600 to-ocean-600 relative">
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedVendor.verified && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-ocean-500/30 text-ocean-200 text-xs rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {selectedVendor.premium && (
                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{selectedVendor.name}</h2>
                    <p className="text-ocean-200">{selectedVendor.subcategory}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold">{selectedVendor.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">{selectedVendor.reviews} reviews</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{selectedVendor.completedJobs}</p>
                  <p className="text-sm text-gray-500">Jobs Completed</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{selectedVendor.yearsInBusiness}</p>
                  <p className="text-sm text-gray-500">Years in Business</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{selectedVendor.responseTime}</p>
                  <p className="text-sm text-gray-500">Response Time</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{selectedVendor.description}</p>
              </div>

              {/* Services */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVendor.services.map((service, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-ocean-50 text-ocean-700 rounded-lg text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {selectedVendor.certifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.certifications.map((cert, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
                        <Award className="w-4 h-4" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{selectedVendor.location}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{selectedVendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{selectedVendor.email}</span>
                  </div>
                  {selectedVendor.website && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span className="text-ocean-600">{selectedVendor.website}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setSelectedVendor(null);
                    setShowRequestModal(true);
                  }}
                  icon={<FileText className="w-4 h-4" />}
                >
                  Request Quote
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  Send Message
                </Button>
                <Button
                  variant="secondary"
                  icon={<Phone className="w-4 h-4" />}
                >
                  Call
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Request Quote Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Request a Quote"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Yacht</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
              <option value="1">Azure Dreams - 85' Motor Yacht</option>
              <option value="2">Ocean Serenity - 65' Sailing Yacht</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
              <option value="">Select a service...</option>
              <option value="repair">Repair</option>
              <option value="maintenance">Maintenance</option>
              <option value="installation">Installation</option>
              <option value="inspection">Inspection</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Describe what you need..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range (Optional)</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
              <option value="">Select budget range...</option>
              <option value="0-500">$0 - $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="10000+">$10,000+</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
              Cancel
            </Button>
            <Button icon={<Send className="w-4 h-4" />}>
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
