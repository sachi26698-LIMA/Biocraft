import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { handleAnchorClick } from '../../lib/router';

/**
 * `<a>` that routes with BioCraft's History-API router instead of reloading.
 *
 * The recovered pages used `next/link`. BioCraft's router intercepts same-origin
 * anchors through `handleAnchorClick`, so the same elements work — a deep link,
 * a middle-click and the back button all behave normally, while a plain click
 * swaps the route without a document reload. Unknown routes still resolve
 * because every route has a static HTML shell.
 */
export function Anchor({
  href,
  children,
  onClick,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) handleAnchorClick(event);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export default Anchor;
