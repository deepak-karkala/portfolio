import Link from 'next/link';
import { getProducts } from '@/lib/content';

export const metadata = {
    title: 'Products | My Portfolio',
    description: 'A collection of my products and projects.',
};

export default async function ProductsPage() {
    const products = await getProducts();
    const productOrder = [
        'agentic-mlops',
        'ai-scriptwriter/sitcom-office',
        'ai-feynman-kannada-tutor/kannada-physics-tutor',
        'chat-with-tv-characters',
        'learn-with-ai',
    ];
    const orderedProducts = [
        ...productOrder
            .map((slug) => products.find((product) => product.slug === slug))
            .filter((product): product is NonNullable<typeof product> => Boolean(product)),
        ...products.filter((product) => !productOrder.includes(product.slug)),
    ];
    const oldProjects = [
        {
            slug: 'ecommerce_image_segmentation',
            title: 'Ecommerce Image Segmentation',
            summary: 'Legacy project with model training, evaluation, and production deployment notes.',
            image: '/products/ecommerce_image_segmentation/about/images/cover.png',
        },
        {
            slug: 'airbnb_price_modeling',
            title: 'Airbnb Price Modeling',
            summary: 'Legacy project on price prediction with data pipelines and production architecture.',
            image: '/products/airbnb_price_modeling/about/images/cover.png',
        },
        {
            slug: 'airbnb_alternate_search',
            title: 'Airbnb Alternate Search',
            summary: 'Legacy project exploring alternate search ranking and experimentation.',
            image: '/products/airbnb_alternate_search/about/images/vibe_search.gif',
        },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Projects</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        A showcase of products, tools, and experiments I&apos;ve built.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {orderedProducts.map((product) => {
                        // Special handling for nested products to match custom routes
                        const href = product.slug === 'ai-scriptwriter/sitcom-office'
                            ? '/products/ai-scriptwriter'
                            : product.slug === 'ai-feynman-kannada-tutor/kannada-physics-tutor'
                            ? '/products/ai-feynman-kannada-tutor'
                            : `/products/${product.slug}`;
                        const isExternal = product.slug === 'chat-with-tv-characters' && product.externalUrl;

                        const card = (
                            <article className="h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                                {product.image && (
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {product.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                        {product.summary}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {product.techStack?.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {product.techStack && product.techStack.length > 3 && (
                                            <span className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200">
                                                +{product.techStack.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );

                        return isExternal ? (
                            <a
                                key={product.slug}
                                href={product.externalUrl}
                                className="group block h-full"
                            >
                                {card}
                            </a>
                        ) : (
                            <Link
                                key={product.slug}
                                href={href}
                                className="group block h-full"
                            >
                                {card}
                            </Link>
                        );
                    })}
                </div>

                <section className="mt-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Old Projects</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {oldProjects.map((project) => (
                            <Link
                                key={project.slug}
                                href={`/products/${project.slug}/about/index.html`}
                                className="group block h-full"
                            >
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
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                            {project.summary}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
