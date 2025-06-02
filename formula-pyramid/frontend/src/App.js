import React, { useState, useEffect } from 'react';
import './App.css';
import Pyramid from './components/Pyramid';

function App() {
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [equationString, setEquationString] = useState("");
  const [selectedTileNamesString, setSelectedTileNamesString] = useState("");
  const [allSolutions, setAllSolutions] = useState([]);
  const [foundCorrectCombinations, setFoundCorrectCombinations] = useState([]);
  const [checkResult, setCheckResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewGameData = async () => {
    setLoading(true);
    setError(null);
    setCheckResult(null);
    setSelectedTiles([]);
    // Reset new state variables for a new game
    setAllSolutions([]);
    setFoundCorrectCombinations([]);

    try {
      // Fetch tiles (existing logic)
      const tilesResponse = await fetch('/api/game/tiles');
      if (!tilesResponse.ok) {
        throw new Error('Network response was not ok while fetching tiles.');
      }
      const newTiles = await tilesResponse.json();
      setTiles(newTiles);

      // Set target number (existing logic)
      const newTargetNumber = Math.floor(Math.random() * 50) + 1;
      setTargetNumber(newTargetNumber);

      // ---- NEW: Fetch all solutions for the new set of tiles and target ----
      if (newTiles.length > 0) { // Only fetch solutions if we have tiles
        try {
          const solveResponse = await fetch('/api/game/solve', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tiles: newTiles, // The newly fetched tiles
              targetNumber: newTargetNumber, // The newly set target number
            }),
          });

          if (!solveResponse.ok) {
            console.error('Failed to fetch solutions:', solveResponse.statusText);
            setAllSolutions([]);
          } else {
            const solutionsData = await solveResponse.json();
            setAllSolutions(solutionsData);
          }
        } catch (solveError) {
          console.error('Error fetching solutions:', solveError);
          setError(prevError => prevError ? `${prevError}, Error fetching solutions: ${solveError.message}` : `Error fetching solutions: ${solveError.message}`);
          setAllSolutions([]); // Ensure it's reset on error
        }
      }
      // ---- END NEW ----

    } catch (err) {
      setError(err.message);
      setTiles([]);
      setAllSolutions([]); // Ensure solutions are cleared on general error too
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
      setSelectedTileNamesString(""); // Clear names string too
      return;
    }

    let eqStr = String(selectedTiles[0].number);
    let namesStr = String(selectedTiles[0].name); // Start with the first tile's name

    if (selectedTiles.length > 1) {
      eqStr += ` ${selectedTiles[1].operator} ${selectedTiles[1].number}`;
      namesStr += selectedTiles[1].name; // Append second tile's name
    }

    if (selectedTiles.length > 2) {
      eqStr += ` ${selectedTiles[2].operator} ${selectedTiles[2].number}`;
      namesStr += selectedTiles[2].name; // Append third tile's name
    }

    setEquationString(eqStr);
    setSelectedTileNamesString(namesStr); // Update the names string state
  }, [selectedTiles]);

  useEffect(() => {
    // Check if allSolutions is populated and not empty
    if (allSolutions && allSolutions.length > 0) {
      // Check if the number of found combinations matches the total number of possible solutions
      if (foundCorrectCombinations.length === allSolutions.length) {
        alert('Found all cases!');
      }
    }
  }, [foundCorrectCombinations, allSolutions]); // Dependencies: effect runs when these change

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

      if (data.success) {
        // ---- NEW: Update foundCorrectCombinations list ----
        // selectedTileNamesString should already be up-to-date from its own useEffect
        if (selectedTileNamesString && !foundCorrectCombinations.includes(selectedTileNamesString)) {
          setFoundCorrectCombinations(prevFound => [...prevFound, selectedTileNamesString]);
        }
        // ---- END NEW ----
      }
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
        <h4>Selected Combination: <span>{selectedTileNamesString || "---"}</span></h4>
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

      {foundCorrectCombinations.length > 0 && (
        <div className="found-combinations-section">
          <h3>Found Combinations:</h3>
          <ul className="found-combinations-list">
            {foundCorrectCombinations.map((comboName, index) => (
              <li key={index} className="found-combo-item">
                {comboName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
