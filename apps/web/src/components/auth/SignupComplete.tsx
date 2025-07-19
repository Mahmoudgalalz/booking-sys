interface SignupCompleteProps {
  onContinue?: () => void;
}

export function SignupComplete({ onContinue }: SignupCompleteProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">Registration Complete!</h2>
      <p className="mb-6 text-gray-700">Your account has been successfully created.</p>
      <a
        href="/"
        onClick={(e) => {
          if (onContinue) {
            e.preventDefault();
            onContinue();
          }
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-block transition-colors"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
