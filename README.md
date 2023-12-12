# Learning System Management (LMS) Project

This README outlines the details on how to set up and run the project on your local machine. But since this project depends on enviormnet variables, you will need to contact me to get the .env file to run the project.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (Preferably the latest stable version)
- npm (Node Package Manager), which typically comes with Node.js
- Git (Version Control System)

## Installation

To install the project, follow these steps:

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/NabilHadi/lms
   ```
2. Navigate to the project directory:
   ```
   cd lms
   ```
3. Install the necessary packages and dependencies:
   ```
   npm install
   ```

## Running the Project

Once the installation is complete, you can run the project locally:

1. Start the development server:
   ```
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3000` to view the project.

## Building for Production

To build the project for production, use the following command:

```
npm run build
```

This command creates an optimized production build of your application. After building, the `start` script will start a Node.js server that supports hybrid pages, serving both statically generated and server-side rendered pages.

## Additional Scripts

- `npm run start`: Starts the application in production mode. The application should be compiled with `npm run build` first.
- `npm run lint`: Runs ESLint for code quality checks.

## Support

For support or any questions, please reach out to me.
