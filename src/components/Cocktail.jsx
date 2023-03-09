import React from 'react';
import { useRef } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function Cocktail() {
    // const [cocktail, setCocktail] = React.useState({});

    // const [input, setInput] = React.useState('');
    // const [drinkName, setDrinkName] = React.useState('');

    // React.useEffect(() => {
    //     handleClick()
    // }, [drinkName])

    // function getSpecificCocktail(name) {
    //     fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`)
    //         .then(res => res.json()) // parse response as JSON
    //         .then(data => {
    //             setCocktail({
    //                 name: data.drinks[0].strDrink,
    //                 instructions: data.drinks[0].strInstructions,
    //                 image: data.drinks[0].strDrinkThumb
    //             })
    //         })
    //         .catch(err => {
    //             console.log(`error ${err}`)
    //         });
    // }

    // function handleChange(event) {
    //     const {value} = event.target
    //     setInput(value)
    // }

    // function handleClick() {
    //     setDrinkName(input)
    //     getSpecificCocktail(drinkName)
    // }

    // return (
    //     <main>
    //         <div className="form">
    //             <h3>What would you like to make today?</h3>
    //             <input 
    //                 type="text" 
    //                 className="form-input"
    //                 name="drinkName"
    //                 value={input}
    //                 onChange={handleChange}
    //             />
    //             <button
    //                 className="form-button"
    //                 onClick={handleClick}
    //             >
    //                 Serve
    //             </button>
    //         </div>
            
    //             {drinkName ? 
    //                 <div className="info">
    //                     <img src={cocktail.image} alt="cocktail image" />
    //                     <h2>{cocktail.name}</h2>
    //                     <h2>Instructions: {cocktail.instructions}</h2>
    //                 </div>
    //                 :
    //                 <div className="no-info">
    //                 </div>
    //             }
    //     </main>
    // )

    const [cocktails, setCocktails] = React.useState([]);
    const [cocktail, setCocktail] = React.useState({});
    const [drinkName, setDrinkName] = React.useState('');
    const previousController = useRef();

    React.useEffect(() => {
        getSpecificCocktail(drinkName)
    }, [drinkName])

    function searchCocktails(searchTerm) {
        if (previousController.current) {
            previousController.current.abort();
        }
        const controller = new AbortController();
        const signal = controller.signal;
        previousController.current = controller;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`, {
            signal
        })
        .then(res => res.json())
        .then(data => {
            // console.log("search term: " + searchTerm + ", results: ",
            // data.drinks);
            const updatedCocktails = data.drinks.map((drink) => {
                return { strDrink: drink.strDrink }
            });
            setCocktails(updatedCocktails);
        });
    }

    function getSpecificCocktail(name) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`)
            .then(res => res.json()) // parse response as JSON
            .then(data => {
                setCocktail({
                    name: data.drinks[0].strDrink,
                    instructions: data.drinks[0].strInstructions.split('.').filter(sentence => sentence !== ' '),
                    image: data.drinks[0].strDrinkThumb
                })
                console.log(cocktail.instructions)
            })
            .catch(err => {
                console.log(`error ${err}`)
            });
    }

    function onInputChange(event, value, reason) {
        if (value) {
            searchCocktails(value)
        } else {
            setCocktails([])
        }
    }

    function handleChange(event, value, reason) {
        setDrinkName(value.strDrink)
    }

    function resetSelection() {
        setDrinkName('')
    }

    return (
        <div className='selection'>
            <Autocomplete 
                id="combo-box-demo"
                options={cocktails}
                onInputChange={onInputChange}
                onChange={handleChange}
                getOptionLabel={(option) => option.strDrink}
                style={{ width: 300 }}
                value={null}
                blurOnSelect={true}
                renderInput={(params) => (
                    <TextField {...params} label="Your drink" variant="outlined" />
                )}
            />
                {drinkName ? 
                    <div className="info">
                        <div className='image'>
                            <img src={cocktail.image} alt="cocktail image" />
                        </div>
                        <div className='instructions'>
                            <h2>We will be making <span className='cocktail-name'>{cocktail.name.toLowerCase()}</span>.</h2>
                            <h2 id='instructions'>Instructions: </h2>
                            <ul>{cocktail.instructions.slice(0, cocktail.instructions.length-1).map((sentence) => <li>{sentence.trim()}</li>)}</ul>
                            <button className='clear-btn btn' onClick={resetSelection}>Drink and make another</button>
                        </div>
                    </div>
                    :
                    <div className="no-info">
                        <h3>What would you like to make today?</h3>
                    </div>
                }
        </div>
    )
}

export default Cocktail