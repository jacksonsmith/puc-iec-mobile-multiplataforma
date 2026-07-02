#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NativeDeviceIntegrity, NSObject)

RCT_EXTERN_METHOD(getDeviceName)
RCT_EXTERN_METHOD(getOsVersion)
RCT_EXTERN_METHOD(isRunningOnEmulator)
RCT_EXTERN_METHOD(getIntegritySnapshot:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
