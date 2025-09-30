import { describe, test, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '..', 'index.js');

function runCLI(args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, ...args], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        code,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    child.on('error', reject);
  });
}

describe('CLI Draw Command Validation', () => {
  test('should require --shape parameter', async () => {
    const result = await runCLI(['draw']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --shape is required. Please specify a shape to draw.');
  });

  test('should throw if not rectangle', async () => {
    const result = await runCLI(['draw', '--shape=circle'])

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Error: shapes other than rectangle have not been implemented yet. Please specify a shape to draw.')
  })

  test('should require --width for rectangle', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --width is required when drawing a rectangle.');
  });

  test('should require --height for rectangle', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '5']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --height is required when drawing a rectangle.');
  });

  test('should reject width of 0', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '0', '--height', '5']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --width must be a number greater than 0.');
  });

  test('should reject negative width', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '-5', '--height', '5']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --width must be a number greater than 0.');
  });

  test('should reject height of 0', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '5', '--height', '0']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --height must be a number greater than 0.');
  });

  test('should reject negative height', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '5', '--height', '-7']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --height must be a number greater than 0.');
  });

  test('should reject non-numeric width', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', 'abc', '--height', '5']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --width must be a number greater than 0.');
  });

  test('should reject non-numeric height', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '5', '--height', 'xyz']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --height must be a number greater than 0.');
  });

  test('should succeed with valid rectangle parameters', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '5', '--height', '7']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
  });

  test('should accept width as 1 (edge case)', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '1', '--height', '5']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
  });

  test('should accept height as 1 (edge case)', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '5', '--height', '1']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
  });

  test('should accept both width and height as 1 (1x1 edge case)', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '1', '--height', '1']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
    expect(result.stdout).toContain('*');
  });
});

describe('CLI Rectangle Drawing Output', () => {
  test('should draw 3x3 hollow rectangle', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '3', '--height', '3']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('***');
    expect(result.stdout).toContain('* *');
  });

  test('should draw 4x2 filled rectangle', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '4', '--height', '2', '--filled']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('****');
    // Both rows should be fully filled
    const lines = result.stdout.split('\n');
    const asteriskLines = lines.filter(line => line.includes('****'));
    expect(asteriskLines.length).toBeGreaterThanOrEqual(2);
  });

  test('should draw 1x1 rectangle (single asterisk)', async () => {
    const result = await runCLI(['draw', '--shape', 'rectangle', '--width', '1', '--height', '1']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('*');
  });
});

describe('CLI Help Commands', () => {
  test('should show general help', async () => {
    const result = await runCLI(['--help']);

    expect(result.code).toBe(1);
    expect(result.stdout).toMatch(/Usage: mycli <command> \[options\]/);
    expect(result.stdout).toContain('Commands:');
  });

  test('should show command-specific help', async () => {
    const result = await runCLI(['draw', '--help']);

    expect(result.code).toBe(1);
    expect(result.stdout).toMatch(/Usage: mycli draw \[options\]/);
    expect(result.stdout).toContain('--shape=<shape>');
    expect(result.stdout).toContain('--width=<width>');
    expect(result.stdout).toContain('--height=<height>');
  });

  test('should show error for unknown command', async () => {
    const result = await runCLI(['unknown']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Unknown command: unknown');
  });
});

describe('CLI File Output Error Handling', () => {
  test('should handle permission denied error (EACCES)', async () => {
    // Create a read-only directory
    const { mkdirSync, chmodSync, rmSync } = await import('fs');
    const testDir = 'test_readonly_dir';

    try {
      mkdirSync(testDir, { recursive: true });
      chmodSync(testDir, 0o444); // Read-only

      const result = await runCLI([
        'draw',
        '--shape', 'rectangle',
        '--width', '3',
        '--height', '3',
        '--output', `${testDir}/test`
      ]);

      expect(result.code).toBe(1);
      expect(result.stderr).toMatch(/IOError|Permission denied|EACCES/i);
    } finally {
      // Cleanup
      try {
        chmodSync(testDir, 0o755);
        rmSync(testDir, { recursive: true, force: true });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should handle directory path error (EISDIR)', async () => {
    const { mkdirSync, rmSync } = await import('fs');
    const testDir = 'test_eisdir';

    try {
      mkdirSync(testDir, { recursive: true });

      const result = await runCLI([
        'draw',
        '--shape', 'rectangle',
        '--width', '3',
        '--height', '3',
        '--output', testDir // Trying to write to a directory
      ]);

      expect(result.code).toBe(1);
      expect(result.stderr).toMatch(/IOError|is a directory|EISDIR/i);
    } finally {
      // Cleanup
      try {
        rmSync(testDir, { recursive: true, force: true });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should handle invalid path error', async () => {
    const result = await runCLI([
      'draw',
      '--shape', 'rectangle',
      '--width', '3',
      '--height', '3',
      '--output', '/nonexistent/deep/path/that/does/not/exist/file'
    ]);

    expect(result.code).toBe(1);
    expect(result.stderr).toMatch(/IOError|Failed to write|ENOENT/i);
  });

  test('should successfully write to valid file path', async () => {
    const { rmSync, existsSync } = await import('fs');
    const testFile = 'test_output_success';

    try {
      const result = await runCLI([
        'draw',
        '--shape', 'rectangle',
        '--width', '3',
        '--height', '3',
        '--output', testFile
      ]);

      expect(result.code).toBe(0);
      expect(result.stdout).toMatch(/FILE:.*HAS BEEN SUCCESSFULLY WRITTEN/);

      // Verify file was actually created in generated_shapes/
      const files = await import('fs').then(fs =>
        fs.readdirSync('generated_shapes')
      );
      const createdFile = files.find(f => f.startsWith(testFile));
      expect(createdFile).toBeDefined();
    } finally {
      // Cleanup - remove any files starting with testFile
      try {
        const { readdirSync, rmSync } = await import('fs');
        const files = readdirSync('generated_shapes');
        files.forEach(file => {
          if (file.startsWith(testFile)) {
            rmSync(`generated_shapes/${file}`);
          }
        });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
});