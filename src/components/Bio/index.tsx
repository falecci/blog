import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import TwitterIcon from '../../../content/assets/twitter.svg';
import LinkedInIcon from '../../../content/assets/linkedin.svg';
import GithubIcon from '../../../content/assets/github.svg';
import EmailIcon from '../../../content/assets/mail.svg';

import { rhythm } from '../../utils/typography';
import { colors } from '../../constants/styles';

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 96, height: 96) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          social {
            twitter
            github
            email
            linkedIn
          }
        }
      }
    }
  `);

  const { author, social } = data.site.siteMetadata;

  const socialURLs = [
    {
      href: `https://github.com/${social.github}`,
      Icon: GithubIcon,
      title: 'Github',
    },
    {
      href: `https://linkedin.com/in/${social.linkedIn}`,
      Icon: LinkedInIcon,
      title: 'LinkedIn',
    },
    {
      href: `https://mobile.twitter.com/${social.twitter}`,
      Icon: TwitterIcon,
      title: 'Twitter',
    },
    {
      href: `mailto:${social.email}`,
      Icon: EmailIcon,
      title: 'Email',
    },
  ];

  return (
    <>
      <div className="bio">
        <Image
          fixed={data.avatar.childImageSharp.fixed}
          alt={author}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            minWidth: 96,
            minHeight: 96,
            borderRadius: `100%`,
          }}
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
        <h3 style={{ marginTop: '2rem', color: colors.orange }}>
          Federico Alecci
        </h3>
        <p
          style={{
            color: colors.dark,
          }}
        >
          Hi there! My name is Fede and I write about coding and some other
          stuff too. I'm really into JavaScript stack, with React on the
          frontend and Node with Serverless. {`\n`}
          On my free time, I love drinking whisky, reading, playing some
          videogames, and petting my cat.
        </p>

        <div className="social-icons-container">
          {socialURLs.map(({ title, href, Icon }) => (
            <a className="social-anchor" title={title} href={href}>
              <Icon className="social-icon" />
            </a>
          ))}
        </div>
      </div>
      <div className="vertical-divider" />
    </>
  );
};

export default Bio;
