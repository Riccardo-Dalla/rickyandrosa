import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM || "Rosa & Riccardo <hello@rickyandrosa.com>";
const SITE_URL = "https://rickyandrosa.com";

function layout(content: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF7F2;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <!-- Header -->
        <tr><td style="text-align:center;padding-bottom:32px;">
          <img src="https://media.rickyandrosa.com/rr-logo-gold.png" alt="R&R" width="120" height="60" style="display:inline-block;width:120px;height:60px;" />
          <p style="margin:8px 0 0;font-size:11px;color:#6B6259;">June 19, 2027 &middot; Bologna, Italy</p>
        </td></tr>
        <!-- Divider -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <div style="width:40px;height:1px;background-color:#C5A47E;display:inline-block;"></div>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:0 8px;text-align:center;">
          ${content}
        </td></tr>
        <!-- Footer divider -->
        <tr><td style="padding:40px 0 24px;text-align:center;">
          <div style="width:40px;height:1px;background-color:#E5DFD7;display:inline-block;"></div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="text-align:center;padding-bottom:20px;">
          <a href="${SITE_URL}" style="font-size:11px;color:#C5A47E;text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">rickyandrosa.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendCommitmentEmail(
  name: string,
  email: string,
  activityName: string
) {
  const html = layout(`
    <h1 style="margin:0 0 16px;font-size:26px;font-weight:300;color:#2C2C2C;letter-spacing:0.02em;">
      You're Committed!
    </h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#6B6259;font-family:-apple-system,sans-serif;">
      Hi ${name}, thanks for committing to <strong style="color:#2C2C2C;">${activityName}</strong>.
      We love that you're taking this on!
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#6B6259;font-family:-apple-system,sans-serif;">
      We'll send you a friendly reminder every 3 months until you've completed it.
      When you do, head to the feed and share your experience!
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:28px auto;">
      <tr><td style="background-color:#2C2C2C;padding:14px 32px;">
        <a href="${SITE_URL}/reverse-registry/feed" style="color:#FFFFFF;text-decoration:none;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:-apple-system,sans-serif;">
          View the Feed
        </a>
      </td></tr>
    </table>
  `);

  await resend.emails.send({
    from,
    to: email,
    subject: `You're committed to ${activityName}!`,
    html,
  });
}

export async function sendCompletionEmail(
  name: string,
  email: string,
  activityName: string
) {
  const html = layout(`
    <h1 style="margin:0 0 16px;font-size:26px;font-weight:300;color:#2C2C2C;letter-spacing:0.02em;">
      Well Done!
    </h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#6B6259;font-family:-apple-system,sans-serif;">
      Congratulations ${name}! You've completed <strong style="color:#2C2C2C;">${activityName}</strong>.
      We're so happy you followed through.
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#6B6259;font-family:-apple-system,sans-serif;">
      Your experience is now visible on the live feed for everyone to see.
      No more reminders for this one!
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:28px auto;">
      <tr><td style="background-color:#2C2C2C;padding:14px 32px;">
        <a href="${SITE_URL}/reverse-registry/feed" style="color:#FFFFFF;text-decoration:none;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:-apple-system,sans-serif;">
          See Your Experience
        </a>
      </td></tr>
    </table>
  `);

  await resend.emails.send({
    from,
    to: email,
    subject: `You completed ${activityName}!`,
    html,
  });
}

export async function sendReminderEmail(
  name: string,
  email: string,
  activityName: string
) {
  const html = layout(`
    <h1 style="margin:0 0 16px;font-size:26px;font-weight:300;color:#2C2C2C;letter-spacing:0.02em;">
      Friendly Reminder
    </h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#6B6259;font-family:-apple-system,sans-serif;">
      Hi ${name}, remember when you committed to <strong style="color:#2C2C2C;">${activityName}</strong>?
      Just checking in to see if you've had a chance to do it yet!
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#6B6259;font-family:-apple-system,sans-serif;">
      When you complete it, visit the feed and mark it as done.
      We'd love to see a photo of your adventure!
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:28px auto;">
      <tr><td style="background-color:#2C2C2C;padding:14px 32px;">
        <a href="${SITE_URL}/reverse-registry/feed" style="color:#FFFFFF;text-decoration:none;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:-apple-system,sans-serif;">
          I Did It!
        </a>
      </td></tr>
    </table>
  `);

  await resend.emails.send({
    from,
    to: email,
    subject: `Reminder: Have you done ${activityName} yet?`,
    html,
  });
}
