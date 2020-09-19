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
        div.innerHTML = `
        <img src=${dog.image}>
        <h2>${dog.name}</h2>
        <button>${isGood}</button>
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
        const childNode = dogInfo.childNode;

        if (childNode) {
            childNode.remove()
        }

    }

    removeDog();

    const clickHandler = () => {
        document.addEventListener("click", e => {
            if (e.target.matches('.dog')) {
                // const 
                removeDog();
                const dogObj = dogList[parseInt(e.target.id) - 1];
                createDogInfoDiv(dogObj)
            }

        })
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