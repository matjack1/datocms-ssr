var nodemailer = require("nodemailer");
const axios = require("axios");

exports.handler = async function (event, context) {
  const data = await JSON.parse(event.body);
  var transport = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "no-reply@socaf.it",
      pass: "Socaf2020",
    },
    secureConnection: false,
    tls: { ciphers: "SSLv3" },
  });

  var access_token_config = {
    method: "post",
    url: "https://socaf-s-p-a.commercelayer.io/oauth/token?grant_type=client_credentials&client_id=UrrIiXW1_p3FB5Ia9-HYk_bOhxGR5UuO2P0G_cUyWiQ&client_secret=fW3p4zvdJ1FH4uKntJULH7GJSuPTvfSSOQx98kHiAAI",
    headers: {},
  };

  return await axios(access_token_config)
    .then(async function (response) {
      let access_token = response.data.access_token;

      var create_reset_data = JSON.stringify({
        data: {
          type: "customer_password_resets",
          attributes: {
            customer_email: data.email,
          },
        },
      });

      var create_reset_config = {
        method: "post",
        url: "https://socaf-s-p-a.commercelayer.io/api/customer_password_resets",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${access_token}`,
        },
        data: create_reset_data,
      };

      return await axios(create_reset_config)
        .then(async function (response) {
          const resetData = response.data.data;
          const id = resetData.id;
          const token = resetData.attributes.reset_password_token;
          const link = `https://shop.socaf.it/reset-password?id=${id}&token=${token}`;

          var msg = {
            from: "no-reply@socaf.it",
            to: resetData.attributes.customer_email,
            // bcc: 'n.lazzaroni@multi-consult.it',
            subject: `Socaf - Password dimenticata`,
            html: `<p>E' stata richiesta la modifica della password!<br>  Se non hai fatto questa richiesta, ignora questa e-mail.<br>
            Altrimenti, clicca su questo link per cambiare la tua password: <br> 
              <a href="${link}">
                ${link}
              </a>
            </p>
            <br>`,
          };

          return await transport
            .sendMail(msg)
            .then(() => {
              return {
                statusCode: 200,
                body: "Success",
              };
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
};
