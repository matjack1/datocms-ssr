const { schedule } = require("@netlify/functions");
const fetch = require("cross-fetch");

// This is a sample build hook URL
const BUILD_HOOK =
  "https://api.netlify.com/build_hooks/6349250a2c99550eae6aa695";

const handler = async function (event, context) {
  console.log("RUN FUNCTION");
  await fetch(BUILD_HOOK, {
    method: "POST",
  }).then((response) => {
    console.log("Build hook response:", response);
  });

  return {
    statusCode: 200,
  };
};

exports.handler = schedule("*/15 * * * *", handler);
