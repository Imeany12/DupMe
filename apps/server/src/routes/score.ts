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
router.post('/:username/addScore', addScore);
router.post('/:username/addMatch', addMatch);
router.post('/:username/updateScore', setScore);
router.post('/:username/resetScore', resetScore);

export default router;
