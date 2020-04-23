import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { rhythm, scale } from '../utils/typography';
import LocaleSwitcher from '../components/LocaleSwitcher';
import { getAbsoluteSlug } from '../utils/slug';
import { colors } from '../constants/styles';

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { previous, next, translations } = pageContext;
  const { frontmatter, timeToRead, fields, excerpt, html } = post;
  const { langKey, slug } = fields;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description || excerpt}
        thumbnail={frontmatter.thumbnail}
      />
      <article>
        <header>
          <h1
            style={{
              color: colors.orange,
              marginTop: rhythm(1),
              marginBottom: 0,
            }}
          >
            {frontmatter.title}
          </h1>
          <p
            style={{
              ...scale(-1 / 5),
              color: colors.gray,
              display: `block`,
              marginBottom: !!translations.length ? 0 : '1.75rem',
            }}
          >
            {frontmatter.date} 📖 {timeToRead} min read
          </p>
          {!!translations.length && (
            <p
              style={{
                ...scale(-1 / 5),
                color: colors.gray,
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
            color: colors.gray,
          }}
        />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link
                to={previous.fields.slug}
                style={{ color: colors.orange }}
                rel="prev"
              >
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link
                to={next.fields.slug}
                style={{ color: colors.orange }}
                rel="next"
              >
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
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
