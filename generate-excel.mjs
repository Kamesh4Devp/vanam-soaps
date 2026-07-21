import XLSX from 'xlsx';

const soaps = [
  { name: 'Kuppameni Soap', description: 'Traditional herbal soap made with Kuppameni leaves for healthy skin', price100g: 100, price70g: 50, inStock100g: 'yes', inStock70g: 'yes', image1: '/images/kuppameni1.jpeg', image2: '/images/kuppameni2.jpeg', image3: '/images/kuppameni3.jpeg' },
  { name: 'Papaya Soap', description: 'Skin brightening soap with natural papaya extract', price100g: 100, price70g: 50, inStock100g: 'yes', inStock70g: 'yes', image1: '/images/papaya1.jpeg', image2: '/images/papaya2.jpeg', image3: '/images/papaya3.jpeg' },
  { name: 'Aloe Vera Soap', description: 'Moisturizing soap with fresh aloe vera gel', price100g: 100, price70g: 50, inStock100g: 'yes', inStock70g: 'yes', image1: '/images/aloevera1.jpeg', image2: '/images/aloevera2.jpeg', image3: '/images/aloevera3.jpeg' },
  { name: 'Charcoal Soap', description: 'Deep cleansing activated charcoal soap for oil control', price100g: 100, price70g: 50, inStock100g: 'yes', inStock70g: 'yes', image1: '/images/charcoal1.jpeg', image2: '/images/charcoal2.jpeg', image3: '/images/charcoal3.jpeg' },
  { name: 'Acne Clear Soap', description: 'Powerful acne-fighting soap with Aloe Vera, Papaya, Shea Butter, Neem & Kasturi Turmeric', price100g: 120, price70g: 100, inStock100g: 'yes', inStock70g: 'yes', image1: '/images/acnesoap1.jpeg', image2: '/images/acnesoap2.jpeg', image3: '/images/acnesoap3.jpeg' },
];

const ws = XLSX.utils.json_to_sheet(soaps);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Soaps');
XLSX.writeFile(wb, 'public/soaps.xlsx');
console.log('soaps.xlsx created! Columns: name, description, price, weight, inStock, image1-3');
