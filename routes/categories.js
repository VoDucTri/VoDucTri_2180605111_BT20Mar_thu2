var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category')

const isMod = (req, res, next) => {
  if (req.user && req.user.role === 'mod') return next();
  res.status(403).send({ success: false, message: 'Require Moderator Role' });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).send({ success: false, message: 'Require Admin Role' });
};

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let categories = await categoryModel.find({});
  res.status(200).send({
    success:true,
    data:categories
  });
});

router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categoryModel.findById(id);
    res.status(200).send({
      success:true,
      data:category
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:"khong co id phu hop"
    });
  }
});

router.post('/', isMod, async function(req, res, next) {
  try {
    let newCategory = new categoryModel({
      name: req.body.name,
    })
    await newCategory.save();
    res.status(200).send({
      success:true,
      data:newCategory
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

router.put('/:id', isMod, async function(req, res, next) {
  try {
    let updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.status(200).send({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', isAdmin, async function(req, res, next) {
  try {
    let category = await categoryModel.findByIdAndDelete(req.params.id);
    if (category) {
      res.status(200).send({
        success: true,
        data: category
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ID khong ton tai"
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;