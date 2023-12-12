const nodemailer = require("nodemailer");
const User  = require("../models/userModel");
const Random = require("crypto-random");

//
module.exports = async (email) => {
  //   const code = Random({ length: 10 });
  const code = 123456;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lilaalmalo1@gmail.com",
      pass: "La1234567",
    },
  });

  const sendEmail = await transporter.sendMail({
    from:  "lilaalmalo1@gmail.com",
    to: email,
    subject: "forget password",
    text: " your code ",
    html: `<b>${code}</b>`,
  });

  let user = await User.findOneAndUpdate({ email: email }, { code: code });
  return sendEmail;
};
