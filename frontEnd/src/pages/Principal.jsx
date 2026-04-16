import { useState } from 'react'
import { useEffect } from 'react';
import '../App.css'
import { data } from 'react-router';

function Card({ character, func }) {
    return (
        <div className="card">
            <h1>{character.name}</h1>
            <img src={character.image} alt={character.name} />
            <p>{character.description}</p>
            <div className='favorite'>
                <div>
                <input type="checkbox" className='fav' onChange={(e) => func({e, character})} />
                </div>
                <div>
                <h5 className='texto_favoritos'>Añadir a Favoritos</h5>
                </div>
            </div>
        </div>
    )
}

function Search({ func }) {
    const [value, setValue] = useState('')
    return(
        <>
            <div className='div_buscador'>
                Buscador: 
                <input className='input_Search' 
                placeholder='ingresa tu busqueda' 
                type='text' value={value} 
                onChange={(e) => 
                (setValue(e.target.value),
                console.log(e.target.value))} />

                <button className='boton_search' onClick={() => func({value})}>Buscar </button>
            </div>
        </>
    );
}

function Render_Character ({ characters, handleFavoriteChange }){
    return(
        <div className="cards-container">
            {characters.map(
                (char) => (
                    <span className="cards" key={char.id}>
                        <Card character={char} func={handleFavoriteChange} />
                    </span>
                )
            )}
        </div>
    );
}

export default function Principal() {
    const [character, setCharacter] = useState([]);

    const [charFilter, setCharFilter] = useState([])

    useEffect(() => {
        fetch('http://localhost:3000/')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setCharacter(data.results)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    function handleFavoriteChange({e, character}) {
        console.log(e, character);
        if (e.target.checked) {
            fetch('http://localhost:3000/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(character)
            })
                .then(response => response.json())
                .then(data => console.log(data))
            console.log("Agregado a favoritos");
        } else {
            fetch('http://localhost:3000/delete-favorite/' + character.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => console.log(data))
            console.log("Eliminado de favoritos");
        }
    }

    function Filtrar({ value }) {
        const filtrados = character.filter((char => char.name.toLowerCase().includes(value.toLowerCase())));
        setCharFilter(filtrados)
    }

    return (
        <>
            <div className="title">
                <h1>Principal</h1>
            </div>
            <Search func={Filtrar}/>
            <Render_Character characters={charFilter.length > 0 ? charFilter : character} handleFavoriteChange={handleFavoriteChange}/>
        </>
    )
}
