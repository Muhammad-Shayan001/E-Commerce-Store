
import { Product, Category } from './types.js';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Food Colors', image: 'https://images.unsplash.com/photo-1621266152865-8b3879944682?q=80&w=800&auto=format&fit=crop', visible: true, description: 'High-concentration professional grade gel and powder colors.' },
  { id: '2', name: 'Premium Chocolate', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop', visible: true, description: 'Ethically sourced Belgian and Swiss couverture chocolate.' },
  { id: '3', name: 'Cake Decorating', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop', visible: true, description: 'Everything you need for perfect finishes and artistic detail.' },
  { id: '4', name: 'Baking Tools', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop', visible: true, description: 'Industrial-strength equipment for home and commercial use.' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Pro-Gel Food Color Set',
    slug: 'pro-gel-food-color-set',
    description: 'Highly concentrated gel-based food colors for vibrant cakes and frostings. Set of 12 essential shades.',
    price: 45,
    discountPrice: 38,
    category: 'Food Colors',
    brand: 'RainbowArt',
    images: [
      'https://images.unsplash.com/photo-1621266152865-8b3879944682?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527735070641-9d45ca1ea7d7?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 50,
    rating: 4.9,
    reviews: [],
    featured: true,
    tags: ['gel', 'vibrant', 'professional'],
    status: 'active',
    isVerified: true,
    authenticityID: 'AUTH-RGB-122',
    logistics: { weight: 450, dimensions: { length: 20, width: 10, height: 5 }, sku: 'COL-GEL-SET-12' },
    seo: { title: 'Professional Food Color Set', description: 'The ultimate gel color set.', keywords: ['food color'] },
    story: [
      { id: 's1', title: 'Molecular Precision', content: 'Our pigments are ground to 2 microns for perfect suspension.', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop', type: 'quality' },
      { id: 's2', title: 'Artisanal Batching', content: 'Hand-mixed in Switzerland to ensure zero saturation drift.', imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop', type: 'process' }
    ]
  },
  {
    id: 'p2',
    name: 'Belgian Couverture Chocolate',
    slug: 'belgian-dark-couverture',
    description: '70.5% premium dark chocolate callets, perfect for melting and luxury ganaches.',
    price: 28,
    category: 'Premium Chocolate',
    brand: 'Callebaut',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop'],
    stock: 25,
    rating: 4.8,
    reviews: [],
    featured: true,
    isVerified: true,
    status: 'active',
    logistics: { weight: 1000, dimensions: { length: 25, width: 15, height: 8 }, sku: 'CHO-DK-BASE' },
    seo: { title: 'Belgian Dark Chocolate', description: 'Finest dark chocolate.', keywords: ['chocolate'] },
    story: [
      { id: 's3', title: 'Single Estate', content: 'Sourced directly from the Sambirano Valley in Madagascar.', imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800&auto=format&fit=crop', type: 'origin' }
    ]
  }
];
