import { useState, useRef, useEffect } from "react";
import { createNote } from "../API/notes-local";
//import { createNote } from "../API/notes";

const COLOR_PRESETS = [
  {
    id: "yellow",
    name: "Yellow",
    colorHeader: "#FFD700",
    colorBody: "#FFFACD",
    colorText: "#000000"
  },
  {
    id: "blue",
    name: "Blue", 
    colorHeader: "#4A90E2",
    colorBody: "#E8F4FD",
    colorText: "#2C3E50"
  },
  {
    id: "green",
    name: "Green",
    colorHeader: "#2ECC71",
    colorBody: "#E8F8F5", 
    colorText: "#1B4332"
  },
  {
    id: "pink",
    name: "Pink",
    colorHeader: "#E91E63",
    colorBody: "#FCE4EC",
    colorText: "#880E4F"
  },
  {
    id: "purple",
    name: "Purple",
    colorHeader: "#9C27B0",
    colorBody: "#F3E5F5",
    colorText: "#4A148C"
  },
  {
    id: "orange",
    name: "Orange",
    colorHeader: "#FF9800",
    colorBody: "#FFF3E0",
    colorText: "#E65100"
  }
];

const AddNoteButton = ({ onNoteAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const createNewNote = async (selectedColor) => {
    try {
      setIsCreating(true);
      
      // Generate a random position so notes don't stack
      const randomX = Math.floor(Math.random() * 400) + 50;
      const randomY = Math.floor(Math.random() * 300) + 50;
      
      const newNote = {
        body: "New Note",
        colors: selectedColor,
        position: { x: randomX, y: randomY }
      };

      const createdNote = await createNote(newNote);
      
      // Transform the created note to frontend format
      const transformedNote = {
        $id: createdNote.id,
        body: createdNote.body,
        colors: {
          id: createdNote.color_id,
          colorHeader: createdNote.color_header,
          colorBody: createdNote.color_body,
          colorText: createdNote.color_text,
        },
        position: {
          x: createdNote.pos_x,
          y: createdNote.pos_y,
        },
      };

      // Notify parent component
      onNoteAdded(transformedNote);
      setIsOpen(false);
      
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleColorSelect = (color) => {
    createNewNote(color);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isCreating}
      >
        <span>{isCreating ? 'Creating...' : '+ Add Note'}</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`} 
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            Choose a color:
          </div>
          
          <div className="dropdown-options">
            {COLOR_PRESETS.map(color => (
              <button
                key={color.id}
                className="dropdown-option"
                onClick={() => handleColorSelect(color)}
                style={{
                  backgroundColor: color.colorBody,
                  borderLeft: `4px solid ${color.colorHeader}`
                }}
              >
                <div className="option-content">
                  <div 
                    className="color-dot"
                    style={{ backgroundColor: color.colorHeader }}
                  ></div>
                  <span className="color-name">{color.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNoteButton;