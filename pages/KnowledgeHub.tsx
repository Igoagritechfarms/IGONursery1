import React, { useRef, useState } from 'react';
import { BookOpen, Search, ArrowRight } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  cat: string;
  img: string;
  read: string;
};

const featuredArticles: Article[] = [
  {
    id: 'climate-resilience-guide',
    title: 'Growing for the Future: Heat-Resilient Propagation',
    cat: 'Plant Care',
    img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=400',
    read: '5 min read'
  },
  {
    id: 'kitchan-gardan',
    title: 'Heritage Themes: Chettinad Style & Contemporary Biophilic Design',
    cat: 'Urban Farming',
    img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400',
    read: '12 min read'
  },
  {
    id: 'soil-ph',
    title: 'Chettinad Heritage Meets Contemporary Biophilic Design',
    cat: 'Lab Insights',
    img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400',
    read: '8 min read'
  }
];

const KnowledgeHub: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const articleSectionRef = useRef<HTMLElement | null>(null);

  const selectedArticle = featuredArticles.find((article) => article.id === selectedArticleId);

  const handleReadArticle = (articleId: string) => {
    if (selectedArticleId === articleId) {
      setSelectedArticleId(null);
      return;
    }

    setSelectedArticleId(articleId);
    window.requestAnimationFrame(() => {
      articleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Growth Center.</h1>
            <p className="text-gray-500">Insights from IGO Lab on plants, landscapes, and agritech.</p>
          </div>
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Search articles, guides, tutorials..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {featuredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => handleReadArticle(art.id)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="h-60 overflow-hidden relative">
                <img
                  src={art.img}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {art.cat}
                </div>
              </div>
              <div className="p-8">
                <div className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-widest">{art.read}</div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-green-700 transition-colors">{art.title}</h3>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleReadArticle(art.id);
                  }}
                  className="flex items-center text-green-700 font-bold text-sm gap-2"
                >
                  {selectedArticleId === art.id ? 'Close Details' : 'Read Article'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedArticle && (
        <section ref={articleSectionRef} className="py-20 bg-white border-t">
          <div className="max-w-4xl mx-auto px-4">
            <div className="inline-block bg-green-50 text-green-700 font-semibold px-4 py-2 rounded-full text-sm mb-6">
              {selectedArticle.cat}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">{selectedArticle.title}</h2>

            {selectedArticle.id === 'climate-resilience-guide' ? (
              <article className="prose prose-lg max-w-none text-gray-700 leading-8 space-y-6">
                <p>
                  Global temperatures are rising and traditional gardening methods are being challenged.
                  At our nursery, we do not just grow plants; we build Climate Resilience.
                  Explore our expert guide on propagating Adenium, Hibiscus and Bougainvillea to thrive
                  in high-heat and high-humidity environments through advanced biological and cultural
                  practices.
                </p>

                <h3 className="text-2xl font-bold text-gray-900">The Challenge: The Heat-Humidity Paradox</h3>
                <p>
                  In dry heat, plants "sweat" (transpire) to stay cool. However, in humid
                  environments, the air is already saturated with moisture, which slows down evaporation.
                  This causes internal plant temperatures to spike, leading to cellular stress. Our
                  propagation techniques focus on Vascular Toughening and Root Oxygenation to keep
                  plants cool from the inside out.
                </p>

                <h3 className="text-2xl font-bold text-gray-900">Species Spotlight: Our Three Pillars of Resilience</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">1. Adenium (The Desert Rose)</h4>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li><strong>The Problem:</strong> High humidity causes "Caudex Rot" and fungal infections in traditional soil-heavy mixes.</li>
                      <li>
                        <strong>The Solution:</strong> We utilize the "Dry Start" method. All cuttings are calloused for 7
                        days in a dry, shaded area to form a suberized (cork-like) layer that acts as a
                        biological shield against soil-borne fungi.
                      </li>
                      <li>
                        <strong>Pro Tip:</strong> Use unglazed terracotta pots. They act as "natural air conditioners,"
                        lowering root-zone temperatures by up to 5C through evaporative wicking.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">2. Hibiscus (The Tropical Queen)</h4>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>
                        <strong>The Problem:</strong> Intense heat causes chlorophyll degradation, leading to yellowing
                        leaves and reduced blooming.
                      </li>
                      <li>
                        <strong>The Solution:</strong> We implement a regimen of Magnesium Sulfate (Epsom Salts) and
                        Foliar Potassium. This "armours" the cell walls, increasing the plant's thermal
                        threshold and resistance to common pests like mealybugs.
                      </li>
                      <li>
                        <strong>Propagation:</strong> We prioritize high-oxygen, porous media to ensure roots never go
                        anaerobic (oxygen-starved) during periods of high humidity or heavy watering.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">3. Bougainvillea (The Paper Flower)</h4>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>
                        <strong>The Problem:</strong> Consistent moisture and high humidity often result in lush green
                        growth with zero flowers.
                      </li>
                      <li>
                        <strong>The Solution:</strong> Water-Stress Hardening. We train young plants to develop thicker
                        xylem (water-carrying) vessels by allowing the media to dry out significantly
                        between waterings. This "survival stress" triggers the plant to prioritize brilliant
                        floral bracts over foliage.
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900">The Resilient Grower's Seasonal Strategy</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Establishment Phase:</strong> Propagate during the milder months of the year. This
                    allows the root system to become established before the peak summer heat
                    arrives.
                  </li>
                  <li>
                    <strong>Thermal Priming:</strong> Gradually introduce young plants to direct sunlight. This
                    triggers the production of Heat Shock Proteins (HSPs), which protect the plant's
                    internal enzymes from denaturing during heat waves.
                  </li>
                  <li>
                    <strong>Peak Heat Management:</strong> Utilize 50% shade nets during the hottest part of the
                    day. Focus on increasing airflow and "micro-misting" around the pots to lower
                    ambient temperatures without over-saturating the soil.
                  </li>
                  <li>
                    <strong>Moisture Guard:</strong> Ensure all pots are elevated to allow for maximum drainage and
                    air circulation, especially during high-rainfall seasons.
                  </li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900">The "Secret Sauce": Specialized Media</h3>
                <p>
                  We have moved away from standard garden soil, which can compact and trap heat. Our
                  resilient plants are grown in a "climate-smart" mix:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Inorganic Grit / Cinder:</strong> Provides 100% drainage and permanent aeration for the root zone.</li>
                  <li>
                    <strong>Biochar:</strong> Acts as a permanent home for beneficial microbes that help roots
                    process nutrients more efficiently under thermal stress.
                  </li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900">Join the Climate-Smart Movement</h3>
                <p>
                  Ready to grow a garden that can stand the heat? Visit our nursery to see our "Hardened"
                  stock or sign up for our next workshop on Advanced Tropical Propagation.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="#" className="px-4 py-2 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors">Contact Us</a>
                  <a href="#" className="px-4 py-2 rounded-full border border-green-700 text-green-700 text-sm font-semibold hover:bg-green-50 transition-colors">Shop Resilient Varieties</a>
                  <a href="#" className="px-4 py-2 rounded-full border border-green-700 text-green-700 text-sm font-semibold hover:bg-green-50 transition-colors">View Gallery</a>
                </div>
              </article>
            ) : selectedArticle.id === 'kitchan-gardan' || selectedArticle.id === 'kitchen-garden' ? (
              <article className="prose prose-lg max-w-none text-gray-700 leading-8 space-y-6">
                <p>
                  This guide explores the fusion of Chettinad heritage - known for its opulent use of natural
                  materials, symmetry, and climate-responsive courtyards - with Contemporary Biophilic
                  Design, which prioritizes the innate human connection to nature through light, air, and
                  organic patterns.
                </p>

                <h3 className="text-2xl font-bold text-gray-900">The Design Philosophy: "The Living Heritage"</h3>
                <p>
                  Traditional Chettinad architecture was inherently biophilic before the term existed. It
                  relied on internal courtyards (Valavu) to regulate temperature and provide a private slice
                  of the sky. Our fusion approach takes these elements and softens them with modern
                  ecological sensibilities.
                </p>

                <h3 className="text-2xl font-bold text-gray-900">Key Design Elements</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">1. The Modern "Valavu" (Internal Courtyard)</h4>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li><strong>Heritage Element:</strong> The central open-to-sky courtyard with carved pillars.</li>
                      <li>
                        <strong>Biophilic Update:</strong> Replace traditional paved floors with a "sunken garden"
                        featuring ferns and mosses. Use glass-enclosed courtyards to allow visual access
                        to nature while maintaining climate control in extreme heat.
                      </li>
                      <li>
                        <strong>Pillar Detail:</strong> Use reclaimed Teak wood or stone pillars, but integrate vertical
                        climbing vines (Cissus antarctica) to "green" the hard architectural lines.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">2. Athangudi Tile Pathways</h4>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li><strong>Heritage Element:</strong> Vibrant, handmade, geometric-patterned floor tiles.</li>
                      <li>
                        <strong>Biophilic Update:</strong> Use these tiles as "focal islands" within a larger landscape of
                        permeable gravel or grass. The geometric patterns mimic the fractal mathematics
                        found in nature, providing visual interest that reduces cognitive stress.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">3. The Reimagined "Thinnai" (Entrance Veranda)</h4>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li><strong>Heritage Element:</strong> Raised platforms at the entrance for social interaction.</li>
                      <li>
                        <strong>Biophilic Update:</strong> Transform the Thinnai into an outdoor "wellness zone."
                        Incorporate built-in stone planters and water rills (narrow channels) that run
                        alongside the seating, providing the soothing sound of moving water.
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900">Planting Palette & Ecology</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">1. The Cultural Canopy (Heritage)</h4>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>
                        <strong>Sacred Trees:</strong> Incorporate Magizham (Spanish Cherry) for its fragrance and
                        Ashoka trees for verticality and symmetry.
                      </li>
                      <li>
                        <strong>Vibrant Flora:</strong> Use local favorites like Sembaruthi (Hibiscus) and
                        Nandiyavattam (Crape Jasmine), which were staples in traditional mansion gardens.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">2. The Biophilic Layer (Contemporary)</h4>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>
                        <strong>Multi-Sensory Planting:</strong> Focus on textures (soft grasses like Pennisetum) and
                        scents that change with the time of day.
                      </li>
                      <li>
                        <strong>Air Purification:</strong> Indoors and in semi-shaded transition zones, use
                        Sansevieria and Peace Lilies to improve indoor air quality, a core tenet of biophilic
                        design.
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900">Water Features: The Cooling Soul</h3>
                <p>Chettinad design often utilized massive stone urns (Urulis).</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Contemporary Twist:</strong> Create a "zero-edge" reflection pool using black granite.
                    Place a single, oversized brass Uruli in the center as a sculpture.
                  </li>
                  <li>
                    <strong>Biophilic Benefit:</strong> The reflection of the sky on the water surface brings "dynamic
                    light" into the living space, while the sound of a hidden bubbler inside the urn
                    provides auditory masking for city noise.
                  </li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900">Lighting: Shadows and Highlights</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Traditional:</strong> Brass hanging lamps (Villakku).</li>
                  <li>
                    <strong>Contemporary:</strong> Concealed LED strips that highlight the texture of exposed brick
                    walls or the grain of weathered wood. Use "warm-dim" technology to mimic the
                    natural progression of sunlight (circadian lighting), which supports human sleep-wake
                    cycles.
                  </li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900">Implementation Checklist</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Material Honesty:</strong> Use local granite, terracotta, and lime-plaster finishes.</li>
                  <li>
                    <strong>Symmetry vs. Organic:</strong> Maintain Chettinad symmetry in the "hardscape" (paths,
                    walls) but allow the "softscape" (plants) to grow in organic, wilder clusters.
                  </li>
                  <li>
                    <strong>Indoor-Outdoor Flow:</strong> Ensure every room has a direct view of a green element,
                    even if it is a small potted Tulsi in a stone niche.
                  </li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900">Bringing History Home</h3>
                <p>
                  By marrying the structured grandeur of Chettinad style with the soft, health-centric
                  approach of biophilic design, we create landscapes that are not just beautiful to look at,
                  but restorative to live in.
                </p>
              </article>
            ) : (
              <article className="prose prose-lg max-w-none text-gray-700">
                <p>Detailed content for this article will be published soon.</p>
              </article>
            )}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Browse by Interest</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Plant Care 101', 'Landscape Design', 'AgriTech & IoT', 'Pest Control', 'Seasonal Tips', 'Vertical Gardens', 'Indoor Mastery', 'Sustainable Living'].map((cat) => (
              <div key={cat} className="p-8 border border-white/10 rounded-3xl text-center hover:bg-white/5 transition-all cursor-pointer">
                <div className="text-green-400 mb-4 flex justify-center"><BookOpen /></div>
                <h4 className="font-bold">{cat}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeHub;
