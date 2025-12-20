import Link from 'next/link';
import ComparisonView from '@/components/ComparisonView';
import ProductSidebar from '@/components/ProductSidebar';
import { getProductBySlug } from '@/lib/content';

export async function generateMetadata() {
    return {
        title: 'Building a Kannada Physics Tutor LLM | Products',
        description: 'Multi-stage fine-tuning pipeline creating a Feynman-style physics tutor in Kannada, combining SFT and RAG for intuitive, grounded explanations',
    };
}

export default async function KannadaPhysicsTutorPage() {
    const product = await getProductBySlug('ai-feynman-kannada-tutor/kannada-physics-tutor');

    // Images
    const images = {
        trainingPipeline: "/products/ai-feynman-kannada-tutor/training_pipeline.png",
        scoreHistogram: "/products/ai-feynman-kannada-tutor/score_hist.png",
        boxplot: "/products/ai-feynman-kannada-tutor/score_boxplot.png"
    };

    // Load actual model outputs from hero_examples.json
    const heroExamplesData = await import('@/public/products/ai-feynman-kannada-tutor/hero_examples.json');

    interface HeroExample {
        id: number;
        question: string;
        question_english: string;
        judge_scores: {
            base: number;
            kannada_sft: number;
            physics_sft: number;
            physics_rag: number;
        };
        models: {
            base: { explanation: string };
            kannada_sft: { explanation: string };
            physics_sft: { explanation: string };
            physics_rag: { explanation: string };
        };
        analysis: {
            title: string;
            focus: string[];
        };
    }

    // Model configuration for 4 models
    const modelConfig = [
        { key: 'base', label: 'Base Model', colorClass: 'border-l-red-500' },
        { key: 'kannada_sft', label: 'Kannada SFT', colorClass: 'border-l-orange-500' },
        { key: 'physics_sft', label: 'Physics SFT', colorClass: 'border-l-yellow-500' },
        { key: 'physics_rag', label: 'Physics + RAG', colorClass: 'border-l-green-500' }
    ];

    const comparisonExamples = (heroExamplesData.hero_examples as HeroExample[]).map((example) => ({
        title: example.analysis.title,
        scenario: `**Question (Kannada):**\n${example.question}\n\n**Question (English):**\n${example.question_english}`,
        scores: {
            base: example.judge_scores.base,
            kannada_sft: example.judge_scores.kannada_sft,
            physics_sft: example.judge_scores.physics_sft,
            physics_rag: example.judge_scores.physics_rag
        },
        outputs: {
            base: example.models.base.explanation,
            kannada_sft: example.models.kannada_sft.explanation,
            physics_sft: example.models.physics_sft.explanation,
            physics_rag: example.models.physics_rag.explanation
        },
        analysis: {
            base: example.analysis.focus[0],
            kannada_sft: example.analysis.focus[1],
            physics_sft: example.analysis.focus[2],
            physics_rag: example.analysis.focus[3]
        }
    }));

    const sections = [
        { id: 'why-this-project', title: 'Why This Project?' },
        { id: 'system-overview', title: 'System Overview' },
        { id: 'evaluation-methodology', title: 'Evaluation Methodology' },
        { id: 'quantitative-results', title: 'Quantitative Results' },
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
                    {product?.image && (
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
                        Building a Kannada Physics Tutor LLM with Feynman-Style Explanations
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8">
                        Multi-stage fine-tuning pipeline to create a reasoning-first physics tutor in Kannada, combining domain-specific SFT and RAG for intuitive, grounded explanations.
                    </p>
                </header>

                {/* Why This Project */}
                <section id="why-this-project" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">Why This Project?</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                        Most LLMs struggle with conceptual physics explanations in regional languages. I wanted to demonstrate:
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-muted/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-3">Low-Resource Language</h3>
                            <p className="text-sm">Teaching a model to think in Kannada, not just translate from English.</p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-3">Feynman-Style Teaching</h3>
                            <p className="text-sm">Intuitive, step-by-step reasoning with analogies—focusing on <em>why</em>, not just formulas.</p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-3">Multi-Stage Pipeline</h3>
                            <p className="text-sm">Language fluency → Domain reasoning → Factual grounding with RAG.</p>
                        </div>
                    </div>
                    <div className="bg-primary/10 border-l-4 border-primary rounded-r-xl p-6">
                        <p className="font-semibold mb-2">This case study demonstrates:</p>
                        <ul className="space-y-2 list-disc pl-6">
                            <li>End-to-end fine-tuning for <strong>low-resource languages + specialized domains</strong></li>
                            <li>How <strong>multi-stage SFT</strong> compounds improvements (language → domain → grounding)</li>
                            <li>Complete <strong>evaluation pipeline</strong>: LLM-as-judge, quantitative metrics, qualitative analysis</li>
                        </ul>
                    </div>
                </section>

                {/* System Overview */}
                <section id="system-overview" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">System Overview</h2>
                    <div className="bg-muted/20 rounded-xl p-6 md:p-8 mb-8">
                        <p className="text-lg mb-4">
                            <strong>Goal:</strong> Given a physics question in Kannada (e.g., <em>&quot;How do we derive Laplace&apos;s equation for a membrane?&quot;</em>), generate:
                        </p>
                        <ol className="space-y-3 list-decimal pl-6">
                            <li>A <strong>step-by-step reasoning trace</strong> that builds intuition.</li>
                            <li>A <strong>Feynman-style explanation</strong> in natural, fluent Kannada.</li>
                            <li><strong>Grounded answers</strong> using retrieved physics context (RAG).</li>
                        </ol>
                    </div>

                    <h3 className="text-2xl font-semibold mb-4">Four-Model Progression</h3>
                    <p className="text-muted-foreground mb-6">
                        The training pipeline uses a <strong>staged approach</strong> where each model builds on the previous one:
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-red-500">
                            <h4 className="font-semibold mb-2">1. Base Model</h4>
                            <p className="text-sm text-muted-foreground">Gemma 3 1B — General-purpose LLM baseline (no specialization)</p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-orange-500">
                            <h4 className="font-semibold mb-2">2. Kannada SFT</h4>
                            <p className="text-sm text-muted-foreground">Language Foundation — Fine-tuned on general Kannada text for fluency</p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-yellow-500">
                            <h4 className="font-semibold mb-2">3. Physics SFT</h4>
                            <p className="text-sm text-muted-foreground">Domain Reasoning — Physics concepts + Feynman-style explanations in Kannada</p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-green-500">
                            <h4 className="font-semibold mb-2">4. Physics + RAG</h4>
                            <p className="text-sm text-muted-foreground">Factual Grounding — Retrieval-augmented generation with physics knowledge base</p>
                        </div>
                    </div>

                    <div className="mt-8 bg-muted/10 rounded-xl p-6">
                        <h4 className="font-semibold mb-4">Why Multi-Stage Fine-Tuning?</h4>
                        <div className="space-y-3 text-sm">
                            <p><strong>Stage 1 (Kannada SFT):</strong> Teaches linguistic fluency and natural expression in Kannada, independent of domain.</p>
                            <p><strong>Stage 2 (Physics SFT):</strong> Builds on fluency to add conceptual reasoning, derivations, and Feynman-style intuition.</p>
                            <p><strong>Stage 3 (RAG):</strong> Adds factual precision by retrieving relevant physics context before answering, preventing hallucinations.</p>
                        </div>
                    </div>
                </section>

                {/* Evaluation Methodology */}
                <section id="evaluation-methodology" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">LLM-as-Judge Evaluation</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Each model&apos;s output is evaluated using an <strong>LLM-as-judge</strong> with a structured grading prompt. The judge scores answers on a <strong>0–5 scale</strong> based on:
                    </p>
                    <div className="bg-muted/30 rounded-xl p-6 md:p-8 mb-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Physics Correctness</h4>
                                    <p className="text-sm text-muted-foreground">Conceptual accuracy and mathematical precision</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Reasoning Quality</h4>
                                    <p className="text-sm text-muted-foreground">Step-by-step clarity and logical flow</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Kannada Fluency</h4>
                                    <p className="text-sm text-muted-foreground">Natural language quality and proper grammar</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Contextual Relevance</h4>
                                    <p className="text-sm text-muted-foreground">Answers the specific question with appropriate detail</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        All scores were collected in a CSV file and visualized using score distributions and boxplots to show the progressive improvement across the 4-model pipeline.
                    </p>
                </section>

                {/* Quantitative Results */}
                <section id="quantitative-results" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">Quantitative Evaluation</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        I evaluated all four models on a held-out set of physics questions, scoring each output with an <strong>LLM-as-judge</strong> (0–5 scale).
                    </p>

                    {/* Score Distribution */}
                    <div className="bg-muted/20 rounded-xl p-6 md:p-8 mb-8">
                        <h3 className="text-xl font-semibold mb-6">Score Distribution by Model</h3>
                        <div className="space-y-6">
                            <div className="w-full bg-muted/30 rounded-lg overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={images.scoreHistogram}
                                    alt="Score Distribution Histogram"
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="space-y-4">
                                <ul className="space-y-3 list-disc pl-6">
                                    <li>The <strong>Base Model</strong> shows very low scores (mostly 0–1), indicating poor physics understanding and Kannada fluency.</li>
                                    <li><strong>Kannada SFT</strong> improves language quality slightly but still lacks physics reasoning—scores remain low.</li>
                                    <li><strong>Physics SFT</strong> shows a dramatic shift—the distribution moves to mid-range (2–3), reflecting strong conceptual reasoning.</li>
                                    <li><strong>Physics + RAG</strong> achieves the highest scores (3–4), with factual grounding preventing errors and hallucinations.</li>
                                </ul>
                                <p className="text-sm text-muted-foreground border-l-4 border-primary pl-4">
                                    The progressive right-shift in score distributions demonstrates that <strong>each stage adds measurable value</strong>: fluency → reasoning → grounding.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Boxplot Comparison */}
                    <div className="bg-muted/20 rounded-xl p-6 md:p-8 mb-8">
                        <h3 className="text-xl font-semibold mb-6">Boxplot Comparison</h3>
                        <div className="space-y-6">
                            <div className="w-full bg-muted/30 rounded-lg overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={images.boxplot}
                                    alt="Score Comparison Boxplot"
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="space-y-4">
                                <ul className="space-y-3 list-disc pl-6">
                                    <li><strong>Median score</strong> increases dramatically from Base (near 0) → Kannada SFT (0.5) → Physics SFT (2.3) → RAG (3.7).</li>
                                    <li>The <strong>interquartile range</strong> narrows for Physics SFT and RAG models, showing more consistent performance.</li>
                                    <li>Low-score outliers become rare in the final RAG model, indicating reliable quality across diverse questions.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/10 border-l-4 border-primary rounded-r-xl p-6">
                        <p className="font-semibold">
                            <strong>Key Takeaway:</strong> Multi-stage fine-tuning doesn&apos;t just improve average performance—it systematically reduces failure modes and increases reliability.
                        </p>
                    </div>
                </section>

                {/* Hero Examples */}
                <section id="hero-examples" className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">Hero Examples</h2>
                    <p className="text-muted-foreground mb-8">
                        Compare the output of all four models. Notice the progressive improvement: Base → Kannada SFT (fluency) → Physics SFT (reasoning) → Physics + RAG (grounding). Each model column includes analysis showing what each stage contributes.
                    </p>

                    <ComparisonView
                        examples={comparisonExamples}
                        modelConfig={modelConfig}
                        helpText="Click on a column to highlight it. The progression shows: language fluency → domain reasoning → factual grounding."
                    />
                </section>

                {/* Training Specifications */}
                <section id="training-specifications" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">Detailed Training Specifications</h2>

                    {/* Training Pipeline */}
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
                            The complete training pipeline flows from a base open-source model through two stages of SFT (Kannada language → Physics reasoning) and finally RAG integration for factual grounding. Each stage builds on the previous one to compound improvements.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Data Preparation */}
                        <div className="bg-muted/20 rounded-xl p-6 md:p-8">
                            <h3 className="text-2xl font-semibold mb-6">Data Preparation</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Base Model</p>
                                    <p className="font-medium">
                                        <a href="https://huggingface.co/google/gemma-3-1b-it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            Gemma 3 1B (google/gemma-3-1b-it)
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Kannada SFT Data</p>
                                    <p className="font-medium">General Kannada text corpus (news, essays, conversations)</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Physics SFT Data</p>
                                    <p className="font-medium">Custom physics Q&A with Feynman-style reasoning traces in Kannada</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">RAG Knowledge Base</p>
                                    <p className="font-medium">Physics textbook chapters in Kannada (vector store)</p>
                                </div>
                            </div>
                        </div>

                        {/* Reasoning Trace Structure */}
                        <div className="bg-muted/20 rounded-xl p-6 md:p-8">
                            <h3 className="text-2xl font-semibold mb-6">Feynman-Style Reasoning Trace Structure</h3>
                            <p className="text-muted-foreground mb-6">
                                The Physics SFT dataset includes structured reasoning traces that teach the model to think like Feynman—building intuition before formulas. Each training example follows this 8-step approach:
                            </p>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">1</div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Identify Core Idea</h5>
                                        <p className="text-sm text-muted-foreground">State the simplest underlying principle of the concept.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">2</div>
                                    <div>
                                        <h5 className="font-semibold mb-1">First Principles Reasoning</h5>
                                        <p className="text-sm text-muted-foreground">Break down the idea into its most basic elements, avoiding jargon at first.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">3</div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Analogies & Everyday Examples</h5>
                                        <p className="text-sm text-muted-foreground">Relate the concept to familiar, tangible experiences (blocks, water, children&apos;s games, etc.).</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">4</div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Curiosity Hooks</h5>
                                        <p className="text-sm text-muted-foreground">Ask playful or intriguing questions that spark further interest (&quot;Why should nature behave this way?&quot;)</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">5</div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Progressive Depth</h5>
                                        <p className="text-sm text-muted-foreground">Gradually increase rigor—from intuition → simple mathematics → abstract reasoning—always showing why each step matters.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">6</div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Cross-Connections</h5>
                                        <p className="text-sm text-muted-foreground">Show how this idea connects to other areas of physics or science.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">7</div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Humility & Limits</h5>
                                        <p className="text-sm text-muted-foreground">Acknowledge approximations, open questions, or where the laws might break down.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">8</div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Engagement & Clarity</h5>
                                        <p className="text-sm text-muted-foreground">Keep the tone conversational, clear, and inspiring—as if talking to bright but curious students.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 bg-primary/10 border-l-4 border-primary rounded-r-lg p-4">
                                <p className="text-sm">
                                    <strong>Impact:</strong> This structured approach trains the model to not just recite formulas, but to build genuine conceptual understanding—teaching <em>why</em> physics works, not just <em>what</em> the equations are.
                                </p>
                            </div>
                        </div>

                        {/* Training Details */}
                        <div className="bg-muted/20 rounded-xl p-6 md:p-8">
                            <h3 className="text-2xl font-semibold mb-6">Training Configuration</h3>

                            {/* Hardware Section */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3">Hardware</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><strong>GPU:</strong> 1x A40 (48 GB VRAM)</li>
                                    <li><strong>Framework:</strong> PyTorch with HuggingFace Transformers</li>
                                </ul>
                            </div>

                            {/* Stage 1: Kannada SFT */}
                            <div className="mb-6 bg-muted/30 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-orange-600">Stage 1: General Kannada SFT</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p><strong>Training Steps:</strong> 80</p>
                                        <p><strong>Epochs:</strong> 1</p>
                                        <p><strong>Batch Size:</strong> 8</p>
                                        <p><strong>Max Learning Rate:</strong> 5e-5</p>
                                    </div>
                                    <div>
                                        <p><strong>Initial Training Loss:</strong> 4.709</p>
                                        <p><strong>Final Training Loss:</strong> 2.898</p>
                                        <p><strong>Final Eval Loss:</strong> 2.912</p>
                                        <p><strong>Eval Interval:</strong> Every 5 steps</p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3 italic">
                                    Trained on diverse Kannada text to establish language fluency and natural expression patterns.
                                </p>
                            </div>

                            {/* Stage 2: Physics SFT */}
                            <div className="bg-muted/30 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-yellow-600">Stage 2: Physics Kannada SFT</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p><strong>Training Steps:</strong> 90</p>
                                        <p><strong>Epochs:</strong> 1</p>
                                        <p><strong>Batch Size:</strong> 8</p>
                                        <p><strong>Max Learning Rate:</strong> 5e-5</p>
                                    </div>
                                    <div>
                                        <p><strong>Initial Training Loss:</strong> 3.248</p>
                                        <p><strong>Final Training Loss:</strong> 2.448</p>
                                        <p><strong>Final Eval Loss:</strong> 2.474</p>
                                        <p><strong>Eval Interval:</strong> Every 10 steps</p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3 italic">
                                    Fine-tuned on custom physics Q&A with Feynman-style reasoning traces, teaching conceptual understanding and step-by-step derivations.
                                </p>
                            </div>

                            {/* Key Training Insights */}
                            <div className="mt-6 bg-primary/10 border-l-4 border-primary rounded-r-lg p-4">
                                <p className="text-sm font-semibold mb-2">Training Progression:</p>
                                <ul className="text-sm space-y-1 list-disc pl-5">
                                    <li>Stage 1 reduced eval loss from 4.71 → 2.91 (38% reduction)</li>
                                    <li>Stage 2 further reduced eval loss from 3.25 → 2.47 (24% reduction)</li>
                                    <li>Healthy train/eval gap indicates good generalization without overfitting</li>
                                    <li>Cosine learning rate schedule with warmup for stable optimization</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Learnings */}
                <section id="key-learnings" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">Key Learnings</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Low-Resource Language Fine-Tuning</h4>
                                <p className="text-sm text-muted-foreground">
                                    Separating language fluency (Kannada SFT) from domain knowledge (Physics SFT) allows the model to learn each skill independently before combining them. This staged approach is more effective than trying to learn both simultaneously.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Multi-Stage SFT Compounds Benefits</h4>
                                <p className="text-sm text-muted-foreground">
                                    Each stage adds measurable value: language quality → reasoning patterns → factual accuracy. The boxplots clearly show that each stage shifts the performance distribution upward.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">RAG as a Grounding Layer</h4>
                                <p className="text-sm text-muted-foreground">
                                    Fine-tuned models can reason well but may still hallucinate details. Adding RAG (retrieving relevant physics context before generation) dramatically improves factual accuracy without additional training.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                4
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">LLM-as-Judge for Evaluation</h4>
                                <p className="text-sm text-muted-foreground">
                                    Building a complete evaluation pipeline with LLM-as-judge, quantitative metrics (distributions, boxplots), and qualitative analysis provides a full picture of model capability—essential for demonstrating product viability.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* From Demo to Product */}
                <section id="product-vision" className="mb-20">
                    <h2 className="text-3xl font-bold mb-6">From Demo to Product: AI-Powered Physics Education for Rural India</h2>

                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 mb-8 border border-primary/20">
                        <p className="text-lg leading-relaxed mb-4">
                            This trained model demonstrates the foundation for a <strong>scalable educational platform</strong>—a system designed for government schools and rural communities across India where students often lack access to quality STEM education in their native language.
                        </p>
                        <p className="text-muted-foreground">
                            Instead of replacing teachers, this platform acts as an <strong>always-available AI tutor</strong> that supplements classroom learning, provides personalized explanations, and helps students build deep conceptual understanding in their mother tongue—whether it&apos;s Kannada, Hindi, Tamil, Telugu, or any of India&apos;s 22 official languages.
                        </p>
                    </div>

                    <h3 className="text-2xl font-semibold mb-6">The Challenge in Rural India</h3>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-red-500">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">🏫</span>
                                Language Barrier
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                In rural Karnataka, 85% of students study in Kannada-medium schools, but most quality educational resources (textbooks, videos, tutoring) are only available in English. This creates a fundamental comprehension gap in STEM subjects like Physics.
                            </p>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-red-500">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">👨‍🏫</span>
                                Teacher Shortage
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Government schools face chronic shortages of qualified physics teachers. Many schools share one teacher across multiple subjects or grades, leaving little time for conceptual depth or individual student attention.
                            </p>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-red-500">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">📚</span>
                                Rote Learning Culture
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Traditional teaching emphasizes memorizing formulas and procedures without understanding. Students can solve textbook problems but struggle to explain <em>why</em> physics works—exactly what Feynman-style teaching addresses.
                            </p>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-red-500">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">💰</span>
                                Cost of Private Tutoring
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Private physics tutoring costs ₹3,000-5,000/month ($35-60)—unaffordable for families earning ₹15,000/month. This creates an educational divide where only urban, affluent students get quality conceptual teaching.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-6">Product Architecture: Multi-Agent AI Tutor System</h3>

                    <div className="space-y-6 mb-12">
                        {/* Agent 1 */}
                        <div className="bg-muted/20 rounded-xl p-6 border-l-4 border-blue-500">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-2">Concept Explainer Agent</h4>
                                    <p className="text-sm text-muted-foreground italic mb-3">Feynman-Style Intuitive Teaching</p>
                                </div>
                            </div>
                            <div className="pl-14">
                                <p className="mb-4 text-muted-foreground">
                                    <strong>This is where our Physics+RAG model powers the system.</strong> When students ask physics questions, this agent generates Feynman-style explanations with analogies, step-by-step reasoning, and visual intuition.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Student Input</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Voice or text questions in Kannada</li>
                                            <li>• &quot;I don&apos;t understand why...&quot; prompts</li>
                                            <li>• Follow-up clarifications</li>
                                        </ul>
                                    </div>
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Agent Output</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Conceptual explanations in Kannada</li>
                                            <li>• Real-world analogies (village examples)</li>
                                            <li>• Progressive depth (intuition → math)</li>
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
                                    <h4 className="text-xl font-semibold mb-2">Practice Problem Generator</h4>
                                    <p className="text-sm text-muted-foreground italic mb-3">Adaptive Problem Sets & Step-by-Step Solutions</p>
                                </div>
                            </div>
                            <div className="pl-14">
                                <p className="mb-4 text-muted-foreground">
                                    Generates contextually relevant practice problems based on the student&apos;s current chapter and difficulty level, with detailed worked solutions that teach the problem-solving approach.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Features</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Chapter-aligned problem generation</li>
                                            <li>• Difficulty progression (easy → hard)</li>
                                            <li>• Culturally relevant scenarios</li>
                                        </ul>
                                    </div>
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Student Benefits</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Unlimited practice questions</li>
                                            <li>• Instant feedback on approach</li>
                                            <li>• Learn from worked examples</li>
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
                                    <h4 className="text-xl font-semibold mb-2">Learning Path Advisor</h4>
                                    <p className="text-sm text-muted-foreground italic mb-3">Personalized Curriculum & Gap Analysis</p>
                                </div>
                            </div>
                            <div className="pl-14">
                                <p className="mb-4 text-muted-foreground">
                                    Tracks student progress across chapters, identifies conceptual gaps, and recommends targeted review topics before moving to advanced concepts.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Analytics Tracked</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Weak vs. strong concept areas</li>
                                            <li>• Time spent per topic</li>
                                            <li>• Question accuracy patterns</li>
                                        </ul>
                                    </div>
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Adaptive Actions</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Suggest prerequisite review</li>
                                            <li>• Adjust difficulty dynamically</li>
                                            <li>• Recommend practice focus areas</li>
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
                                    <h4 className="text-xl font-semibold mb-2">Exam Preparation Coach</h4>
                                    <p className="text-sm text-muted-foreground italic mb-3">Board Exam Focused Support</p>
                                </div>
                            </div>
                            <div className="pl-14">
                                <p className="mb-4 text-muted-foreground">
                                    Provides targeted support for Karnataka SSLC (10th) and PUC (12th) board exams, including previous year question analysis, common mistake patterns, and exam strategy guidance.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Exam Focus</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Previous year papers (2015-2024)</li>
                                            <li>• High-weightage topic identification</li>
                                            <li>• Marking scheme understanding</li>
                                        </ul>
                                    </div>
                                    <div className="bg-background/50 rounded-lg p-4">
                                        <p className="font-semibold text-sm mb-2">Strategic Prep</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Mock tests with scoring</li>
                                            <li>• Answer writing practice</li>
                                            <li>• Time management strategies</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-6">Why This Becomes a Viable Social Enterprise</h3>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-muted/20 rounded-xl p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">🌍</span>
                                Multi-Language Scalability
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                The same multi-stage fine-tuning approach (General Language SFT → Physics SFT → RAG) can be replicated for Hindi, Tamil, Telugu, Marathi, Bengali, and other regional languages. Train once per language, deploy nationwide. Start with Kannada (6 crore speakers), then expand to Hindi (55 crore speakers) for massive impact.
                            </p>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">📱</span>
                                Mobile-First, Offline-Capable
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Deploy lightweight models (1B-3B parameters) that run efficiently on mobile devices. Students can download chapter-specific models and knowledge bases for offline use—critical for rural areas with unreliable internet. Voice input removes typing barriers for students uncomfortable with keyboards.
                            </p>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">💡</span>
                                Proven Pedagogy + AI Scale
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Feynman&apos;s teaching method is proven effective but relies on rare, exceptional teachers. By encoding this pedagogy into fine-tuned models, we democratize access to world-class physics teaching. Every student, regardless of location or family income, gets a patient, always-available tutor who explains concepts intuitively.
                            </p>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span className="text-2xl">🎯</span>
                                Sustainable Revenue Model
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                <strong>Freemium approach:</strong> Basic concept explanations free for all students. Premium features (adaptive practice, exam prep, learning analytics) at ₹99/month ($1.20)—affordable even for low-income families. Government partnerships and NGO sponsorships subsidize access for students below poverty line. B2B licensing to private coaching centers.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-6">Path to Impact at Scale</h3>

                    <div className="space-y-4 mb-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                            <div>
                                <h5 className="font-semibold mb-1">Pilot in 50 Karnataka Government Schools (Year 1)</h5>
                                <p className="text-sm text-muted-foreground">
                                    Partner with Karnataka State Education Department. Deploy in 50 rural high schools (~25,000 students). Track learning outcomes: concept test scores, board exam performance, student engagement metrics. Gather teacher and student feedback for product iteration.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                            <div>
                                <h5 className="font-semibold mb-1">Expand to All Karnataka Schools (Year 2)</h5>
                                <p className="text-sm text-muted-foreground">
                                    Scale to all 10,000+ government high schools in Karnataka (~2.5 million students). Launch premium tier for parents who want advanced features. Begin training models for Hindi, Tamil, and Telugu based on the proven Kannada pipeline.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                            <div>
                                <h5 className="font-semibold mb-1">National Rollout Across India (Year 3-5)</h5>
                                <p className="text-sm text-muted-foreground">
                                    Launch in other states with regional language models. Partner with central government initiatives like Digital India and National Education Policy 2020 (which emphasizes mother-tongue education). Target: 50 million students across 10+ languages. Expand to Chemistry, Math, and Biology using the same SFT+RAG architecture.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">4</div>
                            <div>
                                <h5 className="font-semibold mb-1">Continuous Improvement via RLHF</h5>
                                <p className="text-sm text-muted-foreground">
                                    Collect student ratings on explanations (&quot;Was this helpful?&quot;). Track which analogies work best for different concepts. Use this feedback for reinforcement learning from human feedback (RLHF) to continuously improve explanation quality. Models learn to adapt teaching style based on what resonates with Indian students.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/10 border-l-4 border-primary rounded-r-xl p-6">
                        <p className="font-semibold mb-3">From Technical Demo to Social Impact Startup</p>
                        <p className="text-sm text-muted-foreground mb-3">
                            This case study proves the foundational technology works: we can fine-tune models to teach complex STEM concepts intuitively in low-resource languages, evaluate quality rigorously, and ground explanations with RAG to prevent hallucinations.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            The product layer—multi-agent tutoring, mobile-first delivery, exam preparation support, and teacher dashboards—transforms this technical capability into a scalable social enterprise. The goal isn&apos;t to replace teachers; it&apos;s to <strong>empower every student in rural India</strong> with a personalized physics tutor who speaks their language and teaches like Feynman—bridging the educational divide between urban privilege and rural potential.
                        </p>
                    </div>
                </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
