const operators = ['+', '-', '*', '/'];
const tileNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

function generateTiles() {
  const tiles = [];
  for (let i = 0; i < 10; i++) { // Loop from 0 to 9 for array indexing
    const number = Math.floor(Math.random() * 9) + 1;
    const operator = operators[Math.floor(Math.random() * operators.length)];
    tiles.push({
      id: i + 1, // id remains 1-10
      operator: operator,
      number: number,
      name: tileNames[i] // Add the name
    });
  }
  return tiles;
}

function performOperation(operand1, operator, operand2) {
  switch (operator) {
    case '+':
      return operand1 + operand2;
    case '-':
      return operand1 - operand2;
    case '*':
      return operand1 * operand2;
    case '/':
      if (operand2 === 0) {
        return Infinity; // Or 'DivisionByZeroError'
      }
      return operand1 / operand2;
    default:
      throw new Error('Invalid operator');
  }
}

function evaluateEquation(tile1, tile2, tile3) {
  const valueA = tile1.number;
  const operator1 = tile2.operator;
  const valueB = tile2.number;
  const operator2 = tile3.operator;
  const valueC = tile3.number;

  const interimResult = performOperation(valueA, operator1, valueB);
  if (interimResult === Infinity) {
    return Infinity;
  }

  const finalResult = performOperation(interimResult, operator2, valueC);
  return finalResult;
}

function findAllSolutions(tiles, targetNumber) {
  const solutions = [];
  if (!tiles || tiles.length < 3) {
    return solutions; // Not enough tiles
  }

  // Iterate through all unique combinations of 3 tiles
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      for (let k = j + 1; k < tiles.length; k++) {
        const tile1 = tiles[i];
        const tile2 = tiles[j];
        const tile3 = tiles[k];

        // Assuming order of tiles in the combination (i,j,k) is the order of application.
        // This matches the game's described evaluation logic: (A op B) op C
        let calculatedValue = evaluateEquation(tile1, tile2, tile3);
        if (calculatedValue === targetNumber && calculatedValue !== Infinity) {
          solutions.push({
            tiles: [tile1, tile2, tile3], // Store the tiles themselves
            names: `${tile1.name}${tile2.name}${tile3.name}`,
            value: calculatedValue,
            equation: `${tile1.number} ${tile2.operator} ${tile2.number} ${tile3.operator} ${tile3.number}`
          });
        }
      }
    }
  }
  return solutions;
}

module.exports = { generateTiles, evaluateEquation, findAllSolutions };
