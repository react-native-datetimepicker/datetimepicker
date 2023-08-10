import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidColors,
  withAndroidColorsNight,
  withAndroidStyles,
} from '@expo/config-plugins';

type ResourceXML = AndroidConfig.Resources.ResourceXML;

type DatePickerProps = {
  colorAccent?: string;
  colorControlActivated?: string;
  colorControlHighlight?: string;
  textColor?: string;
  textColorPrimary?: string;
  textColorSecondary?: string;
  windowBackground?: string;
};

type DatePickerTheme = {light?: DatePickerProps; dark?: DatePickerProps};

type TimePickerProps = {
  background?: string;
  headerBackground?: string;
  numbersBackgroundColor?: string;
  numbersSelectorColor?: string;
  numbersTextColor?: string;
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

const TIME_PICKER_THEME_ATTRIBUTE = 'android:timePickerStyle';
const TIME_PICKER_STYLE_NAME = 'TimePickerTheme';
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

const {assignStylesValue, getAppThemeLightNoActionBarGroup} =
  AndroidConfig.Styles;

const {assignColorValue} = AndroidConfig.Colors;

const withDateTimePickerStyles: ConfigPlugin<Options> = (
  baseConfig,
  options = {},
) => {
  const {android = {}} = options;

  let newConfig = withAndroidColors(baseConfig, (config) => {
    if (android.datePicker?.light) {
      config.modResults = setAndroidColors(
        config.modResults,
        android.datePicker.light,
        DATE_PICKER_ALLOWED_ATTRIBUTES,
      );
    }

    if (android.timePicker?.light) {
      config.modResults = setAndroidColors(
        config.modResults,
        android.timePicker.light,
        TIME_PICKER_ALLOWED_ATTRIBUTES,
      );
    }

    return config;
  });

  newConfig = withAndroidColorsNight(newConfig, (config) => {
    if (android.datePicker?.dark) {
      config.modResults = setAndroidColors(
        config.modResults,
        android.datePicker.dark,
        DATE_PICKER_ALLOWED_ATTRIBUTES,
      );
    }

    if (android.timePicker?.dark) {
      config.modResults = setAndroidColors(
        config.modResults,
        android.timePicker.dark,
        TIME_PICKER_ALLOWED_ATTRIBUTES,
      );
    }

    return config;
  });

  newConfig = withAndroidStyles(newConfig, (config) => {
    if (android.datePicker) {
      config.modResults = setAndroidDatePickerStyles(
        config.modResults,
        android.datePicker,
      );
    }

    if (android.timePicker) {
      config.modResults = setAndroidTimePickerStyles(
        config.modResults,
        android.timePicker,
      );
    }

    return config;
  });

  return newConfig;
};

const setAndroidDatePickerStyles = (
  styles: ResourceXML,
  {light, dark}: DatePickerTheme,
): ResourceXML => {
  styles = Object.keys({...light, ...dark}).reduce((acc, attr) => {
    const {attrName, colorName} =
      DATE_PICKER_ALLOWED_ATTRIBUTES[attr as keyof DatePickerProps];

    return assignStylesValue(acc, {
      add: true,
      parent: {
        name: DATE_PICKER_STYLE_NAME,
        parent: 'Theme.AppCompat.Light.Dialog',
      },
      name: attrName,
      value: `@color/${colorName}`,
    });
  }, styles);

  styles = assignStylesValue(styles, {
    add: true,
    parent: getAppThemeLightNoActionBarGroup(),
    name: DATE_PICKER_THEME_ATTRIBUTE,
    value: `@style/${DATE_PICKER_STYLE_NAME}`,
  });

  return styles;
};

const setAndroidTimePickerStyles = (
  styles: ResourceXML,
  {light, dark}: TimePickerTheme,
): ResourceXML => {
  styles = Object.keys({...light, ...dark}).reduce((acc, attr) => {
    const {attrName, colorName} =
      TIME_PICKER_ALLOWED_ATTRIBUTES[attr as keyof TimePickerProps];

    return assignStylesValue(acc, {
      add: true,
      parent: {
        name: TIME_PICKER_STYLE_NAME,
        parent: 'android:Widget.Material.Light.TimePicker',
      },
      name: attrName,
      value: `@color/${colorName}`,
    });
  }, styles);

  styles = assignStylesValue(styles, {
    add: true,
    parent: getAppThemeLightNoActionBarGroup(),
    name: TIME_PICKER_THEME_ATTRIBUTE,
    value: `@style/${TIME_PICKER_STYLE_NAME}`,
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
