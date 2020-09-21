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
    newDogDiv.classList.add('new-dog-div')
    if(dog.likes){
        dog.likes = dog.likes
    } else if (dog.likes === undefined){
        dog.likes = 0
    }
    newDogDiv.innerHTML = `
        <img src="${dog.image}" alt="${dog.name}" />
        <h2>${dog.name}</h2>
        <h4 class="likes-container">${dog.likes} Likes <3</h4>
        <button class="good-or-bad-dog" type="button">${goodOrBadDog(dog, newDogDiv)}</button>
        <button class="delete-dog" type="button">Delete Dog</button>
        <button class="likes" type="button">Like!</button>
    `
    dogDiv.append(newDogDiv)
}

// returns button content based on whether the dog is good or bad from DB

const goodOrBadDog = (dog, dogEl) => {
    if(dog.isGoodDog){
        dogEl.dataset.dogStatus = 'true'
        return "Bad Dog!"
    } else if (dog.isGoodDog === false){
        dogEl.dataset.dogStatus = 'false'
        return "Good Dog!"
    }
}

const clickHandler = () => {
    document.addEventListener('click', e => {
        if(e.target.matches('.dog-span')){
            showAdditionalDogInfo(e.target)
        } else if(e.target.matches('.good-or-bad-dog')){
            updateGoodOrBadStatus(e.target)
        } else if(e.target.matches('#good-dog-filter')){
            filterDogs(e.target)
        } else if(e.target.matches('#create-new-dog')){
            showForm(e.target)
        } else if(e.target.matches('#hide-dog-form')){
            hideForm(e.target)
        } else if(e.target.matches('.likes')){
            updateLikes(e.target)
        } else if(e.target.matches('.delete-dog')){
            const dogId = e.target.parentElement.dataset.dogId
            const options = {
                method: "DELETE"
            }
            fetch(Url + dogId, options)
            .then(response => response.json())
            .then(() => {
                const dogBarEl = document.querySelector(`[data-dog-id="${dogId}"]`)
                dogBarEl.remove()
                e.target.parentElement.remove()
            })
            //delete element from page
        }
    })
}

const updateLikes = el => {
    const dogId = el.parentElement.dataset.dogId
    const likeText= el.parentElement.querySelector('.likes-container')
    const likes = parseInt(likeText.textContent)
    

    const dogObj = {
        likes: likes + 1
    }
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify(dogObj)
    }
    fetch(Url + dogId, options)
    .then(response => response.json())
    .then(dog => {
        const likeContainer = el.parentElement.querySelector('.likes-container') 
        likeContainer.innerText = `${dog.likes} Likes 	
        <3`
    })
}

const showForm = el => {
    const formDiv = el.parentElement
    const form = formDiv.querySelector('form')
    form.style.display = 'inline'
    el.textContent = "Hide Form"
    el.id = "hide-dog-form"
}

const hideForm = el => {
    const formDiv = el.parentElement
    const form = formDiv.querySelector('form')
    form.style.display = 'none'
    el.textContent = "Show New Dog Form"
    el.id = "create-new-dog"
}

const submitListener = () => {
    document.addEventListener('submit', e => {
        if(e.target.matches('#dog-form')){
            const form = e.target
            e.preventDefault()
            console.log(form.name.value)
            const dogObj = {
               name: form.name.value,
               isGoodDog: true,
               image: form.image.value 
            }
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accepts": "application/json"
                },
                body: JSON.stringify(dogObj)
            }
            fetch(Url, options)
            .then(response => response.json())
            .then(dog => {
                renderDog(dog)
            })
        }
    })
}
// filter dogs based on DB isGoodDog

const filterDogs = el => {
    if(el.textContent === "Filter good dogs: OFF"){
        el.textContent = "Filter good dogs: ON"
        const dogSpans = document.querySelectorAll('.dog-span')
        for(const dog of dogSpans){
            const dogId = dog.dataset.dogId
            const dogDiv = document.querySelector('#dog-info')
            const matchingDogDiv = dogDiv.querySelector(`[data-dog-id="${dogId}"]`)
            if (matchingDogDiv.dataset.dogStatus === "false"){
                dog.style.display = "none"
            }
        }
    } else if(el.textContent === "Filter good dogs: ON"){
        const dogSpans = document.querySelectorAll('.dog-span')
        for(const dog of dogSpans){
            dog.style.display = "inline"
        }
        el.textContent = "Filter good dogs: OFF"
    }
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
            el.textContent = "Bad Dog!"
            el.parentElement.dataset.dogStatus = "true"
        } else if (dog.isGoodDog === false){
            el.textContent = "Good Dog!"
            el.parentElement.dataset.dogStatus = "false"
        }
        //if the filter button text content = good dog on
        const likeButton = document.querySelector('#good-dog-filter')
        if(likeButton.textContent === "Filter good dogs: ON"){
            const dogSpans = document.querySelectorAll('.dog-span')
            for(const dog of dogSpans){
                const dogId = dog.dataset.dogId
                const dogDiv = document.querySelector('#dog-info')
                const matchingDogDiv = dogDiv.querySelector(`[data-dog-id="${dogId}"]`)
                if (matchingDogDiv.dataset.dogStatus === "false"){
                    dog.style.display = "none"
                } else if(matchingDogDiv.dataset.dogStatus === "true"){
                    dog.style.display = "inline"
                }
            }
        }
    
    })
    .catch(error => alert(error))
}

// get whether good or bad from dog button text content

const goodOrBadFromButton = el => {
    if (el.textContent === "Good Dog!"){
        return true
    } else if (el.textContent === "Bad Dog!"){
        return false
    }
}

// unhide additional dog info

const showAdditionalDogInfo = el => {
    const dogId = el.dataset.dogId
    const dogDiv = document.querySelector('#dog-info')
    const allDogDivs = document.querySelectorAll('.new-dog-div')
    for(const dog of allDogDivs){
        dog.style.display = "none"
    }
    const matchingDogDiv = dogDiv.querySelector(`[data-dog-id="${dogId}"]`)
    matchingDogDiv.style.display = 'inline'
    el.dataset.hiddenOrShown = "shown"
}
submitListener()
clickHandler()
getAndShowDogsFromDb()

})