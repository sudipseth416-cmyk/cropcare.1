export interface Crop {
  id: string;
  name: string;
  scientificName?: string;
  description: string;
  image: string;
  season: string[];
  ph: { min: number; max: number };
  diseases: Array<{ name: string; symptoms: string; treatment: string }>;
  fertilizers: string[];
}

// Recommended Agriculture APIs:
// 1. Perenual API (https://perenual.com/docs/api) - Excellent plant database
// 2. OpenFarm (https://openfarm.cc/api/v1/) - Open source crop data
// 3. Trefle (https://trefle.io/) - Global plant species API

const CROPS_DB: Crop[] = [
  {
    id: '1',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    description: 'A nutrient-dense vegetable widely grown in India.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1974&auto=format&fit=crop',
    season: ['Rabi', 'Zaid'],
    ph: { min: 6.0, max: 7.0 },
    diseases: [
      { name: 'Early Blight', symptoms: 'Brown spots with concentric rings', treatment: 'Copper fungicide' },
      { name: 'Leaf Mold', symptoms: 'Yellow spots on upper leaf surface', treatment: 'Improve ventilation' }
    ],
    fertilizers: ['NPK 10-10-10', 'Urea', 'Compost']
  },
  {
    id: '2',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    description: 'The primary staple crop of North India.',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2034&auto=format&fit=crop',
    season: ['Rabi'],
    ph: { min: 6.0, max: 7.5 },
    diseases: [
      { name: 'Leaf Rust', symptoms: 'Orange-brown pustules on leaves', treatment: 'Mancozeb spray' }
    ],
    fertilizers: ['DAP', 'Urea', 'Potash']
  }
];

export async function searchCrops(query: string): Promise<Crop[]> {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 500));
  
  if (!query) return CROPS_DB;
  
  return CROPS_DB.filter(crop => 
    crop.name.toLowerCase().includes(query.toLowerCase()) ||
    crop.description.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getCropById(id: string): Promise<Crop | null> {
  await new Promise(r => setTimeout(r, 300));
  return CROPS_DB.find(crop => crop.id === id) || null;
}
