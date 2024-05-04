import { useEffect, useRef, useState } from "react";

const useCalcOffset = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect?.top) {
      setOffset(rect.top);
    }
  }, []);

  return {
    ref,
    offset,
  }
}

export default useCalcOffset