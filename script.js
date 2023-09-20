console.log(XLSX.book_new);

    // Parsing user input from logic notation
    // this is to get the variables
    function parseInput(input) {
      let variables = new Set();
      let ops = ['and', 'or', 'xor', 'iff', '~', '=>']; //~ is not, => is implies

      let cleanedInput = input.replace(/[\s=]|and|~|or|xor|iff|=>|,/g,''); // Remove spaces, and equals sign
      let tokens = cleanedInput.split('');

      tokens.forEach(token => {
        if (!ops.includes(token) && isNaN(token)) { // Make sure that the token isn't a number
          variables.add(token);
        }
      });

      return Array.from(variables); // Set -> Array
    }

    // this is to separate each expression (they are separatede using commas from the input like emathhelp)
    function parseExpressions(input){
      let expressionArray = input.split(',');

      //there is probably a better way to do this
      for(var i = 0; i < expressionArray.length; i++){
        if(expressionArray[i].trim() == ','){
          expressionArray.slice(i,1);
        }
      }

      //this will go on row 1
      return expressionArray;
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
    //return a !== b;
    return "XOR("+a+","+b+")";
}

function iff(a, b) {
    //return a === b;
    return "IF("+a+","+b+","+"TRUE)";
}

function and(a,b){
  return "AND("+a+","+b+")";
}

function or(a,b){
  return "OR("+a+","+b+")";
}

function not(a){
  return "NOT("+b+")";
}

function evaluateExpression(expression, values) {
    let exp = expression.replace(/and/g, '&&')
                        .replace(/or/g, '||')
                        .replace(/xor/g, '!==') 
                        .replace(/iff/g, '==='); 

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
      //let combinations = generateCombinations(variables);

      let expressions = parseExpressions(inputValue);

      // Creating the truth table
      let table = [];
      table.push([...variables, ...expressions]); // adds the expressions to row 1
      


      //row 2 
      let row2 = [];
      for(var i = 0; i < variables.length; i++){
        row2.push("TRUE");
      }
      

      // for(var j = 0; j < expressions.length;j++){
      //   row2.push(evaluateExpression(expressions[i])); //
      // }

      table.push(row2);
      //row 2 end


      // combinations.forEach(combination => {
      //     let values = {};
      //     for (let i = 0; i < variables.length; i++) {
      //         values[variables[i]] = combination[i];
      //     }

      //     let result = evaluateExpression(inputValue.split('=')[1].trim(), values);
      //     //let result = evaluateExpression(inputValue.split('=')[1], values);
      //     table.push([...combination, result]);
      // });




      // Workbook edit
      console.log(XLSX.version);
      const workbook = XLSX.utils.book_new();

      let worksheet = XLSX.utils.aoa_to_sheet(table); // Use the correct variable name
      
      let new_name = XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1", true);
      
      // Write to the excel file
      XLSX.writeFile(workbook, "test.xlsx");
  });
});