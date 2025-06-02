import React from 'react';

function Pyramid({ tiles, selectedTiles, onTileClick }) {
  const tileRows = [];
  if (tiles && tiles.length === 10) {
    tileRows.push(tiles.slice(0, 1));  // Row 1: 1 tile (A)
    tileRows.push(tiles.slice(1, 3));  // Row 2: 2 tiles (B, C)
    tileRows.push(tiles.slice(3, 6));  // Row 3: 3 tiles (D, E, F)
    tileRows.push(tiles.slice(6, 10)); // Row 4: 4 tiles (G, H, I, J)
  } else {
    // Fallback for different number of tiles (e.g. display all in one row)
    tileRows.push(tiles || []);
  }

  return (
    <div>
      {tileRows.map((row, rowIndex) => (
        <div key={rowIndex} className="pyramid-row">
          {row.map(tile => {
            const isTileSelected = selectedTiles.find(st => st.id === tile.id);
            return (
              <button
                key={tile.id}
                className={`tile-button ${isTileSelected ? 'selected' : ''}`}
                onClick={() => onTileClick(tile)}
                // disabled={/* Add disabled logic if needed later */}
              >
                {`${tile.name}: ${tile.operator} ${tile.number}`}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Pyramid;
