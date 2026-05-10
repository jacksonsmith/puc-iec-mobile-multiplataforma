import Foundation
import LocalAuthentication

@objc(NativeBiometrics)
class NativeBiometrics: NSObject {
    @objc func isAvailable(_ resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(true)
    }

    @objc func authenticate(_ reason: String,
                            resolver resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(true)
    }
}
