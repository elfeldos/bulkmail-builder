import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://bulkmail-builder.vercel.app", "http://localhost:3000", "https://bulkmail-builder-k8p3eijw9-elfeldos-projects.vercel.app/"],
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.post("/api/send-emails", async (req, res) => {
  const { recipients, subject, body, smtp } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: parseInt(smtp.port),
      secure: smtp.port === "465",
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    });

    let successCount = 0;
    const failedEmails: string[] = [];

    for (let i = 0; i < recipients.length; i += 5) {
      const batch = recipients.slice(i, i + 5);

      await Promise.all(
        batch.map(async (recipient: Record<string, string>) => {
          try {
            let personalizedBody = body;
            Object.entries(recipient).forEach(([key, value]) => {
              personalizedBody = personalizedBody.replace(
                new RegExp(`{{${key}}}`, "g"),
                value
              );
            });

            await transporter.sendMail({
              from: smtp.from,
              to: recipient.email,
              subject,
              html: personalizedBody,
            });

            successCount++;
          } catch (error) {
            failedEmails.push(recipient.email);
            console.error(`Failed to send to ${recipient.email}:`, error);
          }
        })
      );

      if (i + 5 < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    res.json({
      success: true,
      successCount,
      failedCount: failedEmails.length,
      failedEmails,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
