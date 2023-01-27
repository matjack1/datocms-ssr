const sgMail = require("@sendgrid/mail");
const axios = require("axios");

sgMail.setApiKey(
  "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"
);

exports.handler = async function (event, context) {
  const data = await JSON.parse(event.body);
  // console.log("data",data)
  var access_token_config = {
    method: "post",
    url: "https://socaf-s-p-a.commercelayer.io/oauth/token?grant_type=client_credentials&client_id=UKgjC82fqYQT2E7nfoEVPmrjcmqd34mMtmqtV671nRo&client_secret=vOhfJBGqZwrhQSpG8etIfjKFrvhPEGYfoTpCC5q4ihA",
    headers: {},
  };

  return await axios(access_token_config)
    .then(async function (response) {
      let access_token = response.data.access_token;

      var customer_reset_password_call_data = JSON.stringify({
        data: {
          type: "customer_password_resets",
          id: data.id,
          attributes: {
            _reset_password_token: data.token,
            customer_password: data.password,
          },
        },
      });
      
      // console.log("customer_reset_password_call_data",customer_reset_password_call_data)

      var customer_reset_password_call_config = {
        method: "patch",
        url: `https://socaf-s-p-a.commercelayer.io/api/customer_password_resets/${data.id}`,
        headers: {
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/vnd.api+json",
        },
        data: customer_reset_password_call_data,
      };

      return await axios(customer_reset_password_call_config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          return {
            statusCode: 200,
            body: "Success",
          };
        })
        .catch(function (error) {
          console.log("reset_password",error.response.status,error.response.data);
          return {
            statusCode: error.response.status,
            body: JSON.stringify(error),
          };
        });
    })
    .catch(function (error) {
      console.log("access_token",error.response.status);
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error),
      };
    });

  //   const msg = {
  //     to: "a.asofii@multi-consult.it",
  //     from: "no-reply@multi-consult.it",
  //     //bcc: 'n.lazzaroni@multi-consult.it',
  //     subject: `Socaf - Password dimenticata`,
  //     html: `<p>E' stata richiesta la modifica della password!</p><br>
  //     <p>Se non hai fatto questa richiesta, ignora questa e-mail.</p><br>
  //     <p>ltrimenti, clicca su questo link per cambiare la tua password: [link].</p><br>`,
  //   };

  //   return sgMail
  //     .send(msg)
  //     .then(() => {
  //       return {
  //         statusCode: 200,
  //         body: "Success",
  //       };
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
};
