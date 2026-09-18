import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

/**
 * Makes every URL the router writes end in a slash.
 *
 * The static build emits each route as `<path>/index.html`, so the host serves
 * `<path>/` with a 200 and redirects `<path>` to it. Canonical tags, og:url,
 * JSON-LD and the sitemap all use the trailing-slash form — but `routerLink`
 * renders an `href` without it, so every internal link on the site was a 307
 * redirect for a crawler following hrefs.
 *
 * Serializing with the slash fixes the emitted hrefs. Parsing strips it again
 * before the default serializer sees the URL, so route matching is unchanged
 * and links written either way still resolve.
 */
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    const [path, rest] = splitPath(url);
    const trimmed = path.length > 1 ? path.replace(/\/+$/, '') : path;
    return super.parse(`${trimmed || '/'}${rest}`);
  }

  override serialize(tree: UrlTree): string {
    const [path, rest] = splitPath(super.serialize(tree));
    return `${path.endsWith('/') ? path : `${path}/`}${rest}`;
  }
}

/** Splits a URL into its path and everything from the first `?` or `#`. */
function splitPath(url: string): [string, string] {
  const cut = url.search(/[?#]/);
  return cut === -1 ? [url, ''] : [url.slice(0, cut), url.slice(cut)];
}

export const trailingSlashUrlProvider = {
  provide: UrlSerializer,
  useClass: TrailingSlashUrlSerializer,
};
