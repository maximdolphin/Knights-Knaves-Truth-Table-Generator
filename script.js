// Import dependencies
const fs = require("fs");
const XLSX = require("xlsx");
const jsontoxml = require("jsontoxml");

var workbook = XLSX.utils.book_new();

//basically you put a 2d array into this and it will write it into the excel sheet
var worksheet = XLSX.utils.aoa_to_sheet([
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"],
    ["A3", "B3", "C3"]
  ]);

var new_name = XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1", true);

//for this to work you need a excel file named "test.xlsx" in the same folder and it will edit that file
XLSX.writeFile(workbook, "test.xlsx");