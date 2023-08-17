const UserCollection = require('../Model/user_details')
const AddressCollection = require('../Model/address_details')

module.exports = {
    userMoreDetails : async(req,res)=>{
        console.log(req.params.id)
        const moreDetails = await UserCollection.aggregate([
            {
                $match : {
                    user_id : req.params.id
                }
             },
             {
                $lookup : {
                    from : 'addres',
                    localField : 'user_id',
                    foreignField : 'user_id',
                    as : 'address'
                }
            }
           

        ])
        console.log(moreDetails)
        res.render('single-user',{user:moreDetails,isAdmin : true})
    },
      //to get user datas from the database
      userLists: async (req, res) => {
        console.log('hai')

        try {
            const userDatas = await UserCollection.find({})

            res.render('userlists', { datas: userDatas ,isAdmin : true})


        } catch (e) {
            console.log(e.message)
        }

    },
    unBlockUser : async (req,res)=>{
        const user_id = req.params.id
        const toUpdate = {
            isBlocked : false
        }
        const unblock = await UserCollection.findOneAndUpdate({user_id},{$set:toUpdate})
        res.redirect('/admin/userlists')

   },
   blockUser : async (req,res)=>{
    const user_id = req.params.id
    const toUpdate = {
        isBlocked : true
    }
    const block = await UserCollection.findOneAndUpdate({user_id},{$set:toUpdate})
    res.redirect('/admin/userlists')

},
}