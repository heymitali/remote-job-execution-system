const ScriptForm = ({ onExecuteScript, loading }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const script = formData.get('script');

        if (script) {
            // Split script into multiple commands and execute them as a single command
            const command = script.trim();
            onExecuteScript(command);
            e.target.reset();
        }
    };

    const commonScripts = [
        {
            name: "System Info",
            script: "uname -a && echo '---' && whoami && echo '---' && date"
        },
        {
            name: "Disk Usage",
            script: "df -h && echo '---' && du -sh /home/* 2>/dev/null | head -10"
        },
        {
            name: "Process List",
            script: "ps aux | head -20"
        },
        {
            name: "Network Info",
            script: "ifconfig && echo '---' && netstat -tuln | head -10"
        },
        {
            name: "Memory Usage",
            script: "free -h && echo '---' && top -n 1 -b | head -5"
        }
    ];

    const handlePresetClick = (script) => {
        document.getElementById('script').value = script;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Execute Script</h2>

            {/* Preset Scripts */}
            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Scripts:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {commonScripts.map((preset, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handlePresetClick(preset.script)}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 truncate"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="script" className="block text-sm font-medium text-gray-700 mb-2">
                        Script / Multi-line Command
                    </label>
                    <textarea
                        name="script"
                        id="script"
                        rows="6"
                        placeholder="Enter script or multiple commands (each line will be executed sequentially)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Executing Script...' : 'Execute Script'}
                </button>
            </form>
        </div>
    );
};

export default ScriptForm;
