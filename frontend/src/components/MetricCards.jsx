function MetricsCards({ metrics }) {

  if (!metrics || metrics.length === 0) {
    return null;
  }

  const latest = metrics[metrics.length - 1];

  return (

    <div className="grid grid-cols-3 gap-6 mb-8">

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-gray-500 text-sm">Likes</h3>
        <p className="text-3xl font-bold">{latest.likes}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-gray-500 text-sm">Comments</h3>
        <p className="text-3xl font-bold">{latest.comments}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-gray-500 text-sm">Shares</h3>
        <p className="text-3xl font-bold">{latest.shares}</p>
      </div>

    </div>

  );
}

export default MetricsCards;