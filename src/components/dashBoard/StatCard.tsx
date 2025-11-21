import { Link } from "react-router-dom";
import  type { StatCardProps } from "../../types";
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  link,
}) => {
  return (
    <Link to={link} className="block">
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition cursor-pointer">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color} mr-4`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {Number(value ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};