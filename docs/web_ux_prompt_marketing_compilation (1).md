# Сводный документ: источники, методики и промты (веб‑сайты, UX, маркетинг, психология)

Дата: 2026-02-17

---

## 1) Источники по промт‑инжинирингу

### Официальные гайды

- OpenAI ---
  https://platform.openai.com/docs/guides/prompt-engineering
- Anthropic (Claude) ---
  https://docs.anthropic.com/claude/docs/prompt-engineering
- Google (Vertex AI) ---
  https://cloud.google.com/vertex-ai/docs/generative-ai/learn/prompt-design
- Microsoft (Azure OpenAI) ---
  https://learn.microsoft.com/azure/ai-services/openai/concepts/prompt-engineering

### Практические базы

- https://www.promptingguide.ai
- https://learnprompting.org
- https://github.com/dair-ai/Prompt-Engineering-Guide
- https://github.com/f/awesome-chatgpt-prompts
- https://flowgpt.com

### Академические исследования

- Chain-of-Thought --- https://arxiv.org/abs/2201.11903
- ReAct --- https://arxiv.org/abs/2210.03629
- Self‑Consistency --- https://arxiv.org/abs/2203.11171
- Tree‑of‑Thoughts --- https://arxiv.org/abs/2305.10601
- Constitutional AI --- https://arxiv.org/abs/2212.08073

### Лекции

- DeepLearning.AI ---
  https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/
- Karpathy --- https://www.youtube.com/watch?v=zjkBMFhNj_g
- FullStackDeepLearning ---
  https://fullstackdeeplearning.com/llm-bootcamp/

### Рекомендуемая траектория

1.  OpenAI guide\
2.  promptingguide.ai\
3.  learnprompting.org\
4.  ReAct\
5.  Tree‑of‑Thoughts\
6.  Агентные архитектуры

---

## 2) Промты для создания веб‑сайтов (полный пайплайн)

### Prompt 1 --- PRD

    ROLE: Senior Product Manager + UX strategist.
    TASK: Create a PRD for a web application.

    INPUT:
    - App idea
    - Target users
    - Jobs-to-be-done
    - Monetization
    - Constraints

    OUTPUT:
    1) Problem & Goal
    2) Target users
    3) Scope (MVP/V1)
    4) User stories (Given/When/Then)
    5) UX requirements
    6) Data & permissions
    7) Non-functional requirements
    8) Success metrics
    9) Risks
    10) Assumptions

### Prompt 2 --- Tech Spec

    ROLE: Staff Software Engineer + Architect.
    TASK: Produce technical specification.

    STACK:
    Frontend: Next.js + TS + Tailwind
    Backend: Next.js API or FastAPI
    DB: Postgres + Prisma
    Auth: NextAuth/Clerk

    OUTPUT:
    A) Architecture
    B) Data model
    C) API endpoints
    D) Page map
    E) State management
    F) Security
    G) Performance
    H) Tests
    I) Implementation plan

### Prompt 3 --- Вертикальные срезы

    ROLE: Engineering Manager.
    TASK: Convert spec into vertical slices.

    Slices:
    0: scaffold + CI
    1: auth + layout
    2: CRUD end‑to‑end
    3: notifications/payments
    4: admin
    5: QA hardening

### Prompt 4 --- Скэффолд проекта

    ROLE: Senior Full‑Stack Engineer.
    Create Next.js TypeScript project
    Tailwind
    ESLint + Prettier
    RU/EN switch
    shadcn/ui
    Provide commands + file tree + code

### Prompt 5 --- Реализация фичи

    ROLE: Senior Full‑Stack Engineer.
    Implement slice.
    Rules:
    - do not refactor unrelated code
    - minimal dependencies
    - add validation and states
    Output:
    files changed + code + run commands + QA checklist

### Prompt 6 --- QA аудит

    ROLE: QA Lead.
    Audit repo:
    - requirements coverage
    - UX states
    - accessibility
    - security
    - performance
    Output severity P0/P1/P2

### Prompt 7 --- One‑shot генерация

    Build a production-ready full-stack web app.
    Next.js + TS + Tailwind
    Postgres + Prisma
    Auth
    RU/EN
    Tests
    Run instructions

### Полезные репозитории

- https://github.com/mosofsky/spec-then-code
- https://github.com/KhazP/vibe-coding-prompt-template
- https://github.com/stackblitz-labs/bolt.diy
- https://github.com/vstorm-co/full-stack-fastapi-nextjs-llm-template

---

## 3) Визуальный маркетинг, e‑commerce и психология

### Книги

- Steve Krug --- https://sensible.com/dont-make-me-think/
- Nir Eyal --- https://www.nirandfar.com/hooked/
- Donald Miller --- https://storybrand.com
- Jonah Berger --- https://jonahberger.com/books/contagious/

### Исследования e‑commerce

- https://baymard.com
- https://nngroup.com
- https://shopify.com/partners/blog

### Обязательные блоки страницы товара

1.  Hero
2.  Цена + CTA
3.  Social proof
4.  Benefits
5.  Demonstration
6.  FAQ
7.  Guarantee
8.  Secondary CTA

### Психологические триггеры

- Social proof
- Scarcity
- Anchoring
- Loss aversion
- Color psychology

---

## 4) Layout‑архитектура и логика блоков

### UX‑исследования

- https://www.nngroup.com/articles/
- https://lawsofux.com
- https://interaction-design.org/literature/topics/information-architecture
- https://m3.material.io/foundations/layout/understanding-layout

### Паттерны

- https://mobbin.com
- https://pageflows.com
- https://goodui.org
- https://baymard.com/blog

### Структура продающего лендинга

1.  Value proposition
2.  Problem
3.  Solution
4.  Proof
5.  Objections
6.  Offer
7.  CTA

### Premium‑layout

- https://godly.website
- https://land-book.com
- https://minimal.gallery
- https://lapa.ninja

### Главные UX‑законы

- Hick's Law
- Fitts's Law
- Gestalt
- Visual hierarchy
- Progressive disclosure
- Chunking

---

## Итоговая модель поведения пользователя

Внимание → Понимание → Доверие → Желание → Снятие риска → Действие
