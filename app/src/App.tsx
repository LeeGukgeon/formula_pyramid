import { useState, useEffect } from 'react'; // Added useEffect
import './App.css';
import HexagonPyramid from './components/HexagonPyramid'; // Import HexagonPyramid

// Define HexagonData interface (copied from HexagonPyramid.tsx for now)
interface HexagonData {
  id: string;
  operator: string;
  number: number;
}

// Define staticHexagonData (copied from HexagonPyramid.tsx for now)
const staticHexagonData: HexagonData[] = [
  { id: 'hex-0', operator: '+', number: 5 },
  { id: 'hex-1', operator: '-', number: 3 },
  { id: 'hex-2', operator: '*', number: 7 },
  { id: 'hex-3', operator: '/', number: 2 },
  { id: 'hex-4', operator: '+', number: 9 },
  { id: 'hex-5', operator: '-', number: 1 },
  { id: 'hex-6', operator: '*', number: 4 },
  { id: 'hex-7', operator: '/', number: 8 },
  { id: 'hex-8', operator: '+', number: 6 },
  { id: 'hex-9', operator: '-', number: 4 },
];

// Function to perform calculation based on operator
const performOperation = (val1: number, operator: string, val2: number): number | null => {
  switch (operator) {
    case '+':
      return val1 + val2;
    case '-':
      return val1 - val2;
    case '*':
      return val1 * val2;
    case '/':
      if (val2 === 0) {
        return null; // Handle division by zero
      }
      return val1 / val2;
    default:
      console.error(`Unknown operator: ${operator}`);
      return null;
  }
};

// Create calculateOutcome function
const calculateOutcome = (tile1: HexagonData, tile2: HexagonData, tile3: HexagonData): number | null => {
  const firstResult = performOperation(tile1.number, tile2.operator, tile2.number);
  if (firstResult === null) {
    return null;
  }
  return performOperation(firstResult, tile3.operator, tile3.number);
};

// Create getAllPossibleOutcomes function
const getAllPossibleOutcomes = (): number[] => {
  const outcomes: Set<number> = new Set(); // Use a Set to store unique outcomes
  const n = staticHexagonData.length;

  if (n < 3) {
    return []; // Not enough tiles for a combination of 3
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue; // Skip if tiles are the same for first two positions

      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue; // Skip if the third tile is same as first or second

        const tile1 = staticHexagonData[i];
        const tile2 = staticHexagonData[j];
        const tile3 = staticHexagonData[k];

        const result = calculateOutcome(tile1, tile2, tile3);
        if (result !== null && Number.isFinite(result)) { // Check for valid, finite numbers
          outcomes.add(result);
        }
      }
    }
  }
  return Array.from(outcomes).sort((a, b) => a - b); // Return sorted array of unique outcomes
};


function App() {
  const [selectedTiles, setSelectedTiles] = useState<HexagonData[]>([]);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [triedCombinations, setTriedCombinations] = useState<Set<string>>(new Set());
  const [gameEndMessage, setGameEndMessage] = useState<string | null>(null);

  const TOTAL_POSSIBLE_COMBINATIONS = 10 * 9 * 8; // P(10, 3)

  // Timer logic and game end message for time up
  useEffect(() => {
    if (!gameActive) return; // Stop if game becomes inactive for any reason

    if (timeLeft <= 0) {
      setGameActive(false);
      setGameEndMessage(`Time's up! Final Score: ${score}`);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameActive, timeLeft, score]); // Added score to dependency for gameEndMessage


  // Function to process the attempt when 3 tiles are selected
  const processAttempt = (currentSelection: HexagonData[]) => {
    if (currentSelection.length !== 3 || !gameActive) { // Added !gameActive check
      console.error("Process attempt called with incorrect number of tiles or game not active:", currentSelection);
      return;
    }
    const [tile1, tile2, tile3] = currentSelection;

    // Track tried combination
    const combinationKey = currentSelection.map(t => t.id).join(',');
    const newTriedCombinations = new Set(triedCombinations).add(combinationKey);
    setTriedCombinations(newTriedCombinations);

    const result = calculateOutcome(tile1, tile2, tile3);
    console.log("Attempt:", currentSelection.map(t => `${t.operator}${t.number}`).join(' '), "Result:", result);

    if (result !== null && result === targetNumber) {
      setScore(prevScore => prevScore + 1); // Score update will be reflected in next render for gameEndMessage
      console.log("Match! Score increased.");
    } else {
      console.log("No match or invalid result.");
    }
    setSelectedTiles([]); // Reset selection

    // Check for all combinations tried game end condition
    // Need to use newTriedCombinations.size because state update is async
    if (newTriedCombinations.size >= TOTAL_POSSIBLE_COMBINATIONS) {
      setGameActive(false);
      // Score used here might be stale if setScore hasn't re-rendered yet.
      // It's better to pass the latest score to gameEndMessage if possible,
      // or rely on a useEffect to set the message when gameActive turns false.
      // For now, let's set it directly, acknowledging it might be off by 1 in this specific message.
      // A useEffect watching gameActive and triedCombinations.size would be more robust for this message.
      setGameEndMessage(`Congratulations! You've tried all possible combinations. Final Score: ${result !== null && result === targetNumber ? score + 1 : score}`);
    }
  };

  const handleHexagonClick = (id: string | number, operator: string, number: number) => {
    if (!gameActive) {
      console.log("Game is not active. Clicks are disabled.");
      return;
    }

    console.log(`Hexagon clicked: id=${id}, operator=${operator}, number=${number}`);

    if (selectedTiles.length >= 3) {
      console.log("Maximum of 3 tiles already selected.");
      return;
    }

    const clickedTile = staticHexagonData.find(tile => tile.id === id);
    if (!clickedTile) {
      console.error("Clicked tile data not found in staticHexagonData");
      return;
    }

    if (selectedTiles.some(tile => tile.id === clickedTile.id)) {
      console.log("Tile already selected:", clickedTile.id);
      return;
    }

    const newSelectedTiles = [...selectedTiles, clickedTile];
    setSelectedTiles(newSelectedTiles);

    if (newSelectedTiles.length === 3) {
      processAttempt(newSelectedTiles);
    }
  };

  // Function to determine the target number
  const determineTargetNumber = () => {
    const allOutcomes = getAllPossibleOutcomes();
    if (allOutcomes.length === 0) {
      console.warn("No outcomes found, cannot determine target number.");
      setTargetNumber(null);
      return;
    }

    const frequencyMap: { [key: number]: number } = {};
    for (const outcome of allOutcomes) {
      frequencyMap[outcome] = (frequencyMap[outcome] || 0) + 1;
    }

    let maxFrequency = 0;
    let currentTargetNumber: number = allOutcomes[0]; // Default to first outcome

    for (const num in frequencyMap) {
      if (frequencyMap[num] > maxFrequency) {
        maxFrequency = frequencyMap[num];
        currentTargetNumber = parseFloat(num);
      }
    }
    setTargetNumber(currentTargetNumber);
    console.log("Determined Target Number:", currentTargetNumber); // Log for verification
  };

  useEffect(() => {
    // Initial setup: determine target number
    const allOutcomes = getAllPossibleOutcomes();
    console.log("All possible unique outcomes (for context):", allOutcomes);
    determineTargetNumber();
    // Timer starts based on gameActive and timeLeft state changes via the other useEffect
  }, []); // Empty dependency array for initial setup


  return (
    <div className="App">
      <header className="App-header">
        <h1>Hexagon Clicker Game</h1>
        <div className="game-status">
          <p className="time-left-display">Time Left: <strong>{timeLeft}s</strong></p>
          {targetNumber !== null && (
            <p className="target-number-display">Target Number: <strong>{targetNumber}</strong></p>
          )}
          <p className="score-display">Score: <strong>{score}</strong></p>
          <p className="combinations-tried-display">Combinations Tried: {triedCombinations.size} / {TOTAL_POSSIBLE_COMBINATIONS}</p>
        </div>

        {/* Display Game End Message */}
        {!gameActive && gameEndMessage && (
          <div className="game-over-message">
            <h2>{gameEndMessage.startsWith("Time's up!") ? "Time's Up!" : "Game Over!"}</h2>
            <p>{gameEndMessage}</p>
            {/* Optionally, add a button here to restart the game */}
          </div>
        )}

        <div className="current-selection-display">
          <h3>Current Selection:</h3>
          {gameActive && selectedTiles.length > 0 ? (
            <ul>
              {selectedTiles.map((tile, index) => (
                <li key={tile.id}>
                  Tile {index + 1}: {tile.operator}{tile.number} (ID: {tile.id})
                </li>
              ))}
            </ul>
          ) : gameActive ? ( // If game is active but no tiles selected
            <p>Click up to 3 hexagons to make an attempt.</p>
          ) : null /* Or some other message if game is not active and no tiles */ }
        </div>
      </header>
      <main>
        {/* Disable HexagonPyramid clicks visually or functionally if needed when !gameActive */}
        <HexagonPyramid onHexagonClick={handleHexagonClick} />
      </main>
    </div>
  );
}

export default App;
