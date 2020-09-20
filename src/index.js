document.addEventListener('DOMContentLoaded', e => {

    const pupUrl = "http://localhost:3000/pups"

    let dogList = []

    const fetchDogs = url => {
        fetch(url)
        .then(response => response.json())
        .then(dogData => renderDogs(dogData));
    }

    const renderDogs = dogArray => {
        for(dog of dogArray) {
            createDogSpan(dog);
            dogList.push(dog);
        }
    }


    const createDogSpan = dogObj => {
        const span = document.createElement('span');
        span.textContent = dogObj.name;
        span.className = "dog";
        span.id = dogObj.id
    
        const dogBar = document.querySelector("#dog-bar");
        dogBar.appendChild(span);
    }


    const createDogInfoDiv = dog => {
        const div = document.createElement('div');
        const isGood = goodBadDog(dog);
        div.dataset.dogId = dog.id;
        div.innerHTML = `
        <img src=${dog.image}>
        <h2>${dog.name}</h2>
        <button id="good-dog-button">${isGood}</button>
        `

        const dogInfo = document.querySelector("#dog-info");
        dogInfo.appendChild(div);
    }

    const goodBadDog = dog => {
        if (dog.isGoodDog === true) {
            return "Good Dog!"
        } else {
            return "Bad Dog!"
        }
    }

    const removeDog = () => {
        const dogInfo = document.querySelector("#dog-info");
        const innerDiv = dogInfo.querySelector('div')
        if (innerDiv) {
            innerDiv.remove();
        } else {
            innerDiv
        }
    }

    const removeDogsInBar = () => {
        const dogBar = document.querySelector("#dog-bar");
        dogBar.innerHTML = "";
        // const innerSpans = dogBar.children;
        // for(const span of innerSpans) {
        //     span.remove();
        // }
    }


    const fetchGoodDogs = url => {
        fetch(url)
        .then(response => response.json())
        .then(dogData => {
            //checkIsGoodDog(dogData);
            for(const dog of dogData ) {
                if (dog.isGoodDog === true) {
                    createDogSpan(dog)
                }
            }
        });
    }


    // const checkIsGoodDog = (dogArray) => {

        
    //     console.log(goodDogs)
    // }

    const clickHandler = () => {
        document.addEventListener("click", e => {
            if (e.target.matches('.dog')) {
                // const 
                removeDog();
                const dogObj = dogList[parseInt(e.target.id) - 1];
                createDogInfoDiv(dogObj)
            } else if (e.target.matches("#good-dog-button")) {
                
                if (e.target.textContent === "Good Dog!") {
                    e.target.textContent = "Bad Dog!"
                } else if (e.target.textContent === "Bad Dog!") {
                    e.target.textContent = "Good Dog!"
                }
                postGoodBoy(e.target)
            } else if (e.target.matches('#good-dog-filter')) {
                removeDog();
                if (e.target.textContent === "Filter good dogs: OFF") {
                    e.target.textContent = "Filter good dogs: ON"
                    removeDogsInBar();
                    fetchGoodDogs(pupUrl);

                } else if (e.target.textContent === "Filter good dogs: ON") {
                    e.target.textContent = "Filter good dogs: OFF"
                    removeDogsInBar();
                    fetchDogs(pupUrl);
                }
                
            }

        })
    }

        const isGoodBoyBoolean = (dog) => {
            if (dog === "Good Dog!") {
                return true
            } else if (dog === "Bad Dog!") {
               return false
            }
        }


        const postGoodBoy = goodDog => {
            const parentDiv = goodDog.parentElement;
            const id = parentDiv.dataset.dogId;
            const content = goodDog.textContent;
            const boolean = isGoodBoyBoolean(content)

            const options = {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({ isGoodDog: boolean })
            };


            fetch(pupUrl + "/" + id, options)
            .then(response => response.json())
            .then(dog => console.log(dog))
        }
            
            

    // createDogInfoDiv({
    //     "id": 1,
    //     "name": "Mr. Bonkers",
    //     "isGoodDog": true,
    //     "image": "https://curriculum-content.s3.amazonaws.com/js/woof-woof/dog_1.jpg"
    // });


    fetchDogs(pupUrl);
    clickHandler()

})