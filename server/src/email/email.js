import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : {
      emails: {
        send: async () => ({ id: "mock_resend_disabled" }),
      },
      templates: {
        get: async () => ({ id: "mock_template_disabled" }),
      },
    };

export async function sendSuccessEmail(
  userEmail,
  repoOwner,
  repoName,
  mode,
  commitSha,
  repoUrl,
) {
  try {
    await resend.emails.send({
      from: "LivingREADME <notifications@livingreadme.com>",
      to: userEmail,
      template: {
        id: process.env.SUCCESS_EMAIL_ID, // from step 1
        variables: {
          repoOwner,
          repoName,
          mode,
          commitSha,
          repoUrl,
        },
      },
    });
  } catch (error) {
    throw new Error(`Failed to send success email: ${error.message}`);
  }
}

export async function sendFailureEmail(
  userEmail,
  repoOwner,
  repoName,
  mode,
  errorMessage,
  repoUrl,
) {
  await resend.emails.send({
    from: "LivingREADME <notifications@livingreadme.com>",
    to: userEmail,
    template: {
      id: process.env.FAILED_EMAIL_ID,
      variables: {
        repoOwner,
        repoName,
        mode,
        errorMessage,
        repoUrl,
        runUrl: "https://app.livingreadme.com/logs",
      },
    },
  });
}
