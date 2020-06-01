module.exports = {
  siteMetadata: {
    title: `World Regret Survey`,
    description: ``,
    author: ``,
    sharing: {
      twitter: {
        tweet: `take this really cool survey`,
        url: `https://worldregretsurvey.com`,
      },
      facebook: {
        url: `https://worldregretsurvey.com`,
      },
      linkedIn: {
        url: `https://worldregretsurvey.com`,
      },
      email: {
        subject: `World Regret Survey`,
        body: `take this really cool survey`,
        url: `https://worldregretsurvey.com`,
      },
    },
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: `QualtricsData`,
      },
    },
    {
      //For JSON Data
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/data`,
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
