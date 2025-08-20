# Manual scroll detector

Detect user-initiated manual scrolling (mouse, touch, keyboard, wheel) for HTML elements.

---

## Installation

```bash
npm install @nadir2k/manual-scroll-detector
```

---

## Usage

### Basic Usage

```ts
import { attachManualScrollDetector } from "@nadir2k/manual-scroll-detector";

const el = document.getElementById("scrollBox")!;
attachManualScrollDetector(el, (manual, element) => {
  console.log(`Manual scroll on ${element.id}:`, manual);
});
```

---

### Multiple Elements

```ts
const boxes: HTMLElement[] = [
  document.getElementById("box1")!,
  document.getElementById("box2")!,
];

attachManualScrollDetector(boxes, (manual, element) => {
  console.log(`Manual scroll on ${element.id}:`, manual);
});
```

---

### Programmatic Scroll Example

```ts
const el = document.getElementById("scrollBox")!;

// Attach manual scroll detector
attachManualScrollDetector(el, (manual, element) => {
  if (manual) {
    console.log("User scrolled manually!");
  } else {
    console.log("Programmatic scroll!");
  }
});

// Programmatically scroll 500px down smoothly
document.getElementById("scrollButton")!.addEventListener("click", () => {
  el.scrollBy({ top: 500, behavior: "smooth" });
});
```

---

### Example HTML

```html
<div
  id="scrollBox"
  style="width:300px; height:250px; overflow:auto; border:1px solid blue;"
>
  <div
    style="height:2000px; background:linear-gradient(to bottom, #f0f8ff, #4682b4);"
  ></div>
</div>
<button id="scrollButton">Scroll Programmatically</button>
```

---

## License

MIT
