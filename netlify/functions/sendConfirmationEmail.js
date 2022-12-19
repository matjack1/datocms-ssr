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
    to: data.data.attributes.customer_email,
    // bcc: 'n.lazzaroni@multi-consult.it',
    subject: `Ordine #${data.data.attributes.number} preso in carico da Socaf`,
    html: `<p>
      L'ordine <b>#${data.data.attributes.number}</b> è stato preso in carico.<br>
      Riceverai un'email di conferma all'approvazione dell'ordine all'indirizzo: ${data.data.attributes.customer_email}<br><br>
      Per assistenza inviare un'email all'indirizzo info@socaf.it<br>
      </p>`,
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
