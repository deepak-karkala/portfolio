#!/usr/bin/env python3
"""Run Agent Evals (framework-agnostic stub)

Wire this script into your stack. Responsibilities:
- Load task YAMLs from suite folders
- For each task: create isolated sandbox env, run k trials
- Collect trace/trajectory + outcome
- Apply graders (deterministic + model-based + human hooks)
- Aggregate pass@k / pass^k and scorecard metrics
- Enforce CI gates from evals/config.yml

This repo intentionally does NOT choose a vendor framework.
"""

import argparse
import glob
import os
import yaml

def load_yaml(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--suite", default="golden", help="golden|open_ended|adversarial|failure_replays|all")
    ap.add_argument("--root", default=".", help="repo root")
    args = ap.parse_args()

    suites = ["golden", "open_ended", "adversarial", "failure_replays"] if args.suite == "all" else [args.suite]
    for s in suites:
        pattern = os.path.join(args.root, "evals", s, "*.yaml")
        tasks = sorted(glob.glob(pattern))
        print(f"Suite={s} tasks={len(tasks)}")
        for t in tasks:
            task = load_yaml(t)
            print(f" - {task['task_id']}: {task.get('description','').splitlines()[0][:80]}")

    print("\nTODO: Implement harness + graders + aggregation for your stack.")

if __name__ == "__main__":
    main()
