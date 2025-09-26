import { getCaseStudies } from '@/lib/content';
import Link from 'next/link';

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
            Case Studies
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--color-primary)'}}>
            Deep-dive into my professional industry experience with quantifiable impact, 
            technical solutions, and architectural insights from real-world ML systems.
          </p>
        </section>

        {/* Case Studies Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.length > 0 ? (
            caseStudies.map((study) => (
              <Link href={`/case-studies/${study.slug}`} key={study.slug}>
                <div className="card hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  {/* Image placeholder */}
                  <div 
                    className="w-full h-48 rounded-lg mb-4 bg-gradient-to-br flex items-center justify-center"
                    style={{backgroundColor: 'var(--color-primary)'}}
                  >
                    <span className="text-white text-sm font-medium">
                      {study.category || 'Case Study'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:opacity-80 transition-opacity" 
                      style={{color: 'var(--color-foreground)'}}>
                    {study.title}
                  </h3>
                  
                  <p className="mb-4 text-sm line-clamp-3" style={{color: 'var(--color-primary)'}}>
                    {study.summary}
                  </p>
                  
                  {/* Tech Stack */}
                  {study.techStack && study.techStack.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {study.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: 'var(--color-secondary)',
                              color: 'var(--color-foreground)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {study.techStack.length > 3 && (
                          <span className="text-xs" style={{color: 'var(--color-primary)'}}>
                            +{study.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: 'var(--color-primary)'}}>
                      {study.date}
                    </span>
                    <span className="text-sm font-medium" style={{color: 'var(--color-accent)'}}>
                      Read Case Study →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
                Case Studies Coming Soon
              </h3>
              <p style={{color: 'var(--color-primary)'}}>
                I&apos;m currently preparing detailed case studies from my professional experience. 
                Check back soon for in-depth technical insights!
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16 p-8 card">
          <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
            Want to discuss a similar project?
          </h3>
          <p className="mb-6" style={{color: 'var(--color-primary)'}}>
            I&apos;m available for consulting and technical advisory roles. Let&apos;s chat about your ML challenges.
          </p>
          <Link href="/contact" className="btn-primary">
            Get in Touch
          </Link>
        </section>
      </div>
    </div>
  );
} 