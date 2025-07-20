import { useState } from 'react';
import useApi from './hooks/useApi';
import {
  CommandForm,
  ScriptForm,
  JobHistory,
  ConnectionStatus,
  ErrorAlert,
  LoadingSpinner
} from './components';
import { useEffect } from 'react';

function App() {
  const {
    loading,
    error,
    healthCheck,
    executeCommand,
    cancelCommand,
    clearError,
  } = useApi();

  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('command');
  const [isHealthy, setIsHealthy] = useState(false);

  useEffect(() => {
    healthCheck()
      .then(result => {
        setIsHealthy(result.status === 'OK' ? true : false);
      })
      .catch(err => {
        console.error('Health check failed:', err);
        setIsHealthy(false);
      });

    console.log('Health status:', isHealthy);
  }, [isHealthy]);

  // Handle command execution
  const handleExecuteCommand = async (command) => {
    const newJob = {
      command
    };

    setJobs(prev => [newJob, ...prev]);

    try {
      const result = await executeCommand(command);

      setJobs(prev => prev.map(job =>
        job.id === result.jobId
          ? { ...job, status: 'completed', result: result.result }
          : job
      ));
    } catch (e) {
      setJobs(prev => {
        const latestJob = prev[0];
        return [{ ...latestJob, status: 'failed', error: e.message }, ...prev.slice(1)];
      });

      console.error('Failed to execute command:', e);
    }
  };

  // Handle script execution
  const handleExecuteScript = async (script) => {
    // For scripts, we can execute them as a single command
    await handleExecuteCommand(script);
  };

  // Handle job cancellation
  const handleCancelJob = async (jobId) => {
    try {
      await cancelCommand(jobId);
      setJobs(prev => prev.map(job =>
        job.id === jobId
          ? { ...job, status: 'cancelled' }
          : job
      ));
    } catch (err) {
      console.error('Failed to cancel job:', err);
    }
  };

  // Clear job history
  const handleClearHistory = () => {
    setJobs([]);
  };

  // Handle health check
  const handleHealthCheck = async () => {
    try {
      const result = await healthCheck();
      alert(`Server Status: ${result.status} - ${result.message}`);

    } catch (err) {
      alert(`Health Check Failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Remote Job Execution System
            </h1>
            <div className="text-sm text-gray-500">
              Execute commands and scripts on remote servers
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        <ErrorAlert error={error} onDismiss={clearError} />

        {/* Loading Spinner */}
        {loading && <LoadingSpinner message="Processing request..." />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('command')}
                    className={`py-3 px-6 border-b-2 font-medium text-sm ${activeTab === 'command'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Single Command
                  </button>
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`py-3 px-6 border-b-2 font-medium text-sm ${activeTab === 'script'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Script Execution
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'command' ? (
                  <CommandForm
                    onExecuteCommand={handleExecuteCommand}
                    loading={loading}
                  />
                ) : (
                  <ScriptForm
                    onExecuteScript={handleExecuteScript}
                    loading={loading}
                  />
                )}
              </div>
            </div>

            {/* Job History */}
            <JobHistory
              jobs={jobs}
              onCancelJob={handleCancelJob}
              onClearHistory={handleClearHistory}
            />
          </div>

          {/* Right Column - Health Status */}
          <div className="space-y-6">
            <ConnectionStatus
              status={isHealthy}
              onHealthCheck={handleHealthCheck}
            />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Jobs:</span>
                  <span className="font-medium">{jobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Running:</span>
                  <span className="font-medium text-yellow-600">
                    {jobs.filter(job => job.status === 'running').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">
                    {jobs.filter(job => job.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Failed:</span>
                  <span className="font-medium text-red-600">
                    {jobs.filter(job => job.status === 'failed').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
