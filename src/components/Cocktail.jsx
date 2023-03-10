import React from 'react';
import { useRef } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";

function Cocktail() {
    const StyledTextField = styled(TextField)({
        [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: "orange"
        },
        [`&:hover .${outlinedInputClasses.input}`]: {
          color: "orange"
        },
        [`&:hover .${inputLabelClasses.outlined}`]: {
          color: "orange"
        }
    });

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
            })
            .catch(err => {
                console.log(`error ${err}`)
            });
    }

    function getRandomCocktail() {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
            .then(res => res.json()) // parse response as JSON
            .then(data => {
                setCocktail({
                    name: data.drinks[0].strDrink,
                    instructions: data.drinks[0].strInstructions.split('.').filter(sentence => sentence !== ' '),
                    image: data.drinks[0].strDrinkThumb
                })
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
            <div className='buttons'>
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
                        <StyledTextField {...params} label="Your drink" variant="outlined" />
                    )}
                />
                <button className='surprise-brn btn' onClick={getRandomCocktail}><img src={'/surprise.svg'} width="25px" height="25px"></img></button>
            </div>
                {drinkName ? 
                    <div className="info">
                        <div className='image'>
                            <img src={cocktail.image} alt="cocktail image" />
                        </div>
                        <div className='instructions'>
                            <h2>We will be making </h2>
                            <h1 className='cocktail-name'>{cocktail.name.toLowerCase()}</h1>
                            <h2 id='instructions'>Instructions: </h2>
                            <ul>{cocktail.instructions.slice(0, cocktail.instructions.length-1).map((sentence) => <li>{sentence.trim()}</li>)}</ul>
                            <button className='clear-btn btn' onClick={resetSelection}>Drink and make another</button>
                        </div>
                    </div>
                    :
                    <div className="no-info">
                        {/* <h3>What would you like to make today?</h3> */}
                    </div>
                }
        </div>
    )
}

export default Cocktail