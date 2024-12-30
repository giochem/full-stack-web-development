import app from "./src/app.js";
import { configEnv } from "./src/configEnv.js";
const PORT = configEnv.port;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
