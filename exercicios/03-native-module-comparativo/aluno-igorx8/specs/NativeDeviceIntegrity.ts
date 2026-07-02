import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type DeviceIntegritySnapshot = {
  platform: string;
  isEmulator: boolean;
  isDebuggable: boolean;
  deviceName: string;
  osVersion: string;
};

export interface Spec extends TurboModule {
  getDeviceName(): string;
  getOsVersion(): string;
  isRunningOnEmulator(): boolean;
  getIntegritySnapshot(): Promise<DeviceIntegritySnapshot>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeDeviceIntegrity');
