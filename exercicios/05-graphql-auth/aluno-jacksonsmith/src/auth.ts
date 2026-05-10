import { authorize } from 'react-native-app-auth';
import * as Keychain from 'react-native-keychain';

const config = {
  issuer: 'https://auth.myapp.com',
  clientId: 'mobile-app',
  redirectUrl: 'com.myapp:/oauth2callback',
  scopes: ['openid', 'profile'],
  usePKCE: true,
};

export async function login() {
  const result = await authorize(config);
  await Keychain.setGenericPassword('user', JSON.stringify(result));
  return result;
}
