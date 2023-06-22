import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  aggregator: window['env']['aggregator'],
  drone: window['env']['drone'],
};
