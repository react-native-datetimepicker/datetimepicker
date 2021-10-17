import UIKit

@objc(SwiftFunctions) class SwiftFunctions : NSObject {

    // Method to fix ios 14 and above issue with Calendar local
    // which can only be set with Swift code
    @objc func configureLocale(_ locale: Locale, datePicker: UIDatePicker) {
        datePicker.locale = locale;
        datePicker.calendar.locale = locale;
    }
}
