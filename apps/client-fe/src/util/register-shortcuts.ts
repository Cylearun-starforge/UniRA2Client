const KeyAllowSet = new Set<string>();
if (window.__DEV__) {
  KeyAllowSet.add("F12");
  KeyAllowSet.add("F5");
}
export function registerShortcuts() {
  document.addEventListener("keydown", (e) => {
    console.log("pressed key", e.key);
    if (!KeyAllowSet.has(e.key)) {
      e.preventDefault();
    }
  });
}
