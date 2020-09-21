const PUPS_BASE_URL = "http://localhost:3000/pups"

document.addEventListener("DOMContentLoaded", () => {

    let filter = false

    const getDogs = () => {
        fetch(PUPS_BASE_URL)
        .then(response => response.json())
        .then(pups => renderPups(pups))
    }

    const renderPups = pups => {
        const dogBar = document.querySelector("#dog-bar")
        dogBar.innerHTML = ""
        if (filter) {
            pups.filter(pup => pup.isGoodDog === true).map(renderPup)
        } else {
            pups.map(renderPup)
        }
    }

    const renderPup = pup => {
        const dogBar = document.querySelector("#dog-bar")
        const dogSpan = document.createElement("span")
        dogSpan.dataset.pup_id = pup.id
        dogSpan.innerText = pup.name
        dogBar.append(dogSpan)
    }

    const clickHandler = () => {
        document.addEventListener("click", (e) => {
            if (e.target.matches("span")) {
                clearPupCard();
                getDog(e.target.dataset.pup_id);
            } else if (e.target.matches(".dog-button")) {
                toggleGoodBad(e.target.dataset.id);
            } else if (e.target.matches("#good-dog-filter")) {
                changeFilter();
                getDogs();
            }
        })
    }

    const changeFilter = () => {
        filter = !filter
        const button = document.querySelector("#good-dog-filter")
        if (filter) {
            button.innerText = "Filter good dogs: ON"
        } else {
            button.innerText = "Filter good dogs: OFF"
        }
    }

    const getDog = (id) => {
        fetch(PUPS_BASE_URL+"/"+id)
        .then(response => response.json())
        .then(pup => showPupCard(pup))
    }

    const showPupCard = (pup) => {
        const pupCardDiv = document.querySelector("#dog-info")
        let attitude = (pup.isGoodDog === true) ? "Bad" : "Good"
        pupCardDiv.innerHTML =
        `<img src=${pup.image}>
        <h2>${pup.name}</h2>
        <button class="dog-button" data-id=${pup.id}>${attitude} Dog!</button>`
    }

    const clearPupCard = () => {
        const pupCardDiv = document.querySelector("#dog-info")
        pupCardDiv.innerHTML = ""
    }


    const toggleGoodBad = (pup_id) => {

        const url = `${PUPS_BASE_URL}/${pup_id}`

        const dogDiv = document.querySelector("#dog-info")
        const attitude = dogDiv.querySelector("button").textContent.split(" ")[0]
        let opposite = (attitude === "Good") ? true : false

        const pupObj = {
            isGoodDog: opposite
        }

        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(pupObj)
        }

        fetch(url, options)
        .then(response => response.json())
        .then(pup => showPupCard(pup))
    }

    clickHandler();
    getDogs();
})