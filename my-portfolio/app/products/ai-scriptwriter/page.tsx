import { getProductBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ComparisonView from '@/components/ComparisonView';
import ProductSidebar from '@/components/ProductSidebar';

export async function generateMetadata() {
    const product = await getProductBySlug('ai-scriptwriter/sitcom-office');
    if (!product) return {};
    return {
        title: `${product.title} | Products`,
        description: product.summary,
    };
}

export default async function ProjectSitcomOfficePage() {
    const product = await getProductBySlug('ai-scriptwriter/sitcom-office');

    if (!product) {
        notFound();
    }

    // Images
    const images = {
        scoreDistribution: "/products/ai-scriptwriter/scores_hist.png",
        rewardProgression: "/products/ai-scriptwriter/training_curves_rft_reward.png",
        boxplot: "/products/ai-scriptwriter/scores_boxplot.png",
        trainingPipeline: "/products/ai-scriptwriter/training_pipeline.png"
    };

    // Load actual model outputs from hero_examples.json
    const heroExamplesData = await import('@/public/products/ai-scriptwriter/hero_examples.json');

    interface HeroExample {
        scene: string;
        judge_scores: { base: number; sft: number; rft: number };
        models: {
            base: { screenplay: string };
            sft: { screenplay: string };
            rft: { screenplay: string };
        };
        analysis: {
            title: string;
            focus: string[];
        };
    }

    const comparisonExamples = (heroExamplesData.hero_examples as HeroExample[]).map((example) => ({
        title: example.analysis.title,
        scenario: example.scene,
        baseScore: example.judge_scores.base,
        sftScore: example.judge_scores.sft,
        rftScore: example.judge_scores.rft,
        baseOutput: example.models.base.screenplay,
        sftOutput: example.models.sft.screenplay,
        rftOutput: example.models.rft.screenplay,
        baseAnalysis: example.analysis.focus[0],
        sftAnalysis: example.analysis.focus[1],
        rftAnalysis: example.analysis.focus[2]
    }));

    const sections = [
        { id: 'why-this-project', title: 'Why This Project?' },
        { id: 'system-overview', title: 'System Overview' },
        { id: 'evaluation-criteria', title: 'Evaluation Criteria' },
        { id: 'training-results', title: 'Training & Results' },
        { id: 'quantitative-evaluation', title: 'Quantitative Evaluation' },
        { id: 'hero-examples', title: 'Hero Examples' },
        { id: 'training-specifications', title: 'Training Specifications' },
        { id: 'key-learnings', title: 'Key Learnings' },
        { id: 'product-vision', title: 'Product Vision' },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Navigation */}
                <div className="mb-8">
                    <Link
                        href="/products"
                        className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span> Back to Products
                    </Link>
                </div>

                <div className="flex gap-12">
                    {/* Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <ProductSidebar sections={sections} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl product-body pr-8 lg:pr-16">

                {/* Header */}
                <header className="mb-12">
                    {/* Cover Image */}
                    {product.image && (
                        <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Teaching an Open-Source LLM to Write <em>The Office</em>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8">
                        Fine-tuning a reasoning-first LLM to generate sitcom screenplays with on-brand humor, character voice, and multi-step setups.
                    </p>
                </header>

                {/* Main Narrative Content - Rendered from Markdown or Custom */}
                {/* Since we want high fidelity, I'll use the custom components and text here instead of raw markdown for the key parts */}

                {/* Why This Project */}
                <section id="why-this-project" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">Why This Project?</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                        Most LLM demos focus on generic chat or coding. I wanted to show something different:
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-muted/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-3">Specific Domain</h3>
                            <p className="text-sm">A single sitcom (<em>The Office</em>) with strong, recognizable character voices.</p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-3">Reasoning-Heavy Format</h3>
                            <p className="text-sm">Each sample includes both a <strong>planning / reasoning trace</strong> and the <strong>final screenplay</strong>.</p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-3">Production Pipeline</h3>
                            <p className="text-sm">Data curation, SFT, RFT, automated evaluation, and visualization.</p>
                        </div>
                    </div>
                    <div className="bg-primary/10 border-l-4 border-primary rounded-r-xl p-6">
                        <p className="font-semibold mb-2">This case study doubles as:</p>
                        <ul className="space-y-2 list-disc pl-6">
                            <li>A <strong>product demo:</strong> &quot;What if you could auto-generate new <em>The Office</em> episodes?&quot;</li>
                            <li>A <strong>skills demo:</strong> End-to-end fine-tuning of open-source LLMs for a narrow, stylistic generation task.</li>
                        </ul>
                    </div>
                </section>

                {/* System Overview */}
                <section id="system-overview" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">System Overview</h2>
                    <div className="bg-muted/20 rounded-xl p-6 md:p-8 mb-8">
                        <p className="text-lg mb-4">
                            <strong>Goal:</strong> Given a high-level sitcom situation (e.g., <em>&quot;Michael uses Pam&apos;s post-its to avoid work calls&quot;</em>), generate:
                        </p>
                        <ol className="space-y-3 list-decimal pl-6">
                            <li>A <strong>reasoning trace</strong> that plans beats, character goals, and comedic engines.</li>
                            <li>A full <strong>screenplay scene</strong> consistent with <em>The Office</em> tone.</li>
                        </ol>
                    </div>

                    <h3 className="text-2xl font-semibold mb-4">Reasoning Trace Structure</h3>
                    <p className="text-muted-foreground mb-6">
                        The training dataset uses a structured reasoning-first approach where each sample includes a comprehensive creative blueprint before the screenplay. The reasoning trace contains:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-muted/10 rounded-lg p-4">
                            <p className="font-semibold mb-2">1. Storyline Goal</p>
                            <p className="text-sm text-muted-foreground">Defines the narrative purpose, core conflict, and comedic goal.</p>
                        </div>
                        <div className="bg-muted/10 rounded-lg p-4">
                            <p className="font-semibold mb-2">2. Character Objectives</p>
                            <p className="text-sm text-muted-foreground">Each character&apos;s immediate want or need.</p>
                        </div>
                        <div className="bg-muted/10 rounded-lg p-4">
                            <p className="font-semibold mb-2">3. Character Dynamics</p>
                            <p className="text-sm text-muted-foreground">Interpersonal conflicts and alliances.</p>
                        </div>
                        <div className="bg-muted/10 rounded-lg p-4">
                            <p className="font-semibold mb-2">4. Meta Reasoning</p>
                            <p className="text-sm text-muted-foreground">Writer&apos;s room approach—why this is funny.</p>
                        </div>
                        <div className="bg-muted/10 rounded-lg p-4">
                            <p className="font-semibold mb-2">5. Primary Comedy Engine</p>
                            <p className="text-sm text-muted-foreground">Cringe, Dramatic Irony, Absurdity, Escalation.</p>
                        </div>
                        <div className="bg-muted/10 rounded-lg p-4">
                            <p className="font-semibold mb-2">6. Beat Sheet</p>
                            <p className="text-sm text-muted-foreground">Inciting Incident → Rising Action → Climax → Resolution.</p>
                        </div>
                        <div className="bg-muted/10 rounded-lg p-4">
                            <p className="font-semibold mb-2">7. Talking Head Strategies</p>
                            <p className="text-sm text-muted-foreground">How characters use confessionals for comedy.</p>
                        </div>
                        <div className="bg-muted/10 rounded-lg p-4">
                            <p className="font-semibold mb-2">8. Comedy Tropes Applied</p>
                            <p className="text-sm text-muted-foreground">Specific comedic devices used.</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground mb-8">
                        This structured approach teaches the model to think like an Emmy-winning TV writer before generating the final screenplay.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Models Compared</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-red-500">
                            <h4 className="font-semibold mb-2">Base Model</h4>
                            <p className="text-sm text-muted-foreground">Gemma-3 1B — Original LLM (no domain fine-tuning)</p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-yellow-500">
                            <h4 className="font-semibold mb-2">SFT</h4>
                            <p className="text-sm text-muted-foreground">CoT Reasoning — Supervised fine-tune on reasoning + screenplay</p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-green-500">
                            <h4 className="font-semibold mb-2">RFT</h4>
                            <p className="text-sm text-muted-foreground">Model Grader — Reinforcement fine-tune using LLM-as-judge rewards</p>
                        </div>
                    </div>
                </section>

                {/* Evaluation Criteria */}
                <section id="evaluation-criteria" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">LLM-as-Judge Evaluation Criteria</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        The judge evaluates each generated screenplay using <strong>eight weighted metrics</strong> that capture both technical quality and stylistic authenticity:
                    </p>
                    <div className="bg-muted/30 rounded-xl p-6 md:p-8 overflow-x-auto mb-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left py-4 px-4 font-semibold">Metric</th>
                                    <th className="text-left py-4 px-4 font-semibold">Weight</th>
                                    <th className="text-left py-4 px-4 font-semibold">Focus</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-4"><strong>Character Consistency</strong></td>
                                    <td className="py-4 px-4 text-primary font-semibold text-lg">25%</td>
                                    <td className="py-4 px-4">Does dialogue perfectly align with each character&apos;s established persona?</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-4"><strong>Humor Quality & Specificity</strong></td>
                                    <td className="py-4 px-4 text-primary font-semibold text-lg">25%</td>
                                    <td className="py-4 px-4">Is the humor effective and consistent with <em>The Office</em>&apos;s comedic DNA?</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-4"><strong>Narrative Coherence</strong></td>
                                    <td className="py-4 px-4 font-semibold">15%</td>
                                    <td className="py-4 px-4">Does the screenplay follow a logical comedic progression?</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-4"><strong>Style Fidelity</strong></td>
                                    <td className="py-4 px-4 font-semibold">15%</td>
                                    <td className="py-4 px-4">Authentic mockumentary techniques (talking heads, camera glances)?</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-4"><strong>Dialogue Plausibility</strong></td>
                                    <td className="py-4 px-4 font-semibold">5%</td>
                                    <td className="py-4 px-4">Natural and conversational while being witty?</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-4"><strong>Creative Plausibility</strong></td>
                                    <td className="py-4 px-4 font-semibold">5%</td>
                                    <td className="py-4 px-4">Fresh ideas that fit within the show&apos;s reality?</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-4 px-4"><strong>Formatting Accuracy</strong></td>
                                    <td className="py-4 px-4 font-semibold">5%</td>
                                    <td className="py-4 px-4">Strict adherence to structure?</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4"><strong>Relevance to Storyline</strong></td>
                                    <td className="py-4 px-4 font-semibold">5%</td>
                                    <td className="py-4 px-4">Reflects the provided scenario?</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-muted-foreground">
                        The final score is a weighted average with the highest weights on <strong>Character Consistency</strong> and <strong>Humor Quality</strong>—the two elements that define <em>The Office</em>&apos;s unique voice.
                    </p>
                </section>

                {/* Training Metrics */}
                <section id="training-results" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">Training & Results</h2>

                    <div className="bg-muted/20 rounded-xl p-6 md:p-8 mb-8">
                        <h3 className="text-2xl font-semibold mb-4">Reinforcement Fine-Tuning Rewards</h3>
                        <p className="text-muted-foreground italic mb-4">
                            How quickly does the policy learn to please the sitcom-style judge?
                        </p>
                        <p className="mb-4">
                            The reward progression plot shows step-wise rewards (light red) and a 20-step rolling average (bold red):
                        </p>
                        <ul className="space-y-2 mb-4 list-disc pl-6">
                            <li>Early steps show <strong>high variance and lower average rewards</strong>.</li>
                            <li>The <strong>rolling average climbs steadily</strong> as the policy learns, then plateaus as it reaches a stable style that the judge prefers.</li>
                            <li>Occasional dips reflect <strong>exploration and noisy judge scores</strong>, but the overall trajectory trends upward.</li>
                        </ul>
                        <p className="text-muted-foreground">
                            You can think of this as the model gradually learning: &quot;Don&apos;t just be coherent—be <em>character-consistent, witty, and structurally Office-like</em>.&quot;
                        </p>
                    </div>

                    {/* RFT Reward Progression - Full Width */}
                    <div className="bg-muted/20 rounded-xl p-6 md:p-8">
                        <div className="w-full bg-muted/30 rounded-lg overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={images.rewardProgression}
                                alt="RFT Reward Progression Curve"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </section>

                {/* Quantitative Evaluation */}
                <section id="quantitative-evaluation" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">Quantitative Evaluation</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        I evaluated all three models on a held-out set of sitcom prompts, scoring each output with a domain-tuned <strong>LLM-as-judge</strong> (0–1 scale, normalized).
                    </p>

                    {/* Score Distribution - Full Width Row */}
                    <div className="bg-muted/20 rounded-xl p-6 md:p-8 mb-8">
                        <h3 className="text-xl font-semibold mb-6">Score Distribution by Model</h3>
                        <div className="space-y-6">
                            {/* Histogram image */}
                            <div className="w-full bg-muted/30 rounded-lg overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={images.scoreDistribution}
                                    alt="Score Distribution Histogram"
                                    className="w-full h-auto"
                                />
                            </div>
                            {/* Description */}
                            <div className="space-y-4">
                                <ul className="space-y-3 list-disc pl-6">
                                    <li>The <strong>Base Model</strong> is concentrated at lower scores, with most samples clustered toward the left.</li>
                                    <li><strong>SFT Model</strong> shifts the distribution right: more samples in the mid-to-high range.</li>
                                    <li><strong>RFT Model</strong> also lives in the higher band, trading a bit of spread for more consistently good outputs.</li>
                                </ul>
                                <p className="text-sm text-muted-foreground border-l-4 border-primary pl-4">
                                    Visually, you can see the <strong>&quot;cloud&quot; of scores moving to the right</strong> as training progresses from Base → SFT → RFT.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Boxplot Comparison - Full Width Row */}
                    <div className="bg-muted/20 rounded-xl p-6 md:p-8 mb-8">
                        <h3 className="text-xl font-semibold mb-6">Boxplot Comparison</h3>
                        <div className="space-y-6">
                            {/* Boxplot image */}
                            <div className="w-full bg-muted/30 rounded-lg overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={images.boxplot}
                                    alt="Score Comparison Boxplot"
                                    className="w-full h-auto"
                                />
                            </div>
                            {/* Description */}
                            <div className="space-y-4">
                                <ul className="space-y-3 list-disc pl-6">
                                    <li><strong>Median score</strong> jumps significantly from Base → SFT.</li>
                                    <li><strong>RFT</strong> retains a higher median than the base model, and its interquartile range sits above most of the Base distribution.</li>
                                    <li>Outliers reveal that:
                                        <ul className="mt-2 space-y-2 list-circle pl-6">
                                            <li>Base occasionally gets lucky with a good scene.</li>
                                            <li>SFT and RFT more <strong>reliably</strong> hit decent quality, with fewer catastrophic failures.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/10 border-l-4 border-primary rounded-r-xl p-6">
                        <p className="font-semibold">
                            <strong>Key Takeaway:</strong> Fine-tuning doesn&apos;t just help a few cherry-picked cases—it shifts the overall quality level up.
                        </p>
                    </div>
                </section>

                {/* Comparison View */}
                <section id="hero-examples" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">Hero Examples</h2>
                    <p className="text-muted-foreground mb-8">
                        Compare the output of the Base model, SFT model, and the final RFT model. Notice how the RFT model captures the specific &quot;mockumentary&quot; style and character voices much better. Each model column includes a qualitative analysis showing the progressive improvement from Base → SFT → RFT.
                    </p>

                    <ComparisonView examples={comparisonExamples} />
                </section>

                {/* Detailed Training Specifications */}
                <section id="training-specifications" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">Detailed Training Specifications</h2>

                    {/* Training Pipeline Overview */}
                    <div className="bg-muted/20 rounded-xl p-6 md:p-8 mb-8">
                        <h3 className="text-xl font-semibold mb-6">Training Pipeline Overview</h3>
                        <div className="flex justify-center bg-muted/30 rounded-lg overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={images.trainingPipeline}
                                alt="Training Pipeline Architecture"
                                className="max-w-2xl w-full h-auto"
                            />
                        </div>
                        <p className="mt-6 text-sm text-muted-foreground">
                            The complete training pipeline flows from a base open-source model through SFT (supervised fine-tuning on custom reasoning + screenplay data) to RFT (reinforcement fine-tuning with PPO using LLM-as-judge rewards). Continuous evaluation and monitoring ensure quality improvement at each stage.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Data Preparation */}
                        <div className="bg-muted/20 rounded-xl p-6 md:p-8">
                            <h3 className="text-2xl font-semibold mb-6">Data Preparation</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Training Dataset</p>
                                    <p className="font-medium">
                                        <a href="https://huggingface.co/datasets/deepakkarkala/sitcom_storylines_reasoning/tree/main/data" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            sitcom_storylines_reasoning
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Total Scenes</p>
                                    <p className="font-medium">500 reasoning-chain + screenplay pairs</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Evaluation Set</p>
                                    <p className="font-medium">100 held-out prompts</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Format</p>
                                    <p className="font-medium">Structured reasoning trace + screenplay</p>
                                </div>
                            </div>
                        </div>

                        {/* SFT */}
                        <div className="bg-muted/20 rounded-xl p-6 md:p-8">
                            <h3 className="text-2xl font-semibold mb-6">SFT (Supervised Fine-Tuning)</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Training Epochs</p>
                                    <p className="font-medium text-lg">3</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Total Steps</p>
                                    <p className="font-medium text-lg">48</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Batch Size</p>
                                    <p className="font-medium text-lg">8</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Learning Rate</p>
                                    <p className="font-medium">5e-05 → 1.16e-06</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Optimizer</p>
                                    <p className="font-medium">AdamW</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Best Checkpoint</p>
                                    <p className="font-medium">Step 45</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Fine-tuning Method</p>
                                    <p className="font-medium">LoRA (r=128, α=128)</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Training Loss</p>
                                    <p className="font-medium">2.558 → 2.161</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Eval Loss</p>
                                    <p className="font-medium">2.478 → 2.311</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Hardware</p>
                                    <p className="font-medium">1 x A40 [48 GB VRAM]</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Frameworks</p>
                                    <p className="font-medium">TRL, Unsloth, PyTorch</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border">
                                <a href="https://huggingface.co/deepakkarkala/gemma3-1b-sft-sitcom-office-reasoning" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                    View SFT Model on HuggingFace →
                                </a>
                            </div>
                        </div>

                        {/* RFT */}
                        <div className="bg-muted/20 rounded-xl p-6 md:p-8">
                            <h3 className="text-2xl font-semibold mb-6">RFT (Reinforcement Fine-Tuning with PPO)</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Reward Model</p>
                                    <p className="font-medium">LLM-as-judge (GPT-5)</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Training Steps</p>
                                    <p className="font-medium text-lg">130</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Batch Size</p>
                                    <p className="font-medium text-lg">4</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Learning Rate</p>
                                    <p className="font-medium">3.8e-06 → 2.78e-06</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">KL Divergence</p>
                                    <p className="font-medium">0.15 - 0.46</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Reward Progression</p>
                                    <p className="font-medium">0.419 → 0.523</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Completion Length</p>
                                    <p className="font-medium">182-878 tokens</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Total Tokens</p>
                                    <p className="font-medium">~2.88M</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Gradient Clipping</p>
                                    <p className="font-medium">Applied</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border">
                                <a href="https://huggingface.co/deepakkarkala/gemma3-1b-rft-sitcom-office-reasoning" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                    View RFT Model on HuggingFace →
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Learnings */}
                <section id="key-learnings" className="mb-20 bg-muted/30 rounded-xl p-8 md:p-10">
                    <h2 className="text-3xl font-bold mb-6">Key Learnings</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        This project touches most parts of the modern LLM lifecycle:
                    </p>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="font-semibold mb-2">Problem Framing</h3>
                                <p className="text-muted-foreground">Turn a fuzzy idea (<em>&quot;Office-style scenes&quot;</em>) into a concrete objective with measurable rewards.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="font-semibold mb-2">Custom Data Design</h3>
                                <p className="text-muted-foreground">Design a <strong>reasoning + screenplay</strong> schema. Build prompts and reference scripts to teach the model structure and style.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 className="font-semibold mb-2">Supervised & Reinforcement Fine-Tuning</h3>
                                <p className="text-muted-foreground">Run SFT to anchor the model in domain behavior. Layer RFT on top to align with a style-aware judge.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                            <div>
                                <h3 className="font-semibold mb-2">Evaluation & Visualization</h3>
                                <p className="text-muted-foreground">Implement <strong>LLM-as-judge scoring</strong>. Visualize distributions (boxplots, histograms) and <strong>training reward curves</strong>. Curate <strong>hero examples</strong> that connect metrics to human-perceived quality.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">5</div>
                            <div>
                                <h3 className="font-semibold mb-2">Storytelling & Product Thinking</h3>
                                <p className="text-muted-foreground">Package the work as a <strong>case study</strong> that looks like a product launch: clear problem definition, before/after comparisons, visuals that non-experts can understand.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Vision */}
                <section id="product-vision" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">From Demo to Product: Agentic ScriptWriter Assistant</h2>

                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 mb-8 border border-primary/20">
                        <p className="text-lg leading-relaxed mb-4">
                            This trained model demonstrates the foundation for a real-world <strong>AI-powered screenwriting co-pilot</strong>—a tool for aspiring writers, professional screenwriters, and showrunners to accelerate their creative process while maintaining artistic control.
                        </p>
                        <p className="text-muted-foreground">
                            Instead of replacing writers, the system acts as an intelligent collaborator that helps execute ideas, ensures consistency, and handles the mechanical aspects of screenplay formatting while the human focuses on story and vision.
                        </p>
                    </div>

                    <h3 className="text-2xl font-semibold mb-6">Core Product Architecture</h3>

                    <div className="space-y-6 mb-12">
                        {/* Agent 1 */}
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-blue-500">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-2">Story Architect Agent</h4>
                                    <p className="text-sm text-muted-foreground italic mb-3">Brainstorming & Structure Planning</p>
                                </div>
                            </div>
                            <div className="pl-14">
                                <p className="mb-4 text-muted-foreground">
                                    The entry point for writers. This agent helps develop high-level story concepts into structured narratives.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">User Input</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Rough situation ideas</li>
                                            <li>• Character preferences</li>
                                            <li>• Comedic tone requirements</li>
                                        </ul>
                                    </div>
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Agent Output</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Beat-by-beat scene structure</li>
                                            <li>• Character dynamics map</li>
                                            <li>• Multiple story variations</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agent 2 */}
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-purple-500">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-2">Screenplay Generator Agent</h4>
                                    <p className="text-sm text-muted-foreground italic mb-3">Dialogue & Scene Execution</p>
                                </div>
                            </div>
                            <div className="pl-14">
                                <p className="mb-4 text-muted-foreground">
                                    <strong>This is where our trained RFT model powers the system.</strong> Takes the structured reasoning trace and generates production-ready screenplay with authentic character voices.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Leverages Training</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Character consistency (25% weight)</li>
                                            <li>• Show-specific humor (25% weight)</li>
                                            <li>• Mockumentary format adherence</li>
                                        </ul>
                                    </div>
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">User Controls</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Regenerate specific sections</li>
                                            <li>• Adjust character focus</li>
                                            <li>• Tune comedic intensity</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agent 3 */}
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-green-500">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-2">Continuity & Quality Guardian Agent</h4>
                                    <p className="text-sm text-muted-foreground italic mb-3">Script Review & Consistency Checking</p>
                                </div>
                            </div>
                            <div className="pl-14">
                                <p className="mb-4 text-muted-foreground">
                                    Monitors the entire script across multiple scenes, ensuring character arcs, running gags, and show mythology remain consistent.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Automated Checks</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Character voice drift detection</li>
                                            <li>• Timeline consistency validation</li>
                                            <li>• Callback/setup-payoff tracking</li>
                                        </ul>
                                    </div>
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Feedback Loop</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Flags inconsistencies for review</li>
                                            <li>• Suggests revisions</li>
                                            <li>• Learns from user edits (RLHF)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agent 4 */}
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-orange-500">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">4</div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-2">Dialogue Polish & Alternative Generator</h4>
                                    <p className="text-sm text-muted-foreground italic mb-3">Iterative Refinement</p>
                                </div>
                            </div>
                            <div className="pl-14">
                                <p className="mb-4 text-muted-foreground">
                                    Provides alternative phrasings, comedic variations, and line-by-line improvements while preserving the writer&apos;s intent.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Features</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• A/B/C line variations</li>
                                            <li>• Punch-up suggestions</li>
                                            <li>• Timing/pacing adjustments</li>
                                        </ul>
                                    </div>
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Writer Control</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Accept/reject changes</li>
                                            <li>• Lock favorite lines</li>
                                            <li>• Set tone constraints</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-6">Why This Becomes a Real Product</h3>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-muted/20 rounded-xl p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">⚡</span>
                                Speed Without Sacrificing Quality
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Writers spend 70% of their time on mechanical work: formatting, ensuring consistency, rewriting dialogue variations. This system handles the grunt work, letting writers focus on creative decisions and story vision. What takes weeks in a traditional writers&apos; room can be iteratively refined in days.
                            </p>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">🎯</span>
                                Specialized Domain Models
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Unlike generic LLMs, our fine-tuned models are <strong>experts in specific show formats</strong>. Train separate models for sitcoms, dramas, thriller formats—each deeply understanding the genre&apos;s unique storytelling patterns, pacing requirements, and audience expectations.
                            </p>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">🔄</span>
                                Continuous Improvement via RLHF
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Every writer edit becomes training data. When users accept/reject suggestions, the system learns their preferences. Over time, the agent adapts to individual writing styles while maintaining show-level consistency—creating a personalized co-pilot.
                            </p>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">💰</span>
                                Clear Business Model
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                <strong>Subscription tiers:</strong> Aspiring writers get basic agents. Professional showrunners pay for multi-episode management, team collaboration, and custom model fine-tuning on their show&apos;s existing episodes. Studios license enterprise versions with proprietary IP training.
                            </p>
                        </div>
                    </div>

                    <div className="bg-primary/10 border-l-4 border-primary rounded-r-xl p-6">
                        <p className="font-semibold mb-3">From Technical Demo to Market Reality</p>
                        <p className="text-sm text-muted-foreground mb-3">
                            This case study proves the foundational tech works: we can fine-tune models to understand nuanced creative domains, evaluate quality with specialized judges, and generate content that improves measurably across training.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            The product layer—agentic workflows, human-in-the-loop refinement, team collaboration tools—turns this technical capability into a tool that practicing writers would actually pay to use. It&apos;s not about automating creativity; it&apos;s about <strong>amplifying human storytellers</strong> with AI that understands their craft.
                        </p>
                    </div>
                </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
