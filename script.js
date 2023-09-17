// Import dependencies
import * as XLSX from 'xlsx';


// add an event listener to the form to handle submission
document.addEventListener("DOMContentLoaded", function () {

  var inputElement = document.getElementById("new-task-title");

  document.getElementById("new-task-form").addEventListener("submit", function (e) {
    e.preventDefault(); // prevent the form from submitting and refreshing the page

    // Get the user's input from the input element
    var inputValue = inputElement.value;
    



    //workbook edit

    console.log(XLSX.version);
    var workbook = XLSX.utils.book_new();

    //basically you put a 2d array into this and it will write it into the excel sheet
    var worksheet = XLSX.utils.aoa_to_sheet(arr); //2d array into the xlsx
    
    var new_name = XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1", true);
    
    //for this to work you need a excel file named "test.xlsx" in the same folder and it will edit that file
    XLSX.writeFile(workbook, "test.xlsx");
    
    

  });
});