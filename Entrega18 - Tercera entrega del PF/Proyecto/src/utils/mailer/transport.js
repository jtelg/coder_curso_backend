import { createTransport } from "nodemailer";

const adminMail = "jtelgarecz@gmail.com";

const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: adminMail,
    pass: "yuqiafufavixbnca",
  },
});

export default transporter;
