import { useState } from 'react'
import '../stylesheets/checkbox.css'

export default function(props) {
    return (
        <>
        <div class="checkbox-wrapper-19">
        <input type="checkbox"  checked={props.checked}/>
        <label for="cbtest-19" class="check-box"/>
        </div>
        </>
    )
}