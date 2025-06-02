const operators = ['+', '-', '*', '/'];

function generateTiles() {
  const tiles = [];
  for (let i = 1; i <= 10; i++) {
    const number = Math.floor(Math.random() * 9) + 1;
    const operator = operators[Math.floor(Math.random() * operators.length)];
    tiles.push({
      id: i,
      operator: operator,
      number: number,
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

module.exports = { generateTiles, evaluateEquation };
