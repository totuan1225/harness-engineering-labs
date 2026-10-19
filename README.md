# Harness Engineering Labs

Thuc hanh theo khoa Learn Harness Engineering.

## P01 - Prompt-only vs Minimal Harness

### Run A
- Coding Agent: Codex
- Execution time: 2 minutes 6 seconds
- Build: FAIL (TypeScript TS2353)
- Runtime: Not tested

### Run B
- Coding Agent: Codex
- Harness: AGENTS.md, feature_list.json, init.sh, docs/
- Build: PASS (reported by Codex)
- Electron window: PASS
- Document import: PASS after one additional fix
- Document display and indexing: PASS
- Local Q&A with citations: PASS
- Persistence after restart: Not yet verified

## Conclusion

Minimal Harness provided clearer instructions and verification criteria.
However, manual GUI testing was still needed to discover a preload issue.
