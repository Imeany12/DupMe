import { Router } from 'express';

import {
  addMatch,
  addScore,
  addScoreAndMatch,
  resetScore,
  setScore,
} from '../controllers/score';

const router: Router = Router();

router.post('/:username/add-score-and-match', addScoreAndMatch);
router.post('/:username/add-score', addScore);
router.post('/:username/add-match', addMatch);
router.post('/:username/set-score', setScore);
router.post('/:username/reset', resetScore);

export default router;
