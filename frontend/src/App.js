import React, { useState, useEffect } from 'react';
import './App.css';
import Pyramid from './components/Pyramid';

function App() {
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [equationString, setEquationString] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewGameData = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    setCheckResult(null); // Clear previous game results
    setSelectedTiles([]); // Clear selected tiles

    try {
      const response = await fetch('/api/game/tiles');
      if (!response.ok) {
        throw new Error('Network response was not ok while fetching tiles.');
      }
      const data = await response.json();
      setTiles(data);
      setTargetNumber(Math.floor(Math.random() * 50) + 1); // New target for new game
    } catch (err) {
      setError(err.message);
      setTiles([]); // Clear tiles on error
    } finally {
      setLoading(false);
    }
  };

  const handleTileClick = (tile) => {
    setSelectedTiles(prevSelected => {
      // Check if tile is already selected
      const isSelected = prevSelected.find(st => st.id === tile.id);
      if (isSelected) {
        // If selected, remove it (deselect)
        return prevSelected.filter(st => st.id !== tile.id);
      } else {
        // If not selected, add if less than 3 tiles are selected
        if (prevSelected.length < 3) {
          return [...prevSelected, tile];
        }
      }
      // If 3 tiles are already selected and it's a new tile, do nothing (return current selection)
      return prevSelected;
    });
  };

  useEffect(() => {
    fetchNewGameData();
  }, []);

  useEffect(() => {
    if (selectedTiles.length === 0) {
      setEquationString("");
      return;
    }

    let eqStr = String(selectedTiles[0].number);

    if (selectedTiles.length > 1) {
      eqStr += ` ${selectedTiles[1].operator} ${selectedTiles[1].number}`;
    }

    if (selectedTiles.length > 2) {
      eqStr += ` ${selectedTiles[2].operator} ${selectedTiles[2].number}`;
    }

    setEquationString(eqStr);
  }, [selectedTiles]);

  if (loading) {
    return <div>Loading tiles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSubmitSelection = async () => {
    if (selectedTiles.length !== 3) {
      alert("Please select exactly 3 tiles."); // Basic validation
      return;
    }

    setIsChecking(true);
    setCheckResult(null);

    try {
      const response = await fetch('/api/game/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedTiles: selectedTiles,
          targetNumber: targetNumber,
        }),
      });

      if (!response.ok) {
        // Try to get error message from backend if available
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCheckResult(data); // data should be { success: boolean, calculatedValue: number, targetNumber: number }
    } catch (error) {
      setCheckResult({ success: false, message: error.message, calculatedValue: null });
    } finally {
      setIsChecking(false);
    }
  };

  const handleNewGame = () => {
    fetchNewGameData();
  };

  return (
    <div className="App">
      <h1>Formula Pyramid</h1>

      <div className="game-info">
        <h2>Target: {targetNumber}</h2>
        {selectedTiles.length > 0 && <h3>Your Equation: <span>{equationString || "Select tiles..."}</span></h3>}
      </div>

      <div className="pyramid-display">
        <Pyramid tiles={tiles} selectedTiles={selectedTiles} onTileClick={handleTileClick} />
      </div>

      <div className="controls">
        <button
          onClick={handleSubmitSelection}
          disabled={selectedTiles.length !== 3 || isChecking || loading}
          className="check-button"
        >
          {isChecking ? 'Checking...' : 'Check Equation'}
        </button>
        <button
          onClick={handleNewGame}
          disabled={loading || isChecking}
          className="new-game-button"
        >
          New Game
        </button>
      </div>

      {checkResult && (
        <div className="result-message" style={{ marginTop: '15px', padding: '10px', border: `1px solid ${checkResult.success ? 'green' : 'red'}` }}>
          {checkResult.message ? ( // For general errors
            <p>{checkResult.message}</p>
          ) : checkResult.success ? (
            <p style={{ color: 'green' }}>Correct! Well done!</p>
          ) : (
            <p style={{ color: 'red' }}>
              Incorrect. Your equation result: {checkResult.calculatedValue} (Target was: {checkResult.targetNumber})
            </p>
          )}
          {checkResult.calculatedValue === Infinity && (
              <p style={{color: 'orange'}}>Note: Your equation resulted in a division by zero.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
