import React from 'react';

function Pyramid({ tiles, selectedTiles, onTileClick }) {
  const tileRows = [];
  if (tiles && tiles.length === 10) {
    tileRows.push(tiles.slice(0, 4)); // Row 1: 4 tiles
    tileRows.push(tiles.slice(4, 7)); // Row 2: 3 tiles
    tileRows.push(tiles.slice(7, 9)); // Row 3: 2 tiles
    tileRows.push(tiles.slice(9, 10)); // Row 4: 1 tile
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
                {tile.operator} {tile.number}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Pyramid;
