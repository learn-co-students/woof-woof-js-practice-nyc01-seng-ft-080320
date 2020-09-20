document.addEventListener('DOMContentLoaded', () => {

 
    let baseUrl = 'http://localhost:3000/pups/'

    //get request to get dog data from API
    //createDogs function is called to create the dogs on the DOM
    const loadDogs = () => {
        fetch(baseUrl)
        .then(response => response.json())
        .then(dogs => createDogs(dogs))
    }

    //gets dog bar div and adds dog span to nav bar with dog id in span dataset
    const createDogBar = info => {
        const dogBar = document.querySelector('#dog-bar')
 
            for(dog of info) {
                const span = document.createElement('span')
                span.textContent = dog.name
                span.dataset.id = `${dog.id}`
                dogBar.append(span)
            } 
            
    }

    //gets dog info div and creates dog html divs and all have a class of hidden and dataset id on div 
    const createDogContainer = info => {
        
        const dogInfo = document.querySelector('#dog-info')
     
        for(dog of info) {
            const dogDiv = document.createElement('div')
            dogDiv.dataset.id = dog.id
            dogDiv.classList.add('hidden')

            if(dog.isGoodDog) {
                dogDiv.innerHTML = `
                    <img src=${dog.image}>
                    <h2>${dog.name}</h2>
                    <button class='isGoodDog' data-good='${dog.isGoodDog}'>Good Dog!</button>
                    <button class='delete'>Delete!</button>
                `
                dogInfo.append(dogDiv)
                dogDiv.style.display = 'none'
            }else {
                dogDiv.innerHTML = `
                    <img src=${dog.image}>
                    <h2>${dog.name}</h2>
                    <button class='isGoodDog' data-good='${dog.isGoodDog}'>Bad Dog!</button>
                    <button class='delete'>Delete!</button>
                `
                dogInfo.append(dogDiv)
                dogDiv.style.display = 'none'

            }
        } 
    }
    
    //createDogs gets data from the fetch request and calls on 
    //createDogBar-makes dog span for DOM and createDogContainer- makes dog HTML for dog div info 
    const createDogs = (data) => {
        createDogBar(data)
        createDogContainer(data)
    }

    //displays a single dog when dog is clicked on in nav bar
    //when clicked class is changed to show and display is changed to block
    //before above function iterates over all DOGS and changes their class to hidden and display to none
    const displayDog = dogEvent => {
        const dogDiv = document.querySelector('#dog-info')
        const dogArray = dogDiv.querySelectorAll('div')

        for(d of dogArray){
            if(d.className !== 'hidden'){
                d.className = 'hidden'
                d.style.display = 'none'
            }
        }
        const dogId = dogEvent.dataset.id
        const dog = dogDiv.querySelector(`[data-id="${dogId}"]`)
        dog.className = "show"
        dog.style.display = 'block'
    }

    //updates the dog good status in DB and passes info to updateDog to update DOM    
    const updateStatus = (boolean, id) => {
        options = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({isGoodDog: boolean})
        }

        fetch(baseUrl + id, options)
        .then(response => response.json())
        .then( dogInfo => updateDog(dogInfo, boolean))
    }

    //updates dog button depending on their status
    const updateDog = (info, boolean) => {
        if(boolean) {
            const dogId = info.id
            const allDogs = document.querySelector('#dog-info')
            const dogDiv = allDogs.querySelector(`div [data-id="${dogId}"]`)
            const button = dogDiv.querySelector('button')

            button.dataset.good = `${boolean}`
            button.textContent = "Good Dog!"
        } else {
            const dogId = info.id
            const allDogs = document.querySelector('#dog-info')
            const dogDiv = allDogs.querySelector(`div [data-id="${dogId}"]`)
            const button = dogDiv.querySelector('button')

            button.dataset.good = `${boolean}`
            button.textContent = "Bad Dog!"
        } 
    }

    //changes button dataset good to true or false depending
    //creates boolean for good status as true or false
    //gets dog id
    //passes all above to updateStatus to get patch fetch request
    const goodDogStatus = (button, id) => {
        if(button.matches('[data-good="true"]')) {

            const falseBoolean = false
            const badDogId = id
            updateStatus(falseBoolean, badDogId)
        }else {

            const trueBoolean = true
            const goodDogId = id
            updateStatus(trueBoolean, goodDogId)
        }   
    }


    //  - If the button now says "ON" (meaning the filter is on), then the Dog Bar should only show pups whose 
    //  isGoodDog attribute is true. If the filter is off, the Dog Bar should show all pups (like normal).
    const filterDogs = (button) => {
        if(button.matches('.off')) {
            button.textContent = "Filter good dogs: ON"
            button.classList = "on"

            const dogsDiv = document.querySelector('#dog-info')
            const dogsArray = dogsDiv.querySelectorAll('[data-good="false"]')
            const badDogs = []

            for(const dogButton of dogsArray) {
                let dog = dogButton.parentElement
                badDogs.push(dog)
            }

            for(const dog of badDogs) {
                const id = dog.dataset.id
                const span = document.querySelector(`span[data-id="${id}"]`)
                span.style.display ="none"
                
            }

        } else if(button.matches('.on')) {
            button.textContent = "Filter good dogs: OFF"
            button.classList = "off"

            const dogs = document.querySelectorAll('span')

            for(const dog of dogs) {
                dog.style.display = "block"
            }

        }
    }

   

    //event listner for dog show in nav bar
    //event listner 
    document.addEventListener('click', e => {
        if(e.target.matches('span')){
            const dogEvent = e.target
            displayDog(dogEvent)
        }else if(e.target.matches('[data-good="false"]')) {
            const badDogButton = e.target
            const badDogId = parseInt(e.target.parentElement.dataset.id)
            goodDogStatus(badDogButton, badDogId)
        }else if(e.target.matches('[data-good="true"]')) {
            const goodDogButton = e.target
            const goodDogId = parseInt(e.target.parentElement.dataset.id)
            goodDogStatus(goodDogButton, goodDogId)
        }else if(e.target.matches('#good-dog-filter')) {
            const filterButton = e.target
            filterDogs(filterButton)
        }else if(e.target.matches('.delete')){
            deleteDog(e.target)
        }
    })

    const deleteDog = target => {
        const dogDiv = target.parentElement
        const dogId = dogDiv.dataset.id
        const span = document.querySelector(`[data-id="${dogId}"]`)
        
        options = {
            method: "DELETE",
        }

        fetch(baseUrl + dogId, options)
        .then(response => response.json())
        .then(dog => {
            dogDiv.remove()
            span.remove()
        })
    }


    loadDogs()
})