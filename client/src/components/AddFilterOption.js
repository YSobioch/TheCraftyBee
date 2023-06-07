import { useEffect, useState } from 'react'

import '../stylesheets/filterform.css'

export function AddFilterOption(props) { 
    let [formValue, setFormValue] = useState('')
    let [id, setId] = useState(null)
    let [label, setLabel] = useState(null)

    //The fetch functions
    const createShape = async (name) => {
        console.log('getting res')
        fetch(`${process.env.REACT_APP_DOMAIN}/colorsAndShapes/shape`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name: name})
        })

        props.function()
    }

    const createColor = async (name) => {
        fetch(`${process.env.REACT_APP_DOMAIN}/colorsAndShapes/color`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name: name})
        })
        props.function()
    }

    const updateShape = async (id, name) => {
        fetch(`${process.env.REACT_APP_DOMAIN}/colorsAndShapes/shape`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, value: name})
        })
        props.function()
    }

    const updateColor = async (id, name) => {
        fetch(`${process.env.REACT_APP_DOMAIN}/colorsAndShapes/color`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, value: name})
        })
        props.function()
    }

    const deleteShape = async (id) => {
        fetch(`${process.env.REACT_APP_DOMAIN}/colorsAndShapes/shape`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: id})
        })
        props.function()
    }

    const deleteColor = async (id) => {
        fetch(`${process.env.REACT_APP_DOMAIN}/colorsAndShapes/color`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: id})
        })
        props.function()
    }

    //the form functions
    const setLabels = (id, value, label) => {
        setFormValue(value)
        setId(id)
        setLabel(label)
    }

    const filterForm = (
        <div>
        <form>
            <label>{label}</label>
            <br></br>
            <input type='hidden' value={id}></input>
            <input id='color-or-shape-name' onChange={e => setFormValue(e.target.value)} type='text' value={formValue}></input>
        </form>
        <br></br>
        {id !== null ?
            <div>
                {label === 'Type' ? 
                <div>
                    <button onClick={() => updateShape(id, formValue)}>Update</button>
                    <button onClick={() => deleteShape(id)}>Delete</button>
                </div>
                :
                <div>
                    <button onClick={() => updateColor(id, formValue)}>Update</button>
                    <button onClick={() => deleteColor(id)}>Delete</button>
                </div>
                }       
            
            </div>
            :
            <div>
                {label === 'Type' ?
                    <button onClick={() => createShape(formValue)}>Create</button>
                    :
                    <button onClick={() => createColor(formValue)}>Create</button>
                }
                <button onClick={props.function}>Cancel</button>
            </div>
        }
        </div>
    )

    return (
        <div className="filter-form-holder">
            <div className="filter-div">
                <h3>Type <span><button onClick={() => setLabels(null, '', 'Type')}>Add</button></span></h3>
                <div className='filter-options-shapeAndColor-holder'>
                    {props.shapes.map((shape, index) => {
                        return <h4 key={index} onClick={() => setLabels(shape.id, shape.shape, 'Type')}>{shape.shape}</h4>
                    })}
                </div>
                <h3>Color <span><button onClick={() => setLabels(null, '', 'Color')}>Add</button></span></h3>
                <div className='filter-options-shapeAndColor-holder'>
                    {props.colors.map((color, index) => {
                        return <h4 key={index} onClick={() => setLabels(color.id, color.color, 'Color')}>{color.color}</h4>
                    })}
                </div>
                <br></br>
                <br></br>
                {label === null ? <></> : filterForm}
                <br></br>
                <button className='filter-options-exit-button' onClick={() => props.function()}>x</button>
            </div>
        </div>
    )
}