import { infoPageForPath } from './info';
import { handleAnchorClick } from '../lib/router';
import { ArrowRightIcon } from '../components/icons';

/**
 * Renders a registry info page (features/pricing/blog/…). Unknown info paths
 * never reach here — App.tsx guards the route table.
 */
export default function InfoPage({ path }: { path: string }) {
  const page = infoPageForPath(path);
  if (!page) return null;

  return (
    <article className="info-page">
      <div className="container info-inner">
        <header className="info-header">
          <h1 id="page-title" className="info-title">
            {page.heading}
          </h1>
          <p className="info-lede">{page.lede}</p>
        </header>

        {page.sections.map((section) => (
          <section key={section.heading} className="info-section">
            <h2>{section.heading}</h2>
            <div className="info-body">{section.body}</div>
          </section>
        ))}

        {page.crossLinks && page.crossLinks.length > 0 && (
          <nav className="info-crosslinks" aria-label="Related in BioCraft">
            <h2>Keep going</h2>
            <ul>
              {page.crossLinks.map((link) => (
                <li key={link.href + link.label}>
                  <a className="info-crosslink" href={link.href} onClick={handleAnchorClick}>
                    {link.label}
                    <ArrowRightIcon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
