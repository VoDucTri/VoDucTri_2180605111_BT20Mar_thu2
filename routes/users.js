var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')
let { check_authentication } = require('../utils/check_auth')
let constants = require('../utils/constants')

const isMod = (req, res, next) => {
  if (req.user && req.user.role === 'mod') return next();
  res.status(403).send({ success: false, message: 'Require Moderator Role' });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).send({ success: false, message: 'Require Admin Role' });
};

/* GET users listing. */
router.get('/', check_authentication, isMod, async function(req, res, next) {
  try {
    let users = await userController.GetAllUser();
    CreateSuccessRes(res, 200, users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', check_authentication, async function(req, res, next) {
  try {
    if (req.params.id === req.user._id.toString()) {
      let user = await userController.GetUserById(req.params.id);
      CreateSuccessRes(res, 200, user);
    } else {
      if (req.user.role !== 'mod' && req.user.role !== 'admin') {
        return res.status(403).send({ success: false, message: 'Require Moderator Role' });
      }
      let user = await userController.GetUserById(req.params.id);
      CreateSuccessRes(res, 200, user);
    }
  } catch (error) {
    CreateErrorRes(res, 404, error);
  }
});

router.post('/', check_authentication, isAdmin, async function(req, res, next) {
  try {
    let body = req.body;
    let newUser = await userController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessRes(res, 200, newUser);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', check_authentication, isAdmin, async function(req, res, next) {
  try {
    let updateUser = await userController.UpdateUser(req.params.id, req.body);
    CreateSuccessRes(res, 200, updateUser);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', check_authentication, isAdmin, async function(req, res, next) {
  try {
    let deletedUser = await userController.DeleteUser(req.params.id);
    CreateSuccessRes(res, 200, deletedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;