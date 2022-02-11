import React from 'react';
import Tag from './Tag';

type Props = {
  tags: string[];
  onTagClick: (tag: string) => void;
};

const Tags = ({ tags, onTagClick }: Props) => (
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
