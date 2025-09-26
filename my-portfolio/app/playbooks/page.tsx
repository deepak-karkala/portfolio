import { getPlaybooks } from '@/lib/content';
import Link from 'next/link';

export default async function PlaybooksPage() {
  const playbooks = await getPlaybooks();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-16">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: 'var(--color-foreground)' }}
          >
            Playbooks & Courses
          </h1>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: 'var(--color-primary)' }}
          >
            In-depth guides, curricula, and operating playbooks for building real-world AI systems. Dive into structured learning paths built from production experience.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          {playbooks.length > 0 ? (
            playbooks.map((playbook) => (
              <Link href={`/playbooks/${playbook.slug}`} key={playbook.slug}>
                <div className="card hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--color-secondary)',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      {playbook.status || 'In Progress'}
                    </span>
                    {playbook.level && (
                      <span
                        className="text-sm"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {playbook.level}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-2xl font-bold mb-3 group-hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {playbook.title}
                  </h3>

                  <p
                    className="mb-6 text-base flex-1"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {playbook.summary}
                  </p>

                  {playbook.techStack && playbook.techStack.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {playbook.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: 'var(--color-card-bg)',
                              color: 'var(--color-foreground)',
                              border: '1px solid var(--color-card-border)',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {playbook.techStack.length > 4 && (
                          <span
                            className="text-xs"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            +{playbook.techStack.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--color-primary)' }}>
                      {playbook.date}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      View Curriculum →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: 'var(--color-foreground)' }}
              >
                Playbooks in Progress
              </h3>
              <p style={{ color: 'var(--color-primary)' }}>
                I am actively writing detailed playbooks that combine architecture, code, and operations guidance. Check back soon!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
