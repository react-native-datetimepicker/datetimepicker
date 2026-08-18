import {promises as fs} from 'fs';
import path from 'path';
import {compileModsAsync} from '@expo/config-plugins';

import withDateTimePickerStyles from '../withDateTimePickerStyles';

const temporaryProjectRoots = [];

afterEach(async () => {
  await Promise.all(
    temporaryProjectRoots
      .splice(0)
      .map((projectRoot) => fs.rm(projectRoot, {recursive: true, force: true})),
  );
});

const runAndroidPrebuild = async (timePicker) => {
  const projectRoot = await fs.mkdtemp(
    path.join(__dirname, 'android-prebuild-'),
  );
  temporaryProjectRoots.push(projectRoot);

  const valuesPath = path.join(projectRoot, 'android/app/src/main/res/values');
  const valuesNightPath = path.join(
    projectRoot,
    'android/app/src/main/res/values-night',
  );

  await Promise.all([
    fs.mkdir(valuesPath, {recursive: true}),
    fs.mkdir(valuesNightPath, {recursive: true}),
  ]);
  await Promise.all([
    fs.writeFile(
      path.join(valuesPath, 'styles.xml'),
      '<resources><style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar" /></resources>',
    ),
    fs.writeFile(path.join(valuesPath, 'colors.xml'), '<resources />'),
    fs.writeFile(path.join(valuesNightPath, 'colors.xml'), '<resources />'),
  ]);

  const config = withDateTimePickerStyles(
    {name: 'datetimepicker-plugin-test', slug: 'datetimepicker-plugin-test'},
    {android: {timePicker}},
  );

  await compileModsAsync(config, {projectRoot, platforms: ['android']});

  return {
    colors: await fs.readFile(path.join(valuesPath, 'colors.xml'), 'utf8'),
    colorsNight: await fs.readFile(
      path.join(valuesNightPath, 'colors.xml'),
      'utf8',
    ),
    styles: await fs.readFile(path.join(valuesPath, 'styles.xml'), 'utf8'),
  };
};

describe('withDateTimePickerStyles Android prebuild', () => {
  it('writes the inner time picker text colors and style attribute', async () => {
    const {colors, colorsNight, styles} = await runAndroidPrebuild({
      numbersInnerTextColor: {light: '#123456', dark: '#abcdef'},
    });

    expect(styles).toContain(
      '<item name="android:numbersInnerTextColor">@color/timePicker_numbersInnerTextColor</item>',
    );
    expect(colors).toContain(
      '<color name="timePicker_numbersInnerTextColor">#123456</color>',
    );
    expect(colorsNight).toContain(
      '<color name="timePicker_numbersInnerTextColor">#abcdef</color>',
    );
  });

  it('still rejects an unknown time picker attribute', async () => {
    await expect(
      runAndroidPrebuild({unknownTextColor: {light: '#123456'}}),
    ).rejects.toThrow('Invalid attribute name: unknownTextColor');
  });
});
