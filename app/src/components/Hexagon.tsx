import React from 'react';
import './Hexagon.css';

interface HexagonProps {
  id: string | number;
  operator: string;
  number: number;
  onClick: (id: string | number, operator: string, number: number) => void;
}

const Hexagon: React.FC<HexagonProps> = (props) => {
  const handleClick = () => {
    props.onClick(props.id, props.operator, props.number);
  };

  return (
    <div className="hexagon" onClick={handleClick}>
      <div className="hexagon-operator">{props.operator}</div>
      <div className="hexagon-number">{props.number}</div>
    </div>
  );
};

export default Hexagon;
