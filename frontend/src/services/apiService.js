// API service for remote job execution
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  // Execute a command
  static async executeCommand(command) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/commands/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Execute command error:', error);
      throw error;
    }
  }

  // Cancel a command
  static async cancelCommand(jobId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/commands/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: jobId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel command error:', error);
      throw error;
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  // Get all jobs with pagination and filtering
  static async getJobs(limit = 50, offset = 0, status = null) {
    try {
      let url = `${API_BASE_URL}/api/jobs?limit=${limit}&offset=${offset}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get jobs error:', error);
      throw error;
    }
  }

  // Get single job
  static async getJob(jobId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get job error:', error);
      throw error;
    }
  }

  // Get job statistics
  static async getJobStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get job stats error:', error);
      throw error;
    }
  }

  // Delete a job
  static async deleteJob(jobId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete job error:', error);
      throw error;
    }
  }
}

export default ApiService;
