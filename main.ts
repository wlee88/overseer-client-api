import express from "express";
import { requestMedia } from "./helpers.ts";

const app = express();

app.get("/", async (req, res) => {
  const { search } = req.query;

  if (search) {
    const result = await requestMedia(search);
    return res.send({ result });
  } else {
    console.log("No search query param specified");
    res.send({ error: "No search query param specified" });
  }
});

app.listen(8000);
console.log(`Server is running on http://localhost:8000`);
