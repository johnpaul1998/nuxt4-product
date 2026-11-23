export const useScrollReveal = () => {
  // observer variable
  let revealObserver: IntersectionObserver | null = null;
  function initializeScrollReveal() {
    if (typeof window === "undefined") return;

    // Respect users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".scroll-reveal").forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");

              // Animate only once. No flickering when scrolling back.
              revealObserver?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -60px 0px",
        },
      );
    }

    document
      .querySelectorAll(".scroll-reveal:not(.is-visible)")
      .forEach((element) => {
        revealObserver?.observe(element);
      });
  }

  onBeforeUnmount(() => {
    revealObserver?.disconnect();
    revealObserver = null;
  });

  return {
    initializeScrollReveal,
  };
};
