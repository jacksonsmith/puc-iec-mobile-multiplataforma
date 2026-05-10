import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isAvailable(): Promise<boolean>;
  authenticate(reason: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeBiometrics');
