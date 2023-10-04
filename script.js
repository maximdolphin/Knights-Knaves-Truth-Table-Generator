    // Parsing user input from logic notation
    function parseInput(input) {
      let variables = new Set();
      let ops = ['and', 'or', 'xor', 'iff', '=', '(', ')'];
  
      // Splitting using regex to separate variables and operators
      let tokens = input.split(/(and|or|xor|iff|\(|\)|=)/g).map(e => e.trim()).filter(e => e.length > 0);
  
      tokens.forEach(token => {
          if (!ops.includes(token) && isNaN(token)) {
              variables.add(token);
          }
      });
  
      return Array.from(variables);
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

  window.xor = function(a, b) {
    return a !== b;
}

  window.iff = function(a, b) {
    return a === b;
}

function handleIFF(exp) {
  const matches = exp.match(/([a-zA-Z0-9_]+)\s*=\s*([a-zA-Z0-9_]+|\([^)]*\))/);
  if (matches) {
    const leftVar = matches[1];
    const rightExpression = matches[2];
    return exp.replace(matches[0], `iff(${leftVar}, ${rightExpression})`);
  }
  return exp;
}

function handleXor(exp) {
  const xorRegex = /\b(\w+)\s*xor\s*(\w+)\b/;

  while (xorRegex.test(exp)) {
      exp = exp.replace(xorRegex, (match, leftVar, rightVar) => {
          return `xor(${leftVar}, ${rightVar})`;
      });
  }

  return exp;
}

function evaluateExpression(expression, values) {
  // 1. Replacing variables with their respective values
  for (let key in values) {
      expression = expression.replace(new RegExp('\\b' + key + '\\b', 'g'), String(values[key]));
  }

  // 2. Replace logical operators
  let exp = expression.replace(/and/g, '&&').replace(/or/g, '||');

  // Handling 'xor'
  exp = handleXor(exp);

  // 3. Handling '='
  exp = handleIFF(exp);

  console.log("Evaluating:", exp); // Debug log to see the expression being evaluated
  try {
      return eval(exp);
  } catch (e) {
      console.error(`Failed to evaluate expression "${expression}":`, e);
      return false;
  }
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
      table.push([...variables, inputValue]);

      combinations.forEach(combination => {
          let values = {};
          for (let i = 0; i < variables.length; i++) {
              values[variables[i]] = combination[i];
          }

          let result = evaluateExpression(inputValue, values);
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