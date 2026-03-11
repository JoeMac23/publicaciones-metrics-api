function AnalysisHistory({ history }) {

  if (!history || history.length === 0) {
    return <p>No analysis history</p>;
  }

  return (

    <div className="bg-white shadow-md rounded-lg p-6 mt-8">

      <h2 className="text-2xl font-semibold mb-4">
        Analysis History
      </h2>

      <table className="w-full border-collapse">

        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Score</th>
            <th className="p-3">Created At</th>
          </tr>
        </thead>

        <tbody>

          {history.map((item, index) => (

            <tr key={index} className="border-t">

              <td className="p-3">{item.score}</td>
              <td className="p-3">{item.created_at}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default AnalysisHistory;