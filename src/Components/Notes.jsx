import React, { useState } from "react";
import CreateNote from "./CreateNote";

const Notes = () => {
    const [inputText, setInputText] = useState('')
    const [notes, setNotes] = useState([])
    const saveHandler = () => {

    }
  return (
    <div className="notes">
        <CreateNote 
        setInputText ={setInputText}
        inputText ={inputText}
        saveHandler= {saveHandler}
        />
    </div>
  )
}

export default Notes