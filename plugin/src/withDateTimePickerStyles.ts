import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidColors,
  withAndroidColorsNight,
  withAndroidStyles,
} from '@expo/config-plugins';

type ResourceXML = AndroidConfig.Resources.ResourceXML;

const moduleName = 'RNDatetimePicker: ';

const DATE_PICKER_ALLOWED_ATTRIBUTES = {
  colorAccent: {attrName: 'colorAccent'},
  colorControlActivated: {
    attrName: 'colorControlActivated',
  },
  colorControlHighlight: {
    attrName: 'colorControlHighlight',
  },
  selectableItemBackgroundBorderless: {
    attrName: 'android:selectableItemBackgroundBorderless',
  },
  textColor: {
    attrName: 'android:textColor',
  },
  textColorPrimary: {
    attrName: 'android:textColorPrimary',
  },
  textColorPrimaryInverse: {
    attrName: 'android:textColorPrimaryInverse',
  },
  textColorSecondary: {
    attrName: 'android:textColorSecondary',
  },
  textColorSecondaryInverse: {
    attrName: 'android:textColorSecondaryInverse',
  },
  windowBackground: {
    attrName: 'android:windowBackground',
  },
} as const;

type ColorDefinition = {
  light: string;
  dark?: string;
};
type DatePickerProps = {
  [key in keyof typeof DATE_PICKER_ALLOWED_ATTRIBUTES]?: ColorDefinition;
};

const TIME_PICKER_ALLOWED_ATTRIBUTES = {
  background: {
    attrName: 'android:background',
  },
  headerBackground: {
    attrName: 'android:headerBackground',
  },
  numbersBackgroundColor: {
    attrName: 'android:numbersBackgroundColor',
  },
  numbersSelectorColor: {
    attrName: 'android:numbersSelectorColor',
  },
  numbersTextColor: {
    attrName: 'android:numbersTextColor',
  },
} as const;

type TimePickerProps = {
  [key in keyof typeof TIME_PICKER_ALLOWED_ATTRIBUTES]?: ColorDefinition;
};

type Options = {
  android?: {
    datePicker?: DatePickerProps;
    timePicker?: TimePickerProps;
  };
};

const DATE_PICKER_THEME_ATTRIBUTE = 'android:datePickerDialogTheme';
const DATE_PICKER_STYLE_NAME = 'DatePickerDialogTheme';

const TIME_PICKER_THEME_ATTRIBUTE = 'android:timePickerStyle';
const TIME_PICKER_STYLE_NAME = 'TimePickerTheme';

const {assignStylesValue, getAppThemeLightNoActionBarGroup} =
  AndroidConfig.Styles;

const {assignColorValue} = AndroidConfig.Colors;

const insertColorEntries = (
  android: Options['android'] = {},
  config: {modResults: ResourceXML},
  themedColorExtractor: (
    color: ColorDefinition,
    attrName: string,
  ) => string | undefined,
) => {
  for (const {theme, attrPrefix} of [
    {theme: android.datePicker, attrPrefix: 'datePicker'},
    {theme: android.timePicker, attrPrefix: 'timePicker'},
  ]) {
    config.modResults = setAndroidColors(
      config.modResults,
      attrPrefix,
      themedColorExtractor,
      theme,
    );
  }
};

const setAndroidColors = (
  colors: ResourceXML,
  attrPrefix: string,
  themedColorExtractor: (
    color: ColorDefinition,
    attrName: string,
  ) => string | undefined,
  theme?: DatePickerProps | TimePickerProps,
): ResourceXML => {
  if (!theme) {
    return colors;
  }
  colors = Object.entries(theme).reduce((acc, [attrName, colors]) => {
    const color = {
      name: `${attrPrefix}_${attrName}`,
      value: themedColorExtractor(colors, attrName) ?? null,
    };
    return assignColorValue(acc, color);
  }, colors);

  return colors;
};

const withDateTimePickerStyles: ConfigPlugin<Options> = (
  baseConfig,
  options = {},
) => {
  const {android = {}} = options;

  let newConfig = withAndroidColors(baseConfig, (config) => {
    insertColorEntries(android, config, (color, attrName) => {
      const value = color.light;
      if (!value) {
        throw new Error(
          `${moduleName}A light color value was not provided for "${attrName}". Providing at least a light color is required.`,
        );
      }
      return value;
    });
    return config;
  });

  newConfig = withAndroidColorsNight(newConfig, (config) => {
    insertColorEntries(android, config, (color) => color.dark);
    return config;
  });

  newConfig = withAndroidStyles(newConfig, (config) => {
    config.modResults = setAndroidPickerStyles(
      config.modResults,
      android.datePicker,
      {
        styleName: DATE_PICKER_STYLE_NAME,
        parentStyle: 'Theme.AppCompat.Light.Dialog',
        themeAttribute: DATE_PICKER_THEME_ATTRIBUTE,
        allowedAttributes: DATE_PICKER_ALLOWED_ATTRIBUTES,
        attrPrefix: 'datePicker',
      },
    );

    config.modResults = setAndroidPickerStyles(
      config.modResults,
      android.timePicker,
      {
        styleName: TIME_PICKER_STYLE_NAME,
        parentStyle: 'android:Widget.Material.Light.TimePicker',
        themeAttribute: TIME_PICKER_THEME_ATTRIBUTE,
        allowedAttributes: TIME_PICKER_ALLOWED_ATTRIBUTES,
        attrPrefix: 'timePicker',
      },
    );

    return config;
  });

  return newConfig;
};

const setAndroidPickerStyles = (
  styles: ResourceXML,
  theme: DatePickerProps | TimePickerProps | undefined,
  config: {
    styleName: string;
    parentStyle: string;
    themeAttribute: string;
    allowedAttributes:
      | typeof DATE_PICKER_ALLOWED_ATTRIBUTES
      | typeof TIME_PICKER_ALLOWED_ATTRIBUTES;
    attrPrefix: string;
  },
): ResourceXML => {
  if (!theme) {
    return styles;
  }
  const {
    allowedAttributes,
    styleName,
    parentStyle,
    themeAttribute,
    attrPrefix,
  } = config;

  styles = Object.keys(theme).reduce((acc, userFacingAttrName) => {
    const entry =
      allowedAttributes[
        userFacingAttrName as keyof (DatePickerProps | TimePickerProps)
      ];
    if (!entry) {
      throw new Error(
        `${moduleName}Invalid attribute name: ${userFacingAttrName}. Supported are ${Object.keys(
          allowedAttributes,
        ).join(', ')}`,
      );
    }
    const {attrName} = entry;

    return assignStylesValue(acc, {
      add: true,
      parent: {
        name: styleName,
        parent: parentStyle,
      },
      name: attrName,
      value: `@color/${attrPrefix}_${userFacingAttrName}`,
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

export default withDateTimePickerStyles;
