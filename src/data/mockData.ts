import { Property, Agent, ServiceCategory } from '@/types/property';

export const agents: Agent[] = [
  {
    id: '1',
    name: 'David Mukasa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+256 700 123 456',
    email: 'david@semkat.ug',
    rating: 4.9,
    totalListings: 45,
  },
  {
    id: '2',
    name: 'Grace Nakato',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    phone: '+256 700 234 567',
    email: 'grace@semkat.ug',
    rating: 4.8,
    totalListings: 38,
  },
  {
    id: '3',
    name: 'Samuel Opio',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+256 700 345 678',
    email: 'samuel@semkat.ug',
    rating: 4.7,
    totalListings: 52,
  },
  {
    id: '4',
    name: 'Mary Achieng',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    phone: '+256 700 456 789',
    email: 'mary@semkat.ug',
    rating: 4.9,
    totalListings: 29,
  },
];

export const properties: Property[] = [
  {
    id: '1',
    title: 'Prime Commercial Land in Kampala CBD',
    type: 'land',
    status: 'available',
    price: 850000000,
    currency: 'UGX',
    location: {
      region: 'Central',
      district: 'Kampala',
      address: 'Plot 45, Kampala Road',
      coordinates: { lat: 0.3136, lng: 32.5811 },
    },
    size: { value: 0.5, unit: 'acres' },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&h=600&fit=crop',
    ],
    description: 'Prime commercial land in the heart of Kampala CBD, perfect for high-rise development or commercial complex.',
    features: ['Title deed available', 'Road access', 'Near shopping centers', 'Utilities connected'],
    hasTitle: true,
    isFeatured: true,
    agent: agents[0],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Luxury 4-Bedroom Villa in Kololo',
    type: 'residential',
    status: 'available',
    price: 1200000000,
    currency: 'UGX',
    location: {
      region: 'Central',
      district: 'Kampala',
      address: 'Kololo Hill Drive',
      coordinates: { lat: 0.3267, lng: 32.5833 },
    },
    size: { value: 4500, unit: 'sqft' },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    ],
    description: 'Stunning luxury villa with panoramic views of Kampala, featuring modern architecture and premium finishes.',
    features: ['Swimming pool', 'Garden', 'Security', 'Garage for 3 cars', 'Staff quarters'],
    hasTitle: true,
    isFeatured: true,
    agent: agents[1],
    createdAt: '2024-01-20',
    bedrooms: 4,
    bathrooms: 5,
  },
  {
    id: '3',
    title: '2-Bedroom Apartment for Rent in Naguru',
    type: 'rental',
    status: 'available',
    price: 2500000,
    currency: 'UGX',
    location: {
      region: 'Central',
      district: 'Kampala',
      address: 'Naguru Housing Estate',
      coordinates: { lat: 0.3369, lng: 32.6028 },
    },
    size: { value: 1200, unit: 'sqft' },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    description: 'Modern fully-furnished apartment in secure compound with 24/7 security and parking.',
    features: ['Furnished', 'Parking', '24/7 Security', 'Water tank', 'Generator backup'],
    hasTitle: true,
    agent: agents[2],
    createdAt: '2024-02-01',
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: '4',
    title: '10 Acres Agricultural Land in Mukono',
    type: 'agricultural',
    status: 'available',
    price: 180000000,
    currency: 'UGX',
    location: {
      region: 'Central',
      district: 'Mukono',
      address: 'Namataba Village, Mukono',
      coordinates: { lat: 0.3533, lng: 32.7550 },
    },
    size: { value: 10, unit: 'acres' },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    ],
    description: 'Fertile agricultural land suitable for farming, with access to water source and good road network.',
    features: ['Water source nearby', 'Fertile soil', 'Road access', 'Electricity nearby'],
    hasTitle: true,
    isFeatured: true,
    agent: agents[3],
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    title: 'Commercial Building in Ntinda',
    type: 'commercial',
    status: 'under-offer',
    price: 2800000000,
    currency: 'UGX',
    location: {
      region: 'Central',
      district: 'Kampala',
      address: 'Ntinda Trading Center',
      coordinates: { lat: 0.3542, lng: 32.6186 },
    },
    size: { value: 8000, unit: 'sqft' },
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&h=600&fit=crop',
    ],
    description: '4-story commercial building with multiple rental units, fully occupied with stable tenants.',
    features: ['Fully tenanted', 'Elevator', 'Parking basement', 'Generator', 'Security system'],
    hasTitle: true,
    agent: agents[0],
    createdAt: '2024-02-15',
  },
  {
    id: '6',
    title: '3-Bedroom Bungalow in Entebbe',
    type: 'residential',
    status: 'available',
    price: 450000000,
    currency: 'UGX',
    location: {
      region: 'Central',
      district: 'Wakiso',
      address: 'Entebbe Municipality',
      coordinates: { lat: 0.0512, lng: 32.4637 },
    },
    size: { value: 2800, unit: 'sqft' },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    ],
    description: 'Beautiful bungalow near Lake Victoria with landscaped gardens and modern amenities.',
    features: ['Lake view', 'Garden', 'Servant quarters', 'Parking', 'Borehole'],
    hasTitle: true,
    agent: agents[1],
    createdAt: '2024-02-20',
    bedrooms: 3,
    bathrooms: 3,
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    id: '1',
    name: 'Land Sales',
    icon: 'map',
    description: 'Buy verified land parcels across Uganda',
    href: '/properties?type=land',
  },
  {
    id: '2',
    name: 'Houses',
    icon: 'home',
    description: 'Find your dream home',
    href: '/properties?type=residential',
  },
  {
    id: '3',
    name: 'Rentals',
    icon: 'key',
    description: 'Quality rental properties',
    href: '/properties?type=rental',
  },
  {
    id: '4',
    name: 'Commercial',
    icon: 'building',
    description: 'Business & office spaces',
    href: '/properties?type=commercial',
  },
  {
    id: '5',
    name: 'Documentation',
    icon: 'file-text',
    description: 'Land titles & legal services',
    href: '/services/documentation',
  },
  {
    id: '6',
    name: 'Construction',
    icon: 'hard-hat',
    description: 'Build your dream property',
    href: '/services/construction',
  },
  {
    id: '7',
    name: 'Financing',
    icon: 'credit-card',
    description: 'Property financing solutions',
    href: '/services/financing',
  },
  {
    id: '8',
    name: 'Vehicles',
    icon: 'car',
    description: 'Quality vehicles marketplace',
    href: '/services/vehicles',
  },
];

export const formatPrice = (price: number, currency: string = 'UGX'): string => {
  if (currency === 'UGX') {
    if (price >= 1000000000) {
      return `UGX ${(price / 1000000000).toFixed(1)}B`;
    } else if (price >= 1000000) {
      return `UGX ${(price / 1000000).toFixed(0)}M`;
    }
    return `UGX ${price.toLocaleString()}`;
  }
  return `${currency} ${price.toLocaleString()}`;
};

export const getPropertyTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    land: 'Land',
    residential: 'House',
    rental: 'Rental',
    commercial: 'Commercial',
    agricultural: 'Agricultural',
  };
  return labels[type] || type;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    available: 'success',
    sold: 'destructive',
    'under-offer': 'warning',
    rented: 'sky',
  };
  return colors[status] || 'default';
};
