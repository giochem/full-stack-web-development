const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'not implement',
        message: 'get all'
    })
})
router.get('/:id', (req, res, next) => {
    res.status(200).json({
        status: 'not implement',
        message: 'get by id'
    })
})
router.post('/', (req, res, next) => {
    res.status(200).json({
        status: 'not implement',
        message: 'create new'
    })
})
router.put('/:id', (req, res, next) => {
    res.status(200).json({
        status: 'not implement',
        message: 'update by id'
    })
})
router.delete('/:id', (req, res, next) => {
    res.status(200).json({
        status: 'not implement',
        message: 'delete by id'
    })
})
module.exports = router;