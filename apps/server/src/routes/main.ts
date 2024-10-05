import { Request, Response, Router } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to main route of DupMe!' });
});

export default router;
