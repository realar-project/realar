import { useRef } from "react";

export function useInstance(cls) {
  const ref = useRef();
  if (!ref.current) ref.current = new cls();
  return ref.current;
}
