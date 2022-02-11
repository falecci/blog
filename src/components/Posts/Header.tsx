import React from 'react';
import { Link } from 'gatsby';
import { rhythm } from '../../utils/typography';
import { colors } from '../../constants/styles';

type Props = {
  slug: string;
  title: string;
  date: string;
  timeToRead: number;
};

const Header = ({ slug, title, date, timeToRead }: Props) => (
  <header>
    <h2
      style={{
        marginBottom: rhythm(1 / 4),
      }}
    >
      <Link style={{ boxShadow: `none`, color: colors.orange }} to={slug}>
        {title}
      </Link>
    </h2>
    <small
      style={{
        color: colors.dark,
      }}
    >
      {date} 📖 {timeToRead} min read
    </small>
  </header>
);

export default Header;
