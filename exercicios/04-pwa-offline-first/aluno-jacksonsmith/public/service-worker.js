import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);
registerRoute(/\.(?:png|jpg|svg)$/, new CacheFirst({ cacheName: 'images' }));
registerRoute(/\/api\/feed/, new StaleWhileRevalidate({ cacheName: 'api-feed' }));
