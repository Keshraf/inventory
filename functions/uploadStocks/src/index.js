const sdk = require("node-appwrite");

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();

  // You can remove services you don't use
  const database = new sdk.Databases(client);

  if (
    !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
    !req.variables["APPWRITE_FUNCTION_API_KEY"]
  ) {
    console.warn(
      "Environment variables are not set. Function cannot use Appwrite SDK."
    );
    res.json({
      success: false,
    });
  } else {
    client
      .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
      .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
      .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"])
      .setSelfSigned(true);

    const reqData = JSON.parse(req.payload);

    console.log(reqData);

    await Promise.all(
      reqData.data.map((stock) => {
        return database.createDocument(
          reqData.databaseId,
          reqData.collectionId,
          stock.id,
          {
            mill: stock.mill,
            quality: stock.quality,
            quantity: stock.quantity,
            dateAdded: reqData.date,
            breadth: stock.breadth,
            length: stock.length,
            gsm: stock.gsm,
            sheets: stock.sheets,
            weight: stock.weight,
          }
        );
      })
    )
      .then((result) => {
        res.json({
          success: true,
          result: result,
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          error: error,
        });
      });
  }
};
