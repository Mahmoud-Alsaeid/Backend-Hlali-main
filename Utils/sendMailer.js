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
      user: "keetup.agency@gmail.com",
      pass: "Keetup@2023",
    },
  });

  const sendEmail = await transporter.sendMail({
    from:  "keetup.agency@gmail.com",
    to: email,
    subject: "forget password",
    text: " your code ",
    html: `<b>${code}</b>`,
  });

  let user = await User.findOneAndUpdate({ email: email }, { code: code });
  return sendEmail;
};
