# Phase 2.5 Batch 5 — Production checklist

## Required environment values

```env
NEXT_PUBLIC_CLIENT_URL=https://www.shahazadtestsite.co.in
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
BLOG_PUBLISH_CRON_SECRET=replace-with-a-long-random-secret
```

Keep secrets only in `.env.local` on the server. Never commit that file.

## Build and PM2

```bash
npm ci
npm run check
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Upload directory

Run only on the VPS after the final deployment path is known:

```bash
mkdir -p public/uploads/blog
chown -R $USER:www-data public/uploads
find public/uploads -type d -exec chmod 775 {} \;
find public/uploads -type f -exec chmod 664 {} \;
```

## Nginx

Use `deployment/nginx-teethandgums.conf` as a starting point, update the domain
when the production domain changes, test with `nginx -t`, and reload Nginx.
SSL should be enabled through Certbot after DNS is pointing to the VPS.

## Scheduled publishing

The included cron example calls the existing publish-due endpoint every five
minutes. Confirm that the endpoint expects the same bearer secret before
installing the cron job.

## Analytics

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to enable GA4 in production. The integration
tracks page views automatically and sends custom events for blog views, reading
progress, shares, copy-link actions, printing and newsletter signups.

## Final checks

- Verify `/robots.txt`, `/sitemap.xml` and `/rss.xml`.
- Test one published, scheduled and draft article.
- Run Lighthouse in an incognito window against the deployed production build.
- Submit the sitemap in Google Search Console.
- Test the newsletter and blog view APIs through Nginx.
- Back up MongoDB and `public/uploads` before every major deployment.
