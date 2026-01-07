import Link from 'next/link';
import { getDataVisualisations } from '@/lib/content';

export const metadata = {
    title: 'Data Visualisation | Deepak Karkala',
    description: 'Interactive data visualizations exploring physics, data science, and storytelling through D3.js and modern web technologies.',
};

export default async function DataVisualisationPage() {
    const projects = await getDataVisualisations();

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Data Visualisation
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Interactive explorations of data through D3.js, scrollytelling,
                        and modern web technologies. Each project tells a story through
                        visualizations and hands-on interaction.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => {
                        const card = (
                            <article className="h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                                {project.image && (
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-grow">
                                    {project.category && (
                                        <span className="text-xs font-medium text-primary mb-2">
                                            {project.category}
                                        </span>
                                    )}
                                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                        {project.summary}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.techStack?.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack && project.techStack.length > 3 && (
                                            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                                                +{project.techStack.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );

                        return project.vizUrl ? (
                            <Link
                                key={project.slug}
                                href={project.vizUrl}
                                className="group block h-full"
                            >
                                {card}
                            </Link>
                        ) : (
                            <div key={project.slug} className="group block h-full">
                                {card}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
