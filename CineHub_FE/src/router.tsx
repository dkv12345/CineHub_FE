import { useEffect, useState } from "react";
import type { AnchorHTMLAttributes } from "react";

const read = () => location.hash.slice(1) || "/home";

export function useRoute() {
  const [raw, setRaw] = useState(read);
  useEffect(() => {
    const on = () => { setRaw(read()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const [path, qs = ""] = raw.split("?");
  return { path, query: new URLSearchParams(qs) };
}

export const go = (to: string) => { location.hash = to; };

export function Link({ to, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={`#${to}`} {...rest} />;
}
