'use client';

import { useState } from 'react';
import TabsNavigation from '@/components/TabsNavigation';

interface TaskData {
    task_id: string;
    suite: string;
    description: string;
    tags: string[];
    inputs: Record<string, unknown>;
    environment: {
        sandbox: string;
        budgets: {
            max_steps: number;
            max_tool_calls: number;
            max_total_tokens: number;
            max_wall_time_seconds: number;
        };
    };
    trials: {
        k: number;
        metric: string;
    };
    graders: Array<Record<string, unknown>>;
    tracked_metrics: Array<Record<string, unknown>>;
    gates: {
        ci_merge_gate: boolean;
        nightly: boolean;
        release_candidate: boolean;
    };
}

interface Task {
    id: string;
    title: string;
    suite: string;
    color: string;
    filepath: string;
    yamlContent: string;
    parsedData: TaskData;
}

interface TasksTabsClientProps {
    tasks: Task[];
}

export default function TasksTabsClient({ tasks }: TasksTabsClientProps) {
    const [activeTab, setActiveTab] = useState(tasks[0]?.id || 'golden');
    const [showFullYaml, setShowFullYaml] = useState(false);

    const activeTask = tasks.find(t => t.id === activeTab);

    if (!activeTask) {
        return <div>No tasks available</div>;
    }

    const { parsedData } = activeTask;

    return (
        <>
            {/* Tab Navigation */}
            <div className="mb-8">
                <TabsNavigation
                    tabs={tasks.map(t => ({ id: t.id, title: t.title }))}
                    activeTab={activeTab}
                    onTabChange={(id) => {
                        setActiveTab(id);
                        setShowFullYaml(false);
                    }}
                />
            </div>

            {/* Task Overview */}
            <div className={`mb-8 bg-muted/10 rounded-xl p-6 border-l-4 ${activeTask.color}`}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{activeTask.title}</h2>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{parsedData.task_id}</code>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {parsedData.tags.map(tag => (
                            <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="text-muted-foreground">{parsedData.description}</p>
            </div>

            {/* Task Details */}
            <div className="space-y-6 mb-8">
                {/* Configuration */}
                <div className="bg-muted/10 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Configuration</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground mb-1">Sandbox</p>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{parsedData.environment.sandbox}</code>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Trials</p>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                k={parsedData.trials.k} ({parsedData.trials.metric})
                            </code>
                        </div>
                    </div>
                </div>

                {/* Budgets */}
                <div className="bg-muted/10 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Budget Constraints</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Steps:</span>
                            <span className="font-mono">{parsedData.environment.budgets.max_steps}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Tool Calls:</span>
                            <span className="font-mono">{parsedData.environment.budgets.max_tool_calls}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Tokens:</span>
                            <span className="font-mono">{parsedData.environment.budgets.max_total_tokens.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Time:</span>
                            <span className="font-mono">{parsedData.environment.budgets.max_wall_time_seconds}s</span>
                        </div>
                    </div>
                </div>

                {/* Graders */}
                <div className="bg-muted/10 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Graders ({parsedData.graders.length})</h3>
                    <div className="space-y-2 text-sm">
                        {parsedData.graders.map((grader, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                <code className="bg-muted px-2 py-1 rounded text-xs">
                                    {String(grader.type)}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tracked Metrics */}
                <div className="bg-muted/10 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Tracked Metrics</h3>
                    <div className="space-y-2 text-sm">
                        {parsedData.tracked_metrics.map((metric, idx) => {
                            const hasFields = metric.fields && Array.isArray(metric.fields) && metric.fields.length > 0;
                            return (
                                <div key={idx} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <div>
                                        <code className="bg-muted px-2 py-1 rounded text-xs">
                                            {String(metric.type)}
                                        </code>
                                        {hasFields ? (
                                            <p className="text-muted-foreground text-xs mt-1">
                                                Fields: {(metric.fields as string[]).join(', ')}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CI Gates */}
                <div className="bg-muted/10 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">CI Gates</h3>
                    <div className="flex gap-3">
                        {parsedData.gates.ci_merge_gate && (
                            <span className="text-xs bg-red-500/10 text-red-700 dark:text-red-400 px-3 py-1 rounded-full">
                                CI Merge Gate
                            </span>
                        )}
                        {parsedData.gates.nightly && (
                            <span className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full">
                                Nightly
                            </span>
                        )}
                        {parsedData.gates.release_candidate && (
                            <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                                Release Candidate
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Full YAML Display */}
            <div className="bg-muted/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">YAML Source</h3>
                    <button
                        onClick={() => setShowFullYaml(!showFullYaml)}
                        className="text-sm text-primary hover:opacity-80 transition-opacity"
                    >
                        {showFullYaml ? 'Hide' : 'Show'} Full YAML
                    </button>
                </div>

                {showFullYaml && (
                    <pre className="bg-background rounded-lg p-4 overflow-x-auto text-xs">
                        <code>{activeTask.yamlContent}</code>
                    </pre>
                )}
            </div>
        </>
    );
}
