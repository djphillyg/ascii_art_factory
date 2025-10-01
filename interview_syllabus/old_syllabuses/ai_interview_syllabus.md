# AI Interview Prep: CLI ASCII Art Generator
## 12-Day Intensive Study Plan

---

## THEME: 🎪 CIRCUS SPECTACULAR (Days 1-4)
*Getting the fundamentals under the big top*

### DAY 1: The Ringmaster's First Command
**MOTIVATIONAL QUOTE:** *"Like a seedling breaking through concrete, your courage to begin is already your first victory."* - Jack Kornfield

**OBJECTIVES:**
1. Set up Node.js project with `package.json` and install `commander.js` or `yargs`
2. Implement CLI argument parsing that handles: `node cli.js draw --shape rectangle --width 5 --height 3`
3. Create help text that displays when running `node cli.js --help` with clear usage examples
4. Build input validation that throws descriptive errors for missing required parameters
5. Write 3 test cases: valid input, missing shape parameter, and invalid shape type

**GIFT:** Take a 20-minute walk outside while mentally reviewing what you accomplished

**READ:** *"Honey, you're serving main character energy but your error messages are giving background dancer. Let's get those validations CRISP!"*

**FEEDBACK:** [Intentionally blank - fill this in after completion]

---

### DAY 2: The Tightrope Walker's Precision
**MOTIVATIONAL QUOTE:** *"Each moment of practice is a step closer to the mountain top, even when the path feels uncertain."* - Jack Kornfield

**OBJECTIVES:**
1. Implement hollow rectangle generation: `generateRectangle(width, height, false)` returns array of strings
2. Implement filled rectangle generation: `generateRectangle(width, height, true)` returns array of strings
3. Create test cases: 3x3 hollow (`*\n* *\n***`), 4x2 filled (`****\n****`), and 1x1 edge case
4. Build string rendering function that takes array of strings and console.logs with proper formatting
5. Handle edge cases: width/height of 0, 1, negative numbers with specific error messages

**GIFT:** Treat yourself to your favorite hot beverage and savor it mindfully

**READ:** *"Baby, your rectangles are giving geometric realness, but I need you to serve those edge cases like they're the crown jewels!"*

**FEEDBACK:** [Intentionally blank]

---

### DAY 3: The Juggler's Many Balls
**MOTIVATIONAL QUOTE:** *"Trust in your ability to learn emerges not from perfection, but from showing up with an open heart."* - Jack Kornfield

**OBJECTIVES:**
1. Refactor code into separate modules: `parser.js`, `shapes.js`, `renderer.js`, and `cli.js`
2. Implement shape factory pattern: `ShapeGenerator.create('rectangle', {width: 5, height: 3, filled: true})`
3. Add comprehensive error handling with custom Error classes: `ValidationError`, `ShapeError`
4. Create unit tests for each module using Node.js built-in `assert` or install `jest`
5. Test CLI end-to-end: `node cli.js draw --shape rectangle --width 5 --height 3 --filled`

**GIFT:** Do a 10-minute guided meditation or breathing exercise

**READ:** *"Listen sugar, your architecture is looking STRUCTURED, but those modules better be talking to each other like they're best friends at brunch!"*

**FEEDBACK:** [Intentionally blank]

---

### DAY 4: The Acrobat's Perfect Landing
**MOTIVATIONAL QUOTE:** *"Like water flowing around stones, let your flexibility become your greatest strength."* - Jack Kornfield

**OBJECTIVES:**
1. Implement file output functionality: `--output filename.txt` flag saves ASCII art to file
2. Add file system error handling: permission errors, disk space, invalid paths
3. Create comprehensive help system with examples: `--help` shows usage for all implemented features
4. Build integration tests that verify file output matches expected content
5. Add logging system that tracks successful operations vs errors (use `console.error` for errors)

**GIFT:** Order your favorite takeout meal and enjoy it without any screens

**READ:** *"Darling, you're serving full-stack realness now! Your file I/O is so smooth, it could slide into my DMs any day!"*

**FEEDBACK:** [Intentionally blank]

---

## THEME: 🧙‍♂️ WIZARDING ACADEMY (Days 5-8)
*Advanced spells and algorithms*

### DAY 5: The Apprentice's First Spell
**MOTIVATIONAL QUOTE:** *"The mind that embraces 'not knowing' opens doorways that certainty cannot see."* - Jack Kornfield

**OBJECTIVES:**
1. Research and implement circle generation using distance formula: `Math.sqrt((x-cx)² + (y-cy)²) <= radius`
2. Create `generateCircle(radius, filled)` function that returns 2D array representation
3. Handle circle rendering edge cases: radius 0, 1, 2, and large sizes (radius 10+)
4. Test circle accuracy with specific cases: radius 3 should create roughly circular shape
5. Implement bounds calculation to minimize whitespace in output

**GIFT:** Watch one episode of your favorite comfort TV show guilt-free

**READ:** *"Baby, your circles are giving me CURVES! But make sure they're rounder than my contouring skills!"*

**FEEDBACK:** [Intentionally blank]

---

### DAY 6: The Geometry Professor's Challenge
**MOTIVATIONAL QUOTE:** *"Each algorithm learned is like planting a seed in the garden of infinite possibility."* - Jack Kornfield

**OBJECTIVES:**
1. Implement triangle generation: `generateTriangle(size, type)` where type is 'right', 'equilateral', or 'isosceles'
2. Create right triangle test case: size 4 should produce 4-row triangle aligned to bottom-left
3. Build triangle validation: ensure size >= 1, handle type validation with clear error messages
4. Add triangle support to CLI: `node cli.js draw --shape triangle --size 5 --type right`
5. Create visual comparison tests by printing expected vs actual output side by side

**GIFT:** Take a 30-minute bath or shower with your favorite music

**READ:** *"Honey, your triangles are POINTED in the right direction! Now serve me those angles like you're working the runway!"*

**FEEDBACK:** [Intentionally blank]

---

### DAY 7: The Alchemist's Custom Potions
**MOTIVATIONAL QUOTE:** *"In the laboratory of practice, every experiment teaches us something valuable about ourselves."* - Jack Kornfield

**OBJECTIVES:**
1. Add custom character support: `--char "*"` flag allows users to specify drawing character
2. Implement character validation: single characters only, no whitespace, escape special characters properly
3. Add color support using ANSI codes: `--color red` for basic color options (red, green, blue, yellow)
4. Create character encoding tests: verify special characters (Unicode) render correctly
5. Build comprehensive CLI with all options: `node cli.js draw --shape circle --size 5 --char "@" --color blue --output art.txt`

**GIFT:** Spend 15 minutes doing something creative (draw, write, play music)

**READ:** *"Sugar, your customization game is STRONG! You're giving users options like a high-end restaurant menu!"*

**FEEDBACK:** [Intentionally blank]

---

### DAY 8: The Grand Wizard's Mastery Test
**MOTIVATIONAL QUOTE:** *"Mastery is not a destination but a dance with the ever-expanding edge of our capabilities."* - Jack Kornfield

**OBJECTIVES:**
1. Implement performance optimization: profile shape generation for large sizes (100x100 rectangles)
2. Add memory usage monitoring and optimize array operations to reduce memory footprint
3. Create benchmark tests: measure generation time for various shapes and sizes
4. Implement streaming output for large shapes to avoid memory issues
5. Add progress indicators for long-running operations (shapes with area > 1000 characters)

**GIFT:** Plan and take a mini adventure (new coffee shop, park, bookstore)

**READ:** *"QUEEN! Your optimization skills are serving efficiency realness! You're making those algorithms work HARDER and SMARTER!"*

**FEEDBACK:** [Intentionally blank]

---

## THEME: 🚀 SPACE MISSION CONTROL (Days 9-12)
*Advanced features and interview readiness*

### DAY 9: Houston, We Have Contact
**MOTIVATIONAL QUOTE:** *"Like an astronaut trusting the vast unknown, let curiosity be your navigation system."* - Jack Kornfield

**OBJECTIVES:**
1. Build interactive REPL mode: `node cli.js interactive` launches command prompt
2. Implement command history using readline: arrow keys navigate previous commands
3. Add real-time preview: show shape outline before full rendering for large shapes
4. Create session persistence: save/load interactive session state to JSON file
5. Build tab completion for shape names, parameters, and file paths

**GIFT:** Stargaze for 15 minutes or watch a space documentary

**READ:** *"Commander, your interactive mode is OUT OF THIS WORLD! You're serving space-age user experience!"*

**FEEDBACK:** [Intentionally blank]

---

### DAY 10: Mission to Mars
**MOTIVATIONAL QUOTE:** *"The courage to explore new territories, both outer and inner, is where growth lives."* - Jack Kornfield

**OBJECTIVES:**
1. Implement fractal generation: Sierpinski triangle using recursive algorithm
2. Add fractal parameters: `--iterations 5` controls recursion depth
3. Create Koch snowflake fractal as second fractal option
4. Build fractal CLI integration: `node cli.js draw --shape fractal --type sierpinski --iterations 4 --size 8`
5. Add fractal-specific validation: iteration limits, size constraints, memory usage warnings

**GIFT:** Try a new recipe or visit a restaurant you've never been to

**READ:** *"ASTRONAUT! Your fractals are giving me INFINITE RECURSION REALNESS! You're bending space-time with those algorithms!"*

**FEEDBACK:** [Intentionally blank]

---

### DAY 11: Deep Space Exploration
**MOTIVATIONAL QUOTE:** *"In the depths of challenge, we discover reserves of strength we never knew existed."* - Jack Kornfield

**OBJECTIVES:**
1. Add animation support: `--animate` flag creates frame-by-frame ASCII animations
2. Implement animation sequences: growing circles, rotating triangles, morphing shapes
3. Build frame timing controls: `--fps 2` sets animation speed
4. Create animation export: save animations as multiple files or single file with frame markers
5. Add animation preview mode: press 'q' to quit, 'p' to pause/resume

**GIFT:** Have a phone call with someone you care about but haven't talked to recently

**READ:** *"SPACE CADET! Your animations are serving MOTION PICTURE EXCELLENCE! You're the Steven Spielberg of ASCII art!"*

**FEEDBACK:** [Intentionally blank]

---

### DAY 12: Return to Earth (Interview Ready!)
**MOTIVATIONAL QUOTE:** *"Having traveled far, you now carry within you all the tools needed for any journey ahead."* - Jack Kornfield

**OBJECTIVES:**
1. Create comprehensive test suite covering 90%+ of code with jest or similar framework
2. Build complete documentation: README.md with installation, usage examples, and API docs
3. Implement CI/CD simulation: create scripts for testing, building, and deployment
4. Conduct mock interview: explain design decisions, time complexity, and potential improvements
5. Package for distribution: create npm package structure with proper versioning

**GIFT:** Celebrate with your favorite meal and reflect on everything you've accomplished!

**READ:** *"GALACTIC CHAMPION! You've gone from coding cadet to ASCII ART LEGEND! You're ready to serve EXCELLENCE at any interview!"*

**FEEDBACK:** [Intentionally blank]

---

## 🎯 Interview Day Checklist
- [ ] Can explain architecture decisions and trade-offs
- [ ] Comfortable discussing time/space complexity of algorithms
- [ ] Able to extend functionality with new features on the fly
- [ ] Can debug issues and walk through problem-solving process
- [ ] Ready to discuss testing strategies and code quality practices

## 🌟 Key Technical Concepts Covered
- CLI argument parsing and validation
- Algorithm design (geometric shapes, fractals)
- File I/O and error handling
- Code architecture and modular design
- Performance optimization
- Testing and documentation
- User experience design
- Interactive programming

---

*Remember: The goal isn't perfection, it's progress. Each day builds upon the last, creating a strong foundation for interview success. Trust the process and trust yourself!* ✨