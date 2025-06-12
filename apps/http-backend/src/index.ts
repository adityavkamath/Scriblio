import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("HTTP Backend is running!");
});

app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});
