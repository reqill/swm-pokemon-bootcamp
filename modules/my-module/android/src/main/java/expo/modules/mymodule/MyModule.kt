package expo.modules.mymodule

import android.content.Context
import android.content.SharedPreferences
import android.content.res.Configuration
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyModule")

    Events("onChangeTheme")

    Function("setTheme") { theme: String ->
      getPreferences().edit().putString("theme", theme).apply()
      val nextTheme = if (theme == "system") getNativeTheme() else theme
      this@MyModule.sendEvent("onChangeTheme", bundleOf("theme" to nextTheme))
    }

    Function("getTheme") {
      val savedTheme = getPreferences().getString("theme", null)
      return@Function savedTheme ?: getNativeTheme()
    }

    Function("getNativeTheme") {
      return@Function getNativeTheme()
    }

    Function("getResolvedTheme") {
      val savedTheme = getPreferences().getString("theme", null)
      return@Function when {
        savedTheme == null -> getNativeTheme()
        savedTheme == "system" -> getNativeTheme()
        else -> savedTheme
      }
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }

  private fun getNativeTheme(): String {
    val nightModeFlags = context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
    return when (nightModeFlags) {
      Configuration.UI_MODE_NIGHT_YES -> "dark"
      Configuration.UI_MODE_NIGHT_NO -> "light"
      else -> "light"
    }
  }
}
