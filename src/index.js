document.addEventListener('DOMContentLoaded', e => {
  let allDogs = [];
 
  const fetchDogs = () => {
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(json => {
      allDogs = json;
      addToDogBar(allDogs);
    });
  }

  fetchDogs();

  const addToDogBar = (dogs) => {
    dogBar = document.querySelector('#dog-bar');

    while (dogBar.firstChild) {
      dogBar.removeChild(dogBar.firstChild);
    }

    for (dog of dogs) {
      newSpan = document.createElement('span');
      newSpan.textContent = dog.name;
      newSpan.id = dog.id;
      dogBar.append(newSpan);
    }
  };

  const showInfo = (dog) => {
    const dogInfo = document.querySelector('#dog-info');

    while (dogInfo.firstChild) {
      dogInfo.removeChild(dogInfo.firstChild);
    }

    const dogImg = document.createElement('img');
    dogImg.src = dog.image;
    dogInfo.append(dogImg);

    const dogName = document.createElement('h2');
    dogName.textContent = dog.name;
    dogInfo.append(dogName);

    const dogButton = document.createElement('button');
    dogButton.id = 'toggle-button';
    if (dog.isGoodDog == true) {
      dogButton.textContent = "Good Dog!"
    } else {
      dogButton.textContent = "Bad Dog!"
    }
    dogInfo.append(dogButton);
  };

  const toggleGoodDog = (dog) => {
    const newStat = !allDogs[`${dog.id - 1}`]['isGoodDog'];
    allDogs[`${dog.id - 1}`].isGoodDog = newStat;
    
    
    fetch(`http://localhost:3000/pups/${dog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "isGoodDog": newStat
      })
    })
      .then(resp => resp.json())
      .then(json => renderStatusButton(json))
      .catch(error => console.log(error.message));

      const dogFilter = document.querySelector('#good-dog-filter');
      if (dogFilter.textContent === "Filter good dogs: ON") {
        let goodDogs = allDogs.filter(dog => dog.isGoodDog == true);
        addToDogBar(goodDogs);
      }
  };

  const renderStatusButton = (dog) => {
    const toggleButton = document.querySelector('#toggle-button');
    if (dog.isGoodDog == true) {
      toggleButton.textContent = 'Good Dog!';
    } else {
      toggleButton.textContent = 'Bad Dog!';
    }
  };

  const clickHandler = () => {
    document.addEventListener('click', e => {
      if (e.target.matches('span')) {
        const chosenDog = allDogs.find(dog => dog.id == e.target.id);
        showInfo(chosenDog);
      } else if (e.target.matches('#toggle-button')) {
        const chosenDog = allDogs.find(dog => dog.name == e.target.previousSibling.textContent);
        toggleGoodDog(chosenDog);
      } else if (e.target.matches('#good-dog-filter')) {
        if (e.target.textContent === "Filter good dogs: OFF") {
          e.target.textContent = "Filter good dogs: ON";
          
          let goodDogs = allDogs.filter(dog => dog.isGoodDog == true);
          addToDogBar(goodDogs);
        }
        else {
          e.target.textContent = "Filter good dogs: OFF";
          addToDogBar(allDogs);
        }
      }
    });
  };


  clickHandler();
});