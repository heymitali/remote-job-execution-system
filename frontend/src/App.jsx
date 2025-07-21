import { useState, useEffect, useCallback } from 'react';
import useApi from './hooks/useApi';
import {
  CommandForm,
  ScriptForm,
  JobHistory,
  ConnectionStatus,
  ErrorAlert,
  LoadingSpinner,
  JobDetailsModal,
  JobFilters
} from './components';

function App() {
  const {
    loading,
    error,
    healthCheck,
    executeCommand,
    cancelCommand,
    getJobs,
    getJobStats,
    deleteJob,
    clearError,
  } = useApi();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobStats, setJobStats] = useState(null);
  const [activeTab, setActiveTab] = useState('command');
  const [isHealthy, setIsHealthy] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    searchTerm: ''
  });
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    hasMore: true
  });

  // Filter jobs based on status and search term
  useEffect(() => {
    let filtered = jobs;

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(job => job.status === filters.status);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(job =>
        job.command.toLowerCase().includes(searchLower) ||
        job.id.toLowerCase().includes(searchLower)
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);
  // 

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  // Handle search change
  const handleSearchChange = (searchTerm) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  // Fetch jobs from the API
  const fetchJobs = useCallback(async (limit = 50, offset = 0, status = null) => {
    try {
      const response = await getJobs(limit, offset, status);
      if (response.success) {
        if (offset === 0) {
          setJobs(response.jobs);
        } else {
          setJobs(prev => [...prev, ...response.jobs]);
        }
        setPagination(prev => ({
          ...prev,
          hasMore: response.jobs.length === limit
        }));
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  }, [getJobs]);

  // Fetch job statistics
  const fetchJobStats = useCallback(async () => {
    try {
      const response = await getJobStats();
      if (response.success) {
        setJobStats(response.stats);
      }
    } catch (err) {
      console.error('Failed to fetch job stats:', err);
    }
  }, [getJobStats]);

  // Polling every 5 seconds for health, jobs, and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const health = await healthCheck();
        setIsHealthy(health.status === 'OK');
      } catch (err) {
        console.error('Health check failed:', err);
        setIsHealthy(false);
      }

      // Fetch jobs and stats
      await fetchJobs();
      await fetchJobStats();
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);


  // Handle command execution
  const handleExecuteCommand = async (command) => {
    try {
      const result = await executeCommand(command);
      if (result.success) {
        await fetchJobs();
        return result;
      }
    } catch (e) {
      console.error('Failed to execute command:', e);
      throw e;
    }
  };

  // Handle script execution
  const handleExecuteScript = async (script) => {
    // For scripts, we can execute them as a single command
    return await handleExecuteCommand(script);
  };

  // Handle job cancellation
  const handleCancelJob = async (jobId) => {
    try {
      const result = await cancelCommand(jobId);
      if (result.success) {
        await fetchJobs();
      }
      return result;
    } catch (err) {
      console.error('Failed to cancel job:', err);
      throw err;
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    try {
      const result = await deleteJob(jobId);
      if (result.success) {
        // Remove job from local state
        setJobs(prev => prev.filter(job => job.id !== jobId));
        // Refresh stats
        await fetchJobStats();
      }
      return result;
    } catch (err) {
      console.error('Failed to delete job:', err);
      throw err;
    }
  };

  // Load more jobs (pagination)
  const handleLoadMore = async () => {
    const newOffset = pagination.offset + pagination.limit;
    setPagination(prev => ({ ...prev, offset: newOffset }));
    await fetchJobs(pagination.limit, newOffset);
  };

  // Handle viewing job details
  const handleViewJobDetails = (jobId) => {
    setSelectedJobId(jobId);
  };

  // Close job details modal
  const handleCloseJobDetails = () => {
    setSelectedJobId(null);
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="xl:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('command')}
                    className={`py-3 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'command'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Single Command
                  </button>
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`py-3 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'script'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Script Execution
                  </button>
                </nav>
              </div>

              <div className="p-4 sm:p-6">
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

            {/* Job Filters */}
            <JobFilters
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
            />

            {/* Job History */}
            <JobHistory
              jobs={filteredJobs}
              onCancelJob={handleCancelJob}
              onDeleteJob={handleDeleteJob}
              onLoadMore={pagination.hasMore ? handleLoadMore : null}
              onViewDetails={handleViewJobDetails}
              loading={loading}
            />
          </div>

          {/* Right Column - Health Status */}
          <div className="space-y-6">
            <ConnectionStatus
              status={isHealthy}
              onHealthCheck={handleHealthCheck}
            />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Jobs:</span>
                  <span className="font-medium">{jobStats?.total ?? jobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-medium text-blue-600">
                    {jobStats?.pending ?? jobs.filter(job => job.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Running:</span>
                  <span className="font-medium text-yellow-600">
                    {jobStats?.running ?? jobs.filter(job => job.status === 'running').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">
                    {jobStats?.completed ?? jobs.filter(job => job.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Failed:</span>
                  <span className="font-medium text-red-600">
                    {jobStats?.failed ?? jobs.filter(job => job.status === 'failed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled:</span>
                  <span className="font-medium text-red-600">
                    {jobStats?.cancelled ?? jobs.filter(job => job.status === 'cancelled').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJobId && (
        <JobDetailsModal
          jobId={selectedJobId}
          onClose={handleCloseJobDetails}
        />
      )}
    </div>
  );
}

export default App;
