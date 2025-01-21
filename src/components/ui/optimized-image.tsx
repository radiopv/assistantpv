import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  ...props 
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setError(false);

    // Create a tiny placeholder
    const tinyPlaceholder = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0 0 40 30"><rect width="100%" height="100%" fill="#f3f4f6"/></svg>'
    )}`;
    
    setCurrentSrc(tinyPlaceholder);

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
      setCurrentSrc("/placeholder.svg");
    };
  }, [src]);

  return (
    <div className="aspect-container">
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`
          ${className}
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          transition-opacity duration-300 ease-in-out
          ${error ? 'grayscale' : ''}
        `}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
    </div>
  );
};