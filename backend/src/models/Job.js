const { pool } = require('../config/database');

class Job {
  constructor(data) {
    this.id = data.id;
    this.command = data.command;
    this.status = data.status || 'pending';
    this.output_stdout = data.output_stdout;
    this.output_stderr = data.output_stderr;
    this.exit_code = data.exit_code;
    this.signal_code = data.signal_code;
    this.created_at = data.created_at;
    this.started_at = data.started_at;
    this.completed_at = data.completed_at;
    this.error_message = data.error_message;
  }

  // Create a new job entry
  static async create(jobData) {
    const { id, command } = jobData;
    const query = `
      INSERT INTO jobs (id, command, status, created_at)
      VALUES (?, ?, 'pending', NOW())
    `;
    
    try {
      const connection = await pool.getConnection();
      await connection.execute(query, [id, command]);
      connection.release();
      
      return await Job.findById(id);
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  // Find job by ID
  static async findById(id) {
    const query = 'SELECT * FROM jobs WHERE id = ?';
    
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(query, [id]);
      connection.release();
      
      if (rows.length === 0) {
        return null;
      }
      
      return new Job(rows[0]);
    } catch (error) {
      console.error('Error finding job by ID:', error);
      throw error;
    }
  }

  // Get all jobs with pagination
  static async findAll(limit = 50, offset = 0, status = null) {
    let query = 'SELECT * FROM jobs';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(query, params);
      connection.release();
      
      return rows.map(row => new Job(row));
    } catch (error) {
      console.error('Error finding all jobs:', error);
      throw error;
    }
  }

  // Update job status
  static async updateStatus(id, status, additionalData = {}) {
    const fields = ['status'];
    const values = [status];
    
    // Add timestamp based on status
    if (status === 'running') {
      fields.push('started_at');
      values.push(new Date());
    } else if (['completed', 'failed', 'cancelled'].includes(status)) {
      fields.push('completed_at');
      values.push(new Date());
    }
    
    // Add additional data if provided
    Object.keys(additionalData).forEach(key => {
      if (['output_stdout', 'output_stderr', 'exit_code', 'signal_code', 'error_message'].includes(key)) {
        fields.push(key);
        values.push(additionalData[key]);
      }
    });
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE jobs SET ${setClause} WHERE id = ?`;
    values.push(id);
    
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(query, values);
      connection.release();
      
      if (result.affectedRows === 0) {
        throw new Error('Job not found');
      }
      
      return await Job.findById(id);
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  }

  // Delete a job
  static async delete(id) {
    const query = 'DELETE FROM jobs WHERE id = ?';
    
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(query, [id]);
      connection.release();
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Get job statistics
  static async getStats() {
    const query = `
      SELECT 
        status,
        COUNT(*) as count
      FROM jobs 
      GROUP BY status
    `;
    
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(query);
      connection.release();
      
      const stats = {
        total: 0,
        pending: 0,
        running: 0,
        completed: 0,
        failed: 0,
        cancelled: 0
      };
      
      rows.forEach(row => {
        stats[row.status] = row.count;
        stats.total += row.count;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting job stats:', error);
      throw error;
    }
  }
}

module.exports = Job;
