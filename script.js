const animated = Array.from(document.querySelectorAll("[data-animate], .impact-card, .workflow-board"));

const applyDelay = (elements) => {
  elements.forEach((el, index) => {
    const delay = Math.min(index * 0.08, 0.5);
    el.style.animationDelay = `${delay}s`;
  });
};

applyDelay(animated);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  animated.forEach((el) => observer.observe(el));
} else {
  animated.forEach((el) => el.classList.add("is-visible"));
}
