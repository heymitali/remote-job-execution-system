const CommandForm = ({ onExecuteCommand, loading }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const command = formData.get('command');

        if (command) {
            onExecuteCommand(command);
            e.target.reset();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Execute Command</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="command" className="block text-sm font-medium text-gray-700 mb-2">
                        Command
                    </label>
                    <input
                        type="text"
                        name="command"
                        id="command"
                        placeholder="Enter command to execute (e.g., ls -la)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Executing...' : 'Execute Command'}
                </button>
            </form>
        </div>
    );
};

export default CommandForm;
