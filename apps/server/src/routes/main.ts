import { Request, Response, Router } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to main route of DupMe!' });
});

router.get('/admin', (req: Request, res: Response) => {
  res.render('./index.html', { root: __dirname });
});

export default router;
