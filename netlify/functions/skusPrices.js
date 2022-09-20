const fetch = require("node-fetch");
const axios = require("axios");

const API_ENDPOINT = "https://cat-fact.herokuapp.com/facts";

exports.handler = async (event, context) => {
    
  const data = await JSON.parse(event.body);
  var axios = require("axios");
  var axiosData = JSON.stringify({
    iduser: data.iduser,
    items: data.items,
  });

  var config = {
    method: "post",
    url: "http://94.138.173.164:9090/syncsocaf/api/discount",
    headers: {
      Authorization:
        "Basic ZGF0b2Ntc3VzZXI6NWJiZjA5NzM3YTQ3YjhkMDFhMjE0N2I0NjM1OWNlODY=",
      "Content-Type": "application/json",
    },
    data: axiosData,
  };

  return await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return {
        statusCode: 200,
        body: JSON.stringify(response.data),
      };
    })
    .catch(function (error) {
      // console.log("error.data",error)
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error),
      };
    });
};
