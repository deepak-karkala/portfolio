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
                <div className="card hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                  <h3
                    className="text-2xl font-bold mb-3 group-hover:opacity-90 transition-opacity"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {playbook.title}
                  </h3>

                  <p
                    className="text-base"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {playbook.summary}
                  </p>
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
