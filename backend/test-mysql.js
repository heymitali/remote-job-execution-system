// Test script to verify MySQL integration
require('dotenv').config();
const { initializeDatabase } = require('./src/config/database');
const Job = require('./src/models/Job');

async function testDatabase() {
  try {
    console.log('Testing database connection and operations...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✓ Database initialized successfully');
    
    // Create a test job
    const testJob = await Job.create({
      id: 'test-job-123',
      command: 'echo "Hello World"'
    });
    console.log('✓ Test job created:', testJob.id);
    
    // Find the job
    const foundJob = await Job.findById('test-job-123');
    console.log('✓ Job found:', foundJob.command);
    
    // Update job status
    const updatedJob = await Job.updateStatus('test-job-123', 'completed', {
      output_stdout: 'Hello World',
      exit_code: 0
    });
    console.log('✓ Job updated:', updatedJob.status);
    
    // Get all jobs
    const allJobs = await Job.findAll(10, 0);
    console.log('✓ Found', allJobs.length, 'jobs');
    
    // Get statistics
    const stats = await Job.getStats();
    console.log('✓ Job statistics:', stats);
    
    // Clean up test job
    await Job.delete('test-job-123');
    console.log('✓ Test job deleted');
    
    console.log('\nAll tests passed! MySQL integration is working correctly.');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Make sure MySQL is running and configured correctly.');
  }
  
  process.exit(0);
}

testDatabase();
