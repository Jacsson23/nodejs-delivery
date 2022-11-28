const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');

module.exports = {

    async findByCategory(req, res, next) {
        try {
            const id_category = req.params.id_category; // CLIENTE
            const data = await Product.findByCategory(id_category);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: `Error al listar los productos por categoria`,
                success: false,
                error: error
            });
        }
    },

    async create(req, res, next) {

        let product = JSON.parse(req.body.product);

        const files = req.files;

        let inserts = 0;
        
        if (files.length === 0) {
            return res.status(501).json({
                message: 'Error al registrar el producto no tiene imagen',
                success: false
            });
        }
        else {
            try {
                
                const data = await Product.create(product); // ALMACENANDO LA INFORMACION
                product.id = data.id;

                const start = async () => {
                     await asyncForEach(files, async (file) => {
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(file, pathImage);

                        if (url !== undefined && url !== null) {
                            if (inserts == 0) { // IMAGEN 1
                                product.image1 = url;
                            }
                            else if(inserts == 1) { // IMAGEN 2
                                product.image2 = url;
                            }
                            else if(inserts == 2) { // IMAGEN 3
                                product.image3 = url;
                            }
                        }

                        await Product.update(product);
                        inserts = inserts + 1;

                        if (inserts == files.length) {
                            return res.status(201).json({
                                success: true,
                                message: 'El producto se ha registrado correctamente'
                            });
                        }

                     }); 

                }

                start();

            } 
            catch (error) {
                console.log(`Error: ${error}`);
                return res.status(501).json({
                    message: `Error al registrar el producto ${error}`,
                    success: false,
                    error: error
                });
            }
        }

    },

    async getAll(req, res, next) {

        try {
            
            const data = await Product.getAll();

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

    async delete(req, res, next){        
        try {
            const { id } = req.params       
            await Product.delete(id); //ELIMINANDO PRODUCTO
            return res.status(201).json({
                succes: true,
                message: 'El producto ha sido eliminado exitosamente',
                data: id
            });            
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al eliminar los datos del producto',
                error: error 
            });            
        }
    },

    async findById(req, res, next) {
        try {
            const id = req.params.id;
            const data = await Product.findById(id);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: `Error al listar los productos por categoria`,
                success: false,
                error: error
            });
        }
    },

    async update(req, res, next){

        try {

            const product = JSON.parse(req.body.product);
            //console.log('Categoria Parseada', product);    
            
            const files = req.files;
            if(files.length > 0){//NO SE ENVIA UN ARCHIVO

                const pathImage =  `image_${Date.now()}`; //NOMBRE DEL ARCHIVO
                const url = await storage(files[0], pathImage);


                if(url != undefined && url != null){
                    product.image1 = url;
                }
            }

            if(files.length > 1){//NO SE ENVIA UN ARCHIVO

                const pathImage =  `image_${Date.now()}`; //NOMBRE DEL ARCHIVO
                const url = await storage(files[1], pathImage);


                if(url != undefined && url != null){
                    product.image2 = url;
                }
            }

            if(files.length > 2){//NO SE ENVIA UN ARCHIVO

                const pathImage =  `image_${Date.now()}`; //NOMBRE DEL ARCHIVO
                const url = await storage(files[2], pathImage);


                if(url != undefined && url != null){
                    product.image3 = url;
                }
            }

            //console.log(product)

            await Product.update(product); //GUARDANDO URL EN LA BASE DE DATOS

            return res.status(201).json({
                succes: true,
                message: 'Los datos se han actualizado correctamente',
                data: product
            });
            
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar los datos de categoria',
                error: error 
            });

            
        }
    }

}