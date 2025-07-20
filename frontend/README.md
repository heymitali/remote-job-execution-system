# Remote Job Execution Frontend

A modern React frontend for executing commands and scripts on remote servers via SSH.

## Features

- **Command Execution**: Execute single commands on remote servers
- **Script Execution**: Run multi-line scripts with preset templates
- **Real-time Job Monitoring**: Track job status and view outputs
- **Connection Management**: Monitor SSH connection status
- **Job History**: View complete history of executed jobs
- **Error Handling**: Comprehensive error display and management

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CommandForm.jsx   # Single command execution form
│   ├── ScriptForm.jsx    # Script execution form with presets
│   ├── JobHistory.jsx    # Job history and results display
│   ├── ConnectionStatus.jsx # SSH connection status
│   ├── ErrorAlert.jsx    # Error message display
│   ├── LoadingSpinner.jsx # Loading indicator
│   └── index.js         # Component exports
├── hooks/               # Custom React hooks
│   └── useApi.js        # API interaction hook
├── services/           # API services
│   └── apiService.js   # Backend API calls
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions and constants
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## Available Scripts

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Usage

1. Start the backend server
2. Run the frontend with `npm run dev`
3. Open your browser to the displayed URL
4. Use the interface to execute commands and monitor jobs