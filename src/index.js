const baseURL = "http://localhost:3000/pups/"
let filter = false

document.addEventListener("DOMContentLoaded", e =>{
    playFetch();
    clickHandler();
})  
const playFetch = () => {
    fetch(baseURL)
    .then(response => response.json())
    .then(doggos => {
        document.getElementById("dog-bar").innerText=""
        if (filter){
            for(dog of doggos){
                if (dog.isGoodDog){
                    addDog(dog)
                }
            }
        }
        else{
            for (dog of doggos){
                addDog(dog)
        }
        }
    })
}

const clickHandler = () => {
    document.addEventListener('click', e=>{
        if (e.target.matches("span")){
            dogMe(e.target.dataset.id)
        }else if (e.target.matches(".maybe-evil")){
            let dogID = (e.target.parentElement.dataset.id)
            let status = e.target.dataset.status
            changeDog(dogID, status)
        }else if (e.target.matches("#good-dog-filter")){
            console.log("bitches")
            if (filter){
                filter = false
                e.target.innerText = "Filter good dogs: OFF"
                playFetch()
            }else{
                filter = true
                e.target.innerText="Filter good dogs: ON"
                playFetch()
            }
        }
    })
}

const changeDog = (dogID, status) =>{
    
    if (status === "true"){
        status = false
    }else{
        status = true
    }
    const options = {
        method: "PATCH",
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({isGoodDog: status})
    }
    
    fetch(baseURL + dogID, options)
        .then(response => response.json())
        .then(dog => {
            renderDog(dog);
            console.log(dog)
            playFetch();
        })
}

const dogMe = (dogID) => {
    fetch(baseURL + dogID)
    .then(response => response.json())
    .then(dog => renderDog(dog))
}

const renderDog = (dog) => {
    const dogContainer = document.getElementById("dog-info")
    dogContainer.dataset.id = dog.id
    const doggo = `<img src=${dog.image}>
    <h2>${dog.name}</h2>`
    dogContainer.innerHTML = doggo
    dogContainer.append(boyButton(dog.isGoodDog))
}

const addDog = (dog) => {
    const dogBar = document.getElementById("dog-bar")
    const newDog = document.createElement("span")
    newDog.dataset.id = dog.id
    newDog.innerText = dog.name
    dogBar.append(newDog)
}

const boyButton = (good) =>{
    button = document.createElement("button")
    if (good){
        button.innerText = "Good Boy"
        button.dataset.status =  true
    }else{
        button.innerText = "Bad Boy"
        button.dataset.status = false
    }
    button.classList.add("maybe-evil")
    return button

}
