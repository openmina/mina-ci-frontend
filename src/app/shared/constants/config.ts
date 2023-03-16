import { MinaEnv } from '@shared/types/core/environment/mina-env.type';
import { environment } from '@environment/environment';

export const CONFIG: Readonly<MinaEnv> = {
  ...environment,
  aggregator: getURL(environment.aggregator),
};

export function getURL(pathOrUrl: string): string {
  if (pathOrUrl) {
    let href = new URL(pathOrUrl, origin).href;
    if (href.endsWith('/')) {
      href = href.slice(0, -1);
    }
    return href;
  }
  return pathOrUrl;
}
