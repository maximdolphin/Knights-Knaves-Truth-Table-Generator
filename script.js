console.log(XLSX.book_new);

    // Parsing user input from logic notation
    function parseInput(input) {
      let variables = new Set();
      let ops = ['and', 'or', 'xor', 'iff'];

      let cleanedInput = input.replace(/[\s\(\)=]/g, ''); // Remove spaces, parentheses, and equals sign
      let tokens = cleanedInput.split('');

      tokens.forEach(token => {
        if (!ops.includes(token) && isNaN(token)) { // Make sure that the token isn't a number
          variables.add(token);
        }
      });

      return Array.from(variables); // Set -> Array
    }

    // Generate truth table combinations
  function generateCombinations(vars) {
    if (vars.length === 0) return [[]];

    let firstVar = vars[0];
    let restvars = vars.slice(1);

    let smallerCombinations = generateCombinations(restvars);
    let combinations = [];

    smallerCombinations.forEach(combination => {
      combinations.push([false, ...combination]);
      combinations.push([true, ...combination]);
    });

    return combinations;
  }

function xor(a, b) {
    return a !== b;
}

function iff(a, b) {
    return a === b;
}

function evaluateExpression(expression, values) {
    let exp = expression.replace(/and/g, '&&')
                        .replace(/or/g, '||')
                        .replace(/xor/g, 'xor(a, b)')
                        .replace(/iff/g, 'iff(a, b)');
    
    for(let key in values) {
        exp = exp.replace(new RegExp(key, 'g'), `values["${key}"]`);
    }

    return eval(exp);
}

// add an event listener to the form to handle submission
document.addEventListener("DOMContentLoaded", function () {
  let inputElement = document.getElementById("new-task-title");

  document.getElementById("new-task-form").addEventListener("submit", function (e) {
      e.preventDefault(); // prevent the form from submitting and refreshing the page

      // Get the user's input from the input element
      let inputValue = inputElement.value;

      let variables = parseInput(inputValue);
      let combinations = generateCombinations(variables);

      // Creating the truth table
      let table = [];
      table.push([...variables, "Result"]);

      combinations.forEach(combination => {
          let values = {};
          for (let i = 0; i < variables.length; i++) {
              values[variables[i]] = combination[i];
          }

          let result = evaluateExpression(inputValue.split('=')[1].trim(), values);
          table.push([...combination, result]);
      });

      // Workbook edit
      console.log(XLSX.version);
      const workbook = XLSX.utils.book_new();

      let worksheet = XLSX.utils.aoa_to_sheet(table); // Use the correct variable name
      
      let new_name = XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1", true);
      
      // Write to the excel file
      XLSX.writeFile(workbook, "test.xlsx");
  });
});