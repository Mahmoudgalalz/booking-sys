interface SignupCompleteProps {
  onContinue?: () => void;
}

export function SignupComplete({ onContinue }: SignupCompleteProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Registration Complete!</h2>
      <p className="mb-6">Your account has been successfully created.</p>
      <a
        href="/"
        onClick={(e) => {
          if (onContinue) {
            e.preventDefault();
            onContinue();
          }
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
