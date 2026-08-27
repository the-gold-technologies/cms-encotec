import nodemailer from "nodemailer";

export function getTransporter() {
  let smtpHost = process.env.SMTP_HOST;
  let smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
  let isSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
  let smtpUser = process.env.SMTP_USER;
  let smtpPass = process.env.SMTP_PASS;
  let fromAddress =
    process.env.SMTP_FROM || smtpUser || "Encotec Energy <jwel.inventory@tgtpartner.com>";

  if (!smtpHost || !smtpPass) {
    try {
      const fs = require("fs");
      const path = require("path");
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf8");
        const parseEnv = (key: string) => {
          const match = envContent.match(new RegExp(`^${key}=["']?([^"'\r\n]+)["']?`, "m"));
          return match ? match[1].trim() : undefined;
        };
        smtpHost = smtpHost || parseEnv("SMTP_HOST");
        const portVal = parseEnv("SMTP_PORT");
        if (portVal) smtpPort = parseInt(portVal, 10);
        smtpUser = smtpUser || parseEnv("SMTP_USER");
        smtpPass = smtpPass || parseEnv("SMTP_PASS");
        fromAddress =
          fromAddress ||
          parseEnv("SMTP_FROM") ||
          "Encotec Energy <jwel.inventory@tgtpartner.com>";
      }
    } catch (e) {}
  }

  if (smtpHost && smtpPass) {
    return {
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: isSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
      fromAddress,
    };
  }
  return null;
}
