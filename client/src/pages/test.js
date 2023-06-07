const isPalendrome = (str) => {
    let arr = [...str]
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] === " ") arr.splice(i, 1);
    }
    
    let j = arr.length - 1;
    let i = 0;

    while(i < j) {
        if(arr[i].toLowerCase() !== arr[j].toLowerCase()) return false
        i++;
        j--
    }
    return true
}

console.log(isPalendrome("race car"))