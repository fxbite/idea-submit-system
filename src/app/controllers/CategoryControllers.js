const Category = require('../models/Category')
const Idea = require('../models/Idea')
class CategoryController {

    // [POST] /category
    async categoryCreate(req, res, next){

        try {
            const newCategory = new Category(req.body)
            const savedCategory = await newCategory.save()
            res.status(200).json(savedCategory)
            
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [PATCH] /category/:id
    async categoryUpdate(req, res, next){

        try {
            const cateId = req.params.id
            const category = await Category.findById(cateId)
            await category.updateOne({ $set: req.body})

            const updatedCategory = await Category.findById(cateId)
            res.redirect('/category-management')

        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [DELETE] /category/:id
    async categoryDelete(req, res, next){

        try {
            const cateId = req.params.id
            const category = await Category.findById(cateId)

            if (category.use !== ''){
                return res.redirect('/category-management')
            } else {
                const category = await Category.findById(cateId)
                await category.deleteOne()
                return res.redirect('/category-management')
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [GET] /category/all
    async getAllCategory(req, res, next){

        try {
            const category = await Category.find({})
            res.status(200).json(category)

        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [GET] /category/one/:id
    async getACategory(req, res, next){

        try {
            const category = await Category.findById(req.params.id)
            res.status(200).json(category)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = new CategoryController