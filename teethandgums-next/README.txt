PHASE 3 - BATCH 1

Replace the matching files in your project.

Important:
1. next.config.ts now applies CSP and security headers globally.
2. proxy.ts now handles only admin authentication redirects to avoid duplicate/conflicting headers.
3. image quality 95 is allowed because several existing Next/Image components use quality={95}.
4. Root layout intentionally does not set a global canonical URL. Each public page should define its own canonical.
5. app/global-error.tsx is included separately because Next.js requires the global error boundary to render its own html and body.
6. Run: npm run check
