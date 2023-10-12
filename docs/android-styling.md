## Android Styling

### Configuration in app.json/app.config.js

```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-community/datetimepicker",
        {
          "android": {
            "datePicker": {
              "light": {
                "colorAccent": "#FF5722",
              },
              "dark": {
                "colorAccent": "#383838",
              }
            },
            "timePicker": {
              "light": {
                "background": "#FFC107"
              },
              "dark": {
                "background": "#FFC107"
              }
            }
          }
        }
      ]
    ]
  }
}
```

Due to a limitation in the way the plugin system works, works, it's not possible to write a custom styles.xml for the values-night, so when customizing a specific property, you must declare a value for both the `light` and `dark` themes. If you don't, the plugin will not work and the following error will be thrown:

> Error: The color "*" in values-night has no declaration in the base values folder; this can lead to crashes when the resource is queried in a configuration that does not match this qualifier

#### Invalid declaration example

  ```json
  {
    "expo": {
      "plugins": [
        [
          "@react-native-community/datetimepicker",
          {
            "android": {
              "datePicker": {
                "light": {
                  "colorAccent": "#FF5722",
                }
              }
            }
          }
        ]
      ]
    }
  }
  ```

### Configurable properties

The following illustrations show the different styles that can be applied to the date and time pickers.

DatePickerDialog | TimePickerDialog
--- | ---
![Date picker dialog breakdown](./images/date_picker_dialog_breakdown.png)|![Time picker breakdown](./images/time_picker_breakdown.png)

#### DatePickerDialog

| Property                    | Attribute Name                            |
|-----------------------------|-------------------------------------------|
| colorAccent                 | colorAccent                               |
| colorControlActivated       | colorControlActivated                    |
| colorControlHighlight       | colorControlHighlight                    |
| selectableItemBackgroundBorderless | android:selectableItemBackgroundBorderless |
| textColor                   | android:textColor                         |
| textColorPrimary            | android:textColorPrimary                  |
| textColorPrimaryInverse     | android:textColorPrimaryInverse           |
| textColorSecondary          | android:textColorSecondary                |
| textColorSecondaryInverse   | android:textColorSecondaryInverse         |
| windowBackground            | android:windowBackground                  |

#### TimePickerDialog

| Property                 | Attribute Name                    |
|--------------------------|-----------------------------------|
| background               | android:background                |
| headerBackground        | android:headerBackground         |
| numbersBackgroundColor  | android:numbersBackgroundColor   |
| numbersSelectorColor    | android:numbersSelectorColor     |
| numbersTextColor        | android:numbersTextColor         |
