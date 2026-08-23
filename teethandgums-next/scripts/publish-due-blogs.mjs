const baseUrl = (process.env.NEXT_PUBLIC_CLIENT_URL || "").replace(/\/$/, "");
const secret = process.env.BLOG_PUBLISH_CRON_SECRET;

if (!baseUrl || !secret) {
  console.error(
    "NEXT_PUBLIC_CLIENT_URL and BLOG_PUBLISH_CRON_SECRET are required.",
  );
  process.exit(1);
}

const response = await fetch(`${baseUrl}/api/admin/blogs/publish-due`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  },
});

const body = await response.text();

if (!response.ok) {
  console.error(`Scheduled publishing failed (${response.status}): ${body}`);
  process.exit(1);
}

console.log(body);
