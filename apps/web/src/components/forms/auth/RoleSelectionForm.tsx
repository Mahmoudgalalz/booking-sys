interface RoleSelectionFormProps {
  onRoleSelect: (roleId: number) => void;
}

export function RoleSelectionForm({ onRoleSelect }: RoleSelectionFormProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold text-indigo-800">Choose your account type</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => onRoleSelect(1)}
          className="p-6 border border-indigo-200 rounded-lg hover:bg-indigo-50 flex flex-col items-center transition-colors"
        >
          <span className="text-xl font-semibold text-indigo-700">User</span>
          <p className="text-sm text-gray-600 mt-2">Book services from providers</p>
        </button>
        <button
          onClick={() => onRoleSelect(2)}
          className="p-6 border border-indigo-200 rounded-lg hover:bg-indigo-50 flex flex-col items-center transition-colors"
        >
          <span className="text-xl font-semibold text-indigo-700">Provider</span>
          <p className="text-sm text-gray-600 mt-2">Offer services to users</p>
        </button>
      </div>
    </div>
  );
}
