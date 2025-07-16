## Roo Rules: Agentic Workflow for Low-Performance LLM

*(rev 3 – **sequential-thinking**, **filesystem**, **puppeteer** MCPs added; no security clauses)*

---

### 1. General Rules

1. **Task Decomposition** – Split every task into 3-5 subtasks (≤ 200 chars each).
2. **Step-by-Step Thinking** – For each subtask write `Reason:` then `Act:`.
3. **Token Economy** – Whole reply ≤ 500 tokens; off-load bulk via MCP tools.
4. **Error Handling** – On failure output `Error:` and propose a retry (via MCP when possible).
5. **Completion Flag** – End with `Done`; if not finished, list next subtasks.
6. **Context Window** – When prompt ≈ 75 % full, summarise oldest turns → `Context-Shrink:`.

---

### 2. Coding Rules

7. **Functional Split** – Max 4 `Feature n:` blocks.
8. **Diff Presentation** – Show `Before:` / `After:` with file name + line range.
9. **Test Plan** – Concrete steps; simulate through MCP if local execution impossible.
10. **Language Optimisation** – Python imports, TS explicit types, HTML a11y.
11. **Performance Profiling** – Supply a lightweight CPU/RAM/net profiler + sample output.
12. **Code Review** – Close with a `PR-DIFF:` summary for peer LGTM / change requests.

---

### 3. Documentation Rules

13. **Sectioning** – 5-10 sections, each ≥ 300 characters.
14. **Iterative Refinement** – Two rounds: write `Feedback:` (3 gaps) → fix.
15. **Minimum Length** – Avoid docs < 100 lines; enlarge with MCP data if needed.
16. **Changelog** – End every doc with `## Changelog – YYYY-MM-DD · author · summary`.
17. **Template Consistency** – Use one shared Markdown skeleton (cover, TOC, footnotes, licence).

---

### 4. MCP Integration Rules

18. **Invocation Syntax** – `MCP: [tool, query]`.
19. **Chain Linking** – Chain 1 = plan, Chain 2 = MCP run; ≤ 3 parallel chains.
20. **Minimise Calls** – Justify heavy hits with `Minimise calls:`.
21. **Call Log** – Immediately after a call print `MCP-LOG:` (timestamp · tool · latency · status).
22. **Concurrency Control** – Hash query → mutex; reuse previous result if identical.

---

#### 4-A. Sequential-Thinking Extension

23. **Usage** – `MCP: sequentialthinking, [goal]` with a YAML step list.
24. **When** – Multi-hop reasoning where step N output feeds step N+1.
25. **Result** – Return merged answer, summarise under `Seq-Result:`.

---

#### 4-B. Filesystem Extension

26. **Purpose** – Read/write local project files, persist artefacts, or fetch large diff context.
27. **Usage** –

```text
MCP: filesystem, {"op":"read","path":"src/app.py","lines":"10-40"}
MCP: filesystem, {"op":"write","path":"docs/plan.md","content":"…"}
```

28. **Best Practices** –

* Limit reads/writes to scopes cited in subtasks.
* Log file ops in `MCP-LOG:`; avoid whole-repo dumps unless essential.

---

#### 4-C. Puppeteer Extension

29. **Purpose** – Headless browser actions: DOM scraping, screenshots, PDF.
30. **Usage** –

```text
MCP: puppeteer, {"url":"https://example.com","action":"screenshot","selector":"#chart"}
```

31. **Guidelines** –

* Prefer puppeteer for JS-rendered pages or visual proofs.
* Chain after browser search only when static HTML is insufficient.
* Store captures via filesystem and reference paths in the answer.

---

### 5. Definitions

* **MCP** – Internal tool suite (browser, filesystem, sequentialthinking, puppeteer, etc.).
* **Low-Performance LLM** – Model with ≤ 30 B parameters or short context window.

**Done**