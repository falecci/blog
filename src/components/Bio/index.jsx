import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Image from 'gatsby-image';
import TwitterIcon from '../../../content/assets/twitter.svg';
import LinkedInIcon from '../../../content/assets/linkedin.svg';
import GithubIcon from '../../../content/assets/github.svg';
import EmailIcon from '../../../content/assets/mail.svg';

import { rhythm } from '../../utils/typography';
import { colors } from '../../constants/styles';
import useIsSmallDisplay from '../useIsSmallDisplay';

const ICON_STYLES = { width: 32, height: 32, fill: colors.orange };
const ANCHOR_STYLES = { boxShadow: `none`, textDecoration: 'none' };

const VerticalDivider = () => (
  <div
    style={{
      border: '1px solid linear-gradient(180deg,#e6e6e6 0,#e6e6e6 48%,#fff)',
      marginLeft: '24px',
      borderImage: `linear-gradient( to bottom, ${colors.orange}, rgba(0, 0, 0, 0) ) 1 100%`,
      borderWidth: '1px',
      borderStyle: 'solid',
      flexDirection: 'column',
      height: '26rem',
      marginTop: '2.625rem',
      marginRight: '1.3125rem',
    }}
  />
);

const Bio = () => {
  const isSmallDisplay = useIsSmallDisplay();
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

  const sectionPadding = isSmallDisplay
    ? `2.625rem ${rhythm(3 / 4)} 0 ${rhythm(3 / 4)}`
    : `2.625rem 0 0 ${rhythm(3 / 4)}`;

  return (
    <>
      <div
        style={{
          display: `flex`,
          flexDirection: 'column',
          marginLeft: isSmallDisplay ? 'auto' : '10%',
          marginRight: isSmallDisplay ? 'auto' : '12px',
          maxWidth: '42rem',
          padding: sectionPadding,
          width: isSmallDisplay ? '100%' : '20%',
        }}
      >
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
          frontend and Node with Serverless. On my free time, I love drinking
          whisky, reading, playing some videogames, and petting my cat.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: !isSmallDisplay ? '80%' : '50%',
          }}
        >
          <a title="Twitter" style={ANCHOR_STYLES} href={socialURLs.Twitter}>
            <TwitterIcon style={ICON_STYLES} />
          </a>

          <a title="LinkedIn" style={ANCHOR_STYLES} href={socialURLs.LinkedIn}>
            <LinkedInIcon style={ICON_STYLES} />
          </a>

          <a title="Github" style={ANCHOR_STYLES} href={socialURLs.Github}>
            <GithubIcon style={ICON_STYLES} />
          </a>

          <a title="Email" style={ANCHOR_STYLES} href={socialURLs.Email}>
            <EmailIcon style={ICON_STYLES} />
          </a>
        </div>
      </div>
      {!isSmallDisplay && <VerticalDivider />}
    </>
  );
};

export default Bio;
