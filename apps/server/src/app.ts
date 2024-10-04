import express, { Request, Response } from 'express';

const app = express();
const port = 5001;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DupMe server is up!' });
});

app.get('/login', (req: Request, res: Response) => {
  res.json({ message: 'pedo time and saygex' });
});

app.listen(port, () => {
  console.log(`[🎉DupMe] app listening on port ${port}`);
});
