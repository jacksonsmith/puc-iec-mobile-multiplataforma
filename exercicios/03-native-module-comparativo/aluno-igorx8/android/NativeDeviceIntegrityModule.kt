package com.alunoigorx8.deviceintegrity

import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeMap

class NativeDeviceIntegrityModule(
  reactContext: ReactApplicationContext,
) : NativeDeviceIntegritySpec(reactContext) {

  override fun getName(): String = NAME

  override fun getDeviceName(): String {
    val manufacturer = Build.MANUFACTURER.orEmpty().replaceFirstChar { it.uppercase() }
    val model = Build.MODEL.orEmpty()
    return if (model.startsWith(manufacturer, ignoreCase = true)) model else "$manufacturer $model"
  }

  override fun getOsVersion(): String = Build.VERSION.RELEASE ?: "unknown"

  override fun isRunningOnEmulator(): Boolean {
    return Build.FINGERPRINT.startsWith("generic") ||
      Build.FINGERPRINT.startsWith("unknown") ||
      Build.MODEL.contains("google_sdk", ignoreCase = true) ||
      Build.MODEL.contains("Emulator", ignoreCase = true) ||
      Build.MODEL.contains("Android SDK built for x86", ignoreCase = true) ||
      Build.MANUFACTURER.contains("Genymotion", ignoreCase = true) ||
      Build.BRAND.startsWith("generic") && Build.DEVICE.startsWith("generic") ||
      Build.PRODUCT == "google_sdk"
  }

  override fun getIntegritySnapshot(promise: Promise) {
    val snapshot = WritableNativeMap().apply {
      putString("platform", "android")
      putBoolean("isEmulator", isRunningOnEmulator())
      putBoolean("isDebuggable", Build.TYPE == "userdebug" || Build.TYPE == "eng")
      putString("deviceName", getDeviceName())
      putString("osVersion", getOsVersion())
    }

    promise.resolve(snapshot)
  }

  companion object {
    const val NAME = "NativeDeviceIntegrity"
  }
}
