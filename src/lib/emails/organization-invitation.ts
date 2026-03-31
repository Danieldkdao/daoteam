import { envServer } from "@/data/env/server";
import { transporter } from "./transporter";

type SendOrganizationInvitationProps = {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteUrl: string;
};

const EMAIL_THEME = {
  background: "#f6f8fc",
  surface: "#ffffff",
  text: "#28344d",
  mutedText: "#5f6d86",
  border: "#d8e1f0",
  primary: "#5a50f3",
  primaryForeground: "#FFFFFF",
  secondary: "#23b28a",
  accent: "#5bb7e8",
  badgeBackground: "#ecfdf7",
  noteBackground: "#f8faff",
  shadow: "0 24px 60px rgba(53, 70, 106, 0.12)",
};

const EMAIL_FONT_FAMILY =
  "'Outfit', Inter, 'Segoe UI', Helvetica, Arial, sans-serif";

export const sendOrganizationInvitation = async ({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteUrl,
}: SendOrganizationInvitationProps) => {
  const subject = `You're invited to join ${teamName} on DaoTeam`;
  const previewLine = `${invitedByUsername} invited you to join the ${teamName} workspace on DaoTeam.`;

  const text = [
    subject,
    "",
    previewLine,
    "",
    `Invited by: ${invitedByUsername} (${invitedByEmail})`,
    `Workspace: ${teamName}`,
    "",
    `Accept invitation: ${inviteUrl}`,
    "",
    "If you don't recognize this invitation, you can safely ignore this email.",
  ].join("\n");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        </style>
      </head>
      <body style="margin:0;padding:0;background:${EMAIL_THEME.background};font-family:${EMAIL_FONT_FAMILY};color:${EMAIL_THEME.text};">
        <div style="margin:0;padding:32px 16px;background:${EMAIL_THEME.background};font-family:${EMAIL_FONT_FAMILY};color:${EMAIL_THEME.text};">
          <div style="max-width:560px;margin:0 auto;background:${EMAIL_THEME.surface};border:1px solid ${EMAIL_THEME.border};border-radius:28px;overflow:hidden;box-shadow:${EMAIL_THEME.shadow};">
            <div style="padding:32px 32px 28px;background:linear-gradient(145deg, ${EMAIL_THEME.primary} 0%, ${EMAIL_THEME.accent} 100%);color:${EMAIL_THEME.primaryForeground};">
              <div style="display:inline-block;padding:7px 14px;border-radius:999px;background:${EMAIL_THEME.badgeBackground};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_THEME.secondary};">
                Workspace invitation
              </div>
              <h1 style="margin:18px 0 10px;font-size:32px;line-height:1.08;font-weight:800;color:${EMAIL_THEME.primaryForeground};">
                ${invitedByUsername} invited you to join ${teamName}
              </h1>
              <p style="margin:0;max-width:430px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.92);">
                Join your team on DaoTeam to start collaborating in the workspace and catch up on shared channels and threads.
              </p>
            </div>

            <div style="padding:32px;">
              <div style="margin:0 0 22px;padding:22px;border:1px solid ${EMAIL_THEME.border};border-radius:24px;background:${EMAIL_THEME.noteBackground};">
                <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_THEME.secondary};">
                  Invitation details
                </p>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:${EMAIL_THEME.text};">
                  <span style="font-weight:700;">Workspace:</span> ${teamName}
                </p>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:${EMAIL_THEME.text};">
                  <span style="font-weight:700;">Invited by:</span> ${invitedByUsername}
                </p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:${EMAIL_THEME.text};">
                  <span style="font-weight:700;">For email:</span> ${email}
                </p>
              </div>

              <a
                href="${inviteUrl}"
                style="display:inline-block;padding:15px 24px;border-radius:16px;background:${EMAIL_THEME.primary};color:${EMAIL_THEME.primaryForeground};font-size:15px;font-weight:700;line-height:1;text-decoration:none;box-shadow:0 14px 30px rgba(90, 80, 243, 0.24);"
              >
                Accept invitation
              </a>

              <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:${EMAIL_THEME.text};">
                If the button does not work, copy and paste this link into your browser:
              </p>
              <p style="margin:8px 0 0;font-size:14px;line-height:1.7;word-break:break-word;">
                <a href="${inviteUrl}" style="color:${EMAIL_THEME.primary};text-decoration:underline;">
                  ${inviteUrl}
                </a>
              </p>

              <div style="margin-top:24px;padding:16px 18px;border-radius:18px;background:${EMAIL_THEME.surface};border:1px solid ${EMAIL_THEME.border};">
                <p style="margin:0;font-size:14px;line-height:1.7;color:${EMAIL_THEME.mutedText};">
                  This invitation was sent by <span style="font-weight:700;color:${EMAIL_THEME.text};">${invitedByUsername}</span> (${invitedByEmail}). If you do not recognize this invitation, you can safely ignore this email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: envServer.SENDER_EMAIL,
    to: email,
    subject,
    html,
    text,
  });
};
