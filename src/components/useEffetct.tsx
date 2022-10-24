import { useEffect, useRef } from "react";

export function AppUse() {
  const isFirstRender = useRef(true);

  useEffect(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = true;
        return;
      }
      return;
    },
    //code
    []
  );
  return <h1>Hello Tester</h1>;
}
