
/* Reusable Component */
export const InfoRow = ({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) => (
  <div className="flex items-center justify-between py-4 border-b">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);
