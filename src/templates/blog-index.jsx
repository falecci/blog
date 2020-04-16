import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';
import { colors } from '../constants/styles';

const BlogIndex = ({ data, location }) => {
  const { title, social } = data.site.siteMetadata;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={title}>
      <SEO title="All posts" />
      <Bio />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug;
        const { timeToRead } = node;

        return (
          <article key={node.fields.slug}>
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link
                  style={{ boxShadow: `none`, color: colors.orange }}
                  to={node.fields.slug}
                >
                  {title}
                </Link>
              </h3>
              <small
                style={{
                  color: colors.gray,
                }}
              >
                {node.frontmatter.date} 📖 {timeToRead} min read
              </small>
            </header>
            <section>
              <p
                style={{
                  color: colors.gray,
                }}
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
          </article>
        );
      })}
      <footer>
        <a
          style={{ color: colors.orange }}
          href={`https://mobile.twitter.com/${social.twitter}`}
        >
          Twitter
        </a>{' '}
        #{' '}
        <a
          style={{ color: colors.orange }}
          href={`https://github.com/${social.github}`}
        >
          Github
        </a>{' '}
        #
      </footer>
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query($langKey: String!) {
    site {
      siteMetadata {
        title
        description
        social {
          twitter
          github
        }
      }
    }
    allMarkdownRemark(
      filter: { fields: { langKey: { eq: $langKey } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
            langKey
          }
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
