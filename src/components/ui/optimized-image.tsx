import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  loadingClassName,
  priority = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
    setIsLoading(!priority);
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    setCurrentSrc("/placeholder.svg");
  };

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton 
          className={cn(
            "absolute inset-0 bg-cuba-warmBeige/20",
            loadingClassName
          )} 
        />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          error ? "grayscale" : "",
          className
        )}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};