import React from 'react';
import { ArrowLeft, ArrowRight, Package } from 'lucide-react';

type ProductItem = {
  slug: string;
  name: string;
  category: string;
  imageFile: string;
  price: number;
  mrp: number;
  unit: string;
  description: string;
};

interface ProductProps {
  selectedSlug?: string | null;
  onOpenProduct?: (slug: string) => void;
}

const PRODUCTS: ProductItem[] = [
  { slug: 'plant-name-tag-stick', name: 'Plant name tag stick', category: 'Accessories', imageFile: 'Handmade to order.jpg', price: 99, mrp: 129, unit: 'Pack of 20', description: 'Reusable wooden tags for clean plant labeling and nursery organization.' },
  { slug: 'plastic-hanging-hook', name: 'Plastic hanging hook', category: 'Accessories', imageFile: 'Plastic Biltong Hooks (pack Of 100).jpg', price: 149, mrp: 199, unit: 'Pack of 25', description: 'Durable lightweight hooks for hanging planters and nursery setups.' },
  { slug: 'sprayer-head', name: 'Sprayer head', category: 'Watering', imageFile: 'sprayer-head.jpg', price: 449, mrp: 599, unit: 'Per piece', description: 'Multi-pattern spray head for controlled watering and cleaning.' },
  { slug: 'seedling-tray', name: 'Seedling tray', category: 'Containers', imageFile: '96 Pcs 4 Inch Round Nursery Pots And 8 Pcs 12 Cell Plant Starter Trays Thick Stu.jpg', price: 349, mrp: 449, unit: 'Per set', description: 'Starter tray set designed for uniform seed germination and transplanting.' },
  { slug: 'draincell', name: 'Draincell', category: 'Infrastructure', imageFile: 'HDPE drainage cell.jpg', price: 1250, mrp: 1500, unit: 'Per sheet', description: 'HDPE drainage layer for terrace gardens and landscape water management.' },
  { slug: 'moss-stick', name: 'Moss stick', category: 'Support', imageFile: 'GKanMore 2Pcs Plant Climbing Pole 12 Inch Coir Moss Totem Pole Coir Moss Stick for Plant Support Extension.jpg', price: 299, mrp: 399, unit: 'Per piece', description: 'Coir stick support for climbing plants with better root adhesion.' },
  { slug: 'plant-support-ring', name: 'Plant support ring', category: 'Support', imageFile: '12pcs Plant Support Plant Stake Half Round Plant Support Ring Garden Flower Supp.jpg', price: 199, mrp: 259, unit: 'Pack of 12', description: 'Half-round support rings to keep stems upright and protected.' },
  { slug: 'spraygun', name: 'Spraygun', category: 'Watering', imageFile: 'download.jpg', price: 2499, mrp: 2999, unit: 'Per piece', description: 'Electric spraygun for fast and even spraying across larger areas.' },
  { slug: 'handfork', name: 'Handfork', category: 'Tools', imageFile: 'hand-fork.jpg', price: 229, mrp: 299, unit: 'Per piece', description: 'Three-prong fork for loosening top soil and aerating planters.' },
  { slug: 'sprayer', name: 'Sprayer', category: 'Watering', imageFile: 'VIVOSUN Battery Powered Backpack Electric.jpg', price: 3999, mrp: 4599, unit: 'Per piece', description: 'Backpack electric sprayer for maintenance and nutrient application.' },
  { slug: 'khurpa-khurpi', name: 'Khurpa(Khurpi)', category: 'Tools', imageFile: 'Durable Gardening Hand Tool for Gardening - Khurpi_Khurpa (3 Inch Blade).jpg', price: 199, mrp: 249, unit: 'Per piece', description: 'Traditional hand blade for weeding, edging, and soil shaping.' },
  { slug: 'garden-gloves', name: 'Garden gloves', category: 'Tools', imageFile: 'garden gloves with style.jpg', price: 249, mrp: 329, unit: 'Per pair', description: 'Protective gloves for safer and cleaner everyday gardening tasks.' },
  { slug: 'hand-trowel', name: 'Hand trowel', category: 'Tools', imageFile: 'Essential Garden Hand Tools.jpg', price: 239, mrp: 299, unit: 'Per piece', description: 'Compact trowel for pot filling, transplanting, and root-zone work.' },
  { slug: 'hand-cultivator', name: 'Hand cultivator', category: 'Tools', imageFile: 'Handegge verzinkt breit _ Manufactum.jpg', price: 299, mrp: 379, unit: 'Per piece', description: 'Wide-tooth cultivator for breaking surface crust and blending media.' },
  { slug: 'hand-weeder-tool', name: 'Hand weeder tool', category: 'Tools', imageFile: 'hand-weeder-tool.jpg', price: 259, mrp: 329, unit: 'Per piece', description: 'Targeted weeder for root-level removal of unwanted growth.' },
  { slug: 'gardening-scissor', name: 'Gardening scissor', category: 'Cutting', imageFile: 'gardening-scissor.jpg', price: 349, mrp: 449, unit: 'Per piece', description: 'Precision scissor for trimming soft stems and finishing cuts.' },
  { slug: 'creeper-net', name: 'Creeper net', category: 'Support', imageFile: 'Square Mesh 10 1 mtr x 50 mtrs.jpg', price: 799, mrp: 950, unit: 'Per roll', description: 'Strong support mesh for creepers, vines, and vertical training.' },
  { slug: 'grafting-tape', name: 'Grafting tape', category: 'Accessories', imageFile: '1pc Eco-Friendly Biodegradable Grafting Tape Graft Membrane Gardening Bind Belt Plant Grafting.jpg', price: 149, mrp: 199, unit: 'Per roll', description: 'Flexible biodegradable tape for secure and clean graft unions.' },
  { slug: 'garden-hoe', name: 'Garden hoe', category: 'Tools', imageFile: 'download (1).jpg', price: 299, mrp: 379, unit: 'Per piece', description: 'Hand hoe for furrow making, shallow cultivation, and quick weeding.' },
  { slug: 'shade-net', name: 'Shade net', category: 'Infrastructure', imageFile: 'Instahut 1_83x50m Heavy Duty Shade Cloth 30% UV Block Green.jpg', price: 2200, mrp: 2600, unit: 'Per roll', description: 'UV shade net for reducing heat stress in nurseries and grow areas.' },
  { slug: 'plant-cutter', name: 'Plant cutter', category: 'Cutting', imageFile: 'plant-cutter.jpg', price: 399, mrp: 499, unit: 'Per piece', description: 'Spring-action cutter for clean branch pruning with low hand fatigue.' },
  { slug: 'extension-garden-cutter', name: 'Extension garden cutter', category: 'Cutting', imageFile: 'download (2).jpg', price: 549, mrp: 699, unit: 'Per piece', description: 'Extended-reach cutter for hard-to-reach stems and edge maintenance.' },
  { slug: 'pots', name: 'Pots', category: 'Containers', imageFile: 'Standard Cotto Terracotta Pot _ Burford Garden Co_.jpg', price: 199, mrp: 249, unit: 'Per piece', description: 'Terracotta-style pot for healthy root breathing and classic finish.' },
  { slug: 'hanging-pots', name: 'Hanging pots', category: 'Containers', imageFile: '9 DIY Vertical Gardens for Better Herbs.jpg', price: 299, mrp: 379, unit: 'Per piece', description: 'Space-saving hanging pots ideal for balconies and vertical layouts.' },
  { slug: 'cocopeat', name: 'cocopeat', category: 'Growing Media', imageFile: 'Cocopeat (germinating medium).jpg', price: 180, mrp: 240, unit: '5kg block', description: 'High-absorption growing medium for seed starting and potting blends.' },
];

const getProductImagePath = (fileName: string): string =>
  `/images/product%20nursery/${encodeURIComponent(fileName)}`;

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const Product: React.FC<ProductProps> = ({ selectedSlug = null, onOpenProduct }) => {
  const selectedProduct = selectedSlug
    ? PRODUCTS.find((product) => product.slug === selectedSlug) ?? null
    : null;

  const openProductPage = (slug: string) => {
    if (onOpenProduct) {
      onOpenProduct(slug);
      return;
    }
    window.location.hash = `product/${slug}`;
  };

  const openCatalog = () => {
    window.location.hash = 'product';
  };

  if (selectedSlug && !selectedProduct) {
    return (
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black tracking-tight mb-4">Product not found</h1>
          <p className="text-igo-muted mb-8">The product page you requested is unavailable.</p>
          <button
            onClick={openCatalog}
            className="bg-igo-dark text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest"
          >
            Back to Product List
          </button>
        </div>
      </section>
    );
  }

  if (selectedProduct) {
    const savings = selectedProduct.mrp - selectedProduct.price;
    const relatedProducts = PRODUCTS.filter((item) => item.slug !== selectedProduct.slug).slice(0, 3);

    return (
      <div className="animate-in fade-in duration-500">
        <section className="bg-igo-dark text-white py-18">
          <div className="max-w-7xl mx-auto px-4">
            <button
              onClick={openCatalog}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-black text-igo-lime mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Product List
            </button>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95]">{selectedProduct.name}</h1>
            <p className="text-gray-300 text-lg mt-6 max-w-3xl">{selectedProduct.description}</p>
          </div>
        </section>

        <section className="py-16 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <img
                src={getProductImagePath(selectedProduct.imageFile)}
                alt={selectedProduct.name}
                className="w-full h-[420px] object-cover rounded-2xl"
              />
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-8">
                <div className="text-xs uppercase tracking-[0.2em] font-black text-igo-lime mb-3">{selectedProduct.category}</div>
                <div className="text-4xl font-black text-igo-dark">{formatCurrency(selectedProduct.price)}</div>
                <div className="mt-2 text-sm text-igo-muted">
                  MRP <span className="line-through">{formatCurrency(selectedProduct.mrp)}</span> • You save {formatCurrency(savings)}
                </div>
                <div className="mt-3 text-sm font-semibold text-igo-dark">Unit: {selectedProduct.unit}</div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-8">
                <h2 className="text-xl font-black mb-4">Price Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-igo-muted">Selling Price</span>
                    <span className="font-bold text-igo-dark">{formatCurrency(selectedProduct.price)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-igo-muted">MRP</span>
                    <span className="font-bold text-igo-dark">{formatCurrency(selectedProduct.mrp)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-igo-muted">Savings</span>
                    <span className="font-bold text-green-700">{formatCurrency(savings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-igo-muted">Unit</span>
                    <span className="font-bold text-igo-dark">{selectedProduct.unit}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => (window.location.hash = 'shop')}
                className="bg-igo-dark text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest inline-flex items-center gap-3"
              >
                Continue to Store <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-2xl font-black mb-6">More Products</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => openProductPage(item.slug)}
                  className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-lg transition-all"
                >
                  <img src={getProductImagePath(item.imageFile)} alt={item.name} className="w-full h-40 object-cover rounded-xl mb-4" />
                  <h4 className="font-black text-igo-dark mb-1">{item.name}</h4>
                  <div className="text-sm text-igo-muted">{formatCurrency(item.price)}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <section className="bg-igo-dark text-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
            <Package className="w-4 h-4 text-igo-lime" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold">Product Page</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter max-w-4xl leading-[0.95]">
            Nursery Products With Dedicated Detail Pages.
          </h1>
          <p className="text-gray-400 text-lg mt-8 max-w-2xl">
            Open any product to view its own page with image, price, and pricing breakdown.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-igo-dark">All Products</h2>
              <p className="text-igo-muted mt-2">Click any item to open its own product detail page.</p>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.25em] text-igo-lime bg-igo-dark px-4 py-2 rounded-full">
              {PRODUCTS.length} Products
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {PRODUCTS.map((product, index) => (
              <div key={product.slug} className="group [perspective:1200px]">
                <div className="h-full rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm transition-all duration-500 transform-gpu [transform:rotateX(7deg)_rotateY(-6deg)] group-hover:[transform:rotateX(0deg)_rotateY(0deg)_translateY(-8px)] group-hover:shadow-2xl">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={getProductImagePath(product.imageFile)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-igo-lime">{product.category}</span>
                      <span className="text-[10px] font-black text-igo-muted">#{index + 1}</span>
                    </div>
                    <h3 className="text-base font-black text-igo-dark leading-snug min-h-[3rem]">{product.name}</h3>
                    <div className="text-lg font-black text-igo-dark mt-2">{formatCurrency(product.price)}</div>
                    <div className="text-xs text-igo-muted">{product.unit}</div>

                    <button
                      onClick={() => openProductPage(product.slug)}
                      className="mt-4 w-full bg-igo-dark text-white py-3 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-igo-charcoal transition-colors inline-flex items-center justify-center gap-2"
                    >
                      View Product Page <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
