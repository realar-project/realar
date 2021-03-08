
export function nextTick() {
  return new Promise(r => setTimeout(r));
}
