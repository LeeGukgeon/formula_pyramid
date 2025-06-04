import { useState } from 'react';
import './App.css';
import HexagonPyramid from './components/HexagonPyramid'; // Import HexagonPyramid

function App() {
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const handleHexagonClick = (id: string | number, operator: string, number: number) => {
    // For now, just log and set state. We can add more complex logic later.
    console.log(`Hexagon clicked: id=${id}, operator=${operator}, number=${number}`);
    setSelectedOperator(operator);
    setSelectedNumber(number);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hexagon Clicker Game</h1>
        <div className="selected-hexagon-display">
          {selectedOperator !== null && selectedNumber !== null ? (
            <p>
              Selected: Operator: {selectedOperator}, Number: {selectedNumber}
            </p>
          ) : (
            <p>Click a hexagon to see its details here</p>
          )}
        </div>
      </header>
      <main>
        <HexagonPyramid onHexagonClick={handleHexagonClick} />
      </main>
    </div>
  );
}

export default App;
