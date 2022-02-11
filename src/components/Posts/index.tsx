import React from 'react';
import Header from './Header';
import { colors } from '../../constants/styles';

type Props = {
  posts: {
    node: {
      frontmatter: {
        title: string;
        date: string;
        description: string;
        thumbnail: {
          childImageSharp: {
            fixed: string;
          };
        };
      };
      fields: {
        slug: string;
        langKey: string;
      };
      timeToRead: number;
      excerpt: string;
    };
  }[];
};

const Posts = ({ posts }: Props) => (
  <div>
    {posts.map(({ node }) => {
      const { frontmatter, fields, timeToRead, excerpt } = node;
      const title = frontmatter.title || fields.slug;

      return (
        <article key={fields.slug}>
          <Header
            slug={fields.slug}
            date={frontmatter.date}
            timeToRead={timeToRead}
            title={title}
          />
          <section>
            <div
              style={{
                color: colors.dark,
              }}
              dangerouslySetInnerHTML={{
                __html: frontmatter.description || excerpt,
              }}
            />
          </section>
        </article>
      );
    })}
  </div>
);

export default Posts;
