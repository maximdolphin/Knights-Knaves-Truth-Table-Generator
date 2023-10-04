// Parsing user input from logic notation
function parseInput(input) {
  const ops = ['and', 'or', 'xor', 'iff', '=', '(', ')'];
  const tokens = input.split(/(and|or|xor|iff|\(|\)|=)/g)
      .map(e => e.trim())
      .filter(e => e.length > 0);

  const variables = new Set();
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

  const firstVar = vars[0];
  const restvars = vars.slice(1);
  const smallerCombinations = generateCombinations(restvars);
  
  return smallerCombinations.flatMap(combination => [
      [false, ...combination],
      [true, ...combination]
  ]);
}

function xor(a, b) {
  return a !== b;
}

function iff(a, b) {
  return a === b;
}

function handleIFF(exp) {
  const matches = exp.match(/([a-zA-Z0-9_]+)\s*=\s*([a-zA-Z0-9_]+|\([^)]*\))/);
  if (matches) {
      return exp.replace(matches[0], `iff(${matches[1]}, ${matches[2]})`);
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
  // Replace variables with their respective values
  for (let key in values) {
      expression = expression.replace(new RegExp('\\b' + key + '\\b', 'g'), String(values[key]));
  }

  let exp = expression
      .replace(/and/g, '&&')
      .replace(/or/g, '||')
      .replace(/=/g, 'iff');

  // Handle 'xor' and 'iff'
  exp = handleXor(exp);
  exp = handleIFF(exp);

  console.log("Evaluating:", exp);
  try {
      return eval(exp);
  } catch (e) {
      console.error(`Failed to evaluate expression "${expression}":`, e);
      return false;
  }
}

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  const inputElement = document.getElementById("new-task-title");

  document.getElementById("new-task-form").addEventListener("submit", function (e) {
      e.preventDefault();

      const inputValue = inputElement.value;
      const variables = parseInput(inputValue);
      const combinations = generateCombinations(variables);
      
      const table = combinations.map(combination => {
          const values = Object.fromEntries(variables.map((variable, idx) => [variable, combination[idx]]));
          const result = evaluateExpression(inputValue, values);
          return [...combination, result];
      });
      
      table.unshift([...variables, inputValue]);

      console.log(XLSX.version);
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(table);
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "test.xlsx");
  });
});