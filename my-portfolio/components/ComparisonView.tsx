'use client';

import React, { useState } from 'react';

// Legacy interface for backward compatibility
interface ComparisonExample {
    title: string;
    scenario: string;
    baseOutput?: string;
    sftOutput?: string;
    rftOutput?: string;
    baseScore?: number;
    sftScore?: number;
    rftScore?: number;
    baseAnalysis?: string;
    sftAnalysis?: string;
    rftAnalysis?: string;
    // New generic properties
    scores?: Record<string, number>;
    outputs?: Record<string, string>;
    analysis?: Record<string, string>;
}

interface ModelConfig {
    key: string;
    label: string;
    colorClass: string;
}

interface ComparisonViewProps {
    examples: ComparisonExample[];
    modelConfig?: ModelConfig[];
    helpText?: string;
}

export default function ComparisonView({ examples, modelConfig, helpText }: ComparisonViewProps) {
    // Default to 3-model configuration for backward compatibility
    const defaultModelConfig: ModelConfig[] = [
        { key: 'base', label: 'Base Model', colorClass: 'border-l-red-500' },
        { key: 'sft', label: 'SFT Model', colorClass: 'border-l-yellow-500' },
        { key: 'rft', label: 'RFT Model', colorClass: 'border-l-green-500' }
    ];

    const models = modelConfig || defaultModelConfig;
    const [activeExample, setActiveExample] = useState(0);
    const [activeModel, setActiveModel] = useState<string>(models[models.length - 1].key);

    const currentExample = examples[activeExample];

    const getScore = (modelKey: string): number => {
        // Try new format first
        if (currentExample.scores && currentExample.scores[modelKey] !== undefined) {
            return currentExample.scores[modelKey];
        }
        // Fall back to legacy format
        const legacyScores: Record<string, number | undefined> = {
            base: currentExample.baseScore,
            sft: currentExample.sftScore,
            rft: currentExample.rftScore
        };
        return legacyScores[modelKey] || 0;
    };

    const getOutput = (modelKey: string): string => {
        let rawOutput = '';

        // Try new format first
        if (currentExample.outputs && currentExample.outputs[modelKey]) {
            rawOutput = currentExample.outputs[modelKey];
        } else {
            // Fall back to legacy format
            const legacyOutputs: Record<string, string | undefined> = {
                base: currentExample.baseOutput,
                sft: currentExample.sftOutput,
                rft: currentExample.rftOutput
            };
            rawOutput = legacyOutputs[modelKey] || '';
        }

        // Format dialogues: add double line breaks between speaker lines for better readability
        // Match patterns like "SPEAKER: dialogue" or "Speaker: dialogue"
        return rawOutput
            .replace(/([A-Z][A-Za-z]*:)/g, '\n\n$1')
            .replace(/^\n+/, '') // Remove leading newlines
            .trim();
    };

    const getAnalysis = (modelKey: string): string => {
        // Try new format first
        if (currentExample.analysis && currentExample.analysis[modelKey]) {
            return currentExample.analysis[modelKey];
        }
        // Fall back to legacy format
        const legacyAnalysis: Record<string, string | undefined> = {
            base: currentExample.baseAnalysis,
            sft: currentExample.sftAnalysis,
            rft: currentExample.rftAnalysis
        };
        return legacyAnalysis[modelKey] || '';
    };

    const formatScenario = (scenario: string) => {
        // Check for Question format (Kannada Tutor)
        const kannadaQuestionMatch = scenario.match(/\*\*Question \(Kannada\):\*\*\s*\n([^\n]+)/);
        const englishQuestionMatch = scenario.match(/\*\*Question \(English\):\*\*\s*\n(.+)/);

        // If question format found, render it
        if (kannadaQuestionMatch || englishQuestionMatch) {
            return (
                <div className="space-y-3">
                    {kannadaQuestionMatch && (
                        <div>
                            <span className="font-semibold text-xs uppercase tracking-wide text-primary">Question (Kannada):</span>
                            <p className="text-sm mt-1 font-semibold">{kannadaQuestionMatch[1].trim()}</p>
                        </div>
                    )}
                    {englishQuestionMatch && (
                        <div>
                            <span className="font-semibold text-xs uppercase tracking-wide text-primary">Question (English):</span>
                            <p className="text-sm mt-1 italic text-muted-foreground">{englishQuestionMatch[1].trim()}</p>
                        </div>
                    )}
                </div>
            );
        }

        // Otherwise, try scriptwriter format (Situation/Characters/Setting)
        const situationMatch = scenario.match(/\*\*Situation:\*\*\s*([^\*]+)/);
        const charactersMatch = scenario.match(/\*\*Characters Involved:\*\*\s*([^\*]+)/);
        const settingMatch = scenario.match(/\*\*Setting:\*\*\s*(.+)/);

        return (
            <div className="space-y-3">
                {situationMatch && (
                    <div>
                        <span className="font-semibold text-xs uppercase tracking-wide text-primary">Situation:</span>
                        <p className="text-sm mt-1">{situationMatch[1].trim()}</p>
                    </div>
                )}
                {charactersMatch && (
                    <div>
                        <span className="font-semibold text-xs uppercase tracking-wide text-primary">Characters:</span>
                        <p className="text-sm mt-1">{charactersMatch[1].trim()}</p>
                    </div>
                )}
                {settingMatch && (
                    <div>
                        <span className="font-semibold text-xs uppercase tracking-wide text-primary">Setting:</span>
                        <p className="text-sm mt-1">{settingMatch[1].trim()}</p>
                    </div>
                )}
            </div>
        );
    };

    const getScoreColor = (score: number) => {
        if (score < 0.3) return 'text-red-500';
        if (score < 0.6) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="my-12 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold">Model Comparison</h3>
                <div className="flex gap-2">
                    {examples.map((ex, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveExample(idx)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${activeExample === idx
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                        >
                            Example {idx + 1}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border bg-muted/30">
                    <h4 className="font-bold text-lg mb-4">{currentExample.title}</h4>
                    {formatScenario(currentExample.scenario)}
                </div>

                <div className={`grid divide-y md:divide-y-0 md:divide-x divide-border ${
                    models.length === 3 ? 'md:grid-cols-3' :
                    models.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
                    'md:grid-cols-2'
                }`}>
                    {models.map((modelConfig) => {
                        const modelKey = modelConfig.key;
                        return (
                            <div
                                key={modelKey}
                                className={`flex flex-col transition-colors ${activeModel === modelKey ? 'bg-primary/5' : ''
                                    }`}
                                onClick={() => setActiveModel(modelKey)}
                            >
                                <div className="p-3 border-b border-border flex justify-between items-center bg-muted/10">
                                    <span className="font-bold uppercase text-xs tracking-wider">
                                        {modelConfig.label}
                                    </span>
                                    <span className={`font-mono font-bold text-sm ${getScoreColor(getScore(modelKey))}`}>
                                        Score: {getScore(modelKey).toFixed(3)}
                                    </span>
                                </div>
                                <div className="p-4 overflow-y-auto h-[400px] font-mono text-xs leading-relaxed whitespace-pre-wrap">
                                    {getOutput(modelKey)}
                                </div>
                                <div className={`p-4 border-t border-border bg-muted/5 border-l-4 ${modelConfig.colorClass}`}>
                                    <p className="text-xs font-semibold mb-2 uppercase tracking-wide">Analysis</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {getAnalysis(modelKey)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {helpText && (
                <p className="text-center text-sm text-muted-foreground">
                    {helpText}
                </p>
            )}
            {!helpText && (
                <p className="text-center text-sm text-muted-foreground">
                    Click on a column to highlight it. The final model typically shows the best performance.
                </p>
            )}
        </div>
    );
}
