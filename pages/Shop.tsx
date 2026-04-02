import React, { useMemo, useState } from 'react';
import { Search, ShoppingBag, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';

type PlantSeed = {
  name: string;
  category: string;
  image: string;
};

const PLANT_SEEDS: PlantSeed[] = [
  { name: 'DUSTY MILLER', category: 'Outdoor', image: '/images/shop-attachments/img-081.jpg' },
  { name: 'ARECA PALM', category: 'Outdoor', image: '/images/shop-attachments/img-031.jpg' },
  { name: 'YUCCA', category: 'Outdoor', image: '/images/shop-attachments/img-100.jpg' },
  { name: 'PULMERIA', category: 'Outdoor', image: '/images/shop-attachments/img-083.jpg' },
  { name: 'CYCAS REVOLUTA', category: 'Outdoor', image: '/images/shop-attachments/img-030.jpg' },
  { name: 'FICUS PANDA', category: 'Outdoor', image: '/images/shop-attachments/img-066.jpg' },
  { name: 'THUJA', category: 'Outdoor', image: '/images/shop-attachments/img-097.jpg' },
  { name: 'GOLDEN SHOWER', category: 'Outdoor', image: '/images/shop-attachments/img-007.jpg' },
  { name: 'PRIDE OF INDIA', category: 'Outdoor', image: '/images/shop-attachments/img-021.jpg' },
  { name: 'PERIWINKLE', category: 'Outdoor', image: '/images/shop-attachments/img-043.jpg' },
  { name: 'MARIGOLD', category: 'Outdoor', image: '/images/shop-attachments/img-065.jpg' },
  { name: 'ZINNA', category: 'Outdoor', image: '/images/shop-attachments/img-095.jpg' },
  { name: 'PETUNIA', category: 'Outdoor', image: '/images/shop-attachments/img-098.jpg' },
  { name: 'CHRYSANTHEMUM', category: 'Outdoor', image: '/images/shop-attachments/img-036.jpg' },
  { name: 'SNAPDRAGON', category: 'Outdoor', image: '/images/shop-attachments/img-005.jpg' },
  { name: 'PANSY', category: 'Outdoor', image: '/images/shop-attachments/img-016.jpg' },
  { name: 'VINCA GREANIUM', category: 'Outdoor', image: '/images/shop-attachments/img-049.jpg' },
  { name: 'DAHLIA', category: 'Outdoor', image: '/images/shop-attachments/img-063.jpg' },
  { name: 'BEGONIA', category: 'Outdoor', image: '/images/shop-attachments/img-102.jpg' },
  { name: 'TECOMA', category: 'Outdoor', image: '/images/outdoor/Tecoma.webp' },
  { name: 'PANEER ROSE', category: 'Outdoor', image: '/images/shop-attachments/img-079.jpg' },
  { name: 'JASMINE', category: 'Outdoor', image: '/images/shop-attachments/img-062.jpg' },
  { name: 'ADENIUM', category: 'Outdoor', image: '/images/shop-attachments/img-087.jpg' },
  { name: 'PEACE LILLY', category: 'Indoor', image: '/images/shop-attachments/img-076.jpg' },
  { name: 'KALANCHOE', category: 'Indoor', image: '/images/shop-attachments/img-051.jpg' },
  { name: 'AFRICAN VIOLET', category: 'Indoor', image: '/images/shop-attachments/img-011.jpg' },
  { name: 'ORCHID', category: 'Indoor', image: '/images/indoor/Anthurium.jpg' },
  { name: 'BALSAM', category: 'Outdoor', image: '/images/shop-attachments/img-042.jpg' },
  { name: 'CROSSANDRA', category: 'Outdoor', image: '/images/shop-attachments/img-080.jpg' },
  { name: 'CROWN OF THORNS', category: 'Indoor', image: '/images/shop-attachments/img-027.jpg' },
  { name: 'SNAKE PLANT', category: 'Indoor', image: '/images/shop-attachments/img-091.jpg' },
  { name: 'MONSTERA', category: 'Indoor', image: '/images/shop-attachments/img-022.jpg' },
  { name: 'ZZ PLANT', category: 'Indoor', image: '/images/shop-attachments/img-101.jpg' },
  { name: 'MONEY PLANT', category: 'Indoor', image: '/images/shop-attachments/img-068.jpg' },
  { name: 'AGLAONEMA', category: 'Indoor', image: '/images/shop-attachments/img-039.jpg' },
  { name: 'HEARTLEAF', category: 'Indoor', image: '/images/shop-attachments/img-048.jpg' },
  { name: 'SPIDER PLANT', category: 'Indoor', image: '/images/shop-attachments/img-096.jpg' },
  { name: 'FIDDLE LEAF FIG', category: 'Indoor', image: '/images/shop-attachments/img-006.jpg' },
  { name: 'FICUS ELASTICA', category: 'Indoor', image: '/images/shop-attachments/img-103.jpg' },
  { name: 'CROTON', category: 'Indoor', image: '/images/outdoor/SONG_OF_INDIA.jfif' },
  { name: 'BIRDS OF PARADISE', category: 'Outdoor', image: '/images/shop-attachments/img-019.jpg' },
  { name: 'MARANTA', category: 'Indoor', image: '/images/shop-attachments/img-064.jpg' },
  { name: 'PARLOR PALM', category: 'Indoor', image: '/images/shop-attachments/img-075.jpg' },
  { name: 'ARALIA', category: 'Indoor', image: '/images/indoor/bamboo-palm.webp' },
  { name: 'LUCKY BAMBOO', category: 'Indoor', image: '/images/shop-attachments/img-008.jpg' },
  { name: 'PEPEROMIA', category: 'Indoor', image: '/images/shop-attachments/img-077.jpg' },
  { name: 'BROMELIADS', category: 'Indoor', image: '/images/shop-attachments/img-024.jpg' },
  { name: 'TRADESCANTIA', category: 'Indoor', image: '/images/shop-attachments/img-086.jpg' },
  { name: 'DISCHIDIA', category: 'Indoor', image: '/images/shop-attachments/img-032.jpg' },
  { name: 'BOSTON FERN', category: 'Indoor', image: '/images/shop-attachments/img-074.jpg' },
  { name: 'ASPARAGUS FERN', category: 'Indoor', image: '/images/shop-attachments/img-014.jpg' },
  { name: 'ENGLISH IVY', category: 'Indoor', image: '/images/shop-attachments/img-037.jpg' },
  { name: 'LIPSTICK PLANT', category: 'Indoor', image: '/images/shop-attachments/img-029.jpg' },
  { name: 'HOYA', category: 'Indoor', image: '/images/shop-attachments/img-059.jpg' },
  { name: 'TULASI', category: 'Herbs', image: '/images/shop-attachments/img-058.jpg' },
  { name: 'MINT', category: 'Herbs', image: '/images/shop-attachments/img-003.jpg' },
  { name: 'CURRY LEAVES', category: 'Herbs', image: '/images/shop-attachments/img-010.jpg' },
  { name: 'BASIL', category: 'Herbs', image: '/images/shop-attachments/img-017.jpg' },
  { name: 'ROSEMARY', category: 'Herbs', image: '/images/shop-attachments/img-071.jpg' },
  { name: 'THYME', category: 'Herbs', image: '/images/shop-attachments/img-061.jpg' },
  { name: 'ALOE VERA', category: 'Herbs', image: '/images/shop-attachments/img-012.jpg' },
  { name: 'LEMONGRASS', category: 'Herbs', image: '/images/shop-attachments/img-052.jpg' },
  { name: 'PEPPERMINT', category: 'Herbs', image: '/images/shop-attachments/img-002.jpg' },
  { name: 'KARPORRAVALLI', category: 'Herbs', image: '/images/shop-attachments/img-028.jpg' },
  { name: 'BETEL LEAF', category: 'Herbs', image: '/images/shop-attachments/img-018.jpg' },
  { name: 'RANGOON CREEPER', category: 'Creepers', image: '/images/shop-attachments/img-094.jpg' },
  { name: 'ALLAMANDA CREEPER', category: 'Creepers', image: '/images/shop-attachments/img-033.jpg' },
  { name: 'GARLIC VINE', category: 'Creepers', image: '/images/shop-attachments/img-105.jpg' },
  { name: 'RAILWAY CREEPER', category: 'Creepers', image: '/images/shop-attachments/img-084.jpg' },
  { name: 'ARROWHEAD VINE', category: 'Creepers', image: '/images/shop-attachments/img-004.jpg' },
  { name: 'AMARANTH', category: 'Vegetables', image: '/images/shop-attachments/img-013.jpg' },
  { name: 'TOMATO', category: 'Vegetables', image: '/images/shop-attachments/img-045.jpg' },
  { name: 'BRINJAL', category: 'Vegetables', image: '/images/shop-attachments/img-104.jpg' },
  { name: 'CHILLI', category: 'Vegetables', image: '/images/shop-attachments/img-046.jpg' },
  { name: 'BELL PEPPER', category: 'Vegetables', image: '/images/shop-attachments/img-009.jpg' },
  { name: 'OKRA', category: 'Vegetables', image: '/images/shop-attachments/img-026.jpg' },
  { name: 'BOTTLE GOURD', category: 'Vegetables', image: '/images/shop-attachments/img-020.jpg' },
  { name: 'RIDGE GOURD', category: 'Vegetables', image: '/images/shop-attachments/img-073.jpg' },
  { name: 'PUMPKIN', category: 'Vegetables', image: '/images/shop-attachments/img-055.jpg' },
  { name: 'SNAKE GOURD', category: 'Vegetables', image: '/images/shop-attachments/img-025.jpg' },
  { name: 'DRUMSTICK', category: 'Vegetables', image: '/images/shop-attachments/img-053.jpg' },
  { name: 'CHERRY TOMATO', category: 'Vegetables', image: '/images/shop-attachments/img-045.jpg' },
  { name: 'BANANA', category: 'Fruits', image: '/images/shop-attachments/img-057.jpg' },
  { name: 'GUAVA', category: 'Fruits', image: '/images/shop-attachments/img-047.jpg' },
  { name: 'POMEGRANATE', category: 'Fruits', image: '/images/shop-attachments/img-050.jpg' },
  { name: 'PAPAYA', category: 'Fruits', image: '/images/shop-attachments/img-067.jpg' },
  { name: 'SAPOTA', category: 'Fruits', image: '/images/shop-attachments/img-088.jpg' },
  { name: 'CUSTARD APPLE', category: 'Fruits', image: '/images/shop-attachments/img-099.jpg' },
  { name: 'STAR FRUIT', category: 'Fruits', image: '/images/shop-attachments/img-092.jpg' },
  { name: 'MULBERRY', category: 'Fruits', image: '/images/shop-attachments/img-054.jpg' },
  { name: 'STRAWBERRY', category: 'Fruits', image: '/images/shop-attachments/img-056.jpg' },
  { name: 'SWEET LIME', category: 'Fruits', image: '/images/shop-attachments/img-038.jpg' },
  { name: 'RAMBUTAN', category: 'Fruits', image: '/images/shop-attachments/img-093.jpg' },
  { name: 'SWEET ORANGE', category: 'Fruits', image: '/images/shop-attachments/img-089.jpg' },
  { name: 'GOLDEN BARREL CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-035.jpg' },
  { name: 'BUNNY EAR CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-072.jpg' },
  { name: 'CHRISTMAS CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-041.jpg' },
  { name: 'BISHOP\'S CAP CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-015.jpg' },
  { name: 'FISHHOOK CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-040.jpg' },
  { name: 'TOTEM POLE CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-090.jpg' },
  { name: 'EASTER CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-078.jpg' },
  { name: 'HEDGEHOG CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-023.jpg' },
  { name: 'MOON CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-069.jpg' },
  { name: 'PERUVIAN APPLE CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-060.jpg' },
  { name: 'PRICKLY PEAR CACTUS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-085.jpg' },
  { name: 'STRINGS OF PEARLS', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-070.jpg' },
  { name: 'HAWORTHIA ZEBRA', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-001.jpg' },
  { name: 'MINI ECHEVERIA VARIETIES', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-034.jpg' },
  { name: 'JADE PLANT', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-082.jpg' },
  { name: 'GASTERIA', category: 'Cactus & Succulent', image: '/images/shop-attachments/img-044.jpg' },
];

const CATEGORY_PROFILE: Record<
  string,
  { basePrice: number; maintenance: Product['maintenance']; light: Product['light'] }
> = {
  Indoor: { basePrice: 899, maintenance: 'Medium', light: 'Indirect' },
  Outdoor: { basePrice: 799, maintenance: 'Medium', light: 'Direct' },
  Herbs: { basePrice: 249, maintenance: 'Low', light: 'Direct' },
  Creepers: { basePrice: 449, maintenance: 'Medium', light: 'Direct' },
  Vegetables: { basePrice: 349, maintenance: 'Medium', light: 'Direct' },
  Fruits: { basePrice: 699, maintenance: 'Medium', light: 'Direct' },
  'Cactus & Succulent': { basePrice: 499, maintenance: 'Low', light: 'Direct' },
};

const DEFAULT_PROFILE = CATEGORY_PROFILE.Outdoor;

const MOCK_PRODUCTS: Product[] = PLANT_SEEDS.map((plant, index) => {
  const profile = CATEGORY_PROFILE[plant.category] ?? DEFAULT_PROFILE;
  return {
    id: String(index + 1),
    name: plant.name,
    category: plant.category,
    image: plant.image,
    price: profile.basePrice + (index % 4) * 60,
    maintenance: profile.maintenance,
    light: profile.light,
    description:
      plant.name +
      ' healthy nursery plant, acclimatized and ready for home gardens and balcony spaces.',
  };
});

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

interface ShopProps {
  addToCart: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ addToCart }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(MOCK_PRODUCTS.map((product) => product.category)))],
    [],
  );

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const categoryMatch = filter === 'All' || product.category === filter;
    const query = searchQuery.trim().toLowerCase();
    const searchMatch = query.length === 0 || product.name.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b bg-gray-50/50 sticky top-20 z-40 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={
                  'px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ' +
                  (filter === category
                    ? 'bg-green-700 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:border-green-200 border border-gray-100')
                }
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative flex-grow md:w-72 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search plants..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-sm text-gray-500 mb-6">Showing {filteredProducts.length} plants</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {product.maintenance} Care
                  </span>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-4 right-4 bg-white p-4 rounded-2xl shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-700 hover:text-white"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h3>
                  <div className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-current mr-1" /> 4.9
                  </div>
                </div>
                <p className="text-xs text-green-700 font-semibold">{product.category}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="text-lg font-bold text-green-700 pt-2">{formatCurrency(product.price)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-gray-50 border-t mt-20 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-12 h-12 text-green-600 mb-4" />
            <h4 className="font-bold text-xl mb-2">Health Guaranteed</h4>
            <p className="text-gray-500 text-sm">Every plant is checked by IGO Lab experts before dispatch.</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-12 h-12 text-green-600 mb-4" />
            <h4 className="font-bold text-xl mb-2">Safe Pan-India Delivery</h4>
            <p className="text-gray-500 text-sm">Special protective packaging ensures zero leaf damage.</p>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw className="w-12 h-12 text-green-600 mb-4" />
            <h4 className="font-bold text-xl mb-2">15-Day Free Returns</h4>
            <p className="text-gray-500 text-sm">Not happy with the health? We'll replace it, no questions asked.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
