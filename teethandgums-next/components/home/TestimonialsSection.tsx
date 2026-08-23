import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faCircleCheck, faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const googleReviewsLink = "https://share.google/X1DeFzBmXM8WkGAuc";

const testimonials = [
  {
    name: "Lovekush Upadhyay",
    location: "Jodhpur",
    review:
      "Dr. Sunita Khetani treated my tooth and gum problem very effectively. She explained everything clearly and made me feel comfortable throughout the treatment. The treatment quality is excellent and the charges are very reasonable.",
  },
  {
    name: "Pramod Khanna",
    location: "Jodhpur",
    review:
      "Excellent root canal and implant service. Dr. Suneeta Khetani and Dr. Vishal Khetani are knowledgeable and meticulous in their work, which made the whole process smooth and painless.",
  },
  {
    name: "Harshraj Singh",
    location: "Jodhpur",
    review:
      "The entire team was warm, welcoming, and highly professional. The dentist took the time to explain every step of the procedure, which really helped put me at ease.",
  },
  {
    name: "Saurabh Agarwal",
    location: "Jodhpur",
    review:
      "Very good service and professional approach. The issue was analyzed quickly and treated genuinely with reasonable charges. I really appreciate the prompt treatment.",
  },
  {
    name: "Sushila Goswami",
    location: "Jodhpur",
    review:
      "Very good experience. My daughter got treatment from Dr. Sunita Khetani. She is very polite and patient in explaining everything.",
  },
];

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 star review">
      {Array.from({ length: 5 }).map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStar} aria-hidden="true" className="text-[#FBBC05]" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [featured, ...others] = testimonials;

  return (
    <section className="bg-[#f7faff] py-20 sm:py-24 lg:py-32" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm">
              <Image src="/images/google.svg" alt="" aria-hidden="true" width={16} height={16} />
              Patient Stories
            </span>
            <h2 id="testimonials-title" className="mt-6 max-w-2xl text-4xl font-black leading-[1.03] tracking-[-0.045em] text-[#08376f] sm:text-5xl lg:text-6xl">
              Trust is built one experience at a time.
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Real patient feedback reflects the experience we work to deliver: clear guidance, gentle care, and thoughtful treatment.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <div className="text-3xl font-black text-[#08376f]">4.9/5</div>
              <div>
                <Stars />
                <div className="mt-1 text-xs font-bold text-slate-500">Google patient rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <a href={googleReviewsLink} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-[32px] bg-[#08376f] p-7 text-white shadow-[0_24px_75px_rgba(8,55,111,0.2)] transition hover:-translate-y-1 lg:col-span-5 lg:row-span-2 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-2xl text-blue-200">
                <FontAwesomeIcon icon={faQuoteLeft} aria-hidden="true" />
              </span>
              <Image src="/images/google.svg" alt="Google" width={32} height={32} className="rounded-full bg-white p-1" />
            </div>
            <blockquote className="mt-10 text-2xl font-bold leading-10 tracking-[-0.02em] sm:text-3xl sm:leading-[1.45]">
              “{featured.review}”
            </blockquote>
            <div className="mt-10 border-t border-white/10 pt-6">
              <Stars />
              <div className="mt-4 text-lg font-black">{featured.name}</div>
              <div className="text-sm text-blue-100/70">{featured.location}</div>
              <div className="mt-5 inline-flex items-center text-sm font-black text-blue-100">
                <FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" className="mr-2" />
                Verified Google Review
              </div>
            </div>
          </a>

          {others.map((item, index) => (
            <a
              key={item.name}
              href={googleReviewsLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`group rounded-[28px] border border-blue-100 bg-white p-6 shadow-[0_12px_40px_rgba(8,55,111,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(8,55,111,0.1)] ${index < 2 ? "lg:col-span-4" : "lg:col-span-3"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <Stars />
                <Image src="/images/google.svg" alt="" aria-hidden="true" width={22} height={22} />
              </div>
              <p className="mt-5 line-clamp-5 text-sm leading-7 text-slate-600">“{item.review}”</p>
              <div className="mt-6 border-t border-blue-50 pt-5">
                <div className="font-black text-[#08376f]">{item.name}</div>
                <div className="mt-1 text-xs font-bold text-slate-400">{item.location}</div>
              </div>
            </a>
          ))}

          <a href={googleReviewsLink} target="_blank" rel="noopener noreferrer" className="flex min-h-[180px] flex-col justify-between rounded-[28px] border border-blue-200 bg-blue-50 p-6 transition hover:-translate-y-1 hover:bg-blue-100 lg:col-span-3">
            <Image src="/images/google.svg" alt="Google Reviews" width={28} height={28} />
            <div>
              <div className="text-xl font-black text-[#08376f]">Read more patient stories</div>
              <div className="mt-3 inline-flex items-center text-sm font-black text-blue-700">
                View all Google reviews
                <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-2" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
