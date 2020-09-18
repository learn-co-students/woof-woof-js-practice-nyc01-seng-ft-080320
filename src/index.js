document.addEventListener('DOMContentLoaded', () => {
  const dogBar = document.querySelector('#dog-bar')

  document.addEventListener('click', e => {
    if(e.target.id === 'good-dog-filter') {
      filterDogs(e.target)
    }else if(e.target.tagName === 'SPAN') {
      getSingleDog(e.target.dataset.id)
    }else if(e.target.id === 'dog-change') {
      updateDog(e.target.dataset.good, e.target.dataset.id)
    }
  })

  const filterDogs = (filterButton) => {
    if(filterButton.innerText.split(' ')[3] == 'OFF'){
      filterButton.innerText = 'Filter good dogs: ON'
      hideDogs(true)
    } else {
      filterButton.innerText = 'Filter good dogs: OFF'
      hideDogs()
    }
  }

  const hideDogs = (boolean) => {
    const dogSpanList = dogBar.querySelectorAll('span')
    for (const dogSpan of dogSpanList) {
      if(dogSpan.dataset.good == 'false' && boolean){
        dogSpan.style.display = 'none'
      }else{
        dogSpan.style.display = ''
      }
    }
  }

  const getDogs = () => {
    fetch('http://localhost:3000/pups')
      .then(resp => resp.json())
      .then(data => dogArr(data))
  }

  const dogArr = (dogs) => {
    for (const dog of dogs) {
      showDog(dog)
    }
  }

  const showDog = (dog) => {
    const newSpan = document.createElement('span')
    newSpan.innerText = dog.name
    newSpan.dataset.id = dog.id
    newSpan.dataset.good = dog.isGoodDog
    dogBar.append(newSpan)
  }

  const getSingleDog = (id) => {
    fetch(`http://localhost:3000/pups/${id}`)
      .then(resp => resp.json())
      .then(data => displayDog(data))
  }

  const updateDog = (goodDog, id) => {
    let trueCheck = (goodDog == 'true')
    let findDogSpan = dogBar.querySelector(`[data-id='${id}'`)
    findDogSpan.dataset.good = !trueCheck
    const filterButton = document.querySelector('#good-dog-filter')
    if(filterButton.innerText.split(' ')[3] == 'ON'){hideDogs(true)}
    const options = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        isGoodDog: !trueCheck
      })}
    fetch(`http://localhost:3000/pups/${id}`, options)
      .then(resp => resp.json())
      .then(data => displayDog(data))
  }

  const displayDog = (dogObj) => {
    const dogInfo = document.querySelector('#dog-info')
    let goodOrBad = 'Bad Dog!'
    if(dogObj.isGoodDog) {
      goodOrBad = 'Good Dog!'
    }
    dogInfo.innerHTML = `
      <img src=${dogObj.image}>
      <h2 >${dogObj.name}</h2>
      <button id='dog-change' data-good=${dogObj.isGoodDog} data-id=${dogObj.id}>${goodOrBad}</button>
      `
  }

  getDogs()

})