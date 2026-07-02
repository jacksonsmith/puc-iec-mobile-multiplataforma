package com.alunoigorx8.deviceintegrity

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeDeviceIntegrityPackage : TurboReactPackage() {
  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext,
  ): NativeModule? {
    return if (name == NativeDeviceIntegrityModule.NAME) {
      NativeDeviceIntegrityModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
        NativeDeviceIntegrityModule.NAME to ReactModuleInfo(
          NativeDeviceIntegrityModule.NAME,
          NativeDeviceIntegrityModule.NAME,
          false,
          false,
          false,
          true,
        ),
      )
    }
  }
}
