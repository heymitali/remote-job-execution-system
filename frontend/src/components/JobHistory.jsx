const JobHistory = ({ jobs, onCancelJob, onDeleteJob, onClearHistory, onLoadMore, onViewDetails, loading }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'running':
                return 'text-yellow-600 bg-yellow-100';
            case 'pending':
                return 'text-blue-600 bg-blue-100';
            case 'cancelled':
                return 'text-red-600 bg-red-100';
            case 'failed':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleString();
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            try {
                await onDeleteJob(jobId);
            } catch (error) {
                alert('Failed to delete job: ' + error.message);
            }
        }
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
                <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {jobs.map((job) => (
                            <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-800 text-sm">{job.id}</span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                                            {job.command}
                                        </p>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-gray-500">
                                                Started: {formatTimestamp(job.started_at)}
                                            </p>
                                            {job.finished_at && (
                                                <p className="text-xs text-gray-500">
                                                    Finished: {formatTimestamp(job.finished_at)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-2">
                                        <button
                                            onClick={() => onViewDetails(job.id)}
                                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            View Details
                                        </button>
                                        {job.status === 'running' && (
                                            <button
                                                onClick={() => onCancelJob(job.id)}
                                                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {job.output_stdout && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                        <div className="text-xs text-gray-600 mb-1">Output:</div>
                                        <pre className="text-sm text-gray-800 whitespace-pre-wrap mb-2 max-h-32 overflow-y-auto">
                                            {job.output_stdout}
                                        </pre>
                                    </div>
                                )}

                                {job.output_stderr && (
                                    <div className="mt-3 p-3 bg-red-50 rounded-md">
                                        <div className="text-xs text-red-600 mb-1">Error Output:</div>
                                        <pre className="text-sm text-red-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                                            {job.output_stderr}
                                        </pre>
                                    </div>
                                )}

                                {job.exit_code !== null && job.exit_code !== undefined && (
                                    <div className="mt-2">
                                        <div className="text-xs text-gray-500">
                                            Exit code: <span className={job.exit_code === 0 ? 'text-green-600' : 'text-red-600'}>{job.exit_code}</span>
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

                    {/* Load More Button */}
                    {onLoadMore && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={onLoadMore}
                                disabled={loading}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobHistory;
