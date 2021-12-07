import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./app";

const PORT = 4002;
const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
