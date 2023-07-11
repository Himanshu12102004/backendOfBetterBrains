const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { generateOtp, saveOtp } = require("../helpers/generateAndSaveOTP");
const jwt = require("jsonwebtoken");

async function sendMail(user_id, email) {
  const credentials = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  };
  try {
    const oAuth2Client = new google.auth.OAuth2(
      credentials.CLIENT_ID,
      credentials.CLIENT_SECRET,
      credentials.REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: credentials.REFRESH_TOKEN });
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SMTP_EMAIL,
        clientId: credentials.CLIENT_ID,
        clientSecret: credentials.CLIENT_SECRET,
        refreshToken: credentials.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const otp = generateOtp();
    saveOtp(otp, email);
    const mailOptions = {
      from: "BetterBrains <betterbrains30@gmail.com>",
      to: email,
      subject: "OTP for brtter brains sign up",
      text: `Your otp for Better Brains signUp authentication is ${otp}`,
      html: `<h1>Your otp for Better Brains signUp authentication is${otp}</h1>`,
    };
    console.log("better brainsggigygigygyg");
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
module.exports = sendMail;
