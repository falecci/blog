import React from 'react';
import Tag from './Tag';

const Tags = ({ tags, onTagClick }) => (
  <ul
    style={{
      listStyleType: 'none',
      marginTop: '2rem',
      marginLeft: 0,
    }}
  >
    {tags.map((tag) => (
      <Tag key={tag} onClick={onTagClick} tag={tag} />
    ))}
  </ul>
);

export default Tags;
