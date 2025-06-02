const express = require('express');
const { generateTiles, evaluateEquation } = require('./gameLogic');
const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Backend is running" });
});

app.get('/api/game/tiles', (req, res) => {
  const tiles = generateTiles();
  res.json(tiles);
});

app.post('/api/game/check', (req, res) => {
  const { selectedTiles, targetNumber } = req.body;

  if (!selectedTiles || !Array.isArray(selectedTiles) || selectedTiles.length !== 3 ||
      targetNumber === undefined || typeof targetNumber !== 'number') {
    return res.status(400).json({ error: 'Invalid input: selectedTiles must be an array of 3 tiles and targetNumber must be provided.' });
  }

  const calculatedValue = evaluateEquation(selectedTiles[0], selectedTiles[1], selectedTiles[2]);
  const success = (calculatedValue === targetNumber && calculatedValue !== Infinity);

  res.json({ success, calculatedValue, targetNumber });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
