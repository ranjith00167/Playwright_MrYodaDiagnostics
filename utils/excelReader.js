// c:/Users/RANJITH/Documents/Playwright_MrYodaDiagnostics/utils/excelReader.js
const XLSX = require('xlsx');
const path = require('path');

function readExcelData(sheetName, rowId) {
    const filePath = path.join(__dirname, '../data/testData.xlsx');
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // First, try to find a row with an 'ID' column matching the rowId
    let row = data.find(r => r.ID && String(r.ID) === String(rowId));
    
    // If not found, treat rowId as a 1-based *data row* number (excluding headers)
    // rowId = 1 -> data[0]
    // rowId = 2 -> data[1]
    // ...
    if (!row) {
        const rowIndex = parseInt(rowId, 10) - 1;
        if (rowIndex >= 0 && rowIndex < data.length) {
            row = data[rowIndex];
        } else {
            console.error(`Row ${rowId} not found in sheet ${sheetName}`);
        }
    }
    
    // Convert all numeric values to strings to avoid Playwright fill() errors
    if (row) {
        Object.keys(row).forEach(key => {
            if (typeof row[key] === 'number') {
                row[key] = String(row[key]);
            }
        });
    }
    
    return row || {};
}

module.exports = { readExcelData };
