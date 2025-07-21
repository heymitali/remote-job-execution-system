-- Database Setup Script for Remote Job Execution System
-- Run this script in your MySQL server to create the database

CREATE DATABASE IF NOT EXISTS remote_job_execution 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE remote_job_execution;

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(36) PRIMARY KEY,
  command TEXT NOT NULL,
  status ENUM('pending', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  output_stdout TEXT,
  output_stderr TEXT,
  exit_code INT,
  signal_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  error_message TEXT,
  
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_status_created (status, created_at)
);

-- Create a view for job summary statistics
CREATE OR REPLACE VIEW job_summary AS
SELECT 
  status,
  COUNT(*) as count,
  AVG(TIMESTAMPDIFF(SECOND, started_at, completed_at)) as avg_duration_seconds
FROM jobs 
WHERE started_at IS NOT NULL
GROUP BY status;

SHOW TABLES;
DESCRIBE jobs;
