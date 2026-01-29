import ExpoModulesCore
import UIKit

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")

    Events("onChangeTheme")

    Function("setTheme") { (theme: String) -> Void in
      UserDefaults.standard.set(theme, forKey:"theme")
      let nextTheme = (theme == "system") ? self.getNativeTheme() : theme
      sendEvent("onChangeTheme", [
        "theme": nextTheme
      ])
    }

    Function("getTheme") { () -> String in
      if let savedTheme = UserDefaults.standard.string(forKey: "theme") {
        return savedTheme
      }
      return self.getNativeTheme()
    }

    Function("getNativeTheme") { () -> String in
      return self.getNativeTheme()
    }

    Function("getResolvedTheme") { () -> String in
      if let savedTheme = UserDefaults.standard.string(forKey: "theme") {
        if savedTheme == "system" {
          return self.getNativeTheme()
        }
        return savedTheme
      }
      return self.getNativeTheme()
    }
  }

  private func getNativeTheme() -> String {
      let userInterfaceStyle = UIScreen.main.traitCollection.userInterfaceStyle
      switch userInterfaceStyle {
        case .dark:
            return "dark"
        case .light:
            return "light"
        default:
            return "light"
      }
  }
}
