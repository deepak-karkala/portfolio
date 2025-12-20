import React from 'react';

interface ModelCardProps {
    baseModel: string;
    baseModelUrl: string;
    trainingDataset: string;
    trainingDatasetUrl: string;
    trainingSteps: number;
    trainingEpochs: number;
    trainingLoss: string;
    evalLoss: string;
    hardware: string;
    frameworks: string[];
}

export default function ModelCard({
    baseModel,
    baseModelUrl,
    trainingDataset,
    trainingDatasetUrl,
    trainingSteps,
    trainingEpochs,
    trainingLoss,
    // evalLoss, // Unused
    hardware,
    frameworks
}: ModelCardProps) {
    return (
        <div className="card p-6 bg-card text-card-foreground border border-border rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="21" y2="9" />
                </svg>
                Model Card
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Base Model & Data</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                            <span>Base Model:</span>
                            <a href={baseModelUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                {baseModel}
                            </a>
                        </li>
                        <li className="flex justify-between">
                            <span>Dataset:</span>
                            <a href={trainingDatasetUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                {trainingDataset}
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Training Stats</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                            <span>Epochs:</span>
                            <span className="font-mono">{trainingEpochs}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Steps:</span>
                            <span className="font-mono">{trainingSteps}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Final Loss:</span>
                            <span className="font-mono text-green-600 dark:text-green-400">{trainingLoss}</span>
                        </li>
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Infrastructure</h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                            {hardware}
                        </span>
                        {frameworks.map(fw => (
                            <span key={fw} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                                {fw}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
