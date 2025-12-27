import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  Code2,
  GraduationCap,
  Layers,
  LineChart,
  Lightbulb,
  Target,
  Users,
  Zap,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About - RLHF Illustrated Guide',
  description:
    'Learn about the RLHF Illustrated Guide project, its features, and the technology behind it.',
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps): JSX.Element {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

interface TechBadgeProps {
  name: string;
}

function TechBadge({ name }: TechBadgeProps): JSX.Element {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
      {name}
    </span>
  );
}

export default function AboutPage(): JSX.Element {
  return (
    <div className="mx-auto max-w-4xl space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="heading-1 mb-6">About This Project</h1>
        <p className="body-large mx-auto max-w-2xl text-muted-foreground">
          Making complex AI alignment concepts accessible through intuitive visualizations,
          interactive playgrounds, and educational storytelling.
        </p>
      </section>

      {/* Project Overview */}
      <section>
        <h2 className="heading-2 mb-6">Project Overview</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">RLHF Illustrated Guide</strong> is a comprehensive,
            interactive web platform that transforms the complex mathematics and concepts behind
            Reinforcement Learning from Human Feedback (RLHF) into an engaging, visual learning
            experience.
          </p>
          <p>
            RLHF has become the cornerstone of modern AI alignment—it&apos;s how ChatGPT, Claude,
            and other large language models learn to be helpful, harmless, and honest. Yet, most
            resources on RLHF are either too academic (dense mathematical papers) or too shallow
            (oversimplified blog posts).
          </p>
          <p>
            This guide fills that gap by providing{' '}
            <strong className="text-foreground">rigorous yet accessible</strong> education with{' '}
            <strong className="text-foreground">hands-on interactive elements</strong> that build
            true understanding.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="rounded-xl border border-border bg-card p-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <StatCard value="12" label="Learning Modules" />
          <StatCard value="30+" label="Visualizations" />
          <StatCard value="60+" label="Quiz Questions" />
          <StatCard value="4" label="Analogy Types" />
        </div>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="heading-2 mb-6">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon={<LineChart className="h-6 w-6" />}
            title="Interactive Visualizations"
            description="30+ D3.js-powered charts and simulations. Adjust parameters in real-time and see how algorithms behave. Export as PNG/SVG for presentations."
          />
          <FeatureCard
            icon={<BookOpen className="h-6 w-6" />}
            title="12 Complete Modules"
            description="From RLHF basics to Constitutional AI. Each module follows a proven template: equation, intuition, analogy, visualization, and assessment."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Concept Playground"
            description="Experiment with PPO, DPO, and rejection sampling algorithms. Compare methods side-by-side with consistent parameters."
          />
          <FeatureCard
            icon={<Lightbulb className="h-6 w-6" />}
            title="Intuitive Analogies"
            description="Complex concepts made concrete through carefully crafted analogies: Game Bot for RL, Writing Student for preferences, Math Tutor for reasoning."
          />
          <FeatureCard
            icon={<GraduationCap className="h-6 w-6" />}
            title="Assessment & Feedback"
            description="Each module includes 5-7 quiz questions with instant feedback and detailed explanations to reinforce key concepts."
          />
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title="Production Ready"
            description="Built with accessibility (WCAG 2.1 AA), responsive design, dark mode, and performance optimization in mind."
          />
        </div>
      </section>

      {/* Analogy System */}
      <section>
        <h2 className="heading-2 mb-6">The Analogy Toolbox</h2>
        <p className="mb-6 text-muted-foreground">
          Complex concepts become intuitive through carefully crafted analogies that carry through
          the entire curriculum:
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950/30">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Atari Game Bot</h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              For core RL concepts: policy as game strategy, rewards as score points, value
              functions as game state evaluation.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:bg-green-950/30">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">✍️</span>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Creative Writing Student
              </h3>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">
              For preference learning: reward model as editor&apos;s taste, preference data as
              manuscript feedback, policy optimization as iterative revision.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4 dark:bg-orange-950/30">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">🧮</span>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">Math Tutor Bot</h3>
            </div>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              For reasoning and verification: verifiable rewards as correct answers,
              chain-of-thought as showing work, tool use as using a calculator.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4 dark:bg-purple-950/30">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                Advanced Concepts
              </h3>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              For constitutional AI and evaluation: AI constitutions as ethical guidelines,
              self-critique as peer review, over-optimization as teaching to the test.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section>
        <h2 className="heading-2 mb-6">Curriculum Overview</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold text-primary">Phase 1: Core RLHF Loop</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Introduction to RLHF</span>
                <span className="block text-sm text-muted-foreground">
                  Why RLHF matters, the four-stage pipeline
                </span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Reward Modeling</span>
                <span className="block text-sm text-muted-foreground">
                  Bradley-Terry, pairwise preferences
                </span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Policy Gradients (PPO)</span>
                <span className="block text-sm text-muted-foreground">
                  Trust regions, clipping, advantage estimation
                </span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Direct Preference Optimization</span>
                <span className="block text-sm text-muted-foreground">
                  Offline alignment without reward models
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-primary">Phase 2: Foundation & Practice</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Problem Setup & Context</span>
                <span className="block text-sm text-muted-foreground">
                  Mathematical definitions, preference data
                </span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Instruction Tuning</span>
                <span className="block text-sm text-muted-foreground">
                  Chat templates, dataset curation
                </span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Regularization</span>
                <span className="block text-sm text-muted-foreground">
                  KL penalties, entropy bonuses
                </span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Rejection Sampling</span>
                <span className="block text-sm text-muted-foreground">
                  Best-of-N, baseline methods
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-primary">Phase 3: Advanced Topics</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Constitutional AI</span>
                <span className="block text-sm text-muted-foreground">
                  AI feedback, principles, self-improvement
                </span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Reasoning Training</span>
                <span className="block text-sm text-muted-foreground">
                  RLVR, chain-of-thought, inference scaling
                </span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Tool Use & Function Calling</span>
                <span className="block text-sm text-muted-foreground">
                  MCP architecture, multi-step reasoning
                </span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-medium">Advanced Topics</span>
                <span className="block text-sm text-muted-foreground">
                  Synthetic data, evaluation, over-optimization
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="heading-2 mb-6">Technology Stack</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Code2 className="h-5 w-5 text-primary" />
              Frontend & Framework
            </h3>
            <div className="flex flex-wrap gap-2">
              <TechBadge name="Next.js 14" />
              <TechBadge name="React 18" />
              <TechBadge name="TypeScript" />
              <TechBadge name="Tailwind CSS" />
              <TechBadge name="Framer Motion" />
            </div>
          </div>
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <LineChart className="h-5 w-5 text-primary" />
              Visualization & Content
            </h3>
            <div className="flex flex-wrap gap-2">
              <TechBadge name="D3.js" />
              <TechBadge name="KaTeX" />
              <TechBadge name="MDX" />
              <TechBadge name="Lucide Icons" />
            </div>
          </div>
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Layers className="h-5 w-5 text-primary" />
              Infrastructure & Deployment
            </h3>
            <div className="flex flex-wrap gap-2">
              <TechBadge name="Vercel" />
              <TechBadge name="GitHub Actions" />
              <TechBadge name="ESLint" />
              <TechBadge name="Prettier" />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Highlights */}
      <section>
        <h2 className="heading-2 mb-6">Technical Highlights</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-2 font-semibold">Server-Side Rendering</h3>
            <p className="text-sm text-muted-foreground">
              MDX content rendered server-side for SEO. D3 visualizations hydrated on client for
              interactivity. Dynamic imports for optimal code splitting.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-2 font-semibold">Performance Optimized</h3>
            <p className="text-sm text-muted-foreground">
              Code splitting for D3, Framer Motion, and vendor bundles. Image optimization with
              AVIF/WebP. Target: LCP &lt;2.5s, FID &lt;100ms, CLS &lt;0.1.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-2 font-semibold">Accessibility First</h3>
            <p className="text-sm text-muted-foreground">
              WCAG 2.1 AA compliant. ARIA labels for visualizations. Full keyboard navigation. High
              contrast color ratios. Screen reader compatible.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-2 font-semibold">Type-Safe Architecture</h3>
            <p className="text-sm text-muted-foreground">
              TypeScript strict mode throughout. Explicit return types. No any types. Comprehensive
              interfaces for all components and data structures.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section>
        <h2 className="heading-2 mb-6">Who This Is For</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-lg border border-border p-4">
            <Users className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold">ML Practitioners</h3>
              <p className="text-sm text-muted-foreground">
                Quickly understand RLHF to implement in production systems
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-lg border border-border p-4">
            <GraduationCap className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold">Students</h3>
              <p className="text-sm text-muted-foreground">
                Visual learning complements academic ML/AI courses
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-lg border border-border p-4">
            <BookOpen className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold">Researchers</h3>
              <p className="text-sm text-muted-foreground">
                Intuitive grounding before diving into academic papers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-lg border border-border p-4">
            <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold">Educators</h3>
              <p className="text-sm text-muted-foreground">
                Ready-made visualizations and materials for teaching
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credits */}
      <section>
        <h2 className="heading-2 mb-6">Credits & Acknowledgments</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            This project is inspired by and based on concepts from{' '}
            <strong className="text-foreground">Nathan Lambert&apos;s RLHF book</strong>, which
            provides an excellent comprehensive treatment of RLHF from first principles.
          </p>
          <p>
            The interactive approach draws inspiration from projects like{' '}
            <strong className="text-foreground">Distill.pub</strong> and{' '}
            <strong className="text-foreground">3Blue1Brown</strong>, which have shown how powerful
            visual explanations can be for complex mathematical concepts.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
        <h2 className="heading-2 mb-4">Ready to Learn RLHF?</h2>
        <p className="mb-6 text-muted-foreground">
          Start with the introduction module or jump into the interactive playground.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/modules/introduction"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Learning
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 transition-colors hover:bg-accent"
          >
            Try Playground
            <Zap className="h-4 w-4" />
          </Link>
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 transition-colors hover:bg-accent"
          >
            Browse Modules
            <BookOpen className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Contact / Links */}
      <section className="border-t border-border pt-8">
        <h2 className="heading-3 mb-6 text-center">Connect & Contribute</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/deepak-karkala/illustrated-rlhf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
          <a
            href="https://linkedin.com/in/deepakkarkala"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href="mailto:contact@deepakkarkala.com"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Mail className="h-4 w-4" />
            Contact
          </a>
        </div>
      </section>
    </div>
  );
}
