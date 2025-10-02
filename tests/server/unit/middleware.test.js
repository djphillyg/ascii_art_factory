import { describe, test, expect, vi } from 'vitest';
import { validate } from '../../../server/middleware/validate.js';
import { generateSchema } from '../../../server/validation/schemas/generate.js';

// Helper to create mock req, res, next
function createMocks(body = {}) {
  const req = { body };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  const next = vi.fn();
  return { req, res, next };
}

describe('Validate Middleware', () => {
  test('should call next() when validation passes', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: 3 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should return 400 with error when validation fails', () => {
    const { req, res, next } = createMocks({
      type: 'invalid-type',
      options: {},
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Rectangle Validation', () => {
  test('should require width for rectangle', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { height: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('width'),
      })
    );
  });

  test('should require height for rectangle', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('height'),
      })
    );
  });

  test('should reject width of 0', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 0, height: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('width'),
      })
    );
  });

  test('should reject negative width', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: -5, height: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('width'),
      })
    );
  });

  test('should reject height of 0', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: 0 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('height'),
      })
    );
  });

  test('should reject negative height', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: -7 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('height'),
      })
    );
  });

  test('should accept valid rectangle parameters', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: 7 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should accept width as 1 (edge case)', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 1, height: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should accept height as 1 (edge case)', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: 1 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should accept both width and height as 1', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 1, height: 1 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('Circle Validation', () => {
  test('should require radius for circle', () => {
    const { req, res, next } = createMocks({
      type: 'circle',
      options: {},
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('radius'),
      })
    );
  });

  test('should reject radius of 0', () => {
    const { req, res, next } = createMocks({
      type: 'circle',
      options: { radius: 0 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('radius'),
      })
    );
  });

  test('should reject negative radius', () => {
    const { req, res, next } = createMocks({
      type: 'circle',
      options: { radius: -3 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('radius'),
      })
    );
  });

  test('should accept valid circle parameters', () => {
    const { req, res, next } = createMocks({
      type: 'circle',
      options: { radius: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should accept radius as 1 (edge case)', () => {
    const { req, res, next } = createMocks({
      type: 'circle',
      options: { radius: 1 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('Polygon Validation', () => {
  test('should require radius for polygon', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { sides: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('radius'),
      })
    );
  });

  test('should require sides for polygon', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: 4 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('sides'),
      })
    );
  });

  test('should reject radius of 0 for polygon', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: 0, sides: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('radius'),
      })
    );
  });

  test('should reject negative radius for polygon', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: -3, sides: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('radius'),
      })
    );
  });

  test('should reject sides less than or equal to 3', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: 4, sides: 3 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('sides'),
      })
    );
  });

  test('should reject sides equal to 2', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: 4, sides: 2 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('sides'),
      })
    );
  });

  test('should reject negative sides', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: 4, sides: -5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('sides'),
      })
    );
  });

  test('should accept valid polygon with 4 sides', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: 4, sides: 4 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should accept valid polygon with 5 sides', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: 5, sides: 5 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should accept sides as 4 (minimum valid)', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: 3, sides: 4 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should accept radius as 1 (edge case)', () => {
    const { req, res, next } = createMocks({
      type: 'polygon',
      options: { radius: 1, sides: 6 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('Text Validation', () => {
  test('should require text parameter', () => {
    const { req, res, next } = createMocks({
      type: 'text',
      options: {},
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('text'),
      })
    );
  });

  test('should reject lowercase letters', () => {
    const { req, res, next } = createMocks({
      type: 'text',
      options: { text: 'hello' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('A-Z'),
      })
    );
  });

  test('should reject special characters', () => {
    const { req, res, next } = createMocks({
      type: 'text',
      options: { text: 'HELLO!' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('A-Z'),
      })
    );
  });

  test('should reject spaces in text', () => {
    const { req, res, next } = createMocks({
      type: 'text',
      options: { text: 'HELLO WORLD' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('A-Z'),
      })
    );
  });

  test('should accept uppercase letters only', () => {
    const { req, res, next } = createMocks({
      type: 'text',
      options: { text: 'HELLO' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should accept numbers only', () => {
    const { req, res, next } = createMocks({
      type: 'text',
      options: { text: '123' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should accept mixed letters and numbers', () => {
    const { req, res, next } = createMocks({
      type: 'text',
      options: { text: 'ABC123' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should accept single character', () => {
    const { req, res, next } = createMocks({
      type: 'text',
      options: { text: 'A' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('Fill Pattern Validation', () => {
  test('should accept valid fillPattern (dots)', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: 3, fillPattern: 'dots' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should reject invalid fillPattern', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: 3, fillPattern: 'invalid' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  test('should reject another invalid fillPattern (stripes)', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: 3, fillPattern: 'stripes' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should work without fillPattern (optional)', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: 3 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should require direction for gradient fillPattern', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: { width: 5, height: 3, fillPattern: 'gradient' },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('direction'),
      })
    );
  });

  test('should accept gradient with valid direction', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
      options: {
        width: 5,
        height: 3,
        fillPattern: 'gradient',
        direction: 'horizontal',
      },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should accept all valid fillPatterns', () => {
    const patterns = ['dots', 'gradient', 'diagonal', 'crosshatch'];

    patterns.forEach((pattern) => {
      const { req, res, next } = createMocks({
        type: 'rectangle',
        options: {
          width: 5,
          height: 3,
          fillPattern: pattern,
          direction: pattern === 'gradient' ? 'horizontal' : undefined,
        },
      });

      const middleware = validate(generateSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe('Type Validation', () => {
  test('should require type field', () => {
    const { req, res, next } = createMocks({
      options: { width: 5, height: 3 },
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  test('should reject invalid type', () => {
    const { req, res, next } = createMocks({
      type: 'invalid-shape',
      options: {},
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should accept all valid types', () => {
    const validTypes = [
      { type: 'rectangle', options: { width: 5, height: 3 } },
      { type: 'circle', options: { radius: 5 } },
      { type: 'polygon', options: { radius: 5, sides: 6 } },
      { type: 'text', options: { text: 'HELLO' } },
    ];

    validTypes.forEach((body) => {
      const { req, res, next } = createMocks(body);

      const middleware = validate(generateSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  test('should require options object', () => {
    const { req, res, next } = createMocks({
      type: 'rectangle',
    });

    const middleware = validate(generateSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });
});