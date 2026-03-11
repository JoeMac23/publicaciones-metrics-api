import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function MetricsChart({ metrics }) {

  if (!metrics || metrics.length === 0) {
    return <p>No metrics available</p>;
  }

  return (

    <div className="bg-white shadow-md rounded-lg p-6 mt-8">

      <h2 className="text-2xl font-semibold mb-4">
        Metrics
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={metrics}>

          <XAxis dataKey="recorded_at" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="likes" />
          <Bar dataKey="comments" />
          <Bar dataKey="shares" />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}

export default MetricsChart;