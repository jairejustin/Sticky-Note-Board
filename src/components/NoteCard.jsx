import { useRef, useEffect, useState } from "react";
import { setNewOffset, autoGrow, setZIndex } from "../utils.js";
import { updateNote, createNote, deleteNote } from "../API/notes-local";
import Trash from "../icons/Trash.jsx";

const NoteCard = ({ note, onNoteDeleted }) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState(note.position);
  const [body, setBody] = useState(note.body);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const colors = note.colors;
  const textAreaRef = useRef(null);
  const id = note.$id; // Use $id for consistency

  // Debounce timers
  const positionSaveTimer = useRef(null);
  const textSaveTimer = useRef(null);

  // Simple drag state
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0,
  });

  // Auto-save function
  const saveNote = async (updates) => {
    try {
      setIsSaving(true);

      const updatedNote = {
        ...note,
        body: body,
        position: position,
        ...updates,
      };

      await updateNote(note.$id, updatedNote);
      console.log("Note saved successfully");
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced save for position changes
  const savePositionAfterDelay = (newPosition) => {
    if (positionSaveTimer.current) {
      clearTimeout(positionSaveTimer.current);
    }

    positionSaveTimer.current = setTimeout(() => {
      saveNote({ position: newPosition });
    }, 1000);
  };

  // Debounced save for text changes
  const saveTextAfterDelay = (newText) => {
    if (textSaveTimer.current) {
      clearTimeout(textSaveTimer.current);
    }

    textSaveTimer.current = setTimeout(() => {
      saveNote({ body: newText });
    }, 1000);
  };

  // Get coordinates from mouse or touch event
  const getCoords = (e) => {
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  // Constrain position within workspace
  const constrainPosition = (x, y) => {
    const margin = 20;
    const cardWidth = 400;
    const cardHeight = 200;

    // Get workspace size
    const workspace = document.querySelector(".notes-container");
    const maxX = workspace ? workspace.offsetWidth - cardWidth - margin : 3000;
    const maxY = workspace ? workspace.offsetHeight - cardHeight - margin : 2000;

    return {
      x: Math.max(margin, Math.min(maxX, x)),
      y: Math.max(margin, Math.min(maxY, y)),
    };
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    moveDrag(e);
  };

  const handleMouseUp = (e) => {
    endDrag();
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Touch events - simplified
  const handleTouchStart = (e) => {
    // Don't prevent default immediately - let's see if touch works
    startDrag(e);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    // Only prevent default if we're actually dragging
    if (dragState.current.isDragging) {
      e.preventDefault();
      moveDrag(e);
    }
  };

  const handleTouchEnd = (e) => {
    endDrag();
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);
  };

  // Core drag functions
  const startDrag = (e) => {
    const coords = getCoords(e);
    const rect = cardRef.current.getBoundingClientRect();

    dragState.current = {
      isDragging: true,
      startX: coords.x,
      startY: coords.y,
      initialLeft: rect.left,
      initialTop: rect.top,
    };

    setIsDragging(true);
    setZIndex(cardRef.current);

    // Disable text selection
    document.body.style.userSelect = "none";
  };

  const moveDrag = (e) => {
    if (!dragState.current.isDragging) return;

    const coords = getCoords(e);
    const deltaX = coords.x - dragState.current.startX;
    const deltaY = coords.y - dragState.current.startY;

    const newX = dragState.current.initialLeft + deltaX;
    const newY = dragState.current.initialTop + deltaY;

    const constrainedPos = constrainPosition(newX, newY);
    setPosition(constrainedPos);
  };

  const endDrag = () => {
    if (!dragState.current.isDragging) return;

    dragState.current.isDragging = false;
    setIsDragging(false);

    // Re-enable text selection
    document.body.style.userSelect = "";

    // Save position
    savePositionAfterDelay(position);
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      await deleteNote(id);
      if (onNoteDeleted) onNoteDeleted(id);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setBody(newText);
    saveTextAfterDelay(newText);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      // Clear timers
      if (positionSaveTimer.current) clearTimeout(positionSaveTimer.current);
      if (textSaveTimer.current) clearTimeout(textSaveTimer.current);

      // Cleanup any stuck states
      document.body.style.userSelect = "";

      // Remove any lingering listeners
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    autoGrow(textAreaRef);
  }, [body]);

  return (
    <div
      ref={cardRef}
      className={`card ${isSaving ? "saving" : ""} ${isDragging ? "dragging" : ""}`}
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <button
          id="delete-button"
          style={{ backgroundColor: colors.colorHeader, borderColor: colors.colorHeader }}
          onClick={handleDelete}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <Trash />
        </button>

        {isSaving && (
          <div className="save-indicator">Saving...</div>
        )}
      </div>
      <div className="card-body">
        <textarea
          style={{ color: colors.colorText }}
          value={body}
          ref={textAreaRef}
          onChange={handleTextChange}
          onInput={() => autoGrow(textAreaRef)}
          onFocus={() => {
            setZIndex(cardRef.current);
          }}
        />
      </div>
    </div>
  );
};

export default NoteCard;