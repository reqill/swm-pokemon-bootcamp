import ExpoModulesCore

public class ContentTransitionViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ContentTransitionView")

    View(ContentTransitionView.self) {
      Prop("value") { (view: ContentTransitionView, prop: Double) in
        view.updateState(value: prop)
      }
    }
  }
}
