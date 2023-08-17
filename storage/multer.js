const multer = require('multer')


module.exports = {
    productStorage : multer.diskStorage({
        destination: function (req,file,cb){
           return  cb(null,'./public/assets/products')
        },
    
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
          }
    
    }),
    bannerStorage : multer.diskStorage({
        destination: function (req,file,cb){
           return  cb(null,'./public/assets/banners')
        },
    
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
          }
    
    }),
}