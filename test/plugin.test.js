import fs from 'fs';
import path from 'path';
import vm from 'vm';
import ts from 'typescript';

describe('Expo config plugin', () => {
  it('loads config plugins through the Expo package re-export', () => {
    const sourcePath = path.join(
      __dirname,
      '../plugin/src/withDateTimePickerStyles.ts',
    );
    const source = fs.readFileSync(sourcePath, 'utf8');
    const {outputText} = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: sourcePath,
    });
    const requestedModules = [];
    const pluginModule = {exports: {}};
    const expoConfigPlugins = {
      AndroidConfig: {
        Colors: {assignColorValue: jest.fn()},
        Styles: {
          assignStylesValue: jest.fn(),
          getAppThemeGroup: jest.fn(),
        },
      },
      withAndroidColors: jest.fn(),
      withAndroidColorsNight: jest.fn(),
      withAndroidStyles: jest.fn(),
    };

    vm.runInNewContext(
      outputText,
      {
        exports: pluginModule.exports,
        module: pluginModule,
        require: (request) => {
          requestedModules.push(request);
          if (request === 'expo/config-plugins') {
            return expoConfigPlugins;
          }
          throw new Error(`Cannot find module '${request}'`);
        },
      },
      {filename: sourcePath},
    );

    expect(requestedModules).toEqual(['expo/config-plugins']);
    expect(pluginModule.exports.default).toEqual(expect.any(Function));
  });
});
