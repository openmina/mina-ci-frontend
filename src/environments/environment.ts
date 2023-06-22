import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  aggregator: 'http://1.k8.openmina.com:31356/aggregator',
  drone: 'https://ci.openmina.com/openmina/mina/',
};
