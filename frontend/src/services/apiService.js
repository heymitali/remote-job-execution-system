// API service for remote job execution
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  // Execute a command
  static async executeCommand(jobId, command) {
    try {
      const response = await fetch(`${API_BASE_URL}/commands/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
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
      const response = await fetch(`${API_BASE_URL}/commands/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
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
      const response = await fetch('http://localhost:3000/health');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

export default ApiService;
