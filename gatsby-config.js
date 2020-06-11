module.exports = {
  siteMetadata: {
    title: `World Regret Survey`,
    description: `Regrets are a universal part of the human experience. All of us have something we wish we had done differently – or some action we wish we had taken or not taken.
For a book about regret, author Daniel H. Pink is collecting regrets from all over the world. This simple survey takes about 3 minutes. Your responses are anonymous. Please consider participating. We think you’ll find the experience interesting and meaningful.`,
    author: `Daniel Pink`,
    sharing: {
      twitter: {
        tweet: `I just completed The World Regret Survey! Check it out:`,
        url: `https://worldregretsurvey.com`,
      },
      facebook: {
        url: `https://worldregretsurvey.com`,
      },
      linkedIn: {
        url: `https://worldregretsurvey.com/?`,
      },
      email: {
        subject: `World Regret Survey`,
        body: `I just completed The World Regret Survey! Check it out:`,
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
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
      },
    }, // this is for turning the copy in markdown to html
    {
      //For Copy
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `World Regret Survey`,
        short_name: `World Regret Survey`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/dpicon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: `UA-5156258-2`,
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,

        defer: false,
      },
    },
  ],
};
