// src/routes/linking.ts
//
// BÔNUS — deep link: expo://detail/<id> abre a MovieDetail direto.
// Doc: https://reactnavigation.org/docs/deep-linking

import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '@/routes/RootStack';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['expo://', 'aula02://'],
  config: {
    screens: {
      Home: {
        path: '',
        screens: {
          Movies: '',
          Favorites: 'favorites',
        },
      },
      Detail: {
        path: 'detail/:id',
        parse: { id: Number },
      },
    },
  },
};
