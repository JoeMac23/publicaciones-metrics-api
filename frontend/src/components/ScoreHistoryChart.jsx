import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const ScoreHistoryChart = ({ history }) => {

  if (!history || history.length === 0) {
    return <p className="mt-6 text-gray-500">No score history available</p>;
  }

  const formattedData = history.map((item) => ({
    date: new Date(item.created_at).toLocaleDateString(),
    score: item.score
  }));

  return (

    <div className="bg-white shadow-md rounded-lg p-6 mt-6">

      <h2 className="text-xl font-semibold mb-4">
        Score Evolution
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={formattedData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

};

export default ScoreHistoryChart;