# Remote Job Execution Backend

A Node.js/Express backend service for executing remote commands via SSH and maintaining job history in MySQL.

## Features

- Execute remote commands via SSH
- Job management with MySQL persistence
- Real-time job status tracking
- Job history and statistics
- Async command execution
- Command cancellation support

## Prerequisites

- Node.js 16+ 
- MySQL 8.0+
- SSH access to target server

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MySQL database:
```bash
mysql -u root -p < database/setup.sql
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# SSH Configuration
SSH_HOST=your_server_host
SSH_PORT=22
SSH_USERNAME=your_username
SSH_PRIVATE_KEY_FILE=your_private_key_filename

# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=remote_job_execution
```

## Database Schema

The application uses a `jobs` table with the following structure:

- `id` (VARCHAR): Unique job identifier
- `command` (TEXT): The command that was executed
- `status` (ENUM): pending, running, completed, failed, cancelled
- `output_stdout` (TEXT): Standard output from command
- `output_stderr` (TEXT): Standard error from command
- `exit_code` (INT): Command exit code
- `signal_code` (VARCHAR): Signal used for termination
- `created_at` (TIMESTAMP): Job creation time
- `started_at` (TIMESTAMP): Job start time
- `completed_at` (TIMESTAMP): Job completion time
- `error_message` (TEXT): Error details if job failed

## API Endpoints

### Execute Command
```
POST /api/execute
Body: { "command": "ls -la" }
Response: { "success": true, "jobId": "uuid", "status": "pending" }
```

### Cancel Command
```
POST /api/cancel
Body: { "jobId": "uuid" }
Response: { "success": true, "message": "Command cancelled" }
```

### Get Job Details
```
GET /api/jobs/:jobId
Response: { "success": true, "job": {...} }
```

### Get All Jobs
```
GET /api/jobs?limit=50&offset=0&status=completed
Response: { "success": true, "jobs": [...], "pagination": {...} }
```

### Get Job Statistics
```
GET /api/jobs-stats
Response: { "success": true, "stats": { "total": 100, "completed": 80, ... } }
```

### Delete Job
```
DELETE /api/jobs/:jobId
Response: { "success": true, "message": "Job deleted" }
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Job Lifecycle

1. **Created** - Job entry created in database with `pending` status
2. **Running** - Command execution starts, status updated to `running`
3. **Completed** - Command finishes successfully, status updated to `completed`
4. **Failed** - Command fails or errors occur, status updated to `failed`
5. **Cancelled** - Job cancelled by user, status updated to `cancelled`

## Error Handling

The application includes comprehensive error handling:
- Database connection errors
- SSH connection failures
- Command execution errors
- Job not found errors
- Validation errors

All errors are logged and returned with appropriate HTTP status codes.