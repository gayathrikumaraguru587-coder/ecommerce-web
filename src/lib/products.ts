export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  imageId: string;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description:
      'Immerse yourself in high-fidelity sound with these noise-cancelling wireless headphones. Long-lasting battery and comfortable design for all-day listening.',
    price: 199.99,
    category: 'Electronics',
    imageId: 'product-headphones',
  },
  {
    id: '2',
    name: 'Smartwatch Pro',
    slug: 'smartwatch-pro',
    description:
      'Stay connected and track your fitness goals with the Smartwatch Pro. Features a vibrant AMOLED display, heart rate monitor, and GPS.',
    price: 249.99,
    category: 'Electronics',
    imageId: 'product-smartwatch',
  },
  {
    id: '3',
    name: 'Digital Camera X1',
    slug: 'digital-camera-x1',
    description:
      'Capture stunning photos and 4K videos with this professional-grade digital camera. Comes with a versatile 18-55mm lens.',
    price: 799.99,
    category: 'Cameras',
    imageId: 'product-camera',
  },
  {
    id: '4',
    name: 'Ultra-Slim Laptop',
    slug: 'ultra-slim-laptop',
    description:
      'A powerful yet lightweight laptop designed for productivity on the go. Features a 14-inch display and the latest generation processor.',
    price: 1299.99,
    category: 'Computers',
    imageId: 'product-laptop',
  },
  {
    id: '5',
    name: 'Quadcopter Drone',
    slug: 'quadcopter-drone',
    description:
      'Explore the world from a new perspective. This drone offers a 4K camera, 30 minutes of flight time, and intelligent flight modes.',
    price: 499.99,
    category: 'Cameras',
    imageId: 'product-drone',
  },
  {
    id: '6',
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    description:
      'Experience a superior typing feel with this backlit mechanical keyboard. Customizable RGB lighting and durable switches.',
    price: 149.99,
    category: 'Computers',
    imageId: 'product-keyboard',
  },
];

export const categories = [
  ...new Set(products.map((product) => product.category)),
];
