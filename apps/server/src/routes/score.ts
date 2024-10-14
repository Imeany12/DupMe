import { Router } from 'express';

import {
  addScore,
  addScoreAndMatch,
  resetScore,
  setScore,
} from '../controllers/score';

const router: Router = Router();

router.post('/:username/add-score-and-match', addScoreAndMatch);
router.post('/:username/add', addScore);
router.post('/:username/update', setScore);
router.post('/:username/reset', resetScore);

export default router;
