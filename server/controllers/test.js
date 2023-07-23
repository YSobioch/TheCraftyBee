// const url = 'http://localhost:3000/purchased/24,23,16/34'

// const generateParsedURLData = (url)  => {
//     const urlArr = [...url]

//     let accountNum = "";
//     let listingsBought = []

//     for(let i = urlArr.length - 1; urlArr[i] !== '/'; i--) {
//         let nextNum = urlArr.pop()
//         accountNum = nextNum + accountNum
//     }

//     urlArr.pop()

//     let runningNum = ""
//     for(let i = urlArr.length - 1; urlArr[i] !== '/'; i--) {
//         let nextNum = urlArr.pop()
//         if(nextNum === ",") {
//             listingsBought.push(Number(runningNum))
//             runningNum = ""
//             continue;
//         }
//         runningNum = nextNum + runningNum
//     }
//     listingsBought.push(Number(runningNum))

//     return {accountNumber: Number(accountNum), listingsBought: listingsBought}
// }


// console.log(generateParsedURLData(url))

// let arrOfNames = ["Nikolai", "Yuri", "Irma"]
// let arrOfValues = [1,3,2,5,6,8,9,10]

// let EvenValues = arrOfValues.filter((number) => {
//     if(number % 2 === 0) return number
// })

// let NewArrOfNames = arrOfNames.map((name) => {
//     return name.charAt(0) + name.slice(-1)
// })

// console.log(NewArrOfNames)
// console.log(arrOfNames)
// console.log(EvenValues)

// let arrOfValues = [1,3,2,5,6,8,9,10]

// let newArrOfValues = arrOfValues.filter(number => number % 2 === 0)

// let extraNewArr = newArrOfValues.map(number => number * 2)

// const addFive = num => num + 5

// console.log(addFive(10))

const testData = [{first: 'Elie', last:"Schoppik"}, {first: 'Tim', last:"Garcia", isCatOwner: true}, {first: 'Matt', last:"Lane"}, {first: 'Colt', last:"Steele", isCatOwner: true}]

// const findInObj = (arr, key, value) => {
//     return arr.filter(object => object[key] === value)[0]
// }

// console.log(findInObj(testData, 'isCatOwner', true))










const mockFilter = (arr, callBack) => {
    let returnArr = []

    for(let i = 0; i < arr.length; i++) {
        if(callBack(arr[i])) returnArr.push(arr[i]) 
    }

    return returnArr
}

//--------------------------------------------------------


const mockForEach = (arr, callBack) => {
    let returnArr = []
    for(let i = 0; i < arr.length; i++) {
        returnArr.push(callBack(arr[i]))
    }

    return returnArr
}



const filterByValue = (arr, key) => {
    return mockFilter(arr, object => object[key])
}

let mockPizza = ['pepperoni', 'cheese', 'pinnaple']

let expression = mockForEach(mockPizza, (str) => str + " is the best")
console.log(expression)


//------------------------------------------------------





// let testData = [1,2,3,4,5,6,7,8]

// console.log(mockFilter(testData, (value) => value > 3))




