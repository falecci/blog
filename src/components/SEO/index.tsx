import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

type Props = {
  description?: string;
  meta: any[];
  lang: string;
  title: string;
  thumbnail?: {
    childImageSharp: {
      fixed: string;
    };
  };
};

const SEO = ({ description, lang, meta, title, thumbnail }: Props) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
            title
            description
            social {
              twitter
            }
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;
  const imageSrc = thumbnail && thumbnail.childImageSharp.fixed;
  let origin = site.siteMetadata.siteUrl;
  if (typeof window !== 'undefined') {
    origin = window.location.origin;
  }
  const image = origin + imageSrc;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: 'og:image',
          content: image,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.social.twitter,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: 'twitter:image',
          content: image,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  );
};

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
