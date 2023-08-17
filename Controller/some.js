let arr = [1,2,3,3,3,4,5,6,7,7,7,8,8,9,1,1,1,10]

let newArr = arr.filter((index,number)=>{
    return arr.indexOf(number) === index
})

console.log(newArr)