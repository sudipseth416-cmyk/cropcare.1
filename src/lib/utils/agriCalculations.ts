export interface FertilizerResult {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  estimatedCost: number;
  products: Array<{ name: string; quantity: number; unit: string }>;
}

export const CROP_REQUIREMENTS: Record<string, { n: number, p: number, k: number, name: string }> = {
  rice: { name: 'Rice', n: 100, p: 50, k: 50 },
  wheat: { name: 'Wheat', n: 120, p: 60, k: 40 },
  tomato: { name: 'Tomato', n: 150, p: 100, k: 100 },
  maize: { name: 'Maize', n: 120, p: 60, k: 40 },
};

export const UNIT_COSTS = {
  urea: 6, // per kg
  dap: 27,
  mop: 34
};

export function calculateFertilizer(cropId: string, area: number, unit: 'acre' | 'hectare'): FertilizerResult {
  const req = CROP_REQUIREMENTS[cropId] || CROP_REQUIREMENTS.rice;
  const multiplier = unit === 'hectare' ? 2.471 : 1;
  const totalArea = area * multiplier;

  // Requirements in kg per total area
  const n_needed = req.n * totalArea;
  const p_needed = req.p * totalArea;
  const k_needed = req.k * totalArea;

  // Simple Product Mapping:
  // DAP (18-46-0)
  const dap_qty = p_needed / 0.46;
  const n_from_dap = dap_qty * 0.18;

  // Urea (46-0-0)
  const urea_qty = Math.max(0, (n_needed - n_from_dap) / 0.46);

  // MOP (0-0-60)
  const mop_qty = k_needed / 0.60;

  const cost = (urea_qty * UNIT_COSTS.urea) + (dap_qty * UNIT_COSTS.dap) + (mop_qty * UNIT_COSTS.mop);

  return {
    nitrogen: Math.round(n_needed),
    phosphorus: Math.round(p_needed),
    potassium: Math.round(k_needed),
    estimatedCost: Math.round(cost),
    products: [
      { name: 'Urea', quantity: Math.round(urea_qty), unit: 'kg' },
      { name: 'DAP', quantity: Math.round(dap_qty), unit: 'kg' },
      { name: 'MOP (Potash)', quantity: Math.round(mop_qty), unit: 'kg' }
    ]
  };
}
