var mailer = require("nodemailer");

module.exports = function(to, subject, text, html) {
    var smtpTransport = mailer
        .createTransport('smtps://vrakashy0101%40gmail.com:vrakashy0102@smtp.gmail.com');

    var mail = {
        from: "VRakashy",
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response);
        }
        smtpTransport.close();
    });
};
