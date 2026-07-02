import Foundation
import React
import UIKit

@objc(NativeDeviceIntegrity)
final class NativeDeviceIntegrity: NSObject {
  @objc
  static func moduleName() -> String! {
    return "NativeDeviceIntegrity"
  }

  @objc
  func getDeviceName() -> String {
    return UIDevice.current.name
  }

  @objc
  func getOsVersion() -> String {
    return UIDevice.current.systemVersion
  }

  @objc
  func isRunningOnEmulator() -> Bool {
    #if targetEnvironment(simulator)
      return true
    #else
      return false
    #endif
  }

  @objc
  func getIntegritySnapshot(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let snapshot: [String: Any] = [
      "platform": "ios",
      "isEmulator": isRunningOnEmulator(),
      "isDebuggable": _isDebugAssertConfiguration(),
      "deviceName": getDeviceName(),
      "osVersion": getOsVersion(),
    ]

    resolve(snapshot)
  }
}
