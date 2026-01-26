import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';

export async function generateMetadata() {
    return {
        title: 'Evaluation Framework | Agentic AI Evals',
        description: 'YAML-based task suite structure with schemas, configuration, and suite breakdown for production agent evaluation.',
    };
}

const suites = [
    {
        name: 'Golden Suite',
        path: 'evals/golden',
        trials: '3 (pass^k)',
        ciRequired: true,
        color: 'border-yellow-500',
        description: 'Deterministic regression tests with code-based assertions',
        example: 'fix-auth-bypass_1.yaml',
        graders: 'Deterministic tests, static analysis, state checks',
        budgets: 'Strict (20 steps max)',
    },
    {
        name: 'Adversarial Suite',
        path: 'evals/adversarial',
        trials: '10 (pass^k)',
        ciRequired: true,
        color: 'border-red-500',
        description: 'Security testing and attack scenarios',
        example: 'prompt-injection_tool-misuse_1.yaml',
        graders: 'Deterministic safety checks, policy validators',
        budgets: 'Very strict (8 steps)',
    },
    {
        name: 'Open-Ended Suite',
        path: 'evals/open_ended',
        trials: '5 (pass@k)',
        ciRequired: false,
        color: 'border-blue-500',
        description: 'Capability evals with subjective rubric scoring',
        example: 'support-chat_resolution_1.yaml',
        graders: 'LLM rubric scoring, model-based evaluation',
        budgets: 'Relaxed (12 steps)',
    },
    {
        name: 'Failure Replays Suite',
        path: 'evals/failure_replays',
        trials: '5 (pass^k)',
        ciRequired: true,
        color: 'border-purple-500',
        description: 'Production incident reproduction tests',
        example: 'incident-2026-01-xx_looping-retries_1.yaml',
        graders: 'Trajectory metrics, robustness checks',
        budgets: 'Medium (10 steps)',
    },
];

export default function EvaluationFrameworkPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation - Mobile only */}
                <div className="mb-8 lg:hidden">
                    <Link
                        href="/agentic-ai-products/agentic-ai-evals"
                        className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span> Back to Evaluation Framework
                    </Link>
                </div>

                <div className="flex gap-12">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <AgenticAINavSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl">
                        {/* Header */}
                        <header className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Evaluation Framework
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                YAML-based task suite structure for systematic agent evaluation across multiple dimensions.
                            </p>
                        </header>

                        {/* Task Structure Overview */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">Task Structure</h2>
                            <p className="text-muted-foreground mb-6">
                                Each evaluation task is defined as a YAML file following a standardized schema. Tasks specify inputs, environment configuration, graders, metrics, and CI gates.
                            </p>

                            <div className="bg-muted/10 rounded-xl p-6">
                                <h3 className="font-semibold mb-3">Required Fields</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <code className="bg-muted px-2 py-1 rounded">task_id</code>
                                        <p className="text-muted-foreground mt-1">Unique identifier</p>
                                    </div>
                                    <div>
                                        <code className="bg-muted px-2 py-1 rounded">suite</code>
                                        <p className="text-muted-foreground mt-1">golden | open_ended | adversarial | failure_replays</p>
                                    </div>
                                    <div>
                                        <code className="bg-muted px-2 py-1 rounded">description</code>
                                        <p className="text-muted-foreground mt-1">Task description</p>
                                    </div>
                                    <div>
                                        <code className="bg-muted px-2 py-1 rounded">inputs</code>
                                        <p className="text-muted-foreground mt-1">Task-specific inputs</p>
                                    </div>
                                    <div>
                                        <code className="bg-muted px-2 py-1 rounded">graders</code>
                                        <p className="text-muted-foreground mt-1">Array of grader configurations</p>
                                    </div>
                                    <div>
                                        <code className="bg-muted px-2 py-1 rounded">tracked_metrics</code>
                                        <p className="text-muted-foreground mt-1">Metrics to collect</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Suite Breakdown */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">Evaluation Suites</h2>
                            <p className="text-muted-foreground mb-6">
                                Four specialized suites for different evaluation purposes, each with specific grading strategies and budget constraints.
                            </p>

                            <div className="space-y-4">
                                {suites.map((suite) => (
                                    <div
                                        key={suite.name}
                                        className={`bg-muted/10 rounded-xl p-6 border-l-4 ${suite.color}`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold">{suite.name}</h3>
                                            <div className="flex gap-2">
                                                {suite.ciRequired && (
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                        CI Required
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground mb-4">{suite.description}</p>

                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Path</p>
                                                <code className="text-xs bg-muted px-2 py-1 rounded">{suite.path}</code>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Default Trials</p>
                                                <code className="text-xs bg-muted px-2 py-1 rounded">{suite.trials}</code>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Graders</p>
                                                <p className="text-xs mt-1">{suite.graders}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Budget Limits</p>
                                                <p className="text-xs mt-1">{suite.budgets}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-muted-foreground">Example Task</p>
                                                <code className="text-xs bg-muted px-2 py-1 rounded">{suite.example}</code>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CI Gates Configuration */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">CI Gates & Execution Flow</h2>
                            <p className="text-muted-foreground mb-6">
                                Three-tier pipeline with progressive evaluation at merge, nightly, and release stages.
                            </p>

                            <div className="space-y-4">
                                <div className="bg-muted/10 rounded-xl p-6">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <span className="text-red-500">●</span>
                                        CI Merge Gate
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Must pass before merging to main. Includes golden, adversarial, and failure replay suites.
                                    </p>
                                    <div className="text-sm space-y-1">
                                        <p><strong>Fail conditions:</strong></p>
                                        <ul className="list-disc list-inside text-muted-foreground ml-4">
                                            <li>Any safety violation</li>
                                            <li>Golden regression</li>
                                            <li>Forbidden tool called</li>
                                        </ul>
                                        <p className="mt-2"><strong>Budget constraints:</strong></p>
                                        <ul className="list-disc list-inside text-muted-foreground ml-4">
                                            <li>Max latency P95 increase: 15ms</li>
                                            <li>Max cost increase: 10%</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-muted/10 rounded-xl p-6">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <span className="text-yellow-500">●</span>
                                        Nightly Runs
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Comprehensive evaluation including all suites (golden, adversarial, open-ended, failure replays) for trend monitoring.
                                    </p>
                                </div>

                                <div className="bg-muted/10 rounded-xl p-6">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <span className="text-green-500">●</span>
                                        Release Candidate
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Full suite validation before production deployment. All four suites must pass with strict thresholds.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Metrics Explanation */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">Trial Metrics</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-muted/10 rounded-xl p-6">
                                    <h3 className="font-semibold mb-2">pass@k</h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        At least one success in k trials (OR logic)
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Used for: Open-ended tasks where any valid solution counts
                                    </p>
                                </div>
                                <div className="bg-muted/10 rounded-xl p-6">
                                    <h3 className="font-semibold mb-2">pass^k</h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        All k trials must succeed (AND logic)
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Used for: Safety and regression tests requiring consistency
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Task Schema Reference */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">Task Schema Reference</h2>
                            <p className="text-muted-foreground mb-4">
                                Full JSON schema defining the structure of evaluation tasks. All tasks must validate against this schema.
                            </p>
                            <div className="bg-muted/10 rounded-xl p-6">
                                <pre className="text-xs overflow-x-auto">
                                    <code>{`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Agent Eval Task",
  "type": "object",
  "required": ["task_id", "suite", "description", "inputs", "graders", "tracked_metrics"],
  "properties": {
    "task_id": { "type": "string" },
    "suite": {
      "type": "string",
      "enum": ["golden", "open_ended", "adversarial", "failure_replays"]
    },
    "description": { "type": "string" },
    "tags": { "type": "array", "items": { "type": "string" } },
    "inputs": { "type": "object" },
    "environment": {
      "type": "object",
      "properties": {
        "sandbox": { "type": "string" },
        "reset": { "type": "object" },
        "budgets": { "type": "object" }
      }
    },
    "trials": {
      "type": "object",
      "properties": {
        "k": { "type": "integer", "minimum": 1 },
        "metric": { "type": "string", "enum": ["pass@k", "pass^k"] }
      }
    },
    "graders": { "type": "array", "minItems": 1 },
    "tracked_metrics": { "type": "array", "minItems": 1 },
    "gates": {
      "type": "object",
      "properties": {
        "ci_merge_gate": { "type": "boolean" },
        "nightly": { "type": "boolean" },
        "release_candidate": { "type": "boolean" }
      }
    }
  }
}`}</code>
                                </pre>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
