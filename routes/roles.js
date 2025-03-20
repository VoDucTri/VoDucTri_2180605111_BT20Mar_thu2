var express = require('express');
var router = express.Router();
let roleController = require('../controllers/roles')
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).send({ success: false, message: 'Require Admin Role' });
};

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let users = await roleController.GetAllRole();
  CreateSuccessRes(res, 200, users);
});

router.get('/:id', async function(req, res, next) {
  try {
    let user = await roleController.GetRoleById(req.params.id);
    CreateSuccessRes(res, 200, user);
  } catch (error) {
    next(error);
  }
});

router.post('/', isAdmin, async function(req, res, next) {
  try {
    let newRole = await roleController.CreateRole(req.body.name);
    CreateSuccessRes(res, 200, newRole);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', isAdmin, async function(req, res, next) {
  try {
    let updatedRole = await roleController.UpdateRole(req.params.id, req.body.name);
    CreateSuccessRes(res, 200, updatedRole);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', isAdmin, async function(req, res, next) {
  try {
    let deletedRole = await roleController.DeleteRole(req.params.id);
    CreateSuccessRes(res, 200, deletedRole);
  } catch (error) {
    next(error);
  }
});

module.exports = router;