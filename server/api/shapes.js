export const getAllShapes = (_req, res) => {
    const shapes = {
        rectangle: {
            type: 'rectangle',
            description: 'Generate a rectangle shape with customizable dimensions',
            requiredParameters: [
                { name: 'width', type: 'integer', constraint: 'Must be > 0' },
                { name: 'height', type: 'integer', constraint: 'Must be > 0' }
            ],
            optionalParameters: [
                { name: 'filled', type: 'boolean', description: 'Fill the shape' },
                { name: 'fillPattern', type: 'string', options: ['dots', 'gradient', 'diagonal', 'crosshatch'] },
                { name: 'direction', type: 'string', options: ['horizontal', 'vertical'], description: 'Required for gradient pattern' }
            ],
            examples: [
                {
                    description: 'Basic 5x7 rectangle',
                    request: { type: 'rectangle', options: { width: 5, height: 7 } }
                },
                {
                    description: 'Filled rectangle with dots pattern',
                    request: { type: 'rectangle', options: { width: 10, height: 5, filled: true, fillPattern: 'dots' } }
                },
                {
                    description: 'Rectangle with gradient fill',
                    request: { type: 'rectangle', options: { width: 8, height: 6, fillPattern: 'gradient', direction: 'horizontal' } }
                }
            ]
        },
        circle: {
            type: 'circle',
            description: 'Generate a circle shape with customizable radius',
            requiredParameters: [
                { name: 'radius', type: 'integer', constraint: 'Must be > 0' }
            ],
            optionalParameters: [
                { name: 'filled', type: 'boolean', description: 'Fill the shape' },
                { name: 'fillPattern', type: 'string', options: ['dots', 'gradient', 'diagonal', 'crosshatch'] },
                { name: 'direction', type: 'string', options: ['horizontal', 'vertical'], description: 'Required for gradient pattern' }
            ],
            examples: [
                {
                    description: 'Basic circle with radius 5',
                    request: { type: 'circle', options: { radius: 5 } }
                },
                {
                    description: 'Filled circle',
                    request: { type: 'circle', options: { radius: 8, filled: true } }
                },
                {
                    description: 'Circle with diagonal pattern',
                    request: { type: 'circle', options: { radius: 6, fillPattern: 'diagonal' } }
                }
            ]
        },
        polygon: {
            type: 'polygon',
            description: 'Generate a polygon shape with customizable sides and radius',
            requiredParameters: [
                { name: 'radius', type: 'integer', constraint: 'Must be > 0' },
                { name: 'sides', type: 'integer', constraint: 'Must be > 3' }
            ],
            optionalParameters: [
                { name: 'filled', type: 'boolean', description: 'Fill the shape' },
                { name: 'fillPattern', type: 'string', options: ['dots', 'gradient', 'diagonal', 'crosshatch'] },
                { name: 'direction', type: 'string', options: ['horizontal', 'vertical'], description: 'Required for gradient pattern' }
            ],
            examples: [
                {
                    description: 'Pentagon (5 sides)',
                    request: { type: 'polygon', options: { radius: 5, sides: 5 } }
                },
                {
                    description: 'Hexagon (6 sides)',
                    request: { type: 'polygon', options: { radius: 6, sides: 6 } }
                },
                {
                    description: 'Octagon with crosshatch pattern',
                    request: { type: 'polygon', options: { radius: 7, sides: 8, fillPattern: 'crosshatch' } }
                }
            ]
        },
        text: {
            type: 'text',
            description: 'Generate ASCII art text banners with customizable styling',
            requiredParameters: [
                { name: 'text', type: 'string', constraint: 'Must contain only uppercase letters (A-Z) and numbers (0-9)' }
            ],
            optionalParameters: [
                { name: 'fillPattern', type: 'string', options: ['dots', 'gradient', 'diagonal', 'crosshatch'] },
                { name: 'width', type: 'integer', description: 'Required for gradient pattern' },
                { name: 'height', type: 'integer', description: 'Required for gradient pattern' },
                { name: 'direction', type: 'string', options: ['horizontal', 'vertical'], description: 'Required for gradient pattern' }
            ],
            examples: [
                {
                    description: 'Simple text banner',
                    request: { type: 'text', options: { text: 'HELLO' } }
                },
                {
                    description: 'Text with dots pattern',
                    request: { type: 'text', options: { text: 'CODE123', fillPattern: 'dots' } }
                },
                {
                    description: 'Text with gradient',
                    request: { type: 'text', options: { text: 'HELLO', fillPattern: 'gradient', width: 5, height: 5, direction: 'vertical' } }
                }
            ]
        }
    };

    return res.status(200).json({
        shapes: Object.values(shapes),
        availableTypes: ['rectangle', 'circle', 'polygon', 'text'],
        fillPatterns: ['dots', 'gradient', 'diagonal', 'crosshatch'],
        directions: ['horizontal', 'vertical']
    });
}