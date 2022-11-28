const { getAll, update } = require('../models/category');
const Category = require('../models/category');
const storage = require('../utils/cloud_storage');

module.exports = {

    async create(req, res, next) {
        
        console.log('REQ BODY', req.body);

        try {
            
            const category = JSON.parse(req.body.category); 
            console.log('Category', category);

            const files = req.files;

            if (files.length > 0) { // CLIENTE NOS ENVIA UN ARCHIVO

                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    category.image = url;
                }

            }

            const data = await Category.create(category);

            return res.status(201).json({
                success: true,
                message: 'La categoria se ha creado correctamente',
                data: {
                    'id': data.id
                }
            });

        } catch (error) {
            
            console.log('Error', error);

            return res.status(501).json({
                success: false,
                message: 'Hubo un error al crear la categoria',
                error: error 
            });
        }

    },

    async getAll(req, res, next) {

        try {
            
            const data = await Category.getAll();

            return res.status(201).json(data);
            
        } catch (error) {
            console.log('Error', error);

            return res.status(501).json({
                success: false,
                message: 'Hubo un error al crear la categoria',
                error: error 
            });
        }
    },

    async update(req, res, next){

        try {

            const category = JSON.parse(req.body.category);
            console.log('Categoria Parseada', category);    
            
            const files = req.files;
            console.log(files)
            if(files.length > 0){//NO SE ENVIA UN ARCHIVO

                const pathImage =  `image_${Date.now()}`; //NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);


                if(url != undefined && url != null){
                    category.image = url;
                }
            }

            console.log(category)

            await Category.update(category); //GUARDANDO URL EN LA BASE DE DATOS

            return res.status(201).json({
                succes: true,
                message: 'Los datos se han actualizado correctamente',
                data: category
            });
            
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar los datos de categoria',
                error: error 
            });

            
        }
    },

    async updateDatos(req, res, next){

        try {

            const category = JSON.parse(req.body.category);
            console.log('Categoria Parseada', category);   
            
            await Category.update(category); //GUARDANDO URL EN LA BASE DE DATOS

            return res.status(201).json({
                succes: true,
                message: 'Los datos se han actualizado correctamente',
                data: category
            });
            
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar los datos de categoria',
                error: error 
            });

            
        }
    },

    async delete(req, res, next){        
        try {
            const { id } = req.params       
            await Category.delete(id); //ELIMINANDO CATEGORIA
            return res.status(201).json({
                succes: true,
                message: 'La Categoria ha sido eliminada exitosamente',
                data: id
            });            
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al eliminar los datos de categoria',
                error: error 
            });            
        }
    },

    async findById(req, res, next) {

        try {

            const { id } = req.params
            const data = await Category.findById(id);
            return res.status(201).json(data);
            
        } catch (error) {
            console.log('Error', error);

            return res.status(501).json({
                success: false,
                message: 'Hubo un error al crear la categoria',
                error: error 
            });
        }
    }

}