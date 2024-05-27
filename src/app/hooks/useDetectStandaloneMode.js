"use client";

import { useEffect, useState } from "react";

function useDetectStandaloneMode() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (
      window.navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setIsStandalone(true);
    }
  }, []);

  return isStandalone;
}

export default useDetectStandaloneMode;
