import { getProducts } from '@/lib/content';
import Link from 'next/link';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
            Products & Ventures
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--color-primary)'}}>
            Innovative AI products and entrepreneurial ventures with interactive demos, 
            technical details, and real-world applications.
          </p>
        </section>

        {/* Products Grid */}
        <section className="grid lg:grid-cols-2 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.slug}>
                <div className="card hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: product.status === 'Public Beta' ? 'var(--color-accent)' : 
                                        product.status === 'Private Beta' ? 'var(--color-secondary)' : 
                                        'var(--color-primary)',
                        color: 'white'
                      }}
                    >
                      {product.status || 'In Development'}
                    </span>
                    {product.category && (
                      <span className="text-sm" style={{color: 'var(--color-primary)'}}>
                        {product.category}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:opacity-80 transition-opacity" 
                      style={{color: 'var(--color-foreground)'}}>
                    {product.title}
                  </h3>
                  
                  <p className="mb-6 text-lg" style={{color: 'var(--color-primary)'}}>
                    {product.summary}
                  </p>
                  
                  {/* Tech Stack */}
                  {product.techStack && product.techStack.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {product.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: 'var(--color-card-bg)',
                              color: 'var(--color-foreground)',
                              border: '1px solid var(--color-card-border)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {product.techStack.length > 4 && (
                          <span className="text-xs" style={{color: 'var(--color-primary)'}}>
                            +{product.techStack.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: 'var(--color-primary)'}}>
                      {product.date}
                    </span>
                    <span className="text-sm font-medium" style={{color: 'var(--color-accent)'}}>
                      Learn More →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
                Products Coming Soon
              </h3>
              <p style={{color: 'var(--color-primary)'}}>
                I&apos;m currently developing several AI products. Check back soon for demos and technical details!
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16 p-8 card">
          <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-foreground)'}}>
            Interested in Collaboration?
          </h3>
          <p className="mb-6" style={{color: 'var(--color-primary)'}}>
            I&apos;m always looking for partners, early users, and feedback on my products. Let&apos;s explore opportunities together.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Get in Touch
            </Link>
            <Link href="/research" className="btn-secondary">
              View Research
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 