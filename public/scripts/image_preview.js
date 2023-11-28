function previewImages(event){
    let previewDiv = document.getElementById('imagePreview')
    let res = ""
   if(event.target?.files){
     for(let each of event.target.files){
        let src = URL.createObjectURL(each)
        res+= `<img src="${src}" onclick="selectImage('${each.name}', this)" class="previewImages">`
    }
   }

   previewDiv.innerHTML = res
}


// function removeImg(name,elem){
//     let fileUploader = document.getElementById('file_uploader')
//     const dt = new DataTransfer()
//     for(let each of fileUploader.files){
//         if(each.name !== name){
//             dt.items.add(each)
//         }
//     }

//     fileUploader.files = dt.files
// }