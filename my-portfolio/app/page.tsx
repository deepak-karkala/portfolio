export default function Home() {
  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
          Architecting AI-Native Products
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto" style={{color: 'var(--color-primary)'}}>
          Building Intelligent Systems, from Silicon to Scale. A Machine Learning Engineer with 7 years of experience in AI, ML, MLOps, and GenAI.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="btn-primary">View My Work</button>
          <button className="btn-secondary">See Products</button>
        </div>
      </section>

      {/* Color Palette Demo */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Current Palette: Warm & Earthy (with Dark Mode)</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          <div className="card text-center">
            <div className="w-full h-20 border border-gray-300 rounded mb-3" style={{backgroundColor: 'var(--color-background)'}}></div>
            <p className="text-sm font-medium">Background</p>
            <p className="text-xs" style={{color: 'var(--color-primary)'}}>#FBF8F3</p>
          </div>
          <div className="card text-center">
            <div className="w-full h-20 rounded mb-3" style={{backgroundColor: 'var(--color-primary)'}}></div>
            <p className="text-sm font-medium">Primary</p>
            <p className="text-xs" style={{color: 'var(--color-primary)'}}>#8B9A8B</p>
          </div>
          <div className="card text-center">
            <div className="w-full h-20 rounded mb-3" style={{backgroundColor: 'var(--color-secondary)'}}></div>
            <p className="text-sm font-medium">Secondary</p>
            <p className="text-xs" style={{color: 'var(--color-primary)'}}>#D4A574</p>
          </div>
          <div className="card text-center">
            <div className="w-full h-20 rounded mb-3" style={{backgroundColor: 'var(--color-accent)'}}></div>
            <p className="text-sm font-medium">Accent</p>
            <p className="text-xs" style={{color: 'var(--color-primary)'}}>#C85A54</p>
          </div>
          <div className="card text-center">
            <div className="w-full h-20 rounded mb-3" style={{backgroundColor: 'var(--color-foreground)'}}></div>
            <p className="text-sm font-medium">Text</p>
            <p className="text-xs" style={{color: 'var(--color-primary)'}}>#2C2C2C</p>
          </div>
        </div>
      </section>

      {/* Main CTA Cards */}
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="card hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold mb-3" style={{color: 'var(--color-foreground)'}}>Case Studies</h3>
          <p className="mb-4" style={{color: 'var(--color-primary)'}}>Deep-dive into my professional industry experience with quantifiable impact and technical solutions.</p>
          <button className="btn-primary w-full">Explore My Work</button>
        </div>
        
        <div className="card hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold mb-3" style={{color: 'var(--color-foreground)'}}>Products</h3>
          <p className="mb-4" style={{color: 'var(--color-primary)'}}>Innovative AI products and entrepreneurial ventures with interactive demos and technical details.</p>
          <button className="btn-primary w-full">See What I&apos;m Building</button>
        </div>
        
        <div className="card hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold mb-3" style={{color: 'var(--color-foreground)'}}>Playbooks</h3>
          <p className="mb-4" style={{color: 'var(--color-primary)'}}>Educational guides and courses on MLOps, GenAI Applications, AI Agents, and system design.</p>
          <button className="btn-primary w-full">Read My Playbooks</button>
        </div>
      </section>
    </div>
  );
}
