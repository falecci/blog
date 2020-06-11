import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import LocaleSwitcher from '../components/LocaleSwitcher';
import SEO from '../components/SEO';

import { colors } from '../constants/styles';
import { getAbsoluteSlug } from '../utils/slug';
import { rhythm, scale } from '../utils/typography';

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { translations } = pageContext;
  const { frontmatter, timeToRead, fields, excerpt, html } = post;
  const { title, description, thumbnail, date } = frontmatter;
  const { langKey, slug } = fields;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={title}
        description={description || excerpt}
        thumbnail={thumbnail}
      />
      <article>
        <header>
          <h1 className="post-title">{title}</h1>
          <p
            style={{
              ...scale(-1 / 5),
              color: colors.dark,
              display: `block`,
              marginBottom: !!translations.length ? 0 : '1.75rem',
            }}
          >
            {date} 📖 {timeToRead} min read
          </p>
          {!!translations.length && (
            <p
              style={{
                ...scale(-1 / 5),
                color: colors.dark,
              }}
            >
              Also in{' '}
              <LocaleSwitcher
                currentLocale={langKey}
                locales={translations}
                slug={getAbsoluteSlug(slug)}
              />
            </p>
          )}
        </header>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            color: colors.dark,
          }}
        />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
      </article>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      timeToRead
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        thumbnail {
          childImageSharp {
            sizes(maxWidth: 600) {
              ...GatsbyImageSharpSizes
            }
          }
        }
      }
      fields {
        slug
        langKey
      }
    }
  }
`;
