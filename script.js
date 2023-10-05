console.log(XLSX.book_new);

    // Parsing user input from logic notation
    // this is to get the variables
    function parseInput(input) {
      let variables = new Set();
      let ops = ['and', 'or', 'xor', 'iff', '!', '->','\(','\)']; //! is not, -> is implies

      let cleanedInput = input.replace(/[\s=]|and|!|or|xor|iff|\)|\(|->|,/g,''); // Remove spaces, and equals sign
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
    return a !== b;
}

function iff(a, b) {
    return a === b;
}



function not(a){
  return !a;
}

function evaluateExpression(expression) {
    let exp = expression.replace(/and/g, '&&')
                        .replace(/or/g, '||')
                        .replace(/xor/g, '!==') 
                        .replace(/iff/g, '===');
                        //we need to do something about implies



    return exp;
}

// function declareVar(nameString,value) {
//   let newValue;
//   if(value == "TRUE"){
//     newValue = 1;
//   } else {
//     newValue = 0;
//   }
//   eval(nameString + " = " + "'" + newValue + "'");
  
// }

function declareVar(nameString, value) {
  window[nameString] = (value === "TRUE" ? 1 : 0);
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
      


      let expressionsOutputList = [];
      for(let o = 0; o<expressions.length;o++){
        expressionsOutputList.push(evaluateExpression(expressions[o]));
      }

      //row 2 to end
      for(let i = 0; i < Math.pow(2, variables.length); i++) {
        let bin = i.toString(2).padStart(variables.length, '0');
        let row = [];
        for(let x = 0; x < bin.length; x++) {
          //console.log(bin.charAt(x));
          switch (bin.charAt(x)) {
            case '0':
              row.push("TRUE");
              break;
            case '1':
              row.push("FALSE");
              break;
          }
        }
        // evaluate the logical expressions here
        
        
        for(let m = 0; m < expressions.length; m++){
          
          let tempVarList = parseInput(expressions[m]);
          
          //declares every temp variable (a b c d etc)
          for(let k = 0; k < tempVarList.length;k++){
            for(let b = 0; b < variables.length; b++){
              if(variables[b] == tempVarList[k]){
                declareVar(tempVarList[k],row[b]);
                
              }
            }
          }


          
          let tempToPush = eval(expressionsOutputList[m]);
          if(tempToPush == 1){
            row.push("TRUE");
          } else if (tempToPush == 0){
            row.push("FALSE");
          }
        }
        

        //console.log(row);
        table.push(row);
      }
      
      



      // Workbook edit
      console.log(XLSX.version);
      const workbook = XLSX.utils.book_new();

      let worksheet = XLSX.utils.aoa_to_sheet(table); // Use the correct variable name
      
      let new_name = XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1", true);
      
      // Write to the excel file
      XLSX.writeFile(workbook, "test.xlsx");
  });
});