// src/index.ts
export type ScrollCallback = (manual: boolean) => void;

export function attachManualScrollDetector(
  el: HTMLElement,
  callback: ScrollCallback
) {
  let isUserScrolling = false;
  let lastScrollTop = el.scrollTop;
  let lastScrollLeft = el.scrollLeft;

  // Detect scrollbar drag
  let isDraggingScrollbar = false;
  const rect = () => el.getBoundingClientRect();

  const onMouseDown = (e: MouseEvent) => {
    const r = rect();
    const scrollbarWidth = el.offsetWidth - el.clientWidth;
    const scrollbarHeight = el.offsetHeight - el.clientHeight;

    const onVerticalScrollbar = e.clientX > r.right - scrollbarWidth;
    const onHorizontalScrollbar = e.clientY > r.bottom - scrollbarHeight;

    if (onVerticalScrollbar || onHorizontalScrollbar) {
      isDraggingScrollbar = true;
      callback(true);
    }
  };

  const stopDrag = () => {
    if (isDraggingScrollbar) {
      isDraggingScrollbar = false;
      callback(false);
    }
  };

  el.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("mouseleave", stopDrag);

  // Detect keyboard scrolling
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
  const onKeyDown = (e: KeyboardEvent) => {
    if (keyScrollKeys.includes(e.key)) {
      isUserScrolling = true;
      callback(true);
    }
  };
  window.addEventListener("keydown", onKeyDown);

  // Detect wheel scrolling
  const onWheel = () => {
    isUserScrolling = true;
    callback(true);
  };
  el.addEventListener("wheel", onWheel);

  // Detect touch scrolling
  const onTouchStart = () => {
    isUserScrolling = true;
    callback(true);
  };
  el.addEventListener("touchstart", onTouchStart);

  // Main scroll listener
  const onScroll = () => {
    const scrolled =
      el.scrollTop !== lastScrollTop || el.scrollLeft !== lastScrollLeft;
    if (scrolled && (isDraggingScrollbar || isUserScrolling)) {
      callback(true);
    }
    lastScrollTop = el.scrollTop;
    lastScrollLeft = el.scrollLeft;
  };
  el.addEventListener("scroll", onScroll);

  // Reset after short timeout
  let resetTimeout: ReturnType<typeof setTimeout>;
  const reset = () => {
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => {
      isUserScrolling = false;
      callback(false);
    }, 100);
  };
  el.addEventListener("scroll", reset);
  window.addEventListener("mouseup", reset);

  // Return detach function
  return () => {
    el.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("mouseleave", stopDrag);
    window.removeEventListener("keydown", onKeyDown);
    el.removeEventListener("wheel", onWheel);
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("scroll", onScroll);
    el.removeEventListener("scroll", reset);
    window.removeEventListener("mouseup", reset);
  };
}
