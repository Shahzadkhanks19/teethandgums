const rawClientUrl =
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  process.env.CLIENT_URL ||
  "https://www.shahzadtestsite.co.in";

const CLIENT_URL = String(rawClientUrl)
  .trim()
  .replace(/\/+$/, "");

const brand = {
  clinicName: "Teeth and Gums Care",
  tagline: "Advanced Care. Healthy Smiles.",

  logoUrl: `${CLIENT_URL}/images/logo/logo.webp`,

  /**
   * The Facebook file is intentionally named "faebook.png"
   * because that is the filename currently stored in public/images/email.
   */
  facebookIcon: `${CLIENT_URL}/images/email/facebook.png`,
  instagramIcon: `${CLIENT_URL}/images/email/instagram.png`,
  whatsappIcon: `${CLIENT_URL}/images/email/whatsapp.png`,

  website: CLIENT_URL,
  phone: "+91 98298 24356",
  email: "sunitakhetani@gmail.com",
  address:
    "E-32, Shastri Nagar, Kalpatru Shopping Centre, Near CLG Institute, Jodhpur, Rajasthan",

  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Teeth%20and%20Gums%20Care%20Jodhpur",

  facebook:
    "https://www.facebook.com/profile.php?id=61590941001711",

  instagram:
    "https://www.instagram.com/teethandgumscare",

  whatsappUrl:
    "https://wa.me/919829824356",
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function text(value = "") {
  return escapeHtml(value).replace(
    /\r?\n/g,
    "<br/>",
  );
}

function cleanWebsite(url = "") {
  return String(url)
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

function safeUrl(value = "") {
  const trimmed = String(value).trim();

  if (!trimmed) {
    return "";
  }

  if (/^(mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsedUrl = new URL(trimmed);

    if (
      !["http:", "https:"].includes(
        parsedUrl.protocol,
      )
    ) {
      return "";
    }

    return parsedUrl.toString();
  } catch {
    return "";
  }
}

const tones = {
  blue: ["#eff6ff", "#bfdbfe", "#2563eb"],
  green: ["#ecfdf5", "#bbf7d0", "#16a34a"],
  red: ["#fef2f2", "#fecaca", "#dc2626"],
  orange: ["#fff7ed", "#fed7aa", "#ea580c"],
  purple: ["#f5f3ff", "#ddd6fe", "#7c3aed"],
  slate: ["#f8fafc", "#e2e8f0", "#0f172a"],
};

function buttonColors(variant = "primary") {
  const colors = {
    primary: [
      "#2563eb",
      "#ffffff",
      "#2563eb",
    ],
    green: [
      "#10b981",
      "#ffffff",
      "#10b981",
    ],
    red: [
      "#ef4444",
      "#ffffff",
      "#ef4444",
    ],
    purple: [
      "#7c3aed",
      "#ffffff",
      "#7c3aed",
    ],
    outline: [
      "#eff6ff",
      "#1d4ed8",
      "#eff6ff",
    ],
  };

  return colors[variant] || colors.primary;
}

function renderButton(button) {
  const url = safeUrl(button.url);

  if (!url) {
    return "";
  }

  const [background, color] =
    buttonColors(button.variant);

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:10px;">
    <tr>
      <td align="center" bgcolor="${background}" style="border-radius:12px;box-shadow:0 8px 22px rgba(37,99,235,.14);">
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="display:block;padding:14px 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:20px;font-weight:800;color:${color};text-decoration:none;border-radius:12px;">
          ${escapeHtml(button.label)}
        </a>
      </td>
    </tr>
  </table>`;
}

function renderLogo(size = 72) {
  const logoUrl = safeUrl(brand.logoUrl);

  if (!logoUrl) {
    return `
    <div style="width:${size}px;height:${size}px;border-radius:18px;background:#eff6ff;color:#2563eb;text-align:center;line-height:${size}px;font-size:34px;font-weight:900;">
      🦷
    </div>`;
  }

  return `
  <img src="${escapeHtml(logoUrl)}" width="${size}" height="${size}" alt="${escapeHtml(brand.clinicName)}" style="display:block;border:0;outline:none;text-decoration:none;border-radius:18px;background:#ffffff;" />`;
}

function renderSocialIcon(
  source,
  href,
  label,
) {
  const safeSource = safeUrl(source);
  const safeHref = safeUrl(href);

  if (!safeSource || !safeHref) {
    return "";
  }

  return `
  <a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}" style="display:inline-block;margin:0 5px;text-decoration:none;">
    <img src="${escapeHtml(safeSource)}" width="28" height="28" alt="${escapeHtml(label)}" style="display:block;border:0;outline:none;text-decoration:none;" />
  </a>`;
}

function renderInfoItems(items = []) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td width="42" valign="top">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="34" height="34" align="center" valign="middle" bgcolor="#eff6ff" style="border-radius:10px;font-size:16px;line-height:34px;">
                      ${escapeHtml(item.icon || "•")}
                    </td>
                  </tr>
                </table>
              </td>

              <td valign="top" style="padding-left:10px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;color:#64748b;font-weight:800;text-transform:uppercase;letter-spacing:.04em;">
                  ${escapeHtml(item.label)}
                </div>

                <div style="margin-top:3px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:22px;color:#0f172a;font-weight:900;word-break:break-word;">
                  ${escapeHtml(item.value || "-")}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
    )
    .join("");
}

function renderBoxes(boxes = []) {
  return boxes
    .map((box) => {
      const tone =
        tones[box.tone || "blue"] ||
        tones.blue;

      const [background, , color] =
        tone;

      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:16px;">
        <tr>
          <td bgcolor="${background}" style="border-radius:14px;padding:16px;box-shadow:0 8px 24px rgba(15,23,42,.06);">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;font-weight:900;color:${color};margin-bottom:8px;">
              ${escapeHtml(box.title)}
            </div>

            <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:23px;color:#334155;">
              ${text(box.content)}
            </div>
          </td>
        </tr>
      </table>`;
    })
    .join("");
}

function renderContactButtons() {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:22px;">
    <tr>
      <td>${renderButton({
        label: "Call Clinic",
        url: `tel:${brand.phone.replace(
          /\s/g,
          "",
        )}`,
        variant: "primary",
      })}</td>
    </tr>

    <tr>
      <td>${renderButton({
        label: "WhatsApp Us",
        url: brand.whatsappUrl,
        variant: "green",
      })}</td>
    </tr>

    <tr>
      <td>${renderButton({
        label: "Get Directions",
        url: brand.mapUrl,
        variant: "outline",
      })}</td>
    </tr>
  </table>`;
}

function emailLayout({
  title,
  previewText,
  badge,
  badgeTone = "blue",
  heading,
  greeting,
  body,
  heroIcon = "🦷",
  heroTone = "blue",
  infoTitle,
  infoItemsList = [],
  boxes = [],
  primaryButton,
  showContactButtons = true,
  footerNote,
}) {
  const badgeColors =
    tones[badgeTone] || tones.blue;

  const heroColors =
    tones[heroTone] || tones.blue;

  const [
    badgeBackground,
    ,
    badgeText,
  ] = badgeColors;

  const [heroBackground] = heroColors;

  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <title>${escapeHtml(title)}</title>
</head>

<body style="margin:0;padding:0;background:#f4f8ff;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">
    ${escapeHtml(previewText)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f8ff" style="border-collapse:collapse;background:#f4f8ff;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:collapse;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(8,47,115,.12);">
          <tr>
            <td align="center" bgcolor="#082f73" style="background:#082f73;padding:30px 24px 28px;">
              ${renderLogo(76)}

              <div style="margin-top:16px;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;font-weight:900;color:#ffffff;text-align:center;">
                ${escapeHtml(brand.clinicName)}
              </div>

              <div style="margin-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#dbeafe;text-align:center;">
                ${escapeHtml(brand.tagline)}
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" bgcolor="#ffffff" style="padding:30px 24px 26px;background:#ffffff;">
              ${
                badge
                  ? `
                  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 auto 18px;">
                    <tr>
                      <td bgcolor="${badgeBackground}" style="border-radius:999px;padding:8px 14px;">
                        <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:15px;color:${badgeText};font-weight:900;text-transform:uppercase;letter-spacing:.06em;">
                          ${escapeHtml(badge)}
                        </span>
                      </td>
                    </tr>
                  </table>`
                  : ""
              }

              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 auto 18px;">
                <tr>
                  <td width="86" height="86" align="center" valign="middle" bgcolor="${heroBackground}" style="border-radius:999px;font-size:42px;line-height:86px;">
                    ${escapeHtml(heroIcon)}
                  </td>
                </tr>
              </table>

              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:38px;color:#06143b;font-weight:900;text-align:center;">
                ${escapeHtml(heading)}
              </h1>

              ${
                greeting
                  ? `<p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:24px;color:#0057d9;font-weight:900;text-align:center;">${escapeHtml(greeting)}</p>`
                  : ""
              }

              <div style="margin-top:16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:27px;color:#334155;text-align:left;">
                ${text(body)}
              </div>

              ${
                infoItemsList.length
                  ? `
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:24px;">
                    <tr>
                      <td style="border-radius:16px;background:#f8fbff;padding:0;box-shadow:0 8px 24px rgba(15,23,42,.05);">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                          <tr>
                            <td style="padding:18px 18px 10px;">
                              <h2 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:26px;color:#06143b;font-weight:900;">
                                ${escapeHtml(infoTitle || "Details")}
                              </h2>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:0 18px 8px;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                ${renderInfoItems(infoItemsList)}
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>`
                  : ""
              }

              ${renderBoxes(boxes)}
              ${
                primaryButton
                  ? renderButton(primaryButton)
                  : ""
              }
              ${
                showContactButtons
                  ? renderContactButtons()
                  : ""
              }

              ${
                footerNote
                  ? `
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:18px;">
                    <tr>
                      <td bgcolor="#eff6ff" style="border-radius:14px;padding:15px;box-shadow:0 8px 24px rgba(37,99,235,.08);">
                        <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#1e3a8a;">
                          ${text(footerNote)}
                        </div>
                      </td>
                    </tr>
                  </table>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td align="center" bgcolor="#031b46" style="background:#031b46;padding:30px 24px;">
              ${renderLogo(56)}

              <div style="margin-top:14px;font-family:Arial,Helvetica,sans-serif;font-size:21px;line-height:27px;font-weight:900;color:#ffffff;text-align:center;">
                ${escapeHtml(brand.clinicName)}
              </div>

              <div style="margin-top:5px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:#bfdbfe;text-align:center;">
                ${escapeHtml(brand.tagline)}
              </div>

              <div style="margin-top:22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;color:#cbd5e1;text-align:center;">
                <strong style="color:#ffffff;">Contact Us</strong><br/>
                ${escapeHtml(brand.phone)}<br/>
                <a href="mailto:${escapeHtml(brand.email)}" style="color:#93c5fd;text-decoration:none;">${escapeHtml(brand.email)}</a><br/>
                ${escapeHtml(brand.address)}
              </div>

              <div style="margin-top:20px;text-align:center;">
                ${renderSocialIcon(
                  brand.facebookIcon,
                  brand.facebook,
                  "Facebook",
                )}
                ${renderSocialIcon(
                  brand.instagramIcon,
                  brand.instagram,
                  "Instagram",
                )}
                ${renderSocialIcon(
                  brand.whatsappIcon,
                  brand.whatsappUrl,
                  "WhatsApp",
                )}
              </div>

              <div style="height:1px;background:rgba(255,255,255,.18);margin:24px 0 18px;"></div>

              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#94a3b8;text-align:center;">
                © ${new Date().getFullYear()} ${escapeHtml(brand.clinicName)}. All rights reserved.
              </div>

              <div style="margin-top:8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;text-align:center;">
                <a href="${escapeHtml(brand.website)}" style="color:#bfdbfe;text-decoration:none;">
                  ${escapeHtml(cleanWebsite(brand.website))}
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
  emailLayout,
};
