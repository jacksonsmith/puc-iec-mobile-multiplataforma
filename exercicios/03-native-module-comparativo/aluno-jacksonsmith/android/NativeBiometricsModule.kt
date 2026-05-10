package com.testapp

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class NativeBiometricsModule(reactContext: ReactApplicationContext) :
    NativeBiometricsSpec(reactContext) {
    override fun isAvailable(promise: Promise) = promise.resolve(true)
    override fun authenticate(reason: String, promise: Promise) = promise.resolve(true)
    override fun getName() = "NativeBiometrics"
}
