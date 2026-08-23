"use client";

import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendarCheck,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
  faExpand,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  AnimatePresence,
  m,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";

import { galleryImages } from "@/data/gallery";
import {
  FadeUp,
  HoverButton,
  HoverImage,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

type GalleryImage = (typeof galleryImages)[number];

const blurPlaceholder =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwMCcgaGVpZ2h0PSc4MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZyc+PHJlY3Qgd2lkdGg9JzEyMDAnIGhlaWdodD0nODAwJyBmaWxsPScjZTVmMGZmJy8+PC9zdmc+";

const SWIPE_THRESHOLD = 70;

function getImagePosition(image: GalleryImage) {
  const title = image.title.toLowerCase();

  if (title.includes("sunita")) return "center 22%";
  if (title.includes("vishal")) return "center 18%";
  if (title.includes("doctor")) return "center 18%";
  if (title.includes("treatment")) return "center 28%";

  return "center center";
}

export default function GalleryClient() {
  const shouldReduceMotion = useReducedMotion();
  const images = galleryImages;
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const focusTimerRef = useRef<number | null>(null);

  const currentIndex = selectedImage
    ? images.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const closeModal = useCallback(() => {
    setSelectedImage(null);

    window.requestAnimationFrame(() => {
      openerRef.current?.focus();
    });
  }, []);

  const openNext = useCallback(() => {
    if (currentIndex === -1) return;
    setSelectedImage(images[(currentIndex + 1) % images.length]);
  }, [currentIndex, images]);

  const openPrevious = useCallback(() => {
    if (currentIndex === -1) return;
    setSelectedImage(images[(currentIndex - 1 + images.length) % images.length]);
  }, [currentIndex, images]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD) {
        openNext();
      }

      if (info.offset.x > SWIPE_THRESHOLD) {
        openPrevious();
      }
    },
    [openNext, openPrevious],
  );

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowRight") openNext();
      if (event.key === "ArrowLeft") openPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, closeModal, openNext, openPrevious]);

  useEffect(() => {
    if (!selectedImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    focusTimerRef.current = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 80);

    return () => {
      document.body.style.overflow = previousOverflow;

      if (focusTimerRef.current !== null) {
        window.clearTimeout(focusTimerRef.current);
      }
    };
  }, [selectedImage]);

  return (
    <main id="main-content" tabIndex={-1} className="overflow-x-hidden outline-none">
      <section
        aria-labelledby="gallery-hero-title"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-5 py-28 text-center text-white lg:py-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.12),transparent_35%)]"
        />

        <div className="relative z-10 mx-auto max-w-5xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-6 py-3 text-sm font-black backdrop-blur">
              Teeth and Gums Care
            </span>

            <h1
              id="gallery-hero-title"
              className="mt-6 text-4xl font-black leading-tight md:text-6xl"
            >
              Dental Clinic Gallery in Jodhpur
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90">
              Explore our modern dental clinic in Jodhpur, advanced treatment rooms, experienced dentists, latest dental technology and patient-friendly environment.
            </p>

            <div className="mt-10">
              <HoverButton>
                <Link prefetch={false}
                  href="/book-appointment"
                  aria-label="Book a dental appointment"
                  className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-black text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Book Appointment
                  <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-3 transition duration-300 group-hover:translate-x-1" />
                </Link>
              </HoverButton>
            </div>
        </div>
      </section>

      <section
        aria-labelledby="gallery-section-title"
        className="[content-visibility:auto] [contain-intrinsic-size:1300px] relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-white to-blue-50 py-20 lg:py-28"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-200/60">
                Clinic Moments
              </span>

              <h2
                id="gallery-section-title"
                className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl"
              >
                Inside Teeth and Gums Care Dental Clinic
              </h2>

              <div
                aria-hidden="true"
                className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-blue-900"
              />

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                Designed for comfort, hygiene, safety and advanced dental care.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer className="grid auto-rows-[260px] grid-cols-1 gap-6 sm:auto-rows-[320px] md:grid-cols-2 lg:auto-rows-[280px] lg:grid-cols-4">
            {images.map((image, index) => (
              <StaggerItem
                key={image.id}
                className={`
                  min-w-0
                  ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
                  ${index === 1 ? "lg:row-span-2" : ""}
                  ${index === 4 ? "lg:col-span-2" : ""}
                `}
              >
                <HoverImage className="h-full w-full">
                  <button
                    type="button"
                    aria-label={`Open ${image.title}`}
                    onClick={(event) => {
                      openerRef.current = event.currentTarget;
                      setSelectedImage(image);
                    }}
                    className="group relative h-full w-full overflow-hidden rounded-[30px] border border-blue-100 bg-white text-left shadow-[0_20px_60px_rgba(37,99,235,.12)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_30px_90px_rgba(37,99,235,.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                  >
                    <Image
                      src={image.image}
                      alt={`${image.title} at Teeth and Gums Care Dental Clinic in Jodhpur`}
                      fill
                      placeholder="blur"
                      blurDataURL={blurPlaceholder}
                      sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 36px), 310px"
                      quality={70}
                      className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.08]"
                      style={{
                        objectPosition: getImagePosition(image),
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent transition duration-500 group-hover:from-blue-900/90" />

                    <div className="absolute left-5 top-5 z-20">
                      <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-blue-700 shadow-lg">
                        {image.category}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 z-20">
                      <h3 className="text-xl font-black leading-tight text-white sm:text-2xl">
                        {image.title}
                      </h3>
                    </div>

                    <div className="absolute right-5 top-5 z-20 grid h-12 w-12 scale-75 place-items-center rounded-full border border-white/30 bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <FontAwesomeIcon aria-hidden="true" icon={faExpand} />
                    </div>
                  </button>
                </HoverImage>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-live="polite"
            aria-labelledby="gallery-dialog-title"
            aria-describedby="gallery-dialog-description"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/92 p-4 backdrop-blur-md"
            onClick={closeModal}
          >

            <button
              type="button"
              onClick={openPrevious}
              aria-label="View previous gallery image"
              className="absolute left-5 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-blue-700 shadow-xl transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 md:grid"
            >
              <FontAwesomeIcon aria-hidden="true" icon={faChevronLeft} />
            </button>

            <button
              type="button"
              onClick={openNext}
              aria-label="View next gallery image"
              className="absolute right-5 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-blue-700 shadow-xl transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 md:grid"
            >
              <FontAwesomeIcon aria-hidden="true" icon={faChevronRight} />
            </button>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              aria-label="Close gallery image"
              className="absolute right-5 top-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-white text-xl text-blue-700 shadow-xl transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              <FontAwesomeIcon aria-hidden="true" icon={faXmark} />
            </button>

            <m.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              initial={
                shouldReduceMotion ? false : { scale: 0.94, opacity: 0, y: 18 }
              }
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : { scale: 0.94, opacity: 0, y: 18 }
              }
              transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
              className="w-full max-w-5xl cursor-grab overflow-hidden rounded-[32px] border border-white/10 bg-white p-4 shadow-2xl active:cursor-grabbing"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-[65vh] overflow-hidden rounded-[24px] bg-slate-100 md:h-[72vh]">
                <Image
                  src={selectedImage.image}
                  alt={`${selectedImage.title} at Teeth and Gums Care Dental Clinic in Jodhpur`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  quality={82}
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col gap-4 px-2 py-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <div>
                  <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700">
                    {selectedImage.category}
                  </span>

                  <h3
                    id="gallery-dialog-title"
                    className="mt-3 text-2xl font-black text-slate-900"
                  >
                    {selectedImage.title}
                  </h3>

                  <p id="gallery-dialog-description" className="sr-only">
                    Enlarged gallery image from Teeth and Gums Care Dental Clinic
                    in Jodhpur. Use the previous and next controls or the left
                    and right arrow keys to browse.
                  </p>
                </div>

                <div
                  aria-live="polite"
                  className="rounded-full bg-blue-50 px-5 py-3 text-sm font-black text-blue-700"
                >
                  {currentIndex + 1} / {images.length}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 px-2 pb-2 md:hidden">
                <button
                  type="button"
                  onClick={openPrevious}
                  className="rounded-full border border-blue-100 bg-blue-50 px-5 py-3 font-black text-blue-700 transition active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={faChevronLeft} className="mr-2" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={openNext}
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-5 py-3 font-black text-white transition active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Next
                  <FontAwesomeIcon aria-hidden="true" icon={faChevronRight} className="ml-2" />
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <section aria-labelledby="gallery-cta-title" className="[content-visibility:auto] [contain-intrinsic-size:650px] relative scroll-mt-24 overflow-hidden bg-blue-50 px-4 py-20 lg:py-28">
        <FadeUp>
          <div className="relative z-10 mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 px-6 py-12 text-white shadow-[0_30px_90px_rgba(37,99,235,.24)] sm:px-10 lg:px-14 lg:py-16">
            <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-5 py-2 text-sm font-black backdrop-blur">
                  Book Your Visit Today
                </span>

                <h2 id="gallery-cta-title" className="mt-6 text-3xl font-black leading-tight md:text-5xl">
                  Book Your Dental Appointment in Jodhpur
                </h2>

                <p className="mt-5 max-w-3xl leading-8 text-white/90">
                  Book your appointment with our experienced dentists in Jodhpur and receive personalized dental treatment using modern technology.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {["Modern Clinic", "Trusted Doctors", "Comfortable Care"].map(
                    (item) => (
                      <span
                        key={item}
                        className="inline-flex rounded-full border border-white/15 bg-white/15 px-4 py-2 text-sm font-black backdrop-blur"
                      >
                        <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-2 text-blue-200" />
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="flex justify-start lg:justify-end">
                <HoverButton>
                  <Link prefetch={false}
                    href="/book-appointment"
                    aria-label="Book a dental appointment at Teeth and Gums Care"
                    className="inline-flex min-h-[58px] w-full items-center justify-center rounded-full bg-white px-8 py-4 text-center font-black text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto sm:min-w-[240px]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="mr-3" />
                    Book Appointment
                  </Link>
                </HoverButton>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </main>
  );
}