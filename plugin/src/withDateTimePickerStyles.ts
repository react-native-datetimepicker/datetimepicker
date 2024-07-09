import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidColors,
  withAndroidColorsNight,
  withAndroidStyles,
} from '@expo/config-plugins';

type ResourceXML = AndroidConfig.Resources.ResourceXML;

const DATE_PICKER_ALLOWED_ATTRIBUTES = {
  colorAccent: {attrName: 'colorAccent', colorName: 'datePicker_colorAccent'},
  colorControlActivated: {
    attrName: 'colorControlActivated',
    colorName: 'datePicker_colorControlActivated',
  },
  colorControlHighlight: {
    attrName: 'colorControlHighlight',
    colorName: 'datePicker_colorControlHighlight',
  },
  selectableItemBackgroundBorderless: {
    attrName: 'android:selectableItemBackgroundBorderless',
    colorName: 'datePicker_selectableItemBackgroundBorderless',
  },
  textColor: {
    attrName: 'android:textColor',
    colorName: 'datePicker_textColor',
  },
  textColorPrimary: {
    attrName: 'android:textColorPrimary',
    colorName: 'datePicker_textColorPrimary',
  },
  textColorPrimaryInverse: {
    attrName: 'android:textColorPrimaryInverse',
    colorName: 'datePicker_textColorPrimaryInverse',
  },
  textColorSecondary: {
    attrName: 'android:textColorSecondary',
    colorName: 'datePicker_textColorSecondary',
  },
  textColorSecondaryInverse: {
    attrName: 'android:textColorSecondaryInverse',
    colorName: 'datePicker_textColorSecondaryInverse',
  },
  windowBackground: {
    attrName: 'android:windowBackground',
    colorName: 'datePicker_windowBackground',
  },
} as const;

type DatePickerProps = {
  [key in keyof typeof DATE_PICKER_ALLOWED_ATTRIBUTES]?: string;
};

type DatePickerTheme = {light?: DatePickerProps; dark?: DatePickerProps};

const TIME_PICKER_ALLOWED_ATTRIBUTES = {
  background: {
    attrName: 'android:background',
    colorName: 'timePicker_background',
  },
  headerBackground: {
    attrName: 'android:headerBackground',
    colorName: 'timePicker_headerBackground',
  },
  numbersBackgroundColor: {
    attrName: 'android:numbersBackgroundColor',
    colorName: 'timePicker_numbersBackgroundColor',
  },
  numbersSelectorColor: {
    attrName: 'android:numbersSelectorColor',
    colorName: 'timePicker_numbersSelectorColor',
  },
  numbersTextColor: {
    attrName: 'android:numbersTextColor',
    colorName: 'timePicker_numbersTextColor',
  },
} as const;

type TimePickerProps = {
  [key in keyof typeof TIME_PICKER_ALLOWED_ATTRIBUTES]?: string;
};

type TimePickerTheme = {light?: TimePickerProps; dark?: TimePickerProps};

type Options = {
  android?: {
    datePicker?: DatePickerTheme;
    timePicker?: TimePickerTheme;
  };
};

const DATE_PICKER_THEME_ATTRIBUTE = 'android:datePickerDialogTheme';
const DATE_PICKER_STYLE_NAME = 'DatePickerDialogTheme';

const TIME_PICKER_THEME_ATTRIBUTE = 'android:timePickerStyle';
const TIME_PICKER_STYLE_NAME = 'TimePickerTheme';

const {assignStylesValue, getAppThemeLightNoActionBarGroup} =
  AndroidConfig.Styles;

const {assignColorValue} = AndroidConfig.Colors;

const withDateTimePickerStyles: ConfigPlugin<Options> = (
  baseConfig,
  options = {},
) => {
  const {android = {}} = options;

  let newConfig = withAndroidColors(baseConfig, (config) => {
    for (const {attrs, theme} of [
      {attrs: DATE_PICKER_ALLOWED_ATTRIBUTES, theme: android.datePicker?.light},
      {attrs: TIME_PICKER_ALLOWED_ATTRIBUTES, theme: android.timePicker?.light},
    ]) {
      if (theme) {
        config.modResults = setAndroidColors(config.modResults, theme, attrs);
      }
    }

    return config;
  });

  newConfig = withAndroidColorsNight(newConfig, (config) => {
    for (const {attrs, theme} of [
      {attrs: DATE_PICKER_ALLOWED_ATTRIBUTES, theme: android.datePicker?.dark},
      {attrs: TIME_PICKER_ALLOWED_ATTRIBUTES, theme: android.timePicker?.dark},
    ]) {
      if (theme) {
        config.modResults = setAndroidColors(config.modResults, theme, attrs);
      }
    }

    return config;
  });

  newConfig = withAndroidStyles(newConfig, (config) => {
    if (android.datePicker) {
      config.modResults = setAndroidPickerStyles(
        config.modResults,
        android.datePicker,
        {
          allowedAttributes: DATE_PICKER_ALLOWED_ATTRIBUTES,
          styleName: DATE_PICKER_STYLE_NAME,
          parentStyle: 'Theme.AppCompat.Light.Dialog',
          themeAttribute: DATE_PICKER_THEME_ATTRIBUTE,
        },
      );
    }

    if (android.timePicker) {
      config.modResults = setAndroidPickerStyles(
        config.modResults,
        android.timePicker,
        {
          allowedAttributes: TIME_PICKER_ALLOWED_ATTRIBUTES,
          styleName: TIME_PICKER_STYLE_NAME,
          parentStyle: 'android:Widget.Material.Light.TimePicker',
          themeAttribute: TIME_PICKER_THEME_ATTRIBUTE,
        },
      );
    }

    return config;
  });

  return newConfig;
};

const setAndroidPickerStyles = (
  styles: ResourceXML,
  theme: DatePickerTheme | TimePickerTheme,
  config: {
    allowedAttributes:
      | typeof DATE_PICKER_ALLOWED_ATTRIBUTES
      | typeof TIME_PICKER_ALLOWED_ATTRIBUTES;
    styleName: string;
    parentStyle: string;
    themeAttribute: string;
  },
): ResourceXML => {
  const {allowedAttributes, styleName, parentStyle, themeAttribute} = config;

  styles = Object.keys({...theme.light, ...theme.dark}).reduce((acc, attr) => {
    const entry =
      allowedAttributes[attr as keyof (DatePickerProps | TimePickerProps)];
    if (!entry) {
      return acc;
    }
    const {attrName, colorName} = entry;

    return assignStylesValue(acc, {
      add: true,
      parent: {
        name: styleName,
        parent: parentStyle,
      },
      name: attrName,
      value: `@color/${colorName}`,
    });
  }, styles);

  styles = assignStylesValue(styles, {
    add: true,
    parent: getAppThemeLightNoActionBarGroup(),
    name: themeAttribute,
    value: `@style/${styleName}`,
  });

  return styles;
};

const setAndroidColors = (
  colors: ResourceXML,
  theme: DatePickerProps | TimePickerProps,
  allowedAttributes:
    | typeof DATE_PICKER_ALLOWED_ATTRIBUTES
    | typeof TIME_PICKER_ALLOWED_ATTRIBUTES,
): ResourceXML => {
  colors = Object.keys(theme).reduce((acc, attr) => {
    const {colorName} =
      allowedAttributes[attr as keyof typeof allowedAttributes];

    return assignColorValue(acc, {
      value: theme[attr as keyof typeof allowedAttributes],
      name: colorName,
    });
  }, colors);

  return colors;
};

export default withDateTimePickerStyles;
