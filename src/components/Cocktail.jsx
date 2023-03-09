import React from 'react';

function Cocktail() {
    const [cocktail, setCocktail] = React.useState({
    });

    const [input, setInput] = React.useState('');
    const [drinkName, setDrinkName] = React.useState('');

    React.useEffect(() => {
        handleClick()
    }, [drinkName])

    function getSpecificCocktail(name) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`)
            .then(res => res.json()) // parse response as JSON
            .then(data => {
                setCocktail({
                    name: data.drinks[0].strDrink,
                    instructions: data.drinks[0].strInstructions,
                    image: data.drinks[0].strDrinkThumb
                })
            })
            .catch(err => {
                console.log(`error ${err}`)
            });
    }

    function handleChange(event) {
        const {value} = event.target
        setInput(value)
    }

    function handleClick() {
        setDrinkName(input)
        getSpecificCocktail(drinkName)
    }

    return (
        <main>
            <div className="form">
                <h3>What would you like to make today?</h3>
                <input 
                    type="text" 
                    className="form-input"
                    name="drinkName"
                    value={input}
                    onChange={handleChange}
                />
                <button
                    className="form-button"
                    onClick={handleClick}
                >
                    Serve
                </button>
            </div>
            
                {drinkName ? 
                    <div className="info">
                        <img src={cocktail.image} alt="cocktail image" />
                        <h2>{cocktail.name}</h2>
                        <h2>Instructions: {cocktail.instructions}</h2>
                    </div>
                    :
                    <div className="no-info">
                    </div>
                }
        </main>
    )
}

export default Cocktail