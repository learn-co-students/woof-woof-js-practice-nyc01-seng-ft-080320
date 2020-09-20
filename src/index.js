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
            dogDiv.innerHTML = `
                <img src=${dog.image}>
                <h2>${dog.name}</h2>
                <button class='isGoodDog' data-good='true' >Good Dog!</button>
            `
            dogInfo.append(dogDiv)
            dogDiv.style.display = 'none'
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

    //event listner for dog show in nav bar
    document.addEventListener('click', e => {
        if(e.target.matches('span')){
            const dogEvent = e.target
            displayDog(dogEvent)
        }else if(e.target.matches('.isGoodDog')) {
            console.log(e.target)
        }else if(e.target.matches('[data-good="false"]')) {
            console.log(e.target)
        }
    })


    loadDogs()
})