export type ManualScrollCallback = (manual: boolean, el: HTMLElement) => void;

/**
 * Attach manual scroll detector to element(s)
 * @param elements HTMLElement or array of HTMLElements
 * @param callback function triggered when manual scroll occurs
 */
export function attachManualScrollDetector(
  elements: HTMLElement | HTMLElement[],
  callback: ManualScrollCallback
): void {
  if (!Array.isArray(elements)) elements = [elements];

  elements.forEach((el) => {
    let isUserScrolling = false;
    let lastScrollTop = el.scrollTop;
    let lastScrollLeft = el.scrollLeft;

    // Detect scrollbar drag
    let isDraggingScrollbar = false;
    const rect = () => el.getBoundingClientRect();

    el.addEventListener("mousedown", (e: MouseEvent) => {
      const r = rect();
      const scrollbarWidth = el.offsetWidth - el.clientWidth;
      const scrollbarHeight = el.offsetHeight - el.clientHeight;

      const onVerticalScrollbar = e.clientX > r.right - scrollbarWidth;
      const onHorizontalScrollbar = e.clientY > r.bottom - scrollbarHeight;

      if (onVerticalScrollbar || onHorizontalScrollbar) {
        isDraggingScrollbar = true;
      }
    });

    const stopDrag = () => {
      isDraggingScrollbar = false;
    };
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mouseleave", stopDrag);

    // Keyboard scrolling
    const keyScrollKeys = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "PageUp",
      "PageDown",
      "Home",
      "End",
    ];
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (keyScrollKeys.includes(e.key)) isUserScrolling = true;
    });

    // Wheel scrolling
    el.addEventListener("wheel", () => {
      isUserScrolling = true;
    });

    // Touch scrolling
    el.addEventListener("touchstart", () => {
      isUserScrolling = true;
    });

    // Scroll listener
    el.addEventListener("scroll", () => {
      const scrolled =
        el.scrollTop !== lastScrollTop || el.scrollLeft !== lastScrollLeft;
      if (scrolled) {
        const manual = isDraggingScrollbar || isUserScrolling;
        callback(manual, el);
      }
      lastScrollTop = el.scrollTop;
      lastScrollLeft = el.scrollLeft;
    });

    // Reset after user stops interacting
    let resetTimeout: number;
    const reset = () => {
      clearTimeout(resetTimeout);
      resetTimeout = window.setTimeout(() => {
        if (isUserScrolling) {
          isUserScrolling = false;
          callback(false, el);
        }
      }, 100);
    };

    el.addEventListener("scroll", reset);
    window.addEventListener("mouseup", reset);
  });
}
