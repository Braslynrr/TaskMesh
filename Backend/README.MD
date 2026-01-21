# Backend

**Local Base URL:** `http://localhost:5000`

## Requirements

- Node.js >= 20  
- MongoDB running locally or a connection URL in `.env`

## Configuration

Create a `.env` file with `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`:

```env
MONGO_URI=mongodb+srv://<User>:<DBMongoUrl>.mongodb.net/<DataBaseName>?appName=<ClusterName>
JWT_SECRET=<any_Secret-Value>
NODE_ENV=development
```

## Install dependencies:

npm ci

## Start the server in development mode:

npm run dev

## Build and start:

npm run build
npm start

## Tests:

npm test