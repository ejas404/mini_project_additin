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

