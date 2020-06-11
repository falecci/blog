import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
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

  const socialURLs = {
    Twitter: `https://mobile.twitter.com/${social.twitter}`,
    Github: `https://github.com/${social.github}`,
    Email: `mailto:${social.email}`,
    LinkedIn: `https://linkedin.com/in/${social.linkedIn}`,
  };

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
          <a
            title="Twitter"
            className="social-anchor"
            href={socialURLs.Twitter}
          >
            <TwitterIcon className="social-icon" />
          </a>

          <a
            title="LinkedIn"
            className="social-anchor"
            href={socialURLs.LinkedIn}
          >
            <LinkedInIcon className="social-icon" />
          </a>

          <a title="Github" className="social-anchor" href={socialURLs.Github}>
            <GithubIcon className="social-icon" />
          </a>

          <a title="Email" className="social-anchor" href={socialURLs.Email}>
            <EmailIcon className="social-icon" />
          </a>
        </div>
      </div>
      <div className="vertical-divider" />
    </>
  );
};

export default Bio;
