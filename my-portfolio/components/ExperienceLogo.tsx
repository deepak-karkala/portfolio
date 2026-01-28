import Image from 'next/image';

interface ExperienceLogoProps {
  logo: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function ExperienceLogo({
  logo,
  alt,
  size = 'large',
  className = ''
}: ExperienceLogoProps) {
  const sizeClasses = {
    small: 'w-12 h-12 md:w-14 md:h-14',
    medium: 'w-20 h-20 md:w-24 md:h-24',
    large: 'w-24 h-24 md:w-32 md:h-32',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-white flex items-center justify-center shadow-xl flex-shrink-0 transition-transform duration-300 hover:-translate-y-2 ${className}`}>
      <Image
        src={logo}
        alt={alt}
        width={size === 'small' ? 56 : size === 'medium' ? 80 : 96}
        height={size === 'small' ? 56 : size === 'medium' ? 80 : 96}
        className="object-contain p-2"
      />
    </div>
  );
}
