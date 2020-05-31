import React, { useState } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import Posts from '../components/Posts';
import SEO from '../components/SEO';
import Tags from '../components/Tags';

const MINIMUM_SEARCH_LENGTH = 2;

const filterByTag = (postTags, selectedTags) =>
  postTags.some((t) => selectedTags.includes(t)) || selectedTags.length === 0;

const filterByTitle = (title, filter) =>
  (filter.length >= MINIMUM_SEARCH_LENGTH &&
    title.toLowerCase().includes(filter.toLowerCase())) ||
  filter.length <= MINIMUM_SEARCH_LENGTH;

const BlogIndex = ({ data, location }) => {
  const { title } = data.site.siteMetadata;
  const tags = data.tagsGroup.group.map((g) => g.fieldValue);

  const [selectedTags, setSelectedTags] = useState([]);
  const [filter, setFilter] = useState('');

  const handleOnTagClick = (tag) => {
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
  query($langKey: String!) {
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
