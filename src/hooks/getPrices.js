import axios from "axios";

export default async function getPrices(data) {
  return await axios
    .post("/.netlify/functions/skusPrices", data)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
}
