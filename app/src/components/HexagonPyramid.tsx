import React, { useState, useEffect } from 'react';
import Hexagon from './Hexagon'; // Step 3: Import Hexagon component
import './HexagonPyramid.css';

// Define HexagonData interface
interface HexagonData {
  id: string;
  operator: string;
  number: number;
}

// Define HexagonPyramidProps interface
interface HexagonPyramidProps {
  onHexagonClick: (id: string | number, operator: string, number: number) => void;
}

const HexagonPyramid: React.FC<HexagonPyramidProps> = ({ onHexagonClick }) => {
  const [hexagons, setHexagons] = useState<HexagonData[]>([]);

  // Define the static array of 10 hexagon configurations
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
    { id: 'hex-9', operator: '-', number: 4 }, // Example, can be adjusted for variety
  ];

  useEffect(() => {
    setHexagons(staticHexagonData);
  }, []); // Empty dependency array means this runs once on mount

  // Function to render hexagons in rows for the pyramid
  const renderPyramid = () => {
    if (hexagons.length < 10) {
      return <p>Generating hexagons...</p>;
    }

    const rowsDefinition = [1, 2, 3, 4]; // Hexagons per row
    let hexagonIndex = 0;

    return rowsDefinition.map((hexagonsInRow, rowIndex) => (
      <div key={`row-${rowIndex}`} className="hexagon-row">
        {Array.from({ length: hexagonsInRow }).map((_, itemIndex) => {
          const hexagon = hexagons[hexagonIndex++];
          if (!hexagon) return null; // Should not happen if we have 10 hexagons
          return (
            <Hexagon
              key={hexagon.id}
              id={hexagon.id}
              operator={hexagon.operator}
              number={hexagon.number}
              onClick={onHexagonClick}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div className="hexagon-pyramid">
      {renderPyramid()}
    </div>
  );
};

export default HexagonPyramid;
