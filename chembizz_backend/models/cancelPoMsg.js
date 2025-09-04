const mongoose= require('mongoose');


const cancelPoMsgSchema= new mongoose.Schema({
    salesInvoiceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'salesInvoice',
        required:true
    },
    buyerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        // required:true
    },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
    },
    message:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const CancelPoMsg = mongoose.model('CancelPoMsg', cancelPoMsgSchema);

module.exports = CancelPoMsg;