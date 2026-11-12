const express = require('express')
const { requireAuth } = require('../middleware/requireAuth')
const {
    getPets,
    getPet,
    createPet,
    deletePet,
    updatePet
}= require('../controllers/petControllers')


const router =express.Router()

router.get('/',getPets)

router.get('/:id',getPet)

router.post('/',requireAuth,createPet)

router.delete('/:id',requireAuth,deletePet)

router.patch('/:id',requireAuth,updatePet)

module.exports=router
