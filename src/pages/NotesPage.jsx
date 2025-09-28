import React, { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import AddNoteButton from "../components/AddNoteButton";
import { fetchNotes, addDemoNotes } from "../API/notes-local";



const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        // Add demo notes if this is the first time
        addDemoNotes();
        const data = await fetchNotes();
        setNotes(data || []);
      } catch (err) {
        console.error('Error loading notes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  const handleNoteAdded = (newNote) => {
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  const handleNoteDeleted = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.$id !== noteId));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div id="app">
      <div className="notes-container">
        <AddNoteButton onNoteAdded={handleNoteAdded} />
        {Array.isArray(notes) && notes.map((note) => (
          <NoteCard 
            note={note} 
            key={note.$id}
            onNoteDeleted={handleNoteDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesPage;