interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-100 border-l-4 border-pokemon-red text-red-700 p-4 rounded-lg shadow-md" role="alert">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Error</p>
          <p>{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-pokemon-red text-white px-4 py-2 rounded hover:bg-pokemon-dark-red transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}