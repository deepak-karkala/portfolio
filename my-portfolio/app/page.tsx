import HomeGridSections from '@/components/HomeGridSections';
import HomeContentList from '@/components/HomeContentList';
import PastExperiencesSection from '@/components/PastExperiencesSection';
import Image from 'next/image';
import Link from 'next/link';
import {
  getProductsForHomepage,
  getPlaybooksForHomepage,
  getIllustratedGuidesForHomepage,
  getAgenticAIProductsForHomepage,
  getAgenticCodingForHomepage
} from '@/lib/homepageData';
import WorkWithMeSection from '@/components/WorkWithMeSection';

export default function Home() {
  const products = getProductsForHomepage();
  const playbooks = getPlaybooksForHomepage();
  const illustratedGuides = getIllustratedGuidesForHomepage();
  const agenticAIProducts = getAgenticAIProductsForHomepage();
  const agenticCoding = getAgenticCodingForHomepage();

  return (
    <div className="min-h-screen py-12">
      {/* Intro Section */}
      <section className="intro-section">
        <div className="intro-card">
          <div className="intro-image">
            <Image
              src="/profile/profile.jpeg"
              alt="Deepak Karkala"
              width={360}
              height={360}
              priority
            />
          </div>
          <div className="intro-content">
            <h1 className="intro-name">Deepak Karkala</h1>
            <p className="intro-tagline">
              {/*A Machine Learning Engineer with 5 years of experience in AI, ML, MLOps, and GenAI.*/}
              Senior ML Engineer | 6 Production ML Systems | GenAI | MLOps | AWS • Python • LLMs | Ex-EPFL • 1 Patent
            </p>
            <div className="intro-links">
              <a
                className="intro-link"
                href="https://linkedin.com/in/deepak-karkala"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                className="intro-link"
                href="https://github.com/deepak-karkala"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                className="intro-link"
                href="/profile/Deepak_Karkala_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                aria-label="Resume"
              >
                <span className="font-bold text-xs tracking-tighter">CV</span>
              </a>
              <a
                className="intro-link"
                href="https://deepakkarkala.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Portfolio"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 9h-2.02a15.7 15.7 0 00-1.3-5.04A8.01 8.01 0 0118.93 11zM12 4.06c.9 1.2 1.62 3.1 1.98 5.94h-3.96C10.38 7.16 11.1 5.26 12 4.06zM5.07 13h2.02c.25 1.98.9 3.76 1.84 5.04A8.01 8.01 0 015.07 13zm2.02-2H5.07a8.01 8.01 0 013.79-5.04A15.7 15.7 0 007.09 11zM12 19.94c-.9-1.2-1.62-3.1-1.98-5.94h3.96c-.36 2.84-1.08 4.74-1.98 5.94zM14.89 18.04c.94-1.28 1.6-3.06 1.84-5.04h2.02a8.01 8.01 0 01-3.86 5.04z" />
                </svg>
              </a>
              <a
                className="intro-link"
                href="mailto:dkarkala01@gmail.com"
                aria-label="Email"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="about-section">
        <div className="about-card">
          <h2 className="about-title">About Me</h2>
          <p className="about-text">
            Senior ML Engineer with 6+ years of experience in ML/AI, shipping production ML systems that
            deliver measurable business impact across e-commerce and IoT.
          </p>
          
          <p className="about-text">
            For a mid-sized European e-commerce marketplace, I built 4 production ML systems:
            <ul>
              <li>• 5% conversion uplift via <Link className="about-link" href="/experiences/ecom_purchase_intent_scoring">real-time purchase intent scoring</Link></li>
              <li>• 12% higher marketing ROI through <Link className="about-link" href="/experiences/ecom_customer_lifetime_value">CLV prediction</Link></li>
              <li>• 4% search-to-purchase improvement with <Link className="about-link" href="/experiences/ecom_rag_product_catalog">RAG-powered discovery</Link></li>
              <li>• 60% cost reduction in <Link className="about-link" href="/experiences/ecom_reviews_summarisation">LLM based review summarization</Link> with fine-tuned Mistral-7B</li>
            </ul>
          </p>
          
          <p className="about-text">
            Earlier at <Link className="about-link" href="https://myesmart.com/en/">eSMART Technologies</Link>, I built 2 IoT ML systems:
            <ul>
              <li>• 20% reduction in emergency maintenance callouts via <Link className="about-link" href="/experiences/iot_anomaly">predictive maintenance</Link></li>
              <li>• 10pp increase in solar self-consumption through <Link className="about-link" href="/experiences/iot_forecasting">energy forecasting</Link></li>
            </ul>
          </p>
          
          <p className="about-text">
            Led end-to-end ownership spanning the full MLOps lifecycle: evaluation frameworks (offline
            metrics, LLM-as-judge, CI/CD regression tests), production debugging
            (calibration breakdowns, alert fatigue), stakeholder management
            (legal governance, cross-functional experiments), and operational
            excellence (latency SLOs, drift monitoring, segment-wise
            reliability, A/B testing strategy). Delivered cost-bounded
            infrastructure while maintaining business impact.
          </p>
          <p className="about-text">
            Recent GenAI based personal projects include fine-tuning Gemma models: an <Link className="about-link" href="/products/ai-feynman-kannada-tutor">AI Feynman style Kannada
              Physics Tutor</Link> and an <Link className="about-link" href="/products/ai-scriptwriter">AI Scriptwriter (The Office)</Link>, both published on
            Hugging Face with custom reasoning datasets and evaluation harnesses.
            I also built a prototype <Link className="about-link" href="/products/agentic-mlops">Agentic MLOps</Link> platform: AI agents that auto-generate complete MLOps
            infrastructure from requirements to production-ready pipelines with database backed job queues, transparency, guardrails, governance and human-in-the-loop workflows.
          </p>
          <p className="about-text">
            For <Link className="about-link" href="/agentic-ai-products">Building Agentic AI Products</Link>, I have curated <Link className="about-link" href="/agentic-ai-products/technical-strategies">technical strategies</Link> on
            reliability, safety, evals, observability, and governance; <Link className="about-link" href="/agentic-ai-products/product-business">business
            strategies</Link> on wedge selection, adoption/distribution loops, pricing,
            and rollout; plus guides on <Link className="about-link" href="/agentic-ai-products/agentic-ai-evals/playbook">agent evaluation</Link>, <Link className="about-link" href="/agentic-ai-products/agentic-rl">agentic RL workflow</Link>
            policy optimization, <Link className="about-link" href="/agentic-ai-products/context-engineering">context engineering</Link>, and <Link className="about-link" href="/agentic-ai-products/product-proposals">product proposal </Link>  templates. The <Link className="about-link" href="/playbooks/">Playbooks</Link> section distills field-tested patterns and
            decision frameworks from production systems.
          </p>
          <p className="about-text">
            Academic background: MS Communication Systems (<Link className="about-link" href="/experiences/masters">EPFL</Link>, Grade 5.25/6.0),
            BE Electronics (RVCE, CGPA 9.23/10.0). Prior work includes research
            at IISc (<a className="about-link" href="https://aapm.onlinelibrary.wiley.com/doi/10.1118/1.4736820">Medical Physics publication</a>), signal processing at
            Signalchip (<a className="about-link" href="https://patents.google.com/patent/US9602240B1/en?oq=9602240">1 US patent</a>), and ML research at <Link className="about-link" href="/experiences/intern_nec">NEC Labs America</Link>.
          </p>
        </div>
      </section>

      {/* Grid Sections */}
      <h2 className="text-3xl font-bold mb-8 text-center mt-12">Explore My Work</h2>
      <HomeGridSections />

      {/* Past Experiences Section */}
      <PastExperiencesSection />

      {/* Content Sections */}
      <HomeContentList sections={[
        {
          title: 'Building Agentic AI Products',
          icon: '',
          items: agenticAIProducts,
          showViewAll: false
        },
        {
          title: 'Product Prototypes',
          icon: '',
          items: products,
          showViewAll: false
        },
        {
          title: 'Production Playbooks',
          icon: '',
          items: playbooks,
          showViewAll: false
        },
        {
          title: 'Agentic Coding',
          icon: '',
          items: agenticCoding,
          showViewAll: false
        },
        {
          title: 'Illustrated Guides',
          icon: '',
          items: illustratedGuides,
          showViewAll: false
        }
      ]} />

      <WorkWithMeSection withBorder={false} />
    </div>
  );
}
