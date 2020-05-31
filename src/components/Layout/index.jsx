import React, { useState, useEffect } from 'react';

import { rhythm } from '../../utils/typography';
import Bio from '../Bio';
import Header from './Header';
import useIsSmallDisplay from '../useIsSmallDisplay';

const Layout = ({ location, title, children, isBioVisible }) => {
  const isSmallDisplay = useIsSmallDisplay();

  let containerStyles = {
    background: '#ececec',
    display: 'flex',
    minHeight: '100vh',
  };

  if (isSmallDisplay) {
    containerStyles = { ...containerStyles, flexDirection: 'column' };
  }

  return (
    <div style={containerStyles}>
      {isBioVisible && <Bio />}
      <div
        style={{
          marginLeft: !isBioVisible || isSmallDisplay ? 'auto' : 0,
          marginRight: 'auto',
          maxWidth: rhythm(24),
          padding: `2.625rem ${rhythm(3 / 4)}`,
          paddingTop: isSmallDisplay ? '0' : rhythm(3 / 4),
        }}
      >
        {!isSmallDisplay && (
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
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
