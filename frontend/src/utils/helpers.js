// Utility functions for the application

// Generate unique job ID
export const generateJobId = (prefix = 'job') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

// Format command output for display
export const formatOutput = (output) => {
  if (!output) return '';
  return output.trim();
};

// Check if job is still running
export const isJobRunning = (job) => {
  return job.status === 'running';
};

// Get job status color class
export const getJobStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'running':
      return 'text-yellow-600 bg-yellow-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    case 'failed':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Common script templates
export const scriptTemplates = {
  systemInfo: {
    name: "System Info",
    script: "uname -a && echo '---' && whoami && echo '---' && date"
  },
  diskUsage: {
    name: "Disk Usage",
    script: "df -h && echo '---' && du -sh /home/* 2>/dev/null | head -10"
  },
  processList: {
    name: "Process List",
    script: "ps aux | head -20"
  },
  networkInfo: {
    name: "Network Info",
    script: "ifconfig && echo '---' && netstat -tuln | head -10"
  },
  memoryUsage: {
    name: "Memory Usage",
    script: "free -h && echo '---' && top -n 1 -b | head -5"
  },
  logFiles: {
    name: "Recent Logs",
    script: "find /var/log -name '*.log' -type f -exec ls -la {} \\; | head -10"
  }
};

// Validate job ID format
export const validateJobId = (jobId) => {
  if (!jobId || typeof jobId !== 'string') {
    return false;
  }
  
  // Job ID should be non-empty and contain only alphanumeric characters, hyphens, and underscores
  return /^[a-zA-Z0-9_-]+$/.test(jobId) && jobId.length >= 3 && jobId.length <= 50;
};

// Validate command
export const validateCommand = (command) => {
  if (!command || typeof command !== 'string') {
    return false;
  }
  
  // Command should be non-empty after trimming
  return command.trim().length > 0;
};
