import React from 'react';

interface TrainingMetricsProps {
    scoreDistributionImage?: string;
    rewardProgressionImage?: string;
}

export default function TrainingMetrics({ scoreDistributionImage, rewardProgressionImage }: TrainingMetricsProps) {
    return (
        <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="card p-6 bg-card border border-border rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-4">Score Distribution</h3>
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden group">
                    {scoreDistributionImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={scoreDistributionImage}
                            alt="Score Distribution Histogram"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        /* Placeholder for actual chart - using CSS for a simple representation if no image */
                        <div className="absolute inset-0 flex items-end justify-around p-4 gap-2">
                            {/* Base */}
                            <div className="w-1/4 bg-red-400/50 h-[30%] rounded-t relative group-hover:opacity-80 transition-opacity">
                                <div className="absolute -top-6 left-0 right-0 text-center text-xs font-bold">Base</div>
                            </div>
                            {/* SFT */}
                            <div className="w-1/4 bg-blue-400/50 h-[60%] rounded-t relative group-hover:opacity-80 transition-opacity">
                                <div className="absolute -top-6 left-0 right-0 text-center text-xs font-bold">SFT</div>
                            </div>
                            {/* RFT */}
                            <div className="w-1/4 bg-green-400/50 h-[85%] rounded-t relative group-hover:opacity-80 transition-opacity">
                                <div className="absolute -top-6 left-0 right-0 text-center text-xs font-bold">RFT</div>
                            </div>
                            <p className="absolute top-2 right-2 text-xs text-muted-foreground">Illustrative Distribution</p>
                        </div>
                    )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                    Score distribution shifts right (higher quality) from Base → SFT → RFT models.
                </p>
            </div>

            <div className="card p-6 bg-card border border-border rounded-xl shadow-sm">
                <h3 className="text-lg font-bold mb-4">RFT Reward Progression</h3>
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {rewardProgressionImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={rewardProgressionImage}
                            alt="RFT Reward Progression Curve"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <svg viewBox="0 0 100 50" className="w-full h-full p-4 overflow-visible">
                            {/* Simple line chart */}
                            <path
                                d="M0,40 Q20,35 40,25 T100,10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-primary"
                            />
                            <path
                                d="M0,40 Q20,38 40,30 T100,15"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                className="text-primary/50"
                            />
                            <p className="absolute top-2 right-2 text-xs text-muted-foreground">Reward vs Steps</p>
                        </svg>
                    )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                    Steady improvement in reward scores as the model aligns with the judge&apos;s preferences.
                </p>
            </div>
        </div>
    );
}
