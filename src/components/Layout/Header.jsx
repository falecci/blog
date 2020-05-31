import React from 'react';
import { Link } from 'gatsby';

import { scale } from '../../utils/typography';
import { colors } from '../../constants/styles';

const Header = ({ location, title }) => {
  const rootPath = `${__PATH_PREFIX__}/`;

  const titleLink = (
    <Link
      style={{
        boxShadow: 'none',
        textDecoration: 'none',
        color: colors.ocean,
      }}
      to={'/'}
    >
      {title} 🥃
    </Link>
  );

  if (location.pathname === rootPath) {
    return (
      <h1
        className="blog-title"
        style={{
          ...scale(0.75),
          marginBottom: 0,
          marginTop: 0,
        }}
      >
        {titleLink}
      </h1>
    );
  }

  return (
    <h2
      style={{
        fontFamily: 'Montserrat, sans-serif',
        marginTop: 0,
        marginBottom: 0,
        height: 42, // because
        lineHeight: '2.625rem',
      }}
    >
      {titleLink}
    </h2>
  );
};

export default Header;
