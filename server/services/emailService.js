import nodemailer from "nodemailer";

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
} = process.env;

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
}

let transporter;
let transporterVerified = false;

function buildTransporter() {
  requireEnv("MAIL_HOST", MAIL_HOST);
  requireEnv("MAIL_PORT", MAIL_PORT);
  requireEnv("MAIL_USER", MAIL_USER);
  requireEnv("MAIL_PASS", MAIL_PASS);
  requireEnv("MAIL_FROM", MAIL_FROM);

  // IMPORTANT: MAIL_PORT MUST be a number.
  const port = Number(MAIL_PORT);
  if (Number.isNaN(port)) {
    throw new Error(`Invalid MAIL_PORT (must be a number). Received: ${MAIL_PORT}`);
  }

  // For common setups:
  // - Gmail SMTP typically uses port 465 (secure=true)
  // - Mailtrap SMTP often uses port 587 (secure=false, STARTTLS)
  const secure = port === 465;

  const debugEnabled = String(process.env.MAIL_SMTP_DEBUG || "true") === "true";

  transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port,
    secure,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
    // Helps avoid TLS handshake failures during debugging.
    // If you want strict verification later, set rejectUnauthorized=true.
    tls: {
      rejectUnauthorized: false,
    },
    logger: debugEnabled,
    debug: debugEnabled,
  });

  return transporter;
}

async function verifyTransporterOnce() {
  if (transporterVerified) return;
  if (!transporter) buildTransporter();

  try {
    console.log("SMTP VERIFY: transporter.verify() starting...");
    await transporter.verify();
    transporterVerified = true;
    console.log("SMTP READY: transporter.verify() succeeded");
  } catch (err) {
    console.error("SMTP ERROR: transporter.verify() failed:", err?.message || err);
    // Preserve exact error message for worker history.
    throw new Error(err?.message || String(err));
  }
}

export async function sendEmail({ to, subject, html, text, from }) {
  if (!to) throw new Error("sendEmail: 'to' is required");
  if (!subject) throw new Error("sendEmail: 'subject' is required");

  // Ensure credentials + SMTP connectivity are valid before sending.
  await verifyTransporterOnce();

  const mailFrom = from || MAIL_FROM;

  try {
    const info = await transporter.sendMail({
      from: mailFrom,
      to,
      subject,
      html,
      text,
    });

    console.log("Email sent successfully:", {
      messageId: info?.messageId,
      accepted: info?.accepted,
      rejected: info?.rejected,
    });

    return {
      ok: true,
      messageId: info?.messageId,
      accepted: info?.accepted,
      rejected: info?.rejected,
      envelope: info?.envelope,
    };
  } catch (err) {
    // Preserve exact nodemailer/SMTP error message.
    console.error("Email send failed:", err?.message || err);
    throw new Error(err?.message || String(err));
  }
}


