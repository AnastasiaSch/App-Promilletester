'use strict'

const orderOne = JSON.parse('{"weight": 89.5, "drinks": [{"type": "wine", "amount": 5}, {"type": "beer", "amount": 3}, {"type": "wine", "amount": 2}]}')
const orderTwo = JSON.parse('{"weight": "hallo", "drinks": [{"type": 55, "amount": 2.5}, {"type": "beer", "amount": 3}]}')

const isKeysWeightAndDrinks = order => Object.keys(order) === ["weight", "drinks"] || ["drinks", "weight"] ? true : false

const isValuePositiveNumber = order => order.weight > 0 && order.weight === Number(order.weight.toFixed(1)) ? order.weight : false

const isValueArray = order => Array.isArray(order.drinks) === true ? true : false

const isElementOfArrayObject = value => Array.isArray(value.drinks) === true && value.drinks.every(el => typeof el === "object" && Array.isArray(el) === false) 

const isKeysOfDrinksArray = value => {
  const isKeysOfDrinksEven = value => value.drinks.map(key => Object.keys(key)).every(el => el === ["type", "amount"] || ["amount", "type"])
  return isKeysOfDrinksEven(value) === true ? value.drinks.map(key => Object.keys(key)) : false
} 

const allValueOfType = value => value.drinks.map(el => Object.values(el)).map(i => i = i[0])

const allValueOfAmount = value => value.drinks.map(el => Object.values(el)).map(i => i = i[1])

const isValueofTypeString = value => {
const isValueType = value => value.drinks.map(el => Object.values(el)).every(x => typeof x[0] === "string")
return isValueType(value) === true ? true : allValueOfType(value).filter(el => typeof el !== "string") 
}

const isValueofAmountNumber = value => {
  const isZahl = value => value.drinks.map(el => Object.values(el)).every(x => typeof x[1] === "number" && x[1] > 0 && Math.round(x[1]) === x[1])
  return isZahl(value) === true ? true : allValueOfAmount(value).filter(x => x <= 0 || Math.round(x) !== x)
}

const WINE_GLASS_SIZE = 0.2
const WINE_ALC_PERCENTAGE = 14
const BEER_BOTTLE_SIZE = 0.7
const BEER_ALC_PERCENTAGE = 5
const STANDARD_DRINK_ALCOHOL_CONTENT = 17
const PROMILLE_IN_ONE_PROZENT = 10
const amountOfAlcoholInWine = order => {
  const numberOfGlassesWine = order => order.drinks.map(el => Object.values(el)).filter(i => i = i[0] === "wine").map(num => num = num[1]).reduce((x, y) => x + y)
    return numberOfGlassesWine(order) * WINE_GLASS_SIZE * WINE_ALC_PERCENTAGE / 100
}

const amountOfAlcoholInBeer = order => {
  const numberOfGlassesBeer = order => order.drinks.map(el => Object.values(el)).filter(i => i = i[0] === "beer").map(num => num = num[1]).reduce((x, y) => x + y)
    return numberOfGlassesBeer(order) * BEER_BOTTLE_SIZE * BEER_ALC_PERCENTAGE / 100
}

const isAmountOfAlcohol = order => {
  return Number((amountOfAlcoholInWine(order) + amountOfAlcoholInBeer(order)).toFixed(2))
}

const amountOfDrinks = order => Number((isAmountOfAlcohol(order) * 1000 / STANDARD_DRINK_ALCOHOL_CONTENT).toFixed(2))

const ebac = order => Number(((0.806 * amountOfDrinks(order) * 1.2) / (0.5 * order.weight)).toFixed(2))

const decideOnDrivingAbility = order => {
  if (isValuePositiveNumber(order) === false || isValueofAmountNumber(order) !== true || isValueofTypeString(order) !== true) {
    const validateRecords = order => {
    const error = []
    if (isValuePositiveNumber(order) === false) {
      error.push(`${order.weight} is not a valid weight`)
    }
    if (isValueofAmountNumber(order) !== true) {
      error.push(`${isValueofAmountNumber(order).map(i => `${i} is not a valid number of bottles or glasses`)}`)
    }
    if (isValueofTypeString(order) !== true) {
      error.push(`${isValueofTypeString(order).map(i => `${i} is not a valid drink`)}`)
    } 
    return error.join('\n')
    }
    return validateRecords(order)
  }
  if (isValuePositiveNumber(order) === true || isValueofAmountNumber(order) === true || isValueofTypeString(order) === true) {
    const bloodAlcoholContentFor = order => Number(((ebac(order) * PROMILLE_IN_ONE_PROZENT)).toFixed(2))
  
    if (bloodAlcoholContentFor(order) <= 0.29) {
      return 'Sie sind vermutlich noch fahrtuechtig.'
    }
    if (bloodAlcoholContentFor(order) >= 0.3 && bloodAlcoholContentFor(order) < 0.6) {
      return 'Sie haben vermutlich schon Konzentrationsschwirigkeiten. Sie sollten nicht mehr fahren.'
    }
    if (bloodAlcoholContentFor(order) >= 0.6 && bloodAlcoholContentFor(order) < 1.0) {
      return 'Fahren Sie nicht, das koentte Sie sonst den Fuehrerschein kosten. Denken Sie auch an die armen Schafe.'
    }
    if (bloodAlcoholContentFor(order) >= 1.0 && bloodAlcoholContentFor(order) < 5.0) {
      return 'Wie viele Handys halten Sie in der Hand?'
    }
    if (bloodAlcoholContentFor(order) >= 5.0) {
      return 'Sie sind vermutlich tot - oder haben sich vertippt.'
    } 
  }
}
  
 console.log(decideOnDrivingAbility({ 
weight: 89.555, 
drinks: [ 
{ type: 5, amount: 5 }, 
{ type: 'beer', amount: 3 }, 
{ type: 'wine', amount: 2 }, 
], 
}))

