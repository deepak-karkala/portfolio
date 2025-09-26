import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
            About Me
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{color: 'var(--color-primary)'}}>
            The story behind the Builder, Teacher, and Innovator
          </p>
        </section>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Personal Story */}
          <section className="card">
            <h2 className="text-3xl font-bold mb-6" style={{color: 'var(--color-foreground)'}}>
              My Journey
            </h2>
            <div className="space-y-4" style={{color: 'var(--color-primary)'}}>
              <p>
                I&apos;m a Machine Learning Engineer with 7 years of experience building AI systems that solve real-world problems. 
                My journey spans from IoT energy systems to autonomous vehicles, e-commerce platforms to educational technology.
              </p>
              <p>
                What drives me is the intersection of three passions: <strong>Building</strong> production systems that scale, 
                <strong>Teaching</strong> others through courses and guides, and <strong>Innovating</strong> on the future of AI.
              </p>
              <p>
                Currently, I&apos;m focused on making advanced AI capabilities accessible through smaller, more efficient models, 
                particularly for Indian languages and cultural contexts.
              </p>
            </div>
          </section>

          {/* Professional Timeline */}
          <section className="card">
            <h2 className="text-3xl font-bold mb-6" style={{color: 'var(--color-foreground)'}}>
              Professional Timeline
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 pl-6" style={{borderColor: 'var(--color-primary)'}}>
                <h3 className="text-xl font-semibold" style={{color: 'var(--color-foreground)'}}>
                  2024 - Present: AI Research & Product Development
                </h3>
                <p style={{color: 'var(--color-primary)'}}>
                  Developing small language models for Indian languages and building AI products for creative and educational applications.
                </p>
              </div>
              
              <div className="border-l-2 pl-6" style={{borderColor: 'var(--color-primary)'}}>
                <h3 className="text-xl font-semibold" style={{color: 'var(--color-foreground)'}}>
                  2021 - 2023: Senior ML Engineer - E-commerce
                </h3>
                <p style={{color: 'var(--color-primary)'}}>
                  Built comprehensive AI suite including customer lifetime value prediction, recommendation systems, and multimodal RAG for review analysis.
                </p>
              </div>
              
              <div className="border-l-2 pl-6" style={{borderColor: 'var(--color-primary)'}}>
                <h3 className="text-xl font-semibold" style={{color: 'var(--color-foreground)'}}>
                  2019 - 2021: ML Engineer - Autonomous Vehicles
                </h3>
                <p style={{color: 'var(--color-primary)'}}>
                  Developed data engines and optimized inference pipelines for ADAS systems, focusing on real-time performance and safety.
                </p>
              </div>
              
              <div className="border-l-2 pl-6" style={{borderColor: 'var(--color-primary)'}}>
                <h3 className="text-xl font-semibold" style={{color: 'var(--color-foreground)'}}>
                  2017 - 2019: ML Engineer - IoT & Energy
                </h3>
                <p style={{color: 'var(--color-primary)'}}>
                  Built anomaly detection and energy forecasting systems for industrial IoT applications, saving millions in operational costs.
                </p>
              </div>
            </div>
          </section>

          {/* Values & Philosophy */}
          <section className="card">
            <h2 className="text-3xl font-bold mb-6" style={{color: 'var(--color-foreground)'}}>
              Values & Philosophy
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{color: 'var(--color-accent)'}}>
                  🏗️ Builder
                </h3>
                <p style={{color: 'var(--color-primary)'}}>
                  I believe in building systems that work reliably in production, not just in notebooks. 
                  Real impact comes from deploying AI that users can depend on.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{color: 'var(--color-accent)'}}>
                  👨‍🏫 Teacher
                </h3>
                <p style={{color: 'var(--color-primary)'}}>
                  Knowledge shared is knowledge multiplied. I create courses, guides, and content to help 
                  others avoid the pitfalls I&apos;ve encountered.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{color: 'var(--color-accent)'}}>
                  💡 Innovator
                </h3>
                <p style={{color: 'var(--color-primary)'}}>
                  The future of AI should be accessible to everyone, regardless of language or resources. 
                  I work on democratizing advanced AI capabilities.
                </p>
              </div>
            </div>
          </section>

          {/* Personal Interests */}
          <section className="card">
            <h2 className="text-3xl font-bold mb-6" style={{color: 'var(--color-foreground)'}}>
              Beyond Work
            </h2>
            <div style={{color: 'var(--color-primary)'}}>
              <p className="mb-4">
                When I&apos;m not building ML systems, you&apos;ll find me exploring the intersection of technology and culture. 
                I&apos;m passionate about preserving and promoting Indian languages through technology.
              </p>
              <p className="mb-4">
                I enjoy reading about cognitive science, playing chess, and experimenting with creative AI applications. 
                I&apos;m also an advocate for open-source AI and believe in making research accessible to everyone.
              </p>
              <p>
                Currently based in Bangalore, India - the Silicon Valley of India - where I&apos;m surrounded by incredible 
                talent and innovation in the AI space.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center p-8 card">
            <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
              Let&apos;s Connect
            </h3>
            <p className="mb-6" style={{color: 'var(--color-primary)'}}>
              I&apos;m always interested in discussing AI, collaborating on research, or helping solve challenging ML problems.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Get in Touch
              </Link>
              <Link href="/case-studies" className="btn-secondary">
                View My Work
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
