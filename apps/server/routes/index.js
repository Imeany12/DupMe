import { Router } from 'express';
var router = Router();

/* GET home page. */
router.get('/', function (req, res, _next) {
  res.render('index', { title: 'Express' });
});

export default router;
