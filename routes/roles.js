var express = require('express');
var router = express.Router();
let roleController = require('../controllers/roles');
var ResHandler = require('../utils/ResHandler');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ 
    success: false, 
    message: 'Require Admin Role' 
  });
};

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    let users = await roleController.GetAllRole();
    ResHandler.CreateSuccessRes(res, 200, users);
  } catch (error) {
    ResHandler.CreateErrorRes(res, 500, error);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    let user = await roleController.GetRoleById(req.params.id);
    ResHandler.CreateSuccessRes(res, 200, user);
  } catch (error) {
    ResHandler.CreateErrorRes(res, 500, error);
  }
});

router.post('/', isAdmin, async function(req, res, next) {
  try {
    let newRole = await roleController.CreateRole(req.body.name);
    ResHandler.CreateSuccessRes(res, 201, newRole);
  } catch (error) {
    ResHandler.CreateErrorRes(res, 500, error);
  }
});

router.put('/:id', isAdmin, async function(req, res, next) {
  try {
    let updatedRole = await roleController.UpdateRole(req.params.id, req.body.name);
    ResHandler.CreateSuccessRes(res, 200, updatedRole);
  } catch (error) {
    ResHandler.CreateErrorRes(res, 500, error);
  }
});

router.delete('/:id', isAdmin, async function(req, res, next) {
  try {
    let deletedRole = await roleController.DeleteRole(req.params.id);
    ResHandler.CreateSuccessRes(res, 200, deletedRole);
  } catch (error) {
    ResHandler.CreateErrorRes(res, 500, error);
  }
});

module.exports = router;