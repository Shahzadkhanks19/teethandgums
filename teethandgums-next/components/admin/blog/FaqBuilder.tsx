"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import type { BlogFaqItem } from "./BlogTypes";

type FaqBuilderProps = {
  value: BlogFaqItem[];
  onChange: (value: BlogFaqItem[]) => void;
};

export default function FaqBuilder({
  value,
  onChange,
}: FaqBuilderProps) {
  const addFaq = () => {
    if (value.length >= 20) return;

    onChange([
      ...value,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  const updateFaq = (
    index: number,
    key: keyof BlogFaqItem,
    nextValue: string,
  ) => {
    onChange(
      value.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: nextValue,
            }
          : item,
      ),
    );
  };

  return (
    <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.08)] md:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            FAQ Builder
          </h2>
          <p className="mt-2 leading-7 text-slate-500">
            These questions can later generate FAQ schema on the public article.
          </p>
        </div>

        <button
          type="button"
          disabled={value.length >= 20}
          onClick={addFaq}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-50 px-4 py-2.5 font-black text-blue-700 transition hover:bg-blue-600 hover:text-white disabled:opacity-50"
        >
          <AdminIcon
            aria-hidden="true"
            className="fa-solid fa-layer-group mr-2"
          />
          Add FAQ
        </button>
      </div>

      {value.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-6 text-center">
          <p className="font-black text-slate-700">
            No FAQs added yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {value.map((faq, index) => (
            <article
              key={index}
              className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black text-blue-700">
                  FAQ {index + 1}
                </span>

                <button
                  type="button"
                  aria-label={`Remove FAQ ${index + 1}`}
                  onClick={() =>
                    onChange(
                      value.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    )
                  }
                  className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600"
                >
                  <AdminIcon
                    aria-hidden="true"
                    className="fa-solid fa-trash-can"
                  />
                </button>
              </div>

              <div className="mt-4 grid gap-4">
                <input
                  type="text"
                  value={faq.question}
                  maxLength={300}
                  onChange={(event) =>
                    updateFaq(index, "question", event.target.value)
                  }
                  placeholder="Question"
                  className="min-h-12 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <textarea
                  rows={4}
                  value={faq.answer}
                  maxLength={2000}
                  onChange={(event) =>
                    updateFaq(index, "answer", event.target.value)
                  }
                  placeholder="Answer"
                  className="w-full resize-y rounded-xl border border-blue-100 bg-white px-4 py-3 font-semibold leading-7 text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
