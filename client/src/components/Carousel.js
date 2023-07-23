import { useState } from "react";
import CarouselPictures from "./CaroselPictures";

import '../stylesheets/carousel.css'

export default function Carousel() {
    let [selected, setSelected] = useState([
        <li id="0" className="selected" onClick={() => {selectionHelper(0)}}>collection</li>,
        <li id="1" className="selector" onClick={() => {selectionHelper(1)}}>color</li>,
        <li id="2" className="selector" onClick={() => {selectionHelper(2)}}>type</li>,
    ])

    let [number, setNumber] = useState(2)

    const selections = [
        <li id="0" className="selector" onClick={() => {selectionHelper(0)}}>collection</li>,
        <li id="1" className="selector" onClick={() => {selectionHelper(1)}}>color</li>,
        <li id="2" className="selector" onClick={() => {selectionHelper(2)}}>type</li>,
    ]

    const selectionsSelected = [
        <li id="0" className="selected" onClick={() => {selectionHelper(0)}}>collection</li>,
        <li id="1" className="selected" onClick={() => {selectionHelper(1)}}>color</li>,
        <li id="2" className="selected" onClick={() => {selectionHelper(2)}}>type</li>,
    ]

    const selectionHelper = (num) => {
        let newSelected = [...selections]
        newSelected[num] = selectionsSelected[num]
        setSelected(newSelected)
        setNumber(num)
    }

    return (
        <>
        <ul className='select-by'>
                <li>SHOP BY:</li>
                <li id="0" className="selected" onClick={() => {selectionHelper(0)}}>collection</li>
        </ul>
        <CarouselPictures />
        </>
    )
}