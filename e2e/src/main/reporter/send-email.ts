import nodemailer from "nodemailer";

export async function sendReportEmail(messageContent: string): Promise<void> {
  // Create a transport object using SMTP
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: "hattriskenneth@gmail.com",
        pass: "oiasjaboajfpgkjo",
      },
    });

    // Define the recipients and attachment
    let recipients = ["specflowtool@gmail.com"];

    // Create the email message
    let message = {
      from: "specflowtool@gmail.com",
      to: recipients,
      subject: "Test Failures Recorded",
      text: messageContent,
    };

    // Send the email
    await transporter.sendMail(message);
    console.log("✔️  Email sent");
  } catch (error) {
    console.error(error);
  }
}
