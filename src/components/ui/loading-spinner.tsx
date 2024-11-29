interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Chargement..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <div className="mt-4 text-gray-600 text-center">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-gray-500 mt-1">Veuillez patienter...</p>
      </div>
    </div>
  );
};