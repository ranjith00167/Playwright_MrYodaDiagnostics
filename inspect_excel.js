const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'data/testData.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = 'Diagnostics';
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Header=1 returns array of arrays

console.log('Sheet Names:', workbook.SheetNames);
if (worksheet) {
    console.log('Headers:', data[0]);
    console.log('First Row:', data[1]);
    
    const dataWithKeys = XLSX.utils.sheet_to_json(worksheet);
    const row6 = dataWithKeys.find(r => String(r.ID) === '6' || String(r.RowID) === '6' || String(r.rowid) === '6');
    console.log('Row with ID 6:', row6);
} else {
    console.log('Sheet "Diagnostics" not found!');
}
