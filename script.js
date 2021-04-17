const mealsEl = document.getElementById('meals')
const favMealContainer = document.getElementById('fav-meals') 
const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')

const mealPopup = document.getElementById("meal-popup")
const popupCloseBtn = document.getElementById("close-popup")
const mealInfo = document.getElementById('meal-info')

getRandomMeal()
fetchFavMeals()


async function getRandomMeal(){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    const respData = await resp.json(); 
    const randomMeal = respData.meals[0] 
    
    addMeal(randomMeal, true)
}
async function getMealById(id){
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const respData = await resp.json(); 
    const meal = respData.meals[0] 
    
    return meal 
}
async function getMealBySearch(term){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term)
    const respData = await resp.json(); 
    const meals = respData.meals 

    return meals
}
function addMeal(mealData, random = false){
    
    const meal = document.createElement('div')
    meal.classList.add('meal');
    
    meal.innerHTML = `           
    <div class="meal-header">
        ${random ? 
            `<span class="random">Random Recipe</span> `
            :
            "" }
        <img 
            src="${mealData.strMealThumb}" 
            alt="${mealData.Meal}" 
            />
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn">
            <i class="fas fa-heart"></i>
        </button>
    </div>
    `
    const btn = meal.querySelector('.meal-body .fav-btn')
    
    btn.addEventListener('click', (e) => {
        if(btn.classList.contains('active')){
            removeMealFromLS(mealData.idMeal)
            btn.classList.remove('active')
        }else{
            addMealToLS(mealData.idMeal)
            btn.classList.add('active')
        }
        
        fetchFavMeals()
    })
    mealsEl.appendChild(meal)
}
function addFavMeals(mealData){
    
    const favMeal = document.createElement('li')
    favMeal.innerHTML = `  
            <img src="${mealData.strMealThumb}" alt="${mealData.Meal}">
            <spam>${mealData.strMeal}</spam>

            <button class="clear"><i class="fas fa-window-close"></i></button>
    `
    const btn = favMeal.querySelector('.clear') 
    btn.addEventListener('click', () => {
        removeMealFromLS(mealData.idMeal)
        fetchFavMeals()
    })
    // show the recipe of an item when clicked!!!!
    console.log(mealData)
    favMeal.addEventListener('click', () => {
        showMealInfo(mealData)
        ingredientsOfAMeal(mealData)
    })
    favMealContainer.appendChild(favMeal)
}
// save in local storage 
function addMealToLS(mealId){
    const mealIds = getMealsFromS() 
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealFromLS(mealId){
    const mealIds = getMealsFromS() 
    
    localStorage.setItem(
        'mealIds', 
        JSON.stringify(mealIds.filter(id => id !== mealId)))
}
function getMealsFromS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'))
    
    return mealIds === null ? [] : mealIds
}

async function fetchFavMeals(){
    favMealContainer.innerHTML = ""
    const mealIds = getMealsFromS()
    for(let i=0; i < mealIds.length; i++){
        const mealId = mealIds[i] 
        meal = await getMealById(mealId) 
        addFavMeals(meal) 
    }
} 

function showMealInfo(mealData){
    mealInfo.innerHTML = ""
    const mealE1 = document.createElement('div')
    
    mealE1.innerHTML = `
            <h1>${mealData.strMeal}</h1>
            <img src="${mealData.strMealThumb}" alt="">
            <p>${mealData.strInstructions}</p>
            <h3> Ingredients </h3>
            <ul>
                ${ingredientsOfAMeal(mealData)}
            </ul>
    `
    mealPopup.classList.remove('hidden')

    mealInfo.appendChild(mealE1)

}
function ingredientsOfAMeal(mealData){
    let count = 1
    let check = true 
    let ingredientList = ""
    while(check){
        if(mealData[`strIngredient${count}`] !== ""){
            ingredientList += `<li>${mealData[`strIngredient${count}`]}------${mealData[`strMeasure${count}`]}</li>`
            count++
        } else {
            check = !check
        } 
    }
    return ingredientList
}

searchBtn.addEventListener('click', async () => {
    mealsEl.innerHTML = ""

    const term = searchTerm.value
    const meals = await getMealBySearch(term)
    if(meals){
        meals.forEach(meal => {
            addMeal(meal)
        })
    }
    
})
popupCloseBtn.addEventListener('click', () => {
    mealPopup.classList.add("hidden")
})


