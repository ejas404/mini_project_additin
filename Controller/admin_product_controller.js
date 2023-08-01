const AdminCollection = require('../Model/admin_details')
const ProductCollection = require('../Model/product')
const CategoryCollection = require('../Model/category')
const subCategoryCollection = require('../Model/sub_category')
const { v4: uuidv4 } = require('uuid');

const fs = require('fs')

module.exports = {
    productEditPage: async (req, res) => {
        const product = await ProductCollection.aggregate([{
            $match: {
                product_id: req.params.id
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "productCategory",
                foreignField: "category_id",
                as: "category",
            }
        }
        ])
        const category = await CategoryCollection.find({}, { categoryName: 1 })
        res.render('edit-product',{product,category})
    },
    productEdit : async (req,res)=>{
        //product id will be sendthrough params while requesting
        const product_id = req.params.id

        let updatedProduct;
        if(req.file?.path){
            updatedProduct = {
            
                productName: req.body.product_name,
                productPrice: req.body.price,
                productWeight: req.body.weight,
                productQuantity: req.body.quantity,
                productDescription: req.body.description,
                productImg: req.file.path,
               
            }
        }else{
            updatedProduct = {
            
                productName: req.body.product_name,
                productPrice: req.body.price,
                productWeight: req.body.weight,
                productQuantity: req.body.quantity,
                productDescription: req.body.description,
               
            }
        }
        const updated = await ProductCollection.findOneAndUpdate({product_id},{$set:updatedProduct})
        res.send('will be updated')
    },
    productDeletePage : (req,res)=>{
        req.session.delproduct = req.params.id
        res.render('confirm-page',
        {
            message : 'sure about deleting this product',
            confirm : '/admin/products/delete' , 
            decline : '/admin/products' 
        })
    },
   productDelete : async  (req,res)=>{
       try{
        const product_id = req.session.delproduct
        const product = await ProductCollection.findOne({product_id})
        // console.log(product)
        // fs.unlink(product.productImg,(err)=>{
        //     if(err){
        //         return res.send(err)
        //     }else{
        //         console.log('done')
        //         return res.send('file deleted successfully')
              
        //     }
        // })
        fs.unlinkSync(product.productImg)
        const deletedProduct = await ProductCollection.deleteOne({product_id})
        res.redirect('/admin/products')
       }catch(e){
            console.log(e)
       }
   },
   productUnblock : async (req,res)=>{
        const product_id = req.params.id
        const toUpdate = {
            isAvailable : true
        }
        const unblock = await ProductCollection.findOneAndUpdate({product_id},{$set:toUpdate})
        console.log(unblock)
        res.redirect('/admin/products')

   },
   productBlock : async (req,res)=>{
    const product_id = req.params.id
    const toUpdate = {
        isAvailable : false
    }
    const block = await ProductCollection.findOneAndUpdate({product_id},{$set:toUpdate})
    console.log(block)
    res.redirect('/admin/products')

},

}