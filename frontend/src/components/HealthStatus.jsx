const ConnectionStatus = ({ status, onHealthCheck }) => {
    const getStatusColor = () => {
        if (!status) return 'text-gray-600 bg-gray-100';
        return status ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
    };

    const getStatusText = () => {
        if (!status) return 'Unknown';
        return status ? 'Connected' : 'Disconnected';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Connection Status</h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor()}`}>
                            {getStatusText()}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onHealthCheck}
                        className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        Health Check
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectionStatus;
