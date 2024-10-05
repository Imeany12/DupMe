import { Request, Response, Router } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Login Page of DupMe!' });
});

export default router;
