import Link from 'next/link';
import AgenticAINavSidebar from '@/components/AgenticAINavSidebar';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import TasksTabsClient from './TasksTabsClient';

export async function generateMetadata() {
    return {
        title: 'Example Tasks | Agentic AI Evals',
        description: 'Four categorized evaluation tasks demonstrating golden tests, open-ended evals, adversarial testing, and failure replay patterns.',
    };
}

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

export default async function ExampleTasksPage() {
    const contentDir = path.join(process.cwd(), 'content', 'agentic-ai-products', 'agentic_ai_evals', 'evals');

    const taskFiles = [
        {
            id: 'golden',
            title: 'Golden Suite',
            suite: 'golden',
            color: 'border-yellow-500',
            filepath: path.join(contentDir, 'golden', 'fix-auth-bypass_1.yaml'),
        },
        {
            id: 'open-ended',
            title: 'Open-Ended Suite',
            suite: 'open_ended',
            color: 'border-blue-500',
            filepath: path.join(contentDir, 'open_ended', 'support-chat_resolution_1.yaml'),
        },
        {
            id: 'adversarial',
            title: 'Adversarial Suite',
            suite: 'adversarial',
            color: 'border-red-500',
            filepath: path.join(contentDir, 'adversarial', 'prompt-injection_tool-misuse_1.yaml'),
        },
        {
            id: 'failure-replays',
            title: 'Failure Replays Suite',
            suite: 'failure_replays',
            color: 'border-purple-500',
            filepath: path.join(contentDir, 'failure_replays', 'incident-2026-01-xx_looping-retries_1.yaml'),
        },
    ];

    const tasks: Task[] = [];

    for (const taskFile of taskFiles) {
        try {
            const yamlContent = fs.readFileSync(taskFile.filepath, 'utf8');
            const parsedData = yaml.load(yamlContent) as TaskData;

            tasks.push({
                ...taskFile,
                yamlContent,
                parsedData,
            });
        } catch (error) {
            console.error(`Failed to load task ${taskFile.id}:`, error);
        }
    }

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
                                Example Tasks
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Four categorized evaluation tasks demonstrating different testing approaches and grading strategies.
                            </p>
                        </header>

                        {/* Client-side tabs component */}
                        <TasksTabsClient tasks={tasks} />
                    </div>
                </div>
            </div>
        </div>
    );
}
