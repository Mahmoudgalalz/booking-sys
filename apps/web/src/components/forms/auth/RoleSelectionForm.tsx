interface RoleSelectionFormProps {
  onRoleSelect: (roleId: number) => void;
}

export function RoleSelectionForm({ onRoleSelect }: RoleSelectionFormProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold">Choose your account type</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => onRoleSelect(1)}
          className="p-6 border rounded-lg hover:bg-gray-100 flex flex-col items-center"
        >
          <span className="text-xl font-semibold">User</span>
          <p className="text-sm text-gray-600 mt-2">Book services from providers</p>
        </button>
        <button
          onClick={() => onRoleSelect(2)}
          className="p-6 border rounded-lg hover:bg-gray-100 flex flex-col items-center"
        >
          <span className="text-xl font-semibold">Provider</span>
          <p className="text-sm text-gray-600 mt-2">Offer services to users</p>
        </button>
      </div>
    </div>
  );
}
