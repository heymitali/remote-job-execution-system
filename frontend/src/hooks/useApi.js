import { useState } from 'react';
import ApiService from '../services/apiService';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Execute command
  const executeCommand = async (command) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ApiService.executeCommand(command);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel command
  const cancelCommand = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ApiService.cancelCommand(jobId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all jobs
  const getJobs = async (limit = 50, offset = 0, status = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ApiService.getJobs(limit, offset, status);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single job
  const getJob = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ApiService.getJob(jobId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get job statistics
  const getJobStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ApiService.getJobStats();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const deleteJob = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ApiService.deleteJob(jobId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Health check
  const healthCheck = async () => {
    try {
      const result = await ApiService.healthCheck();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    executeCommand,
    cancelCommand,
    getJobs,
    getJob,
    getJobStats,
    deleteJob,
    healthCheck,
    clearError,
  };
};

export default useApi;
