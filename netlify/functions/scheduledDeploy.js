import fetch from "node-fetch";

// This is a sample build hook URL
const BUILD_HOOK =
  "https://api.netlify.com/build_hooks/6349250a2c99550eae6aa695";

// Schedules the handler function to run at midnight on
// Mondays, Wednesday, and Friday

const { schedule } = require("@netlify/functions");

const handler = async function (event, context) {
  console.log("Received event:", event);

  return {
    statusCode: 200,
  };
};

exports.handler = schedule("* * * * *", handler);
// const handler = schedule("* * * * *", async () => {
//   console.log("RUN FUNCTION");
//   await fetch(BUILD_HOOK, {
//     method: "POST",
//   }).then((response) => {
//     console.log("Build hook response:", response);
//   });

//   return {
//     statusCode: 200,
//   };
// });

// export { handler };
