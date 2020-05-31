import React, { useState } from 'react';
import { colors } from '../../constants/styles';

const styles = {
  border: '1px solid transparent',
  borderRadius: '8px',
  color: '#fff',
  cursor: 'pointer',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  marginRight: '1rem',
  padding: '4px 16px',
  userSelect: 'none',
};

const Tag = ({ tag, onClick }) => {
  const [selected, setSelected] = useState(false);

  const handleOnTagClick = (tag) => {
    setSelected(!selected);
    onClick(tag);
  };

  return (
    <li
      onClick={() => handleOnTagClick(tag)}
      style={{
        backgroundColor: selected ? colors.orange : colors.lightGray,
        ...styles,
      }}
    >
      #{tag}
    </li>
  );
};

export default Tag;
