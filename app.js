import express from 'express';
import helmet from "helmet";
import router from "./routes/index.js";  // Assuming router is correctly exported from index.js

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Use the router for handling requests to '/' 
app.use('/', router); // This will forward the requests to the `router` you imported

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
