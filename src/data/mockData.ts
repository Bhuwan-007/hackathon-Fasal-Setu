export interface CropPrice {
  id: string;
  nameEn: string;
  nameHi: string;
  pricePerQ: number;
  trend: 'up' | 'down' | 'stable';
  changeAmount: number;
  demandSignal: 'high' | 'normal' | 'low';
}

export const cropPrices: Record<string, CropPrice[]> = {
  Pune: [
    { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर', pricePerQ: 2400, trend: 'up', changeAmount: 150, demandSignal: 'high' },
    { id: 'onion', nameEn: 'Onion', nameHi: 'प्याज', pricePerQ: 1800, trend: 'down', changeAmount: 50, demandSignal: 'normal' },
    { id: 'potato', nameEn: 'Potato', nameHi: 'आलू', pricePerQ: 1200, trend: 'stable', changeAmount: 0, demandSignal: 'normal' },
    { id: 'cauliflower', nameEn: 'Cauliflower', nameHi: 'फूलगोभी', pricePerQ: 3200, trend: 'up', changeAmount: 200, demandSignal: 'high' },
  ],
  Nashik: [
    { id: 'onion', nameEn: 'Onion', nameHi: 'प्याज', pricePerQ: 1650, trend: 'down', changeAmount: 80, demandSignal: 'normal' },
    { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर', pricePerQ: 2100, trend: 'up', changeAmount: 100, demandSignal: 'high' },
    { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं', pricePerQ: 2450, trend: 'stable', changeAmount: 10, demandSignal: 'normal' },
  ],
  Nagpur: [
    { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', pricePerQ: 7200, trend: 'down', changeAmount: 300, demandSignal: 'low' },
    { id: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', pricePerQ: 4600, trend: 'up', changeAmount: 120, demandSignal: 'high' },
    { id: 'orange', nameEn: 'Orange', nameHi: 'संतरा', pricePerQ: 3500, trend: 'stable', changeAmount: 0, demandSignal: 'normal' },
  ],
  Jalgaon: [
    { id: 'banana', nameEn: 'Banana', nameHi: 'केला', pricePerQ: 1400, trend: 'up', changeAmount: 50, demandSignal: 'high' },
    { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', pricePerQ: 7100, trend: 'down', changeAmount: 250, demandSignal: 'low' },
    { id: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', pricePerQ: 4550, trend: 'stable', changeAmount: 0, demandSignal: 'normal' },
  ],
};
