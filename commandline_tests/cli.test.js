import { describe, test, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '..', 'cli', 'index.js');

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

/**
 * Helper function to clean up test files from generated_shapes directory
 * @param {string} prefix - File name prefix to match for cleanup
 */
async function cleanupGeneratedFiles(prefix) {
  try {
    const { readdirSync, rmSync } = await import('fs');
    const files = readdirSync('generated_shapes');
    files.forEach(file => {
      if (file.startsWith(prefix)) {
        rmSync(`generated_shapes/${file}`);
      }
    });
  } catch {
    // Ignore cleanup errors
  }
}

describe('CLI Draw Command Validation', () => {
  test('should require --shape parameter', async () => {
    const result = await runCLI(['draw']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --shape is required. Please specify a shape to draw.');
  });

  test('should require --radius for circle', async () => {
    const result = await runCLI(['draw', '--shape=circle'])

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Error: --radius is required when drawing a polygon or circle.')
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

describe('CLI Circle Drawing Output', () => {
  test('should draw hollow circle with radius 3', async () => {
    const result = await runCLI(['draw', '--shape', 'circle', '--radius', '3']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('*');
    // Should have a 7x7 grid (radius * 2 + 1)
    const lines = result.stdout.split('\n').filter(l => l.trim().length > 0);
    expect(lines.length).toBeGreaterThanOrEqual(5);
  });

  test('should draw filled circle with radius 3', async () => {
    const result = await runCLI(['draw', '--shape', 'circle', '--radius', '3', '--filled']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('*');
    // Filled circle should have more asterisks than hollow
    const asteriskCount = (result.stdout.match(/\*/g) || []).length;
    expect(asteriskCount).toBeGreaterThan(4);
  });
});

describe('CLI Polygon Validation', () => {
  test('should require --radius for polygon', async () => {
    const result = await runCLI(['draw', '--shape=polygon']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --radius is required when drawing a polygon or circle.');
  });

  test('should require --sides for polygon', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '4']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --sides is required when drawing a polygon.');
  });

  test('should reject radius of 0 for polygon', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '0', '--sides', '5']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --radius must be a number greater than 0.');
  });

  test('should reject negative radius for polygon', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '-3', '--sides', '5']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --radius must be a number greater than 0.');
  });

  test('should reject non-numeric radius for polygon', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', 'abc', '--sides', '5']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --radius must be a number greater than 0.');
  });

  test('should reject sides less than 3', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '4', '--sides', '2']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --sides must be a number greater than 3.');
  });

  test('should reject sides equal to 3 (boundary)', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '4', '--sides', '3']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --sides must be a number greater than 3.');
  });

  test('should reject negative sides', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '4', '--sides', '-5']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --sides must be a number greater than 3.');
  });

  test('should reject non-numeric sides', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '4', '--sides', 'xyz']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --sides must be a number greater than 3.');
  });

  test('should succeed with valid polygon parameters (4 sides)', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '4', '--sides', '4']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
    expect(result.stdout).toContain('*');
  });

  test('should succeed with valid polygon parameters (5 sides)', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '5', '--sides', '5']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
    expect(result.stdout).toContain('*');
  });

  test('should accept sides as 4 (minimum valid)', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '3', '--sides', '4']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
  });

  test('should accept radius as 1 (edge case)', async () => {
    const result = await runCLI(['draw', '--shape=polygon', '--radius', '1', '--sides', '6']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
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
      } catch {
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
      } catch {
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
      await cleanupGeneratedFiles(testFile);
    }
  });

  test('should append to existing file with append subcommand', async () => {
    const { writeFileSync, readFileSync, rmSync } = await import('fs');
    const testFile = 'generated_shapes/test_append.txt';

    try {
      // Create initial file
      writeFileSync(testFile, '*****\n*   *\n*****\n', 'utf-8');

      // Append to file
      const result = await runCLI([
        'draw',
        'append',
        '--shape', 'rectangle',
        '--width', '5',
        '--height', '3',
        '--output', testFile
      ]);

      expect(result.code).toBe(0);
      expect(result.stdout).toMatch(/FILE:.*HAS BEEN APPENDED/);

      // Verify file contains both rectangles
      const content = readFileSync(testFile, 'utf-8');
      const lines = content.split('\n').filter(l => l.length > 0);
      expect(lines.length).toBe(6); // Two 3-line rectangles
    } finally {
      // Cleanup
      try {
        rmSync(testFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  test('should overwrite existing file without append subcommand', async () => {
    const { writeFileSync, readFileSync, rmSync, mkdirSync } = await import('fs');
    const testFile = 'generated_shapes/test_overwrite.txt';

    try {
      mkdirSync('generated_shapes', { recursive: true });

      // Create initial file with content
      writeFileSync(testFile, 'OLD CONTENT\n', 'utf-8');

      // Draw without append - should overwrite
      const result = await runCLI([
        'draw',
        '--shape', 'rectangle',
        '--width', '3',
        '--height', '2',
        '--output', testFile
      ]);

      expect(result.code).toBe(0);
      expect(result.stdout).toMatch(/FILE:.*HAS BEEN SUCCESSFULLY WRITTEN/);

      // Verify file contains only new rectangle (overwritten)
      const content = readFileSync(testFile, 'utf-8');
      expect(content).not.toContain('OLD CONTENT');
      expect(content).toContain('***');
    } finally {
      // Cleanup
      try {
        rmSync(testFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  });
});

describe('CLI Banner Command Validation', () => {
  test('should require --text parameter', async () => {
    const result = await runCLI(['banner']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --text is required. Please specify text to render.');
  });

  test('should reject lowercase letters', async () => {
    const result = await runCLI(['banner', '--text=hello']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --text must contain only uppercase letters (A-Z) and numbers (0-9).');
  });

  test('should reject special characters', async () => {
    const result = await runCLI(['banner', '--text=HELLO!']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --text must contain only uppercase letters (A-Z) and numbers (0-9).');
  });

  test('should reject spaces in text', async () => {
    const result = await runCLI(['banner', '--text=HELLO WORLD']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --text must contain only uppercase letters (A-Z) and numbers (0-9).');
  });

  test('should accept uppercase letters only', async () => {
    const result = await runCLI(['banner', '--text=HELLO']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
    expect(result.stdout).toContain('*');
  });

  test('should accept numbers only', async () => {
    const result = await runCLI(['banner', '--text=123']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
    expect(result.stdout).toContain('*');
  });

  test('should accept mixed letters and numbers', async () => {
    const result = await runCLI(['banner', '--text=ABC123']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
    expect(result.stdout).toContain('*');
  });

  test('should accept single character', async () => {
    const result = await runCLI(['banner', '--text=A']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
    expect(result.stdout).toContain('*');
  });

  test('should accept valid fillPattern (dots)', async () => {
    const result = await runCLI(['banner', '--text=HELLO', '--fillPattern=dots']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
    expect(result.stdout).toContain('*');
  });

  test('should reject invalid fillPattern', async () => {
    const result = await runCLI(['banner', '--text=HELLO', '--fillPattern=invalid']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --fillPattern must be one of: dots, gradient, diagonal, crosshatch');
  });

  test('should reject another invalid fillPattern (stripes)', async () => {
    const result = await runCLI(['banner', '--text=HELLO', '--fillPattern=stripes']);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Error: --fillPattern must be one of: dots, gradient, diagonal, crosshatch');
  });

  test('should work without fillPattern (optional)', async () => {
    const result = await runCLI(['banner', '--text=HELLO']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Hi there!');
    expect(result.stdout).toContain('*');
  });
});

describe('CLI Banner Output', () => {
  test('should generate ASCII art for HELLO', async () => {
    const result = await runCLI(['banner', '--text=HELLO']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('*');
    // Should have ASCII art output
    const asteriskCount = (result.stdout.match(/\*/g) || []).length;
    expect(asteriskCount).toBeGreaterThan(10); // HELLO has many asterisks
  });

  test('should generate ASCII art for 123', async () => {
    const result = await runCLI(['banner', '--text=123']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('*');
    const asteriskCount = (result.stdout.match(/\*/g) || []).length;
    expect(asteriskCount).toBeGreaterThan(5); // 123 has asterisks
  });

  test('should generate ASCII art for ASCII123', async () => {
    const result = await runCLI(['banner', '--text=ASCII123']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('*');
    const asteriskCount = (result.stdout.match(/\*/g) || []).length;
    expect(asteriskCount).toBeGreaterThan(20); // ASCII123 has many asterisks
  });
});

describe('CLI Banner File Output', () => {
  test('should write HELLO to file', async () => {
    const testFile = 'test_banner_hello';

    try {
      const result = await runCLI([
        'banner',
        '--text=HELLO',
        '--output', testFile
      ]);

      expect(result.code).toBe(0);
      expect(result.stdout).toMatch(/FILE:.*HAS BEEN SUCCESSFULLY WRITTEN/);

      // Verify file was created in generated_shapes/
      const files = await import('fs').then(fs =>
        fs.readdirSync('generated_shapes')
      );
      const createdFile = files.find(f => f.startsWith(testFile));
      expect(createdFile).toBeDefined();

      // Verify file content has ASCII art
      const { readFileSync } = await import('fs');
      const filePath = `generated_shapes/${createdFile}`;
      const content = readFileSync(filePath, 'utf-8');
      expect(content).toContain('*');
      const lines = content.split('\n').filter(l => l.includes('*'));
      expect(lines.length).toBe(5);
    } finally {
      await cleanupGeneratedFiles(testFile);
    }
  });

  test('should write 123 to file', async () => {
    const testFile = 'test_banner_123';

    try {
      const result = await runCLI([
        'banner',
        '--text=123',
        '--output', testFile
      ]);

      expect(result.code).toBe(0);
      expect(result.stdout).toMatch(/FILE:.*HAS BEEN SUCCESSFULLY WRITTEN/);

      // Verify file was created
      const files = await import('fs').then(fs =>
        fs.readdirSync('generated_shapes')
      );
      const createdFile = files.find(f => f.startsWith(testFile));
      expect(createdFile).toBeDefined();

      // Verify file content
      const { readFileSync } = await import('fs');
      const filePath = `generated_shapes/${createdFile}`;
      const content = readFileSync(filePath, 'utf-8');
      expect(content).toContain('*');
      const lines = content.split('\n').filter(l => l.includes('*'));
      expect(lines.length).toBe(5);
    } finally {
      await cleanupGeneratedFiles(testFile);
    }
  });

  test('should write ASCII123 to file', async () => {
    const testFile = 'test_banner_ascii123';

    try {
      const result = await runCLI([
        'banner',
        '--text=ASCII123',
        '--output', testFile
      ]);

      expect(result.code).toBe(0);
      expect(result.stdout).toMatch(/FILE:.*HAS BEEN SUCCESSFULLY WRITTEN/);

      // Verify file was created
      const files = await import('fs').then(fs =>
        fs.readdirSync('generated_shapes')
      );
      const createdFile = files.find(f => f.startsWith(testFile));
      expect(createdFile).toBeDefined();

      // Verify file content
      const { readFileSync } = await import('fs');
      const filePath = `generated_shapes/${createdFile}`;
      const content = readFileSync(filePath, 'utf-8');
      expect(content).toContain('*');
      const lines = content.split('\n').filter(l => l.includes('*'));
      expect(lines.length).toBe(5);
    } finally {
      await cleanupGeneratedFiles(testFile);
    }
  });

  test('should append banner to existing file', async () => {
    const { writeFileSync, readFileSync, rmSync, mkdirSync } = await import('fs');
    const testFile = 'generated_shapes/test_banner_append.txt';

    try {
      mkdirSync('generated_shapes', { recursive: true });

      // Create initial file with content
      writeFileSync(testFile, 'INITIAL CONTENT\n', 'utf-8');

      // Append banner
      const result = await runCLI([
        'banner',
        'append',
        '--text=HI',
        '--output', testFile
      ]);

      expect(result.code).toBe(0);
      expect(result.stdout).toMatch(/FILE:.*HAS BEEN APPENDED/);

      // Verify file contains both initial content and banner
      const content = readFileSync(testFile, 'utf-8');
      expect(content).toContain('INITIAL CONTENT');
      expect(content).toContain('*');
    } finally {
      // Cleanup
      try {
        rmSync(testFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  });
});