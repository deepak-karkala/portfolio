export default function Footer() {
    return (
        <footer className="py-6 border-t mt-12 text-center text-sm text-foreground bg-background">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-4">
                    <a href="https://github.com/deepak-karkala" target="_blank" rel="noopener noreferrer" className="hover:text-accent">GitHub</a>
                    <a href="https://www.linkedin.com/in/deepak-karkala" target="_blank" rel="noopener noreferrer" className="hover:text-accent">LinkedIn</a>
                    <a href="mailto:dkarkala01@gmail.com" className="hover:text-accent">Email</a>
                </div>
                <div>&copy; {new Date().getFullYear()} Deepak Karkala</div>
            </div>
        </footer>
    );
} 