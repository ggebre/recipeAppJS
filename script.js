const meals = document.getElementById('meals')
const favMealContainer = document.getElementById('fav-meals')

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
    const meals = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term)
    
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
        favMealContainer.innerHTML = ""
        fetchFavMeals()
    })
    meals.appendChild(meal)
}
function addFavMeals(mealData){
    const favMeal = document.createElement('li')
    favMeal.innerHTML = `  
            <img src="${mealData.strMealThumb}" alt="${mealData.Meal}">
            <spam>${mealData.strMeal}</spam>
    `
    favMealContainer.appendChild(favMeal)
}
// save in local storage 
function addMealToLS(mealId){
    const mealIds = getMealsFromS() 
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealFromLS(mealId){
    const mealIds = getMealsFromS() 
    localStorage.removeItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)))

}
function getMealsFromS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'))
    
    return mealIds === null ? [] : mealIds
}

async function fetchFavMeals(){
    const mealIds = getMealsFromS()
    for(let i=0; i < mealIds.length; i++){
        const mealId = mealIds[i] 
        meal = await getMealById(mealId) 
    
        addFavMeals(meal) 
    }
}