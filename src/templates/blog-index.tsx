import React, { useState } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import Posts from '../components/Posts';
import SEO from '../components/SEO';
import Tags from '../components/Tags';

const MINIMUM_SEARCH_LENGTH = 2;

const filterByTag = (postTags: string[], selectedTags: string[]): boolean =>
  postTags.some((t) => selectedTags.includes(t)) || selectedTags.length === 0;

const filterByTitle = (title: string, filterCriteria: string): boolean =>
  (filterCriteria.length >= MINIMUM_SEARCH_LENGTH &&
    title.toLowerCase().includes(filterCriteria.toLowerCase())) ||
  filterCriteria.length <= MINIMUM_SEARCH_LENGTH;

type Props = {
  location: Location;
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
      };
    };
    allMarkdownRemark: {
      edges: {
        node: {
          fields: {
            slug: string;
            langKey: string;
          };
          timeToRead: number;
          excerpt: string;
          frontmatter: {
            date: string;
            title: string;
            description: string;
            thumbnail: {
              childImageSharp: {
                fixed: string;
              };
            };
            tags: string[];
          };
        };
      }[];
    };
    tagsGroup: {
      group: { fieldValue: string }[];
    };
  };
};

const BlogIndex = ({ data, location }: Props) => {
  const { title } = data.site.siteMetadata;
  const tags = data.tagsGroup.group.map((g) => g.fieldValue);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  const handleOnTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((s) => s !== tag));
      return;
    }

    setSelectedTags([...selectedTags, tag]);
  };

  const posts = data.allMarkdownRemark.edges.filter(
    (p) =>
      filterByTag(p.node.frontmatter.tags, selectedTags) &&
      filterByTitle(p.node.frontmatter.title, filter)
  );

  return (
    <Layout location={location} title={title} isBioVisible>
      <SEO title="All posts" />
      <Tags onTagClick={handleOnTagClick} tags={tags} />
      <input
        onChange={({ target }) => setFilter(target.value)}
        placeholder="Filter..."
        style={{
          border: 'none',
          borderRadius: '6px',
          height: '36px',
          paddingLeft: '10px',
          minWidth: '100%',
        }}
      />
      <Posts posts={posts} />
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query ($langKey: String!) {
    site {
      siteMetadata {
        title
        description
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
            tags
          }
        }
      }
    }
    tagsGroup: allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
      }
    }
  }
`;
