import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const N8N_URL = process.env.N8N_URL || "http://n8n:5678";

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));
app.use(express.static("public"));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  const requestId = (req.headers["x-request-id"] as string) || uuidv4();

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded", requestId });
  }

  try {
  const arrayBuffer = req.file.buffer.buffer.slice(
    req.file.buffer.byteOffset,
    req.file.buffer.byteOffset + req.file.buffer.byteLength
  ) as ArrayBuffer;

  const blob = new Blob([arrayBuffer], { type: req.file.mimetype });

  const form = new FormData();
  form.append("image", blob, req.file.originalname || "upload");
  form.append("requestId", requestId);

const resp = await fetch(`${N8N_URL}/webhook/test`, {
  method: "POST",
  body: form as any,
});

  const text = await resp.text();
  const contentType = resp.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? JSON.parse(text || "{}")
    : { raw: text };

  res.status(resp.status).json(payload);
} catch (err) {
  console.error("Error analyzing image:", err);
  res.status(502).json({ error: "Failed to analyze image", requestId });
}

});


app.listen(PORT, () => {
  console.log(`Express listening on http://0.0.0.0:${PORT}`);
});
