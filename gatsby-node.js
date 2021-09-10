const path = require("path");
exports.createPages = async function({ actions, graphql, reporter }) {
  const { createPage } = actions;
  // Creates a url in gatsby router for the netlify functions so it can hydrate
  const { data } = await graphql(
    `
      {
        allQualtricsData {
          nodes {
            results {
              regretList {
                id
                location {
                  country
                  state
                }
                regret
                age
                gender
              }
            }
          }
        }
      }
    `
  );

  const pageTemplate = path.resolve("src/templates/regret.js");
  data.allQualtricsData.nodes[0].results.regretList.forEach(
    ({ id, location, regret, age, gender }) => {
      createPage({
        path: `/regret/${id}`,
        component: pageTemplate,
        context: { id, location, regret, age, gender },
      });
    }
  );
};
