const JobHistory = ({ jobs, onCancelJob, onClearHistory }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'running':
                return 'text-yellow-600 bg-yellow-100';
            case 'cancelled':
                return 'text-red-600 bg-red-100';
            case 'failed':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Job History</h2>
                {jobs.length > 0 && (
                    <button
                        onClick={onClearHistory}
                        className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Clear History
                    </button>
                )}
            </div>

            {jobs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No jobs executed yet</p>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {jobs.map((job) => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-800">{job.id}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                                        {job.command}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatTimestamp(job.timestamp)}
                                    </p>
                                </div>

                                {job.status === 'running' && (
                                    <button
                                        onClick={() => onCancelJob(job.id)}
                                        className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            {job.result && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                    <div className="text-xs text-gray-600 mb-1">Output:</div>
                                    {job.result.stdout && (
                                        <pre className="text-sm text-gray-800 whitespace-pre-wrap mb-2 max-h-32 overflow-y-auto">
                                            {job.result.stdout}
                                        </pre>
                                    )}
                                    {job.result.stderr && (
                                        <pre className="text-sm text-red-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                                            {job.result.stderr}
                                        </pre>
                                    )}
                                    <div className="text-xs text-gray-500 mt-1">
                                        Exit code: {job.result.code}
                                    </div>
                                </div>
                            )}

                            {job.error && (
                                <div className="mt-3 p-3 bg-red-50 rounded-md">
                                    <div className="text-xs text-red-600 mb-1">Error:</div>
                                    <p className="text-sm text-red-700">{job.error}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobHistory;
