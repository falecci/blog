const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const { supportedLanguages } = require('./i18n');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.jsx');

    // Create index pages for all supported languages
    Object.keys(supportedLanguages).forEach((langKey) => {
      createPage({
        path: langKey === 'en' ? '/' : `/${langKey}/`,
        component: path.resolve('./src/templates/blog-index.jsx'),
        context: {
          langKey,
        },
      });
    });

    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  fields {
                    slug
                    langKey
                    directoryName
                  }
                  frontmatter {
                    title
                  }
                }
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
          return;
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;

        const translationsByDirectory = _.reduce(
          posts,
          (result, post) => {
            const directoryName = _.get(post, 'node.fields.directoryName');
            const langKey = _.get(post, 'node.fields.langKey');

            if (directoryName && langKey && langKey !== 'en') {
              (result[directoryName] || (result[directoryName] = [])).push(
                langKey
              );
            }

            return result;
          },
          {}
        );

        const defaultLangPosts = posts.filter(
          ({ node }) => node.fields.langKey === 'en'
        );
        _.each(defaultLangPosts, (post, index) => {
          const previous =
            index === defaultLangPosts.length - 1
              ? null
              : defaultLangPosts[index + 1].node;
          const next = index === 0 ? null : defaultLangPosts[index - 1].node;

          const translations =
            translationsByDirectory[_.get(post, 'node.fields.directoryName')] ||
            [];

          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
              translations,
              translatedLinks: [],
            },
          });

          const otherLangPosts = posts.filter(
            ({ node }) => node.fields.langKey !== 'en'
          );
          _.each(otherLangPosts, (post) => {
            const translations =
              translationsByDirectory[_.get(post, 'node.fields.directoryName')];

            // Record which links to internal posts have translated versions
            // into this language. We'll replace them before rendering HTML.
            let translatedLinks = [];

            createPage({
              path: post.node.fields.slug,
              component: blogPost,
              context: {
                slug: post.node.fields.slug,
                translations,
                translatedLinks,
              },
            });
          });
        });
      })
    );
  });
};

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (_.get(node, 'internal.type') === `MarkdownRemark`) {
    createNodeField({
      node,
      name: 'directoryName',
      value: path.basename(path.dirname(_.get(node, 'fileAbsolutePath'))),
    });
  }
};
