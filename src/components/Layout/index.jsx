import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Helmet from 'react-helmet';

import { rhythm, scale } from '../../utils/typography';
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
      🐈 {title} 🥃
    </Link>
  );

  if (location.pathname === rootPath) {
    return (
      <h1
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
    <h3
      style={{
        fontFamily: 'Montserrat, sans-serif',
        marginTop: 0,
        marginBottom: 0,
        height: 42, // because
        lineHeight: '2.625rem',
      }}
    >
      {titleLink}
    </h3>
  );
};

const Layout = ({ location, title, children }) => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(window.__theme);
    window.__onThemeChange = () => {
      setTheme(window.__theme);
    };
  }, []);

  return (
    <div
      style={{
        color: 'var(--textNormal)',
        background: '#222831',
        transition: 'color 0.2s ease-out, background 0.2s ease-out',
        minHeight: '100vh',
      }}
    >
      <Helmet
        meta={[
          {
            name: 'theme-color',
            content: theme === 'light' ? '#ffa8c5' : '#282c35',
          },
        ]}
      />
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: rhythm(24),
          padding: `2.625rem ${rhythm(3 / 4)}`,
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2.625rem',
          }}
        >
          <Header title={title} location={location} />
          <div style={{ height: '24px' }} />
        </header>
        {children}
      </div>
    </div>
  );
};

export default Layout;
