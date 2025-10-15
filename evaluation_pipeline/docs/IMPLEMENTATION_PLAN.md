# ASCII Art Evaluation Pipeline - 8-Hour Implementation Plan

**Project**: Production-Ready Python Evaluation Pipeline for ASCII Art Generation System
**Timeline**: 8 hours total, broken into 2-3 hour segments
**Target**: Lightning AI Interview Preparation
**Approach**: Hybrid evaluation (Structural + Computational + LLM-based)

---

## Overview

This plan implements a comprehensive evaluation pipeline that:
1. Generates test prompts for your ASCII art API
2. Calls your Express API to generate recipes and art
3. Evaluates outputs using three tiers (structural validation, computational metrics, LLM judge)
4. Stores results in SQLite with metrics tracking
5. Suggests improvements based on evaluation patterns

**Key Technology**: FastAPI, Pydantic, httpx (async), Anthropic Claude SDK, SQLAlchemy, pytest

---

## Day Plan Breakdown

### Session 1: Foundation & Core Models (2.5 hours)

**Goal**: Set up project structure, Pydantic models, and API client

#### Hour 1: Project Setup (60 minutes)
- [ ] **Initialize Python project** (15 min)
  - Create `evaluation_pipeline/` directory structure
  - Set up `pyproject.toml` with Poetry
  - Configure dependencies:
    - fastapi, pydantic, httpx, anthropic, sqlalchemy
    - structlog, tenacity, prometheus-client
    - pytest, pytest-asyncio, pytest-cov, hypothesis
  - Create `.env.example` and `.gitignore`
  - Initialize git in evaluation_pipeline directory

- [ ] **Create project structure** (20 min)
  ```
  evaluation_pipeline/
  ├── src/ascii_evaluator/
  │   ├── __init__.py
  │   ├── models.py
  │   ├── config.py
  │   └── exceptions.py
  ├── tests/
  │   ├── conftest.py
  │   └── unit/
  ├── data/
  └── docs/
  ```

- [ ] **Core configuration** (25 min)
  - Implement `config.py` with Pydantic Settings
  - Define environment variables (API URLs, keys, timeouts)
  - Create `exceptions.py` with custom exception hierarchy
    - `EvaluationError` (base)
    - `APIError`, `ValidationError`, `LLMJudgeError`

#### Hour 2: Pydantic Models & API Client (90 minutes)
- [ ] **Define Pydantic models** (`models.py`) (45 min)
  - `RecipeOperation` - Base operation model
  - `GenerateOperation`, `OverlayOperation`, etc. - Operation types
  - `Recipe` - Full recipe with operations array
  - `APIResponse` - Response from Express API
  - `StructuralValidation` - Tier 1 results
  - `ComputationalMetrics` - Tier 2 results
  - `LLMEvaluation` - Tier 3 results
  - `EvaluationResult` - Final aggregated result
  - `TestPrompt` - Prompt with category/complexity metadata

- [ ] **Implement API client** (`api_client.py`) (45 min)
  - Create `ASCIIArtAPIClient` class
  - Async HTTP client using `httpx.AsyncClient`
  - `async def generate(prompt: str) -> APIResponse`
  - Implement retry logic with exponential backoff (tenacity)
  - Error handling with custom exceptions
  - Request/response validation with Pydantic
  - Timeout configuration
  - Write basic unit tests with mocked responses

**Checkpoint**: Run `pytest tests/unit/test_api_client.py` - should pass with mocked API

---

### Session 2: Evaluation Engine Core (2.5 hours)

**Goal**: Implement all three evaluation tiers

#### Hour 3: Tier 1 & 2 - Deterministic Evaluation (90 minutes)
- [ ] **Structural validation** (`validators/structural.py`) (40 min)
  - Recipe schema compliance checker
  - Operation field validation
  - Grid reference validation (ensure all referenced grids exist)
  - Output grid existence check
  - Scoring function (0-100 scale)
  - Write tests for valid/invalid recipes

- [ ] **Computational metrics** (`metrics/grid_analyzer.py`, `metrics/recipe_analyzer.py`) (50 min)
  - Grid dimension validator (100x100 to 200x200 range)
  - Character density calculator (non-space char percentage)
  - Operation count analyzer
  - Recipe complexity scorer
  - Recipe graph analyzer (detect cycles, dependency chains)
  - Scoring function (0-100 scale)
  - Write property-based tests with Hypothesis

#### Hour 4: Tier 3 - LLM Judge (60 minutes)
- [ ] **LLM evaluation prompts** (`llm_judge/prompts.py`) (20 min)
  - Define `EVALUATION_SYSTEM_PROMPT`
  - Implement `build_evaluation_prompt(prompt, grid, recipe)`
  - Include scoring rubric for 4 dimensions:
    - Visual coherence (1-10)
    - Prompt adherence (1-10)
    - Creativity (1-10)
    - Technical execution (1-10)

- [ ] **LLM judge implementation** (`llm_judge/judge.py`) (40 min)
  - Create `LLMJudge` class with Anthropic async client
  - `async def evaluate(prompt, grid, recipe) -> LLMEvaluation`
  - JSON response parsing with fallback for markdown
  - Convert 1-10 scores to 0-100 percentage
  - Circuit breaker pattern for LLM failures
  - Write tests with mocked Claude responses

**Checkpoint**: Manual test with real API call to verify LLM judge works

---

### Session 3: Orchestration & Storage (2 hours)

**Goal**: Connect all pieces and add persistence

#### Hour 5: Evaluation Engine (60 minutes)
- [ ] **Orchestration layer** (`evaluation_engine.py`) (45 min)
  - Create `EvaluationEngine` class
  - Dependency injection for API client, LLM judge, storage
  - `async def evaluate_prompt(prompt: str) -> EvaluationResult`
    1. Call API to generate art
    2. Run Tier 1 (structural validation)
    3. Run Tier 2 (computational metrics)
    4. Run Tier 3 (LLM judge) with fallback
    5. Calculate weighted final score
    6. Return complete `EvaluationResult`
  - Implement structured logging throughout
  - Write integration test with mocked dependencies

- [ ] **Batch evaluation** (15 min)
  - `async def evaluate_batch(prompts: List[str], parallel: int = 3)`
  - Use `asyncio.gather` with semaphore for concurrency control
  - Progress tracking with structured logs

#### Hour 6: Storage Layer (60 minutes)
- [ ] **Database models** (`storage/database.py`) (30 min)
  - SQLAlchemy models for SQLite
  - `EvaluationResultModel` table with columns:
    - id, prompt, prompt_category, prompt_complexity
    - final_score, tier1_score, tier2_score, tier3_score
    - llm_evaluation (JSON), metrics (JSON)
    - grid_output (text), recipe (JSON)
    - created_at, duration_ms
  - Database initialization function

- [ ] **Repository pattern** (`storage/repository.py`) (30 min)
  - `EvaluationRepository` class
  - `async def save_evaluation(result: EvaluationResult)`
  - `async def get_evaluations(filters: dict)`
  - `async def get_metrics_summary()`
  - Query methods for analysis
  - Write tests with in-memory SQLite

**Checkpoint**: Run full evaluation flow and verify data persists to SQLite

---

### Session 4: Prompt Generation & Improvement (3 hours)

**Goal**: Complete the evaluation loop with prompt generation and suggestions

#### Hour 7: Prompt Generation (60 minutes)
- [ ] **Prompt generator** (`prompt_generator.py`) (45 min)
  - Define `PROMPT_TEMPLATES` dict with categories:
    - faces (simple/complex)
    - houses (simple/complex)
    - nature (simple/complex)
    - geometric (simple/complex)
    - characters (simple/complex)
  - Size variations (small, medium, large, huge)
  - `def generate_test_suite() -> List[TestPrompt]`
    - 5 categories × 2 complexity × 4 sizes = 40 prompts
  - `def generate_random_variations(base_prompts: List, n: int)`
    - Create 10 random mutations
  - Write tests to ensure coverage of categories

- [ ] **Test suite definition** (15 min)
  - Create `data/test_prompts.json` with 50 curated prompts
  - Include edge cases (very simple, very complex)

#### Hour 8: Improvement Suggester & CLI (90 minutes)
- [ ] **Pattern analysis** (`improvement/suggester.py`) (50 min)
  - Create `ImprovementSuggester` class
  - `def analyze_failures(results: List[EvaluationResult])`
    - Group by failure patterns:
      - Low structural scores → Recipe schema issues
      - Low dimension scores → Size problems
      - Low LLM coherence → Visual quality
      - Low prompt adherence → Not following instructions
  - `def suggest_improvements(patterns: dict) -> List[Suggestion]`
    - System prompt modifications
    - User prompt template improvements
    - Operation sequence best practices
  - Generate actionable recommendations
  - Write tests with sample failure data

- [ ] **CLI script** (`scripts/run_evaluation.py`) (30 min)
  - Create CLI with argparse or typer
  - Commands:
    - `evaluate-batch` - Run full test suite
    - `evaluate-single <prompt>` - Test one prompt
    - `analyze-results` - Show metrics summary
    - `suggest-improvements` - Run improvement analysis
  - Progress bars with `rich` library
  - Export results to CSV/JSON

- [ ] **Documentation** (10 min)
  - Update README with usage instructions
  - Document API endpoints
  - Add example outputs

**Checkpoint**: Run full evaluation suite and generate improvement suggestions

---

## Testing Strategy

### Unit Tests (write alongside implementation)
- Test each component in isolation with mocked dependencies
- Use `pytest` fixtures for common test data
- Property-based testing for metrics with `hypothesis`
- Target: 80%+ code coverage

### Integration Tests (Session 3)
- Test evaluation engine with mocked API/LLM responses
- Test storage layer with in-memory SQLite
- Verify data flows correctly through pipeline

### E2E Tests (Session 4)
- Run actual evaluations against your Express API
- Use `ENABLE_E2E_TESTS=true` environment flag
- Verify end-to-end functionality

---

## FastAPI Service (Optional - Time Permitting)

If time allows after core implementation:

- [ ] **FastAPI app** (`main.py`)
  - `POST /evaluate` - Single prompt evaluation
  - `POST /evaluate/batch` - Batch evaluation
  - `GET /results` - Query evaluation results
  - `GET /metrics` - Summary statistics
  - `GET /suggestions` - Improvement suggestions
  - WebSocket endpoint for real-time evaluation streaming

- [ ] **Prometheus metrics**
  - Evaluation duration histogram
  - Score distribution histogram
  - API error counters
  - LLM judge availability gauge

---

## Deliverables Checklist

By end of 8 hours, you should have:

- [x] ✅ **Working Python evaluation pipeline**
  - Async HTTP client calling Express API
  - Three-tier evaluation system
  - SQLite persistence with query interface

- [x] ✅ **Comprehensive test suite**
  - Unit tests for all components
  - Integration tests for evaluation flow
  - Property-based tests for metrics
  - 80%+ code coverage

- [x] ✅ **50+ evaluation results**
  - Test suite executed against your API
  - Results stored in SQLite
  - Metrics calculated and analyzed

- [x] ✅ **Improvement suggestions**
  - Pattern analysis from results
  - Actionable recommendations
  - System prompt modifications

- [x] ✅ **Production-ready code patterns**
  - Type hints throughout (mypy validated)
  - Structured logging
  - Error handling with retries
  - Dependency injection
  - Configuration management
  - Black formatted, Ruff linted

- [x] ✅ **Documentation**
  - README with setup instructions
  - API documentation
  - Architecture overview
  - Example usage

---

## Time Management Tips

### If Running Ahead of Schedule:
1. Add FastAPI service wrapper
2. Implement WebSocket streaming
3. Add Prometheus metrics
4. Create visualization dashboard
5. Add more sophisticated prompt mutations

### If Running Behind Schedule:
1. **Priority 1 (Must Have)**: Sessions 1-3 (API client, evaluation tiers, storage)
2. **Priority 2 (Should Have)**: Basic prompt generator + CLI script
3. **Priority 3 (Nice to Have)**: Improvement suggester, comprehensive tests

### Critical Path:
- Session 1 (Hour 1-2): Foundation
- Session 2 (Hour 3-4): Evaluation core
- Session 3 (Hour 5-6): Storage + orchestration
- Session 4 (Hour 7-8): Prompt generation + analysis

---

## Lightning AI Interview Focus Areas

When demonstrating this project, emphasize:

1. **Async Python patterns** - Modern async/await throughout
2. **Type safety** - Pydantic models everywhere, mypy validated
3. **Testing rigor** - Unit, integration, property-based tests
4. **Production patterns** - Retry logic, circuit breakers, structured logging
5. **LLM evaluation** - Understanding of AI evaluation patterns (relevant to Lightning AI)
6. **Clean architecture** - Dependency injection, separation of concerns
7. **Error handling** - Comprehensive exception hierarchy
8. **Observability** - Structured logs, metrics, tracing

---

## Project Structure Reference

```
evaluation_pipeline/
├── pyproject.toml              # Poetry dependencies
├── README.md                   # Setup and usage docs
├── .env.example               # Environment variables template
├── .gitignore
├── src/
│   └── ascii_evaluator/
│       ├── __init__.py
│       ├── main.py            # FastAPI app (optional)
│       ├── config.py          # Pydantic settings
│       ├── models.py          # All Pydantic models
│       ├── exceptions.py      # Custom exceptions
│       ├── api_client.py      # Express API client
│       ├── prompt_generator.py # Test prompt generation
│       ├── evaluation_engine.py # Orchestration
│       ├── validators/
│       │   ├── __init__.py
│       │   ├── structural.py  # Tier 1
│       │   └── recipe_schema.py
│       ├── metrics/
│       │   ├── __init__.py
│       │   ├── grid_analyzer.py    # Tier 2
│       │   └── recipe_analyzer.py
│       ├── llm_judge/
│       │   ├── __init__.py
│       │   ├── judge.py       # Tier 3
│       │   └── prompts.py
│       ├── storage/
│       │   ├── __init__.py
│       │   ├── database.py    # SQLAlchemy models
│       │   └── repository.py  # Data access
│       ├── improvement/
│       │   ├── __init__.py
│       │   └── suggester.py
│       └── utils/
│           ├── __init__.py
│           ├── logging.py
│           └── retry.py
├── tests/
│   ├── conftest.py           # Shared fixtures
│   ├── unit/
│   │   ├── test_api_client.py
│   │   ├── test_validators.py
│   │   ├── test_metrics.py
│   │   ├── test_llm_judge.py
│   │   └── test_models.py
│   ├── integration/
│   │   ├── test_evaluation_engine.py
│   │   └── test_storage.py
│   └── e2e/
│       └── test_full_pipeline.py
├── scripts/
│   ├── run_evaluation.py     # CLI tool
│   └── export_results.py
└── data/
    ├── evaluations.db        # SQLite database
    ├── test_prompts.json     # Curated test prompts
    └── reports/              # Generated reports
```

---

## Dependencies (pyproject.toml)

```toml
[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.109.0"
pydantic = "^2.5.0"
pydantic-settings = "^2.1.0"
httpx = "^0.26.0"
anthropic = "^0.18.0"
sqlalchemy = "^2.0.0"
structlog = "^24.1.0"
tenacity = "^8.2.0"
prometheus-client = "^0.19.0"
rich = "^13.7.0"  # For CLI progress bars
typer = "^0.9.0"  # For CLI

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.23.0"
pytest-cov = "^4.1.0"
hypothesis = "^6.98.0"
black = "^24.1.0"
ruff = "^0.2.0"
mypy = "^1.8.0"
```

---

## Success Metrics

By the end of 8 hours, you should be able to demonstrate:

1. **Evaluation pipeline running** - Execute `python scripts/run_evaluation.py evaluate-batch` and see 50 prompts evaluated
2. **Results in database** - Query SQLite to show evaluation results with scores
3. **Improvement suggestions** - Run analysis and show actionable recommendations
4. **Test coverage** - Run `pytest --cov` and show 80%+ coverage
5. **Clean code** - Run `black`, `ruff`, `mypy` and show no errors
6. **Production patterns** - Walk through retry logic, error handling, logging

---

## Next Steps (Post-Interview)

If you want to extend this project:

1. Add FastAPI REST API wrapper
2. Create web dashboard for visualization
3. Implement A/B testing for prompt variations
4. Add more sophisticated LLM prompting strategies
5. Create Dockerfile for deployment
6. Add CI/CD pipeline with GitHub Actions
7. Implement caching layer for API responses
8. Add more evaluation dimensions (performance, cost tracking)

---

**Good luck with your Lightning AI interview! 🚀**