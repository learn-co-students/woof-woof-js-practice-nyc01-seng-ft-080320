document.addEventListener("DOMContentLoaded", () => {
    const contentUrl = 'http://localhost:3000/pups/'
    let status = 'inactive'
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
   

    const dogFilter = display => {
        const badDogs = document.querySelectorAll('[isGoodDog="false"]')
                badDogs.forEach(dog => {
                dog.className = display
                });

    }

    document.addEventListener('click', e => {
        if (e.target.matches('SPAN')) {
            const dogSpan = e.target
            const dogId = dogSpan.getAttribute('id')
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

    
         if (e.target.matches("#good-dog-filter")) {
            const filterBtn = e.target
            if (status == 'inactive') {
               dogFilter('hide') 
               filterBtn.innerText = "Filter Good Dogs: ON"
               status = 'active'
            } else if (status == 'active') {
                dogFilter('show') 
               filterBtn.innerText = "Filter Good Dogs: OFF"
               status = 'inactive'
            }

            
        
        };
    });

    fetchData()

});

