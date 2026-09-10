import {spawnSync} from 'child_process';
import path from 'path';

describe('TypeScript declarations', () => {
  it('allows optional nativeEvent.target on picker events (issue #927)', () => {
    const result = spawnSync(
      process.execPath,
      [
        require.resolve('typescript/bin/tsc'),
        '--noEmit',
        '--strict',
        '--esModuleInterop',
        '--skipLibCheck',
        '--jsx',
        'react-native',
        '--moduleResolution',
        'node',
        '--module',
        'commonjs',
        '--target',
        'esnext',
        path.join(__dirname, 'datetimepickerEvent.types.ts'),
      ],
      {encoding: 'utf8', cwd: path.join(__dirname, '..')},
    );

    const output = `${result.stdout}${result.stderr}`;
    expect({status: result.status, output}).toEqual({status: 0, output: ''});
  });
});
