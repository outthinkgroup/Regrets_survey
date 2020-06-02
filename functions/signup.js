exports.handler = async (event, context) => {
  /* console.log(event);
  const { email } = JSON.parse(event.body);
  addUserToList(email)
  .catch(e){
    handleMailChimpError(e)
  } */

  // return message
  //
  return {
    statusCode: 200,
    body: JSON.stringify({ message: email }),
  };
};
async function addUserToList(e) {}
