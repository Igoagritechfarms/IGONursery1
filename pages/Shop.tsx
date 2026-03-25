

import React, { useState } from 'react';
import { Filter, ShoppingBag, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';
//redeploy trigger

const MOCK_PRODUCTS: Product[] = [
 {
  id: '1',
  name: 'Monstera Deliciosa',
  price: 1450,
  category: 'Indoor',
  image: '/images/indoor/monstera.png',
  maintenance: 'Medium',
  light: 'Indirect',
  description: 'Classic Swiss Cheese Plant, grown in climate-controlled polyhouses for superior leaf health.'
},
  { id: '2', name: 'Fiddle Leaf Fig', price: 2800, category: 'Indoor', image: '/images/indoor/Fiddle Leaf Fig.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '3', name: 'Zamioculcas Zamiifolia (ZZ)', price: 850, category: 'Indoor', image: '/images/outdoor/Zamioculcas.jpeg', maintenance: 'Low', light: 'Shade', description: 'The indestructible office plant. Ultra-low water requirements.' },
  { id: '4', name: 'Areca Palm (Large)', price: 1200, category: 'Outdoor', image: '/images/indoor/Areca_Palm.webp', maintenance: 'Medium', light: 'Direct', description: 'Natural air purifier. Perfect for screening and creating privacy.' },
  { id: '5', name: 'Snake Plant Futura', price: 650, category: 'Indoor', image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=400', maintenance: 'Low', light: 'Shade', description: 'Hardy air purifier that releases oxygen at night.' },
  { id: '6', name: 'Birds of Paradise', price: 3500, category: 'Landscape', image: 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&q=80&w=400', maintenance: 'Medium', light: 'Direct', description: 'Stunning tropical flowers. Ideal for resort-style home gardens.' },
  { id: '7', name: 'ZZ Plant', price: 2800, category: 'Indoor', image: '/images/indoor/ZZplant.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '8', name: 'Money Plant (Pothos)', price: 2800, category: 'Indoor', image: '/images/indoor/Money_Plant.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '9', name: 'Aglaonema(Lipstick)', price: 2800, category: 'Indoor', image: '/images/indoor/aglaonema.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '10', name: 'Philodendron', price: 2800, category: 'Indoor', image: '/images/indoor/Philodendron.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '11', name: 'Bamboo Palm', price: 2800, category: 'Indoor', image: '/images/indoor/bamboo-palm.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '12', name: 'Spider Plant ', price: 2800, category: 'Indoor', image: '/images/indoor/Spider_Plant.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '13', name: 'Chinese Evergreen', price: 2800, category: 'Indoor', image: '/images/indoor/Chinese_Evergreen.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '14', name: 'Peace Lily', price: 2800, category: 'Indoor', image: '/images/indoor/Peace_Lily.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '15', name: 'Anthurium', price: 2800, category: 'Indoor', image: '/images/indoor/Anthurium.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '16', name: 'Calathea', price: 2800, category: 'Indoor', image: '/images/indoor/Calathea.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '17', name: 'Fiddle Leaf Fig ', price: 2800, category: 'Indoor', image: '/images/indoor/Fiddle.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '18', name: 'Ferns (Boston/Bird Nest) ', price: 2800, category: 'Indoor', image: '/images/indoor/Ferns.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '19', name: 'Jade Plant', price: 2800, category: 'Indoor', image: '/images/indoor/Jade.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '20', name: 'String of Pearls', price: 2800, category: 'Indoor', image: '/images/indoor/String.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '21', name: 'Echeveria / Haworthia', price: 2800, category: 'Indoor', image: '/images/indoor/Echeveria.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '22', name: 'Kalanchoe', price: 2800, category: 'Indoor', image: '/images/indoor/Kalanchoe.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '23', name: 'Golden Barrel Cactus', price: 2800, category: 'Indoor', image:'/images/indoor/golden.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '24', name: 'Bunny Ear / Old Man Cactus', price: 2800, category: 'Indoor', image: '/images/indoor/Bunny.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '25', name: 'Moon Cactus', price: 2800, category: 'Indoor', image:'/images/indoor/Moon.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant.' },
  { id: '26', name: 'Fairy Castle Cactus', price: 2800, category: 'Indoor', image:'/images/indoor/Fairy.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '27', name: 'Aloe Vera', price: 2800, category: 'Indoor', image: '/images/indoor/Aloe.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '28', name: 'Vinca (Periwinkle) ', price: 2800, category: 'Outdoor', image: '/images/outdoor/vinca.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '29', name: 'Bougainvillea (Star/Torch)', price: 2800, category: 'Outdoor', image: '/images/outdoor/Bougainvillea.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '30', name: 'Hibiscus (Hybrid/Pune) ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Hibiscus.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '31', name: 'Ixora (Dwarf Red/Pink)  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/ixora.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '32', name: 'Tecoma (Yellow Bells)', price: 2800, category: 'Outdoor', image: '/images/outdoor/Tecoma.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '33', name: 'Tabernaemontana', price: 2800, category: 'Outdoor', image: '/images/outdoor/Tabernaemontana.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '34', name: 'Lantana', price: 2800, category: 'Outdoor', image: '/images/outdoor/Lantana.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '35', name: 'Thunbergia (Clock Vine)', price: 2800, category: 'Outdoor', image: '/images/outdoor/Rangoon.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '36', name: 'Rangoon Creeper ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Nerium.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '37', name: 'Vernonia (Curtain Creeper) ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Vernonia.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '38', name: 'Bottlebrush', price: 2800, category: 'Outdoor', image: '/images/outdoor/Bottlebrush.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '39', name: 'Portulaca (Table Rose)', price: 2800, category: 'Outdoor', image: '/images/outdoor/Portulaca.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '40', name: 'Bottlebrush', price: 2800, category: 'Outdoor', image: '/images/outdoor/Bottlebrush.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '41', name: 'Dahlia', price: 2800, category: 'Outdoor', image: '/images/outdoor/Dahlia.avif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '42', name: 'Chrysanthemum ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Chrysanthemum.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '43', name: 'Begonia ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Begonia.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '44', name: 'Geranium ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Geranium.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '44', name: 'Plumeria (Frangipani)  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Plumeria.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '45', name: 'Paneer Rose (Pink) ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Paneer.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '46', name: 'Adenium (Desert Rose)  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Adenium.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '47', name: 'Magnolia  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/Magnolia.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '48', name: 'FOXTAIL PALM ', price: 2800, category: 'Outdoor', image: '/images/outdoor/foxtail_palm.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '49', name: 'TRAVELLER PALM  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/traveller_palm.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '50', name: 'DATE PALM ', price: 2800, category: 'Outdoor', image: '/images/outdoor/DATE_PALM.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '51', name: 'ROYAL PALM  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/ROYAL_PALM.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '52', name: 'RED PALM ', price: 2800, category: 'Outdoor', image: '/images/outdoor/RED_PALM.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '53', name: 'BOTTLE PALM   ', price: 2800, category: 'Outdoor', image: '/images/outdoor/BOTTLE-PALM.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '54', name: 'CLUSTER FIG   ', price: 2800, category: 'Outdoor', image: '/images/outdoor/CLUSTER_FIG.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '55', name: 'ARJUN ', price: 2800, category: 'Outdoor', image: '/images/outdoor/AONAL.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '56', name: 'AONAL ', price: 2800, category: 'Outdoor', image: '/images/outdoor/ARJUN.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '57', name: 'BANYAN  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/BANYAN.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '58', name: 'EUCALYPTUS  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/EUCALYPTUS.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '59', name: 'MOHOGANY ', price: 2800, category: 'Outdoor', image: '/images/outdoor/MOHOGANY.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '60', name: 'TEAK ', price: 2800, category: 'Outdoor', image: '/images/outdoor/TEAK.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '61', name: 'NEEM ', price: 2800, category: 'Outdoor', image: '/images/outdoor/NEEM.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '62', name: 'TAMARIND ', price: 2800, category: 'Outdoor', image: '/images/outdoor/TAMARIND.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '63', name: 'SANDALWOOD RED ', price: 2800, category: 'Outdoor', image: '/images/outdoor/SANDALWOOD_RED.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '64', name: 'BOXWOOD ', price: 2800, category: 'Outdoor', image: '/images/outdoor/BOXWOOD.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '65', name: 'INDIAN ALMOND  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/SANDALWOOD_WHITE.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '66', name: 'ASHOKA  ', price: 2800, category: 'Outdoor', image: '/images/outdoor/DURANTA_GREEN.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '67', name: 'DURANTA GREEN ', price: 2800, category: 'Outdoor', image: '/images/outdoor/DURANTA_GOLDEN.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '68', name: 'DURANTA GOLDEN ', price: 2800, category: 'Outdoor', image: '/images/outdoor/DURANTA_GOLDEN.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '69', name: 'LEMON ', price: 2800, category: 'Outdoor', image: '/images/outdoor/LEMON.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '70', name: 'JAMUN ', price: 2800, category: 'Outdoor', image: '/images/outdoor/JAMUN.jpg', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '71', name: 'RAIN TREE ', price: 2800, category: 'Outdoor', image: '/images/outdoor/RAIN.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '72', name: 'JUNIPER ', price: 2800, category: 'Outdoor', image: '/images/outdoor/JUNIPER.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '74', name: 'SONG OF INDIA', price: 2800, category: 'Outdoor', image: '/images/outdoor/SONG_OF_INDIA.jfif', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '75', name: 'OLEANDER ', price: 2800, category: 'Outdoor', image: '/images/outdoor/OLEANDER.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '76', name: 'LANTANA ', price: 2800, category: 'Outdoor', image: '/images/outdoor/LANTANA.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '77', name: 'NEW ZEALAND FLEX', price: 2800, category: 'Outdoor', image: '/images/outdoor/NEW_ZEALAND.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '78', name: 'ELEPHANT EAR ', price: 2800, category: 'Outdoor', image: '/images/outdoor/ELEPHANT.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '78', name: 'LUNGWORT', price: 2800, category: 'Outdoor', image: '/images/outdoor/LUNGWORT.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },
  { id: '78', name: 'LILYTURF ', price: 2800, category: 'Outdoor', image: '/images/outdoor/LILYTURF.webp', maintenance: 'High', light: 'Direct', description: 'Architectural statement plant. Highly robust, acclimatized to Indian coastal conditions.' },




];

interface ShopProps {
  addToCart: () => void;
}

const Shop: React.FC<ShopProps> = ({ addToCart }) => {
  const [filter, setFilter] = useState('All');

  const filteredProducts = filter === 'All'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="bg-white min-h-screen">
      {/* Search & Categories Bar */}
      <div className="border-b bg-gray-50/50 sticky top-20 z-40 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {['All', 'Indoor', 'Outdoor', 'Landscape', 'Exotic'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === cat ? 'bg-green-700 text-white shadow-md' : 'bg-white text-gray-600 hover:border-green-200 border border-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <input type="text" placeholder="Search plants..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white" />
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 mb-4">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{product.maintenance} Care</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); addToCart(); }}
                  className="absolute bottom-4 right-4 bg-white p-4 rounded-2xl shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-700 hover:text-white"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <div className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-current mr-1" /> 4.9
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="text-lg font-bold text-green-700 pt-2">₹{product.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Banner */}
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
