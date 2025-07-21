import { useState, useEffect, useCallback } from 'react';
import useApi from '../hooks/useApi';

const JobDetailsModal = ({ jobId, onClose }) => {
    const { getJob, loading, error } = useApi();
    const [job, setJob] = useState(null);

    const fetchJobDetails = useCallback(async () => {
        try {
            const response = await getJob(jobId);
            if (response.success) {
                setJob(response.job);
            }
        } catch (err) {
            console.error('Failed to fetch job details:', err);
        }
    }, [getJob, jobId]);

    useEffect(() => {
        if (jobId) {
            fetchJobDetails();
        }
    }, []);

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleString();
    };

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

    if (!jobId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Job Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading job details...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                            <div className="text-red-600 text-sm">Error: {error}</div>
                        </div>
                    )}

                    {job && !loading && (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job ID</label>
                                    <div className="text-sm text-gray-900 font-mono break-all">{job.id}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Started At</label>
                                    <div className="text-sm text-gray-900">{formatTimestamp(job.started_at)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Finished At</label>
                                    <div className="text-sm text-gray-900">{formatTimestamp(job.finished_at)}</div>
                                </div>
                            </div>

                            {/* Command */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Command</label>
                                <div className="bg-gray-50 border rounded-md p-3">
                                    <code className="text-sm text-gray-900 break-all">{job.command}</code>
                                </div>
                            </div>

                            {/* Output */}
                            {job.output_stdout && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Standard Output</label>
                                    <div className="bg-gray-50 border rounded-md p-3 max-h-64 overflow-y-auto overflow-x-auto custom-scrollbar">
                                        <pre className="text-sm text-gray-900 whitespace-pre-wrap">{job.output_stdout}</pre>
                                    </div>
                                </div>
                            )}

                            {/* Error Output */}
                            {job.output_stderr && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Error Output</label>
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-64 overflow-y-auto overflow-x-auto custom-scrollbar">
                                        <pre className="text-sm text-red-700 whitespace-pre-wrap">{job.output_stderr}</pre>
                                    </div>
                                </div>
                            )}

                            {/* Exit Code */}
                            {job.exit_code !== null && job.exit_code !== undefined && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Exit Code</label>
                                    <div className={`text-sm font-medium ${job.exit_code === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {job.exit_code}
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            {job.error && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Error Message</label>
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <div className="text-sm text-red-700">{job.error}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 sm:p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;
