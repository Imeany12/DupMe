import { Router } from 'express';

import {
  addMatch,
  addScore,
  addScoreAndMatch,
  resetScore,
  setScore,
} from '../controllers/score';

const router: Router = Router();

router.post('/:name/add-score-and-match', addScoreAndMatch);
router.post('/:name/add-score', addScore);
router.post('/:name/add-match', addMatch);
router.post('/:name/set-score', setScore);
router.post('/:name/reset', resetScore);

export default router;
