import { useState } from 'react';

const JobFilters = ({ onFilterChange, onSearchChange }) => {
    const [status, setStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        onFilterChange(newStatus);
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearchChange(term);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="running">Running</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Search */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Commands
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by command, job ID..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                </div>

                {/* Clear Filters */}
                {(status || searchTerm) && (
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setStatus('');
                                setSearchTerm('');
                                onFilterChange('');
                                onSearchChange('');
                            }}
                            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobFilters;
