# Code Formatting & Tooling 📚

---

## Code Formatting & Tooling 🛠️

### ESLint vs Prettier: Which should handle formatting?
*Added: 2025-10-04*

**Question:** Should I use ESLint rules to format long import statements, or use Prettier?

**Thinking:**

This is a classic confusion point when setting up a JavaScript project! Both ESLint and Prettier *can* handle formatting, but they were designed for different purposes. The confusion comes from ESLint's history - it started as a linter (bug finder) but added formatting rules over time. Then Prettier came along and did formatting *way* better.

The key insight: **ESLint = code quality, Prettier = code style.**

When you try to use ESLint for formatting (max-len, object-curly-newline, etc.), you end up with:
1. Conflicts between ESLint's formatting rules and Prettier (if you use both)
2. Manual fixes instead of auto-formatting
3. Slower feedback loop (ESLint shows errors, you fix manually vs Prettier auto-fixes on save)

The industry has largely settled on: **Prettier for all formatting, ESLint for code quality only.**

**Explanation:**

### What Each Tool Does 🔧

**ESLint - Code Quality Linter**

ESLint finds *bugs* and *problematic patterns* in your code:

```javascript
// ❌ ESLint catches these (actual problems):
const x = 10;
x = 20;  // Error: Assignment to constant variable

if (x = 10) {  // Warning: Assignment in condition (probably meant ==)
  console.log(x);
}

const unused = 'never used';  // Warning: Unused variable

function foo() {
  return;
  console.log('unreachable');  // Warning: Unreachable code
}
```

**ESLint rules are about correctness:**
- `no-unused-vars` - Catch dead code
- `no-undef` - Catch typos in variable names
- `eqeqeq` - Enforce `===` instead of `==`
- `no-console` - Warn about console.logs in production

**Prettier - Code Formatter**

Prettier handles *visual style* (how code looks):

```javascript
// Before Prettier
import {FormControl,FormLabel,NumberInput,NumberInputField,Checkbox,chakra} from '@chakra-ui/react'

// After Prettier (auto-formatted on save)
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Checkbox,
  chakra,
} from '@chakra-ui/react'
```

**Prettier decisions are about style:**
- Line length (printWidth)
- Single vs double quotes
- Semicolons or not
- Trailing commas
- Indentation (tabs vs spaces)

### The Problem with ESLint Formatting Rules ⚠️

**If you use ESLint for formatting:**

```json
// .eslintrc.json
{
  "rules": {
    "max-len": ["error", { "code": 80 }],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-newline": ["error", { "multiline": true }]
  }
}
```

**Problems:**
1. **Manual fixes** - ESLint shows red squiggles, you fix by hand
2. **Inconsistent** - Different developers format differently
3. **Slow** - Fix one file at a time when you could auto-format the whole codebase
4. **Conflicts** - If you add Prettier later, rules fight each other

**Example conflict:**
```javascript
// ESLint wants this:
const foo = { a: 1, b: 2 };

// Prettier wants this:
const foo = {
  a: 1,
  b: 2,
};

// Both are "right" but they disagree!
```

### The Prettier Solution ✅

**Step 1: Install Prettier**
```bash
npm install --save-dev prettier
```

**Step 2: Create `.prettierrc` (your formatting preferences)**
```json
{
  "printWidth": 100,
  "singleQuote": true,
  "semi": false,
  "trailingComma": "es5"
}
```

**Step 3: Install ESLint + Prettier integration**
```bash
npm install --save-dev eslint-config-prettier
```

**Step 4: Update `.eslintrc.json`**
```json
{
  "extends": [
    "eslint:recommended",
    "prettier"  // ← Disables ESLint formatting rules that conflict with Prettier
  ],
  "rules": {
    // Only code quality rules, no formatting
    "no-unused-vars": "warn",
    "no-console": "warn",
    "eqeqeq": "error"
  }
}
```

**Step 5: Auto-format on save** (VS Code settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**Now when you save:**
```javascript
// You type this mess:
import {FormControl,FormLabel,NumberInput,NumberInputField,Checkbox,chakra} from '@chakra-ui/react'

// Prettier auto-formats on save:
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Checkbox,
  chakra,
} from '@chakra-ui/react'
```

**No thinking, no manual fixes, just automatic consistency!** ✨

**Example:**

### Complete Setup (Recommended) 🚀

**1. Install dependencies:**
```bash
npm install --save-dev prettier eslint eslint-config-prettier
```

**2. Create `.prettierrc`:**
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

**3. Create `.eslintrc.json`:**
```json
{
  "extends": [
    "eslint:recommended",
    "prettier"
  ],
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "warn",
    "eqeqeq": "error"
  }
}
```

**4. Add npm scripts (package.json):**
```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx",
    "lint:fix": "eslint . --ext .js,.jsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,json,md}\""
  }
}
```

**5. Format entire codebase:**
```bash
npm run format
```

**6. Check for issues:**
```bash
npm run lint
```

### Before vs After 📊

**Before (ESLint-only formatting):**

```javascript
// Developer A writes:
import { FormControl, FormLabel, NumberInput } from '@chakra-ui/react';

// Developer B writes:
import {FormControl,FormLabel,NumberInput} from "@chakra-ui/react"

// Developer C writes:
import {
  FormControl,
  FormLabel,
  NumberInput
} from '@chakra-ui/react'

// ❌ Inconsistent, requires manual alignment, causes merge conflicts
```

**After (Prettier):**

```javascript
// Everyone's code looks the same after saving:
import {
  FormControl,
  FormLabel,
  NumberInput,
} from '@chakra-ui/react'

// ✅ Automatic, consistent, zero config needed after setup
```

### Mental Model 🧠

Think of your code tooling as a pipeline:

```
Your Code
    ↓
[Prettier] ← Formats (style: quotes, spacing, line length)
    ↓
[ESLint] ← Lints (quality: bugs, unused vars, problematic patterns)
    ↓
Clean, Consistent Code
```

**Prettier = Formatter** (like auto-correct for code style)
- Runs on save (in editor)
- Runs in CI/CD to check formatting
- Zero decisions needed (opinionated)

**ESLint = Linter** (like spell-check for code logic)
- Runs alongside Prettier
- Catches bugs, not style
- Configurable per project

### Real-World Workflow 🔄

**Scenario: You write messy code**

```javascript
// You type this fast and ugly:
import {Box,Text,Button} from '@chakra-ui/react'
const MyComponent=()=>{const x=10;if(x===10){return <Box><Text>Hello</Text></Box>}else{return null}}
```

**On Save:**

1. **Prettier formats it:**
```javascript
import { Box, Text, Button } from '@chakra-ui/react'

const MyComponent = () => {
  const x = 10
  if (x === 10) {
    return (
      <Box>
        <Text>Hello</Text>
      </Box>
    )
  } else {
    return null
  }
}
```

2. **ESLint catches issues:**
```javascript
// Warning: 'Button' is imported but never used (no-unused-vars)
import { Box, Text, Button } from '@chakra-ui/react'
                      ^^^^^^
```

**You fix the ESLint warning:**
```javascript
import { Box, Text } from '@chakra-ui/react'  // ✅ Removed unused import

const MyComponent = () => {
  const x = 10
  if (x === 10) {
    return (
      <Box>
        <Text>Hello</Text>
      </Box>
    )
  } else {
    return null
  }
}
```

**Result:** Code is both *formatted* (Prettier) and *correct* (ESLint)!

**Impact:**

**Why This Separation Matters:**

1. **No conflicts** - Prettier handles style, ESLint handles quality
   - Never waste time fixing "quote" errors manually
   - Never have Prettier and ESLint fight over formatting
   - Clear separation of concerns

2. **Speed** - Auto-format entire codebase in seconds
   ```bash
   npm run format  # Formats 1000+ files instantly
   ```
   vs. manually fixing ESLint formatting errors one by one

3. **Consistency** - No style debates in PRs
   - "Should this be single quotes?" → Prettier decides
   - "Should this be 80 or 100 char lines?" → Prettier decides
   - Team focuses on logic, not style

4. **Onboarding** - New developers get it for free
   - Install extensions, save file, done
   - No need to learn style guide
   - No "your code doesn't match our style" comments

5. **Focus on what matters** - ESLint catches real bugs
   ```javascript
   // ESLint catches this (real bug):
   const user = getUser();
   console.log(user.name);  // ❌ Might be null!

   // Prettier formats this (just style):
   const user = getUser()
   console.log(user.name)
   ```

**Common Setup (Industry Standard):**

```
.prettierrc        → Your style preferences
.eslintrc.json     → Your code quality rules
eslint-config-prettier → Disables ESLint formatting rules
```

**VS Code extensions:**
- `esbenp.prettier-vscode` - Prettier formatter
- `dbaeumer.vscode-eslint` - ESLint linter

**Editor settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**On save:**
1. Prettier formats (quotes, spacing, line length)
2. ESLint auto-fixes (remove unused imports, fix simple bugs)
3. ESLint shows warnings for things it can't auto-fix

**For Your Import Problem:**

```javascript
// You write this long import:
import { FormControl, FormLabel, NumberInput, NumberInputField, Checkbox, chakra } from '@chakra-ui/react'

// Prettier sees it exceeds printWidth (100 chars) and auto-formats:
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Checkbox,
  chakra,
} from '@chakra-ui/react'
```

**No ESLint config needed!** Just set `printWidth` in `.prettierrc`.

**Quick Start:**

```bash
# Install
npm install -D prettier eslint-config-prettier

# Create .prettierrc
echo '{"printWidth":100,"singleQuote":true,"semi":false}' > .prettierrc

# Update .eslintrc.json to extend "prettier"
# (disables formatting rules)

# Format everything
npx prettier --write .

# Done!
```

**Your imports will now auto-format on save, no ESLint rules needed!** 🎉

**Summary:**

| Tool | Purpose | Example |
|------|---------|---------|
| **Prettier** | Code *style* | Line length, quotes, spacing |
| **ESLint** | Code *quality* | Unused vars, bugs, patterns |
| **eslint-config-prettier** | Integration | Disables ESLint format rules |

**Recommendation:** Use Prettier for all formatting. Keep ESLint focused on catching bugs and bad patterns. This is the modern JavaScript standard and what 90% of projects use.

---
