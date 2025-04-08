export const businessWelcomeTemplate = ({
  name,
  otp,
}: {
  name: string;
  otp: string;
}): string => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DJENGO | Verify Your E-Mail Address</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Questrial&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=mail"
    />
    <style>
          .mail-section {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      }
      .mail-section::before,
      .mail-section::after {
        content: '';
        flex: 1;
        height: 1px;
        background-color: #ccc;
        margin: 0 10px;
      }</style>
  </head>
  <body style="margin: 0; padding: 32px 16px; background-color: #f0f0f0; font-family: Arial, sans-serif;">
    <table
      align="center"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px;"
    >
      <tr>
        <td style="padding: 20px; text-align: center;">
          <!-- Logo Section -->
          <table align="center" cellpadding="0" cellspacing="0">
            <tr>
              <td style="text-align: center;">
                <img
                  src="djengo-logo.png"
                  alt="Logo"
                  style="height: 4rem; width: 4rem; border-radius: 12px;"
                />
                <span style="color: black; font-size: 2rem; font-family: 'Comfortaa', sans-serif; font-weight: 800;">
                  Djengo
                </span>
              </td>
            </tr>
          </table>

          <!-- Header Section -->
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="background-color: #333; color: #ffffff; border-radius: 8px 8px 0 0; padding: 20px;"
          >
            <tr>
              <td style="text-align: center;">
           
                <h3 class="mail-section" style="margin: 0; font-size: 18px;">THANKS FOR SIGNING UP!</h3>
                <h1 style="margin: 0; font-size: 24px;">Verify Your E-Mail Address</h1>
              </td>
            </tr>
          </table>

          <!-- Main Body Section -->
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 24px;">
            <tr>
              <td style="text-align: left;">
                <p style="color: #555; font-size: 16px; margin: 0 0 10px 0;">Hello ${name},</p>
                <p style="color: #555; font-size: 16px; margin: 0 0 10px 0;">
                  Please use the following One Time Password (OTP):
                </p>
                <div
                  style="display: inline-block; font-size: 24px; font-weight: bold; color: #333; padding: 10px; border: 2px solid #333; border-radius: 5px; margin: 10px 0;"
                >
                  ${otp}
                </div>
                <p style="color: #555; font-size: 16px; margin: 0 0 10px 0;">
                  This passcode will only be valid for the next <strong>2 minutes</strong>.
                </p>
              </td>
            </tr>
          </table>

          <!-- Footer Section -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
            <tr>
              <td style="text-align: center; font-size: 12px; color: #777;">
                <p style="margin: 0;">Thank you for using our services!</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
