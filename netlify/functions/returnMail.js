var nodemailer = require("nodemailer");

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

  var msg = {
    from: "no-reply@socaf.it",
    to: "a.asofii@multi-consult.it",
    // bcc: 'n.lazzaroni@multi-consult.it',
    subject: `Richiesta di reso da Socaf.it E-commerce`,
    html: `<p>
    <b>Email: </b>${data.customer}<br>
    <b>Ordine #: </b>${data.order}<br>
    <b>Prodotti: </b><br>
    ${data.products.map((product) =>
      product.name + " - " + product.sku_code + " -  <br>"
    )}
    </p>
    <b>Messaggio: </b>${data.message}<br>
    `,
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
};
