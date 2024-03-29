import React from 'react';

import Bio from '../Bio';
import Header from './Header';

type Props = {
  title: string;
  isBioVisible?: boolean;
  location: Location;
};

const Layout: React.FC<Props> = ({
  location,
  title,
  isBioVisible,
  children,
}) => {
  return (
    <div className="container">
      {isBioVisible && <Bio />}
      <div className={`articles ${isBioVisible && 'articles-with-bio'}`}>
        <header className="blog-title">
          <Header title={title} location={location} />
          <div style={{ height: '24px' }} />
        </header>
        {children}
      </div>
    </div>
  );
};

export default Layout;
