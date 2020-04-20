import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { supportedLanguages } from '../../../i18n';
import { colors } from '../../constants/styles';

const LocaleSwitcher = ({ currentLocale, locales, slug }) => {
  if (!locales.length) {
    return null;
  }

  const links = locales
    .filter((lang) => lang !== currentLocale)
    .map((lang, index, mLocales) => (
      <Fragment key={lang}>
        <Link style={{ color: colors.orange }} to={`/${lang}/${slug}`}>
          {supportedLanguages[lang]}
        </Link>
        {index < mLocales.length - 1 && ' | '}
      </Fragment>
    ));

  if (currentLocale !== 'en') {
    links.unshift(
      <Fragment key="en">
        <Link style={{ color: colors.orange }} to={`/${slug}`}>
          {supportedLanguages.en}
        </Link>{' '}
        {links.length >= 1 && ' | '}
      </Fragment>
    );
  }

  return links;
};

LocaleSwitcher.propTypes = {
  currentLocale: PropTypes.oneOf(Object.keys(supportedLanguages)),
  locales: PropTypes.arrayOf(PropTypes.string),
  slug: PropTypes.string,
};

LocaleSwitcher.defaultProps = {
  currentLocale: 'en',
  locales: [],
  slug: '/',
};

export default LocaleSwitcher;
