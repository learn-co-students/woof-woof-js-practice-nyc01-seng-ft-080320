document.addEventListener("DOMContentLoaded", () => {
    const contentUrl = 'http://localhost:3000/pups/'
    
    const fetchData = () => {
        fetch(contentUrl)
        .then(res => res.json())
        .then(pupData => renderDogs(pupData))
    };

    const patchData = (id, status) => {
        const options = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({ isGoodDog: status })
        };

        fetch(contentUrl + id, options)
        .then(res => res.json())
        .then(dog => {
            console.log(dog)
        })
    };

    const renderDogs = dogArr => {
        dogArr.forEach(dogObj => {
            renderDog(dogObj)
        });

    };

    const renderDog = dogObj => {
        const dogBar = document.querySelector('#dog-bar')
        const dogSpan = document.createElement('SPAN')
        dogSpan.setAttribute('image', dogObj.image)
        dogSpan.setAttribute('isGoodDog', dogObj.isGoodDog)
        dogSpan.setAttribute('id', dogObj.id)
        dogSpan.innerText = dogObj.name
        dogBar.appendChild(dogSpan)
    };
   
    document.addEventListener('click', e => {
        if (e.target.matches('SPAN')) {
            const dogSpan = e.target
            const dogId = dogSpan.getAttribute('id')
            console.log(dogId)
            const dogDiv = document.querySelector('#dog-info')
            if (dogSpan.getAttribute('isGoodDog') === 'true') {
                dogDiv.innerHTML = `
                <img src="${dogSpan.getAttribute('image')}">
                <h2> ${dogSpan.textContent} </h2>
                <button id="${dogId}" class="dog-btn">Good Dog!</button>
                ` 
            } else {
                dogDiv.innerHTML = `
                <img src="${dogSpan.getAttribute('image')}">
                <h2> ${dogSpan.textContent} </h2>
                <button id="${dogId}" class="dog-btn">Bad Dog!</button>
                ` 
            }
        };

        if (e.target.matches('.dog-btn')) {
            console.log(e.target)
            const dogStatusBtn = e.target
            const dogId = dogStatusBtn.id
            
            
            if (dogStatusBtn.textContent === 'Bad Dog!') {
                dogStatusBtn.textContent = 'Good Dog!'
                patchData(dogId, 'true')
            } else {
                dogStatusBtn.textContent = 'Bad Dog!'
                patchData(dogId, 'false')
            }

        };
    });

    fetchData()

});
