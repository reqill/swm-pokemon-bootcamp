import ExpoModulesCore
import WebKit
import SwiftUI

class ContentTransitionView: ExpoView {
  private let hostingController = UIHostingController(rootView: AnyView(EmptyView()))
  
  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    setupHostingController()
  }
  
  private func setupHostingController() {
    hostingController.view.translatesAutoresizingMaskIntoConstraints = false
    
    addSubview(hostingController.view)
    
    NSLayoutConstraint.activate([
      hostingController.view.topAnchor.constraint(equalTo: topAnchor),
      hostingController.view.bottomAnchor.constraint(equalTo: bottomAnchor),
      hostingController.view.leadingAnchor.constraint(equalTo: leadingAnchor),
      hostingController.view.trailingAnchor.constraint(equalTo: trailingAnchor)
    ])
  }
  
  func updateState(value: Double) {
    if #available(iOS 17.0, *) {
      let swiftUIView = IncrementingCurrencyView(value: value)
      hostingController.rootView = AnyView(swiftUIView)
    } else {
      hostingController.rootView = AnyView(Text("Requires iOS 17+"))
    }
  }
}

@available(iOS 17.0, *)
struct IncrementingCurrencyView: View {
  var value: Double
  
  var body: some View {
    VStack {
      Text("\(NSNumber(value: value), formatter: NumberFormatter())")
        .contentTransition(.numericText(value: value))
        .animation(.default, value: value)
        .font(.largeTitle)
        .bold()
    }
  }
}

