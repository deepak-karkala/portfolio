import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | DriftCity",
  description:
    "Overview of DriftCity — an interactive, narrative-driven platform teaching production ML statistics.",
};

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "var(--space-10) var(--space-6)",
    color: "var(--color-text)",
  },
  hero: {
    textAlign: "left" as const,
    marginBottom: "var(--space-10)",
  },
  eyebrow: {
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontSize: "var(--text-xs)",
    color: "var(--color-text-secondary)",
    margin: "0 0 var(--space-2) 0",
  },
  h1: {
    margin: "0 0 var(--space-3) 0",
    fontSize: "clamp(28px, 4vw, 38px)",
    fontFamily: "var(--font-display)",
  },
  h2: {
    margin: "0 0 var(--space-4) 0",
    fontSize: "clamp(22px, 3vw, 28px)",
    fontFamily: "var(--font-display)",
  },
  h3: {
    margin: "0 0 var(--space-3) 0",
    fontSize: "var(--text-lg)",
    fontWeight: "var(--weight-semibold)" as const,
  },
  lede: {
    fontSize: "var(--text-lg)",
    color: "var(--color-text-secondary)",
    margin: "0 0 var(--space-4) 0",
    maxWidth: "740px",
    lineHeight: "var(--leading-relaxed)",
  },
  ctaRow: {
    display: "flex",
    gap: "var(--space-3)",
    alignItems: "center",
    flexWrap: "wrap" as const,
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-2)",
    padding: "var(--space-3) var(--space-4)",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-bg)",
    textDecoration: "none",
    fontWeight: "var(--weight-semibold)",
    borderRadius: "var(--radius-md)",
  },
  ctaSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-2)",
    padding: "var(--space-3) var(--space-4)",
    backgroundColor: "transparent",
    color: "var(--color-blue)",
    textDecoration: "none",
    fontWeight: "var(--weight-semibold)",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--color-blue)",
  },
  section: {
    marginBottom: "var(--space-10)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "var(--space-4)",
    marginBottom: "var(--space-6)",
  },
  gridThree: {
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  },
  card: {
    background: "var(--color-bg-secondary)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-5)",
    boxShadow: "var(--shadow-sm)",
  },
  list: {
    margin: 0,
    paddingLeft: "var(--space-5)",
    color: "var(--color-text-secondary)",
    lineHeight: "var(--leading-relaxed)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginBottom: "var(--space-4)",
  },
  th: {
    textAlign: "left" as const,
    padding: "var(--space-3)",
    borderBottom: "2px solid var(--color-border)",
    fontWeight: "var(--weight-semibold)",
    fontSize: "var(--text-sm)",
  },
  td: {
    padding: "var(--space-3)",
    borderBottom: "1px solid var(--color-border)",
    fontSize: "var(--text-sm)",
    color: "var(--color-text-secondary)",
  },
  code: {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-sm)",
    backgroundColor: "var(--color-bg-tertiary)",
    padding: "var(--space-1) var(--space-2)",
    borderRadius: "var(--radius-sm)",
  },
  divider: {
    border: "none",
    borderTop: "1px solid var(--color-border)",
    margin: "var(--space-8) 0",
  },
  paragraph: {
    color: "var(--color-text-secondary)",
    lineHeight: "var(--leading-relaxed)",
    marginBottom: "var(--space-4)",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "var(--space-4)",
    marginTop: "var(--space-4)",
  },
  featureItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--space-1)",
  },
  featureLabel: {
    fontSize: "var(--text-sm)",
    color: "var(--color-text-secondary)",
  },
  featureValue: {
    fontSize: "var(--text-xl)",
    fontWeight: "var(--weight-bold)",
    color: "var(--color-text)",
  },
};

export default function AboutPage() {
  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>About</p>
        <h1 style={styles.h1}>DriftCity: Statistics for MLOps</h1>
        <p style={styles.lede}>
          An interactive, narrative-driven educational platform that teaches production ML statistical
          concepts through hands-on visualizations, real-world case studies, and runnable code examples.
        </p>
        <div style={styles.ctaRow}>
          <Link href="/chapters/chapter-1" style={styles.cta}>
            Start Learning
          </Link>
          <Link href="https://github.com/deepak-karkala/stats-for-mlops" style={styles.ctaSecondary}>
            View Source on GitHub
          </Link>
        </div>
      </section>

      <hr style={styles.divider} />

      {/* The Problem */}
      <section style={styles.section}>
        <h2 style={styles.h2}>The Problem</h2>
        <p style={styles.paragraph}>
          Machine Learning teams face a critical knowledge gap when it comes to production model operations.
          Understanding concepts like data drift, A/B testing, and variance reduction is essential for
          maintaining reliable ML systems, yet these topics are typically:
        </p>
        <ul style={styles.list}>
          <li><strong>Scattered across dense textbooks and academic papers</strong> — inaccessible to practitioners</li>
          <li><strong>Taught through static equations</strong> — abstract and hard to internalize</li>
          <li><strong>Disconnected from real-world implementation</strong> — theory without production context</li>
        </ul>
        <p style={{ ...styles.paragraph, marginTop: "var(--space-4)" }}>
          The result? ML Engineers ship models to production without fully understanding how to detect
          when they fail, how to run experiments correctly, or how to build monitoring systems that actually work.
        </p>
      </section>

      <hr style={styles.divider} />

      {/* The Solution */}
      <section style={styles.section}>
        <h2 style={styles.h2}>The Solution</h2>
        <p style={styles.paragraph}>
          DriftCity transforms how teams learn MLOps statistics by combining three powerful forces:
        </p>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.h3}>Narrative Cohesion</h3>
            <p style={styles.paragraph}>
              A fictional &quot;DriftCity&quot; story where algorithms power urban transportation,
              making abstract concepts tangible through metaphor.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.h3}>Interactive Exploration</h3>
            <p style={styles.paragraph}>
              Live Plotly visualizations with sliders, comparisons, and real-time calculations
              that let learners experiment and discover.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.h3}>Production Reality</h3>
            <p style={styles.paragraph}>
              Code patterns and case studies from Uber, Airbnb, Netflix, and DoorDash showing
              exactly how these concepts work in practice.
            </p>
          </div>
        </div>
      </section>

      <hr style={styles.divider} />

      {/* Statistical Concepts */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Statistical Concepts Covered</h2>

        <div style={{ ...styles.card, marginBottom: "var(--space-4)" }}>
          <h3 style={styles.h3}>Chapter 1: The City That Learned Too Fast</h3>
          <p style={{ ...styles.paragraph, marginBottom: "var(--space-2)" }}>
            <strong>Baseline Distributions & Drift Detection</strong>
          </p>
          <ul style={styles.list}>
            <li><strong>Population Stability Index (PSI)</strong> — Quantifies distribution shift between reference and current windows</li>
            <li><strong>Kolmogorov-Smirnov Test</strong> — Non-parametric test comparing empirical CDFs</li>
            <li><strong>Reference Windows</strong> — Establishing baseline P(X) for feature monitoring</li>
          </ul>
        </div>

        <div style={{ ...styles.card, marginBottom: "var(--space-4)" }}>
          <h3 style={styles.h3}>Chapter 2: The Weather Event</h3>
          <p style={{ ...styles.paragraph, marginBottom: "var(--space-2)" }}>
            <strong>Covariate Drift (P(X) Changes)</strong>
          </p>
          <ul style={styles.list}>
            <li><strong>Covariate Shift</strong> — Input distributions change while P(Y|X) remains stable</li>
            <li><strong>Distribution Overlay Analysis</strong> — Visual comparison of baseline vs. current histograms</li>
            <li><strong>Trend Monitoring</strong> — Tracking PSI over time windows to detect sustained shifts</li>
          </ul>
        </div>

        <div style={{ ...styles.card, marginBottom: "var(--space-4)" }}>
          <h3 style={styles.h3}>Chapter 3: The Vanishing Commuter</h3>
          <p style={{ ...styles.paragraph, marginBottom: "var(--space-2)" }}>
            <strong>Concept Drift (P(Y|X) Changes)</strong>
          </p>
          <ul style={styles.list}>
            <li><strong>Concept Drift</strong> — The relationship between inputs and outputs breaks down</li>
            <li><strong>RMSE/MAE Trend Analysis</strong> — Tracking prediction error over time as drift signal</li>
            <li><strong>Residual Analysis</strong> — Identifying spatial/temporal patterns in model failures</li>
          </ul>
        </div>

        <div style={{ ...styles.card, marginBottom: "var(--space-4)" }}>
          <h3 style={styles.h3}>Chapter 4: The Great Experiment</h3>
          <p style={{ ...styles.paragraph, marginBottom: "var(--space-2)" }}>
            <strong>A/B Testing & Controlled Experiments</strong>
          </p>
          <ul style={styles.list}>
            <li><strong>Sample Ratio Mismatch (SRM)</strong> — Chi-square test detecting randomization failures</li>
            <li><strong>Statistical Power Analysis</strong> — Determining sample sizes to detect meaningful effects</li>
            <li><strong>Type I/II Errors</strong> — Understanding false positive and false negative trade-offs</li>
          </ul>
        </div>

        <div style={{ ...styles.card, marginBottom: "var(--space-4)" }}>
          <h3 style={styles.h3}>Chapter 5: The CUPED Control Tower</h3>
          <p style={{ ...styles.paragraph, marginBottom: "var(--space-2)" }}>
            <strong>Variance Reduction & Sequential Testing</strong>
          </p>
          <ul style={styles.list}>
            <li><strong>CUPED</strong> — Controlled-experiment Using Pre-Experiment Data</li>
            <li><strong>Variance Reduction</strong> — Reduction approaches rho-squared (correlation squared)</li>
            <li><strong>Sequential Testing</strong> — O&apos;Brien-Fleming boundaries for early stopping</li>
          </ul>
        </div>

        <div style={styles.card}>
          <h3 style={styles.h3}>Chapter 6: The City Restored</h3>
          <p style={{ ...styles.paragraph, marginBottom: "var(--space-2)" }}>
            <strong>Continuous Monitoring & Guardrails</strong>
          </p>
          <ul style={styles.list}>
            <li><strong>Closed Feedback Loop</strong> — Detect, Diagnose, Retrain, Revalidate, Redeploy</li>
            <li><strong>Dual-Metric Correlation</strong> — Tracking PSI against RMSE to quantify drift impact</li>
            <li><strong>Automated Guardrails</strong> — Threshold-based triggers for SLA breaches</li>
          </ul>
        </div>
      </section>

      <hr style={styles.divider} />

      {/* Technical Implementation */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Technical Implementation</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Layer</th>
              <th style={styles.th}>Technology</th>
              <th style={styles.th}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}><strong>Framework</strong></td>
              <td style={styles.td}>Next.js 14</td>
              <td style={styles.td}>App Router, static generation, TypeScript strict mode</td>
            </tr>
            <tr>
              <td style={styles.td}><strong>Content</strong></td>
              <td style={styles.td}>MDX</td>
              <td style={styles.td}>Markdown with embedded React components</td>
            </tr>
            <tr>
              <td style={styles.td}><strong>Visualization</strong></td>
              <td style={styles.td}>Plotly.js</td>
              <td style={styles.td}>Interactive charts with client-only rendering</td>
            </tr>
            <tr>
              <td style={styles.td}><strong>Styling</strong></td>
              <td style={styles.td}>CSS Variables</td>
              <td style={styles.td}>Design tokens for consistent theming</td>
            </tr>
            <tr>
              <td style={styles.td}><strong>Deployment</strong></td>
              <td style={styles.td}>Vercel</td>
              <td style={styles.td}>Auto-deploy on main branch push</td>
            </tr>
          </tbody>
        </table>

        <div style={{ ...styles.grid, ...styles.gridThree }}>
          <div style={styles.card}>
            <h3 style={styles.h3}>Dynamic Imports</h3>
            <p style={styles.paragraph}>
              Plotly charts use dynamic imports with SSR disabled to prevent hydration errors
              and optimize bundle size.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.h3}>Lazy Loading</h3>
            <p style={styles.paragraph}>
              Charts defer CSV loading until scrolled into viewport using IntersectionObserver
              with 120px rootMargin.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.h3}>CSV Pipeline</h3>
            <p style={styles.paragraph}>
              D3-DSV for parsing with type coercion, parallel fetching, and Laplace smoothing
              for PSI calculations.
            </p>
          </div>
        </div>
      </section>

      <hr style={styles.divider} />

      {/* Teaching Methodology */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Teaching Methodology</h2>

        <h3 style={{ ...styles.h3, marginTop: "var(--space-4)" }}>Narrative-Driven Learning</h3>
        <p style={styles.paragraph}>Each chapter uses metaphor to make abstract concepts concrete:</p>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Chapter</th>
              <th style={styles.th}>Metaphor</th>
              <th style={styles.th}>Statistical Concept</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>1</td>
              <td style={styles.td}>City establishing equilibrium</td>
              <td style={styles.td}>Baseline distributions</td>
            </tr>
            <tr>
              <td style={styles.td}>2</td>
              <td style={styles.td}>Weather event</td>
              <td style={styles.td}>Covariate drift</td>
            </tr>
            <tr>
              <td style={styles.td}>3</td>
              <td style={styles.td}>Commuter behavior change</td>
              <td style={styles.td}>Concept drift</td>
            </tr>
            <tr>
              <td style={styles.td}>4</td>
              <td style={styles.td}>Engine competition</td>
              <td style={styles.td}>A/B testing</td>
            </tr>
            <tr>
              <td style={styles.td}>5</td>
              <td style={styles.td}>Control tower precision</td>
              <td style={styles.td}>Variance reduction</td>
            </tr>
            <tr>
              <td style={styles.td}>6</td>
              <td style={styles.td}>City recovery</td>
              <td style={styles.td}>Monitoring & feedback loops</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ ...styles.h3, marginTop: "var(--space-6)" }}>Three Evidence Layers</h3>
        <p style={styles.paragraph}>Every concept is taught through multiple lenses:</p>
        <ol style={styles.list}>
          <li><strong>Mathematical</strong> — Formulas and statistical tests (PSI, KS, CUPED)</li>
          <li><strong>Visual</strong> — Interactive charts with threshold indicators</li>
          <li><strong>Operational</strong> — Decision rules and production thresholds</li>
        </ol>
      </section>

      <hr style={styles.divider} />

      {/* Industry Case Studies */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Industry Case Studies</h2>
        <p style={styles.paragraph}>
          The content references real implementations from leading tech companies:
        </p>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.h3}>Uber Michelangelo</h3>
            <ul style={styles.list}>
              <li>Nightly feature monitoring computing PSI/KS for all continuous features</li>
              <li>Residual analysis flagging zones where error exceeds 2 sigma</li>
              <li>Auto-drain traffic on drift or SLA breach</li>
            </ul>
          </div>
          <div style={styles.card}>
            <h3 style={styles.h3}>Airbnb Experimentation</h3>
            <ul style={styles.list}>
              <li>CUPED on booking conversion achieving ~40% sample reduction</li>
              <li>Guardrail blocking for metric regressions</li>
              <li>XP Guards preventing concurrent test interference</li>
            </ul>
          </div>
          <div style={styles.card}>
            <h3 style={styles.h3}>Netflix XP</h3>
            <ul style={styles.list}>
              <li>Thousands of concurrent A/B tests daily</li>
              <li>Auto-checks for SRM, power, and guardrail violations</li>
              <li>Sequential testing ending ~10% of experiments early</li>
            </ul>
          </div>
          <div style={styles.card}>
            <h3 style={styles.h3}>DoorDash Feature Store</h3>
            <ul style={styles.list}>
              <li>Streaming feature store with 7-day moving PSI average</li>
              <li>Drift detection combined with volume metrics</li>
              <li>Upstream ETL failure detection via missing-data drift</li>
            </ul>
          </div>
        </div>
      </section>

      <hr style={styles.divider} />

      {/* Key Features */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Key Features</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureItem}>
            <span style={styles.featureValue}>16</span>
            <span style={styles.featureLabel}>Interactive Plotly visualizations</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureValue}>6</span>
            <span style={styles.featureLabel}>Comprehensive chapters</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureValue}>2-3 min</span>
            <span style={styles.featureLabel}>Reading time per chapter</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureValue}>15+</span>
            <span style={styles.featureLabel}>Realistic CSV datasets</span>
          </div>
        </div>
      </section>

      <hr style={styles.divider} />

      {/* Skills Demonstrated */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Skills Demonstrated</h2>
        <div style={{ ...styles.grid, ...styles.gridThree }}>
          <div style={styles.card}>
            <h3 style={styles.h3}>Statistical Analysis</h3>
            <ul style={styles.list}>
              <li>PSI implementation</li>
              <li>Kolmogorov-Smirnov test</li>
              <li>CUPED variance reduction</li>
              <li>Sequential testing</li>
              <li>A/B test power analysis</li>
            </ul>
          </div>
          <div style={styles.card}>
            <h3 style={styles.h3}>Educational Design</h3>
            <ul style={styles.list}>
              <li>Narrative framing</li>
              <li>Visual-first learning</li>
              <li>Progressive complexity</li>
              <li>Industry-grounded examples</li>
            </ul>
          </div>
          <div style={styles.card}>
            <h3 style={styles.h3}>UX & Interaction</h3>
            <ul style={styles.list}>
              <li>Interactive sliders & toggles</li>
              <li>Real-time calculations</li>
              <li>Color-coded thresholds</li>
              <li>Two-column layout</li>
            </ul>
          </div>
        </div>
      </section>

      <hr style={styles.divider} />

      {/* What Makes This Distinctive */}
      <section style={styles.section}>
        <h2 style={styles.h2}>What Makes This Project Distinctive</h2>
        <ol style={{ ...styles.list, marginBottom: "var(--space-4)" }}>
          <li style={{ marginBottom: "var(--space-3)" }}>
            <strong>Narrative Cohesion</strong> — Unlike fragmented tutorials, DriftCity weaves
            statistical concepts into a consistent story where readers understand the &quot;why&quot; behind each metric
          </li>
          <li style={{ marginBottom: "var(--space-3)" }}>
            <strong>Hands-On Interactivity</strong> — Sliders, comparisons, and live simulations
            let learners explore concepts, not just read about them
          </li>
          <li style={{ marginBottom: "var(--space-3)" }}>
            <strong>Production-Grade Examples</strong> — Code snippets aren&apos;t academic—they&apos;re
            patterns used by Uber, Airbnb, and Netflix
          </li>
          <li style={{ marginBottom: "var(--space-3)" }}>
            <strong>Accessibility</strong> — WCAG AA compliance and simple visual metaphors make
            MLOps accessible to non-statisticians
          </li>
          <li>
            <strong>Extensible Architecture</strong> — Modular MDX + component design allows rapid
            chapter additions without framework changes
          </li>
        </ol>
      </section>

      <hr style={styles.divider} />

      {/* CTA */}
      <section style={{ textAlign: "center" as const, padding: "var(--space-6) 0" }}>
        <h2 style={{ ...styles.h2, textAlign: "center" as const }}>Ready to Learn?</h2>
        <p style={{ ...styles.paragraph, textAlign: "center" as const, maxWidth: "600px", margin: "0 auto var(--space-6)" }}>
          Start with Chapter 1 to understand baseline distributions and drift detection fundamentals.
        </p>
        <div style={{ ...styles.ctaRow, justifyContent: "center" }}>
          <Link href="/chapters/chapter-1" style={styles.cta}>
            Start Chapter 1
          </Link>
        </div>
      </section>
    </div>
  );
}
