document.addEventListener("DOMContentLoaded",  () => {
const Url = "http://localhost:3000/pups/"

const getAndShowDogsFromDb = () => {
fetch(Url)
.then(response => response.json())
.then(dogs => renderDogs(dogs))
.catch(error => alert(error))
}

//creates dog span and more info dog divs for each dog from DB

const renderDogs = dogs => {
    for(const dog of dogs){
        renderDog(dog)
    }
}

// creates both dog span and more info dog div elements for each dog

const renderDog = dog => {
   createDogSpan(dog)
   createDogDiv(dog)
}

// creates the dog span for top bar

const createDogSpan = dog => {
    const dogBar = document.querySelector('#dog-bar')
    const dogSpan = document.createElement('span')
    dogSpan.dataset.dogId = dog.id
    dogSpan.dataset.hiddenOrShown = 'hidden'
    dogSpan.classList.add('dog-span')
    dogSpan.textContent = `${dog.name}`
    dogBar.append(dogSpan)
}

// created the more info dog divs

const createDogDiv = dog => {
    const dogDiv = document.querySelector('#dog-info')
    const newDogDiv = document.createElement('div')
    newDogDiv.dataset.dogId = dog.id
    newDogDiv.style.display = 'none'
    newDogDiv.innerHTML = `
        <img src="${dog.image}" alt="${dog.name}" />
        <h2>${dog.name}</h2>
        <button class="good-or-bad-dog" type="button">${goodOrBadDog(dog, newDogDiv)}</button>
    `
    dogDiv.append(newDogDiv)
}

// returns button content based on whether the dog is good or bad from DB

const goodOrBadDog = (dog, dogEl) => {
    if(dog.isGoodDog){
        dogEl.dataset.dogStatus = 'true'
        return "Good Dog!"
    } else if (dog.isGoodDog === false){
        dogEl.dataset.dogStatus = 'false'
        return "Bad Dog!"
    }
}

const clickHandler = () => {
    document.addEventListener('click', e => {
        if(e.target.matches('.dog-span')){
            showAdditionalDogInfo(e.target)
        } else if(e.target.matches('.good-or-bad-dog')){
            updateGoodOrBadStatus(e.target)
        }
    })
}

// update DB then DOM with new status of dog good or bad

const updateGoodOrBadStatus = el => {
    const dogId = el.parentElement.dataset.dogId
    const dogObj = {
        isGoodDog: goodOrBadFromButton(el)
    }
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify(dogObj)
    };
    fetch(Url + dogId, options)
    .then(response => response.json())
    .then(dog => {
        if(dog.isGoodDog === true){
            el.textContent = "Good Dog!"
            el.parentElement.dataset.dogStatus = "true"
        } else if (dog.isGoodDog === false){
            el.textContent = "Bad Dog!"
            el.parentElement.dataset.dogStatus = "false"
        }
    })
    .catch(error => alert(error))

}
// get whether good or bad from dog button text content

const goodOrBadFromButton = el => {
    if (el.textContent === "Bad Dog!"){
        return true
    } else if (el.textContent === "Good Dog!"){
        return false
    }
}

// unhide additional dog info

const showAdditionalDogInfo = el => {
    const dogId = el.dataset.dogId
    const dogDiv = document.querySelector('#dog-info')
    const matchingDogDiv = dogDiv.querySelector(`[data-dog-id="${dogId}"]`)
    matchingDogDiv.style.display = 'inline'
    el.dataset.hiddenOrShown = "shown"
}



clickHandler()
getAndShowDogsFromDb()

})