exports.createPages = async function({actions}){
  // Creates a url in gatsby router for the netlify functions so it can hydrate
  actions.createPage({
    path:`api/share-regret`, 
    component:require.resolve(`./src/pages/share-regret.js`),
  })
}

