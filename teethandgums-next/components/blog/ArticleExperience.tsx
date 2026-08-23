"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type ArticleExperienceProps = {
  slug: string;
  title: string;
  toc: TocItem[];
};

function ShareIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-black" aria-hidden="true">
      {children}
    </span>
  );
}

export default function ArticleExperience({
  slug,
  title,
  toc,
}: ArticleExperienceProps) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(toc[0]?.id || "");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const engagementMilestones = useRef(new Set<number>());

  const articleUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  useEffect(() => {
    const viewKey = `blog-viewed:${slug}`;

    if (sessionStorage.getItem(viewKey)) return;

    sessionStorage.setItem(viewKey, "1");

    void fetch(`/api/blogs/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => undefined);

    trackEvent("blog_view", {
      blog_slug: slug,
      blog_title: title,
    });
  }, [slug, title]);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById("blog-article-body");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const start = window.scrollY + rect.top - window.innerHeight * 0.2;
      const end = start + article.offsetHeight - window.innerHeight * 0.55;
      const value = ((window.scrollY - start) / Math.max(end - start, 1)) * 100;

      const nextProgress = Math.min(100, Math.max(0, value));
      setProgress(nextProgress);

      for (const milestone of [25, 50, 75, 100]) {
        if (
          nextProgress >= milestone &&
          !engagementMilestones.current.has(milestone)
        ) {
          engagementMilestones.current.add(milestone);
          trackEvent("blog_read_progress", {
            blog_slug: slug,
            percent: milestone,
          });
        }
      }
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [slug]);

  useEffect(() => {
    if (toc.length === 0) return;

    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [toc]);

  const scrollToHeading = useCallback((id: string) => {
    const heading = document.getElementById(id);
    if (!heading) return;

    heading.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setMobileTocOpen(false);
  }, []);

  const share = useCallback(
    (platform: "whatsapp" | "facebook" | "linkedin" | "x") => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(title);
      const targets = {
        whatsapp: `https://wa.me/?text=${text}%20${url}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      };

      trackEvent("blog_share", {
        blog_slug: slug,
        platform,
      });

      window.open(
        targets[platform],
        "blog-share",
        "noopener,noreferrer,width=760,height=620",
      );
    },
    [slug, title],
  );

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      trackEvent("blog_copy_link", { blog_slug: slug });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      trackEvent("blog_copy_link", { blog_slug: slug });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }, [slug]);

  const tocList = (
    <ol className="mt-4 space-y-1.5">
      {toc.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-4" : undefined}>
          <button
            type="button"
            onClick={() => scrollToHeading(item.id)}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm font-bold leading-5 transition ${
              activeId === item.id
                ? "bg-blue-700 text-white"
                : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"
            }`}
          >
            {item.text}
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[90] h-1 bg-transparent" aria-hidden="true">
        <div
          className="h-full origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-800 transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <aside className="hidden rounded-[26px] border border-blue-100 bg-white p-5 shadow-[0_15px_45px_rgba(37,99,235,.08)] lg:block">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              On this page
            </p>
            <h2 className="mt-1 text-lg font-black text-slate-900">
              Table of Contents
            </h2>
          </div>
          <span className="text-xs font-black text-slate-400">{Math.round(progress)}%</span>
        </div>
        {toc.length > 0 ? (
          tocList
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-500">
            This article does not contain section headings yet.
          </p>
        )}
      </aside>

      <div className="hidden rounded-[26px] bg-blue-950 p-5 text-white lg:block">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-200">
          Share this guide
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => share("whatsapp")} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-black hover:bg-white/20">
            <ShareIcon>W</ShareIcon> WhatsApp
          </button>
          <button type="button" onClick={() => share("facebook")} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-black hover:bg-white/20">
            <ShareIcon>f</ShareIcon> Facebook
          </button>
          <button type="button" onClick={() => share("linkedin")} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-black hover:bg-white/20">
            <ShareIcon>in</ShareIcon> LinkedIn
          </button>
          <button type="button" onClick={() => share("x")} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-black hover:bg-white/20">
            <ShareIcon>𝕏</ShareIcon> Share
          </button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button type="button" onClick={copyLink} className="rounded-xl border border-white/15 px-3 py-2.5 text-sm font-black hover:bg-white/10">
            {copied ? "Copied" : "Copy link"}
          </button>
          <button type="button" onClick={() => { trackEvent("blog_print", { blog_slug: slug }); window.print(); }} className="rounded-xl border border-white/15 px-3 py-2.5 text-sm font-black hover:bg-white/10">
            Print
          </button>
        </div>
      </div>

      <div className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-2 rounded-2xl border border-blue-100 bg-white/95 p-2 shadow-[0_18px_60px_rgba(15,23,42,.22)] backdrop-blur lg:hidden print:hidden">
        <button
          type="button"
          onClick={() => setMobileTocOpen(true)}
          className="min-h-11 flex-1 rounded-xl bg-blue-50 px-3 py-2 text-sm font-black text-blue-800"
        >
          Contents · {Math.round(progress)}%
        </button>
        <button type="button" onClick={() => share("whatsapp")} className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 font-black text-emerald-700" aria-label="Share on WhatsApp">
          W
        </button>
        <button type="button" onClick={copyLink} className="grid h-11 min-w-11 place-items-center rounded-xl bg-blue-700 px-3 text-xs font-black text-white" aria-label="Copy article link">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {mobileTocOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden print:hidden" role="dialog" aria-modal="true" aria-label="Article table of contents">
          <button type="button" className="absolute inset-0 bg-slate-950/60" onClick={() => setMobileTocOpen(false)} aria-label="Close table of contents" />
          <div className="absolute inset-x-0 bottom-0 max-h-[78vh] overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" aria-hidden="true" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Article navigation</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">Table of Contents</h2>
              </div>
              <button type="button" onClick={() => setMobileTocOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-xl font-black text-slate-600" aria-label="Close table of contents">
                ×
              </button>
            </div>
            {toc.length > 0 ? tocList : <p className="mt-5 text-slate-500">No section headings are available.</p>}
          </div>
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {copied ? `Copied ${articleUrl || "article link"}` : ""}
      </span>
    </>
  );
}
