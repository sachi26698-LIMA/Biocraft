import { handleAnchorClick } from '../lib/router';
import { ChevronRightIcon } from './icons';

export interface Crumb {
  label: string;
  href?: string;
}

/** Light breadcrumb trail used on tool and discovery pages. */
export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${crumb.label}-${index}`}>
              {crumb.href && !isLast ? (
                <a href={crumb.href} onClick={handleAnchorClick}>{crumb.label}</a>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
              {!isLast && <ChevronRightIcon size={13} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
