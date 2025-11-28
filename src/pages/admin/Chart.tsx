import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJs, Tooltip, Legend, ArcElement } from "chart.js";
import { api } from "../../congif/api";

ChartJs.register(Tooltip, Legend, ArcElement);

interface BorrowStatusItem {
  _id: string;
  count: number;
}

const BorrowStatusPieChart = () => {
  const [borrowData, setBorrowData] = useState<BorrowStatusItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/chart");
        const borrowStatus: BorrowStatusItem[] =
          res.data.chartData.borrowStatusCount;
        setBorrowData(borrowStatus);
      } catch (err) {
        console.log("Error:", err);
      }
    };
    fetchData();
  }, []);

  const colors = [
    "rgba(59, 130, 246, 0.9)",
    "rgba(16, 185, 129, 0.9)",
    "rgba(245, 158, 11, 0.9)",
  ];

  const data = {
    labels: borrowData.map((item) => item._id),
    datasets: [
      {
        label: "Borrow Status",
        data: borrowData.map((item) => item.count),
        backgroundColor: colors,
        borderColor: "#ffffff",
        cutout: "50%",
      },
    ],
  };

  const totalcount = borrowData.reduce((sum, i) => sum + i.count, 0);
  const centerTextPlugin = {
    id: "centerText",
    beforeDatasetsDraw(chart: any) {
      const { ctx } = chart;
      ctx.save();
      const x = chart.getDatasetMeta(0).data[0]?.x;
      const y = chart.getDatasetMeta(0).data[0]?.y;

      if (x && y) {
        ctx.font = "bold 25px Inter, sans-serif";
        ctx.fillStyle = "#0951ecff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(totalcount.toLocaleString(), x, y);
      }
      ctx.restore();
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      <h3 className="text-base font-bold mb-3 text-center">Today Borrow Status</h3>

      {borrowData.length > 0 ? (
        <div className="mx-auto flex justify-center h-70 w-75">
          <Doughnut data={data} plugins={[centerTextPlugin]} />
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">No Data</p>
      )}

      <div className="mt-4 space-y-2">
        {borrowData.map((item, index) => {
          const percentage = ((item.count / totalcount) * 100).toFixed(1);

          return (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center truncate">
                <div
                  className="w-3 h-3 rounded mr-2 flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>

                <span
                  className="truncate text-gray-700 capitalize"
                  title={item._id}
                >
                  {item._id}
                </span>
              </div>

              <div className="text-right flex-shrink-0 ml-2">
                <span className="font-medium text-gray-900 text-xs">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between items-center text-xs">
        <div className="text-center">
          <div className="font-semibold text-gray-900">{borrowData.length}</div>
          <div className="text-gray-500">Categories</div>
        </div>

        <div className="text-center">
          <div className="font-semibold text-gray-900">
            {totalcount.toLocaleString()}
          </div>
          <div className="text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

export default BorrowStatusPieChart;
