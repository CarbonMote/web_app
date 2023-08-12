"use client";

import { useEffect, useState } from "react";

export default function SafePage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <></>
    // <ClientOnly>
    //   <CreateSafe />
    // </ClientOnly>
  );
}
