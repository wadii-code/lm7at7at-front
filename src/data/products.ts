import type { Product, Collection } from '@/types';

export const bestSellingProducts: Product[] = [];

export const graphicCollection: Product[] = [];

export const sportCollection: Product[] = [];

export const classicCollection: Product[] = [];

export const collections: Collection[] = [
  {
    id: 'col1',
    name: 'Basic Tees',
    nameAr: 'تيشيرتات أساسية',
    image: '/images/1.jpeg',
    href: '/products/basic',
    productCount: 12,
  },
  {
    id: 'col2',
    name: 'Graphic Tees',
    nameAr: 'تيشيرتات جرافيك',
    image: '/images/2.jpeg',
    href: '/products/graphic',
    productCount: 8,
  },
  {
    id: 'col3',
    name: 'Sport Tees',
    nameAr: 'تيشيرتات رياضية',
    image: '/images/tshirt-sport.jpg',
    href: '/products/sport',
    productCount: 6,
  },
  {
    id: 'col4',
    name: 'Polo Shirts',
    nameAr: 'قمصان بولو',
    image: '/images/polo-white.jpg',
    href: '/products/polo',
    productCount: 4
  },
];