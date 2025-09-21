import React from 'react'

const CreateNote = ({inputText, setInputText, saveHandler}) => {
    const char=300;
    const charLimit = char - inputText.length;
  return (
    <div className='create_note'>
      <textarea cols={30}
      rows={10} 
      placeholder='Write here...'
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      maxLength={300}
      > 
      </textarea>

      <div className='footer'>
        <span className='label'>{charLimit} Characters Left</span>
        <button className='Save' onClick={saveHandler}></button>
      </div>
  </div>
  )
}

export default CreateNote