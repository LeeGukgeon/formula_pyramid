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

  useEffect(() => {
    const operators = ['+', '-', '*', '/'];
    const generatedHexagons: HexagonData[] = [];
    for (let i = 0; i < 10; i++) {
      generatedHexagons.push({
        id: `hex-${i}`,
        operator: operators[Math.floor(Math.random() * operators.length)],
        number: Math.floor(Math.random() * 10),
      });
    }
    setHexagons(generatedHexagons);
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
