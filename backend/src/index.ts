import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import Papa from 'papaparse';

const app = express();
const PORT = 8080;

// Can hold any shape of data from CSV
const datasets: { [id: string]: Record<string, unknown>[] } = {};
let nextId = 0;

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post(
  '/api/datasets/upload',
  upload.single('file'),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }

    const csvString = req.file.buffer.toString('utf-8');

    const result = Papa.parse<Record<string, unknown>>(csvString, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      res
        .status(400)
        .json({ error: 'Error parsing CSV file.', details: result.errors });
      return;
    }

    const id = (nextId++).toString();
    datasets[id] = result.data;

    res.status(201).json({ id });
  },
);

app.get('/api/datasets/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const dataset = datasets[id];

  if (!dataset) {
    res.status(404).json({ error: 'Dataset not found.' });
    return;
  }

  res.status(200).json(dataset);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
