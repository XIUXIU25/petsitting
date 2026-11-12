const { get, default: mongoose } = require('mongoose')
const Pet=require('../models/petsModel')

//get all pets
const getPets=async(req,res)=>{
    const pets=await Pet.find({}).sort({createdAt:-1})

    res.status(200).json(pets)
}

//get a single pet
const getPet=async(req,res)=>{
    const {id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'no this pet'})
    }

    const pet=await Pet.findById(id)

    if(!pet){
        return res.status(404).json({error:'No such pet'})
    }

    res.status(200).json(pet)
}

//create new pet
const createPet=async(req,res)=>{
    const{petName,age,sex,parent}=req.body

    //add doc to db
    try{
        const createdPet=await Pet.create({petName,age,sex,parent})
        return res.status(200).json(createdPet)
    }catch(error){
        return res.status(400).json({error:error.message})
    }
}

const deletePet=async(req,res)=>{
    const {id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'no this pet'})
    }

    const pet=await Pet.findByIdAndDelete({_id: id})

    if(!pet){
        return res.status(404).json({error:'No such pet'})
    }

    res.status(200).json(pet)
}

const updatePet=async(req,res)=>{
    const {id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'no this pet'})
    }

    const pet=await Pet.findByIdAndUpdate({_id: id},{
        ...req.body
    })

    if(!pet){
        return res.status(404).json({error:'No such pet'})
    }

    res.status(200).json(pet)
}

module.exports={
    getPets,
    getPet,
    createPet,
    deletePet,
    updatePet
}