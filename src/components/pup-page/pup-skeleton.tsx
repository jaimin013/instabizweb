/**
 * Placeholder for a puppy page while its content streams in. It is part of the prerendered HTML, so
 * the page is never blank: it reserves the same boxes as the real page (breadcrumb, photo frame, name
 * tag), which also keeps the layout from jumping when the story replaces it.
 */
export function PupSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto min-h-[80vh] w-full max-w-[110rem] px-(--gutter) pt-8 pb-20 md:pt-12"
    >
      <span className="sr-only">Loading this puppy…</span>
      <div aria-hidden="true">
        <div className="tp-skel h-6 w-52 rounded-full" />
        <div className="tp-skel h-[37px] w-44 rounded-full" />
        <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="tp-skel aspect-[4/5] rounded-[1.2rem] md:aspect-[5/6]" />
            <div className="mt-3 flex gap-3 pt-2">
              <div className="tp-skel h-24 w-20 rounded-[0.9rem] md:h-28 md:w-24" />
              <div className="tp-skel h-24 w-20 rounded-[0.9rem] md:h-28 md:w-24" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="tp-skel mt-16 h-[30rem] rounded-[2.2rem] lg:mt-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
