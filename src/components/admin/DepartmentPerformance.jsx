import { useSelector } from "react-redux";
import { FcDepartment } from "react-icons/fc";

const DepartmentPerformance = () => {
  const { allComplaints = [] } = useSelector(
    (state) => state.complaint
  );

  // Group complaints by department
  const departmentStats = allComplaints.reduce((acc, complaint) => {
    const name = complaint.department?.name || "Unassigned";

    if (!acc[name]) {
      acc[name] = {
        name,
        total: 0,
        resolved: 0,
      };
    }

    acc[name].total++;

    if (complaint.status?.toLowerCase() === "resolved") {
      acc[name].resolved++;
    }

    return acc;
  }, {});

  const departments = Object.values(departmentStats).sort(
    (a, b) => b.total - a.total
  );

  return (
    <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Department Performance
      </h2>

      {departments.length > 0 ? (
        <div className="space-y-5">
          {departments.map((dept) => {
            const percentage =
              dept.total > 0
                ? Math.round((dept.resolved / dept.total) * 100)
                : 0;

            return (
              <div key={dept.name}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FcDepartment size={22} />
                    <span className="font-medium text-slate-700">
                      {dept.name}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    {dept.resolved}/{dept.total}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-end mt-1">
                  <span className="text-xs text-slate-500">
                    {percentage}% Resolved
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-500">
          No department data available.
        </div>
      )}
    </div>
  );
};

export default DepartmentPerformance;