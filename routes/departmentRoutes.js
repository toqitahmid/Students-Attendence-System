const express = require('express');
const router = express.Router();
const Departments = require('../models/Departments');
const { model } = require('mongoose');


//CREATE
router.post('/', async(req,res) => {
    try{
        const department = new Departments(req.body);
        await department.save();
        res.status(201).json(department);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
});


//READ
router.get('/', async(req,res) => {
    try{
        const departments = await Departments.find();
        res.json(departments);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
})


//READ Spacific
router.get('/:id', async(req, res) => {
    try{
        const department = await Departments.findById(req.params.id);
        if(!department){
            return res.status(404).json({error: 'Not found'});
        }else{
            res.json(department);
        }
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})


//UPDATE
router.patch('/:id', async (req,res) => {
    try{
        const department = await Departments.findByIdAndUpdate(
            req.params.id,
            req.body,{
                new: true
            }
        );
        res.json(department);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
})

router.delete('/:id', async(req,res) => {
    try {
      await Departments.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
})

module.exports = router;