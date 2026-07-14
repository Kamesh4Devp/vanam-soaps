import XLSX from 'xlsx';

const soaps = [
  { name: 'Kuppameni Soap', description: 'Traditional herbal soap made with Kuppameni leaves for healthy skin', price: 120, weight: '100g', inStock: 'yes', image1: '/images/kuppameni1.jpg', image2: '/images/kuppameni2.jpg', image3: '/images/kuppameni3.jpg' },
  { name: 'Papaya Soap', description: 'Skin brightening soap with natural papaya extract', price: 130, weight: '100g', inStock: 'yes', image1: '/images/papaya1.jpg', image2: '/images/papaya2.jpg', image3: '/images/papaya3.jpg' },
  { name: 'Aloe Vera Soap', description: 'Moisturizing soap with fresh aloe vera gel', price: 110, weight: '100g', inStock: 'yes', image1: '/images/aloevera1.jpg', image2: '/images/aloevera2.jpg', image3: '/images/aloevera3.jpg' },
  { name: 'Charcoal Soap', description: 'Deep cleansing activated charcoal soap for oil control', price: 140, weight: '100g', inStock: 'yes', image1: '/images/charcoal1.jpg', image2: '/images/charcoal2.jpg', image3: '/images/charcoal3.jpg' },
];

const ws = XLSX.utils.json_to_sheet(soaps);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Soaps');
XLSX.writeFile(wb, 'public/soaps.xlsx');
console.log('soaps.xlsx created! Columns: name, description, price, weight, inStock, image1-3');
