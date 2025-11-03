const STORAGE_KEY = 'sticky_notes';

// Helper function to get all notes from localStorage
function getStoredNotes() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Helper function to save notes to localStorage
function saveStoredNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Generate a simple ID (for demo purposes)
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// ---- Fetch ----
export async function fetchNotes() {
  // Simulate async behavior to match API
  return new Promise((resolve) => {
    setTimeout(() => {
      const notes = getStoredNotes();
      resolve(transformFromBackend(notes));
    }, 100);
  });
}

// ---- Create ----
export async function createNote(frontendNote) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notes = getStoredNotes();
      const newNote = {
        ...transformToBackend(frontendNote),
        id: generateId(),
        owner_id: null // For localStorage version
      };
      
      notes.push(newNote);
      saveStoredNotes(notes);
      
      resolve(newNote);
    }, 100);
  });
}

// ---- Update ----
export async function updateNote(id, frontendNote) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notes = getStoredNotes();
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) {
        reject(new Error('Note not found'));
        return;
      }
      
      // Update the note
      const updatedBackendNote = {
        ...notes[noteIndex],
        ...transformToBackend(frontendNote)
      };
      
      notes[noteIndex] = updatedBackendNote;
      saveStoredNotes(notes);
      
      resolve(updatedBackendNote);
    }, 100);
  });
}

// ---- Delete ----
export async function deleteNote(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notes = getStoredNotes();
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) {
        reject(new Error('Note not found'));
        return;
      }
      
      notes.splice(noteIndex, 1);
      saveStoredNotes(notes);
      
      resolve(true);
    }, 100);
  });
}

function transformFromBackend(backendNotes) {
  return backendNotes.map(note => ({
    $id: note.id,
    body: note.body,
    colors: {
      id: note.color_id,
      colorHeader: note.color_header,
      colorBody: note.color_body,
      colorText: note.color_text,
    },
    position: {
      x: note.pos_x,
      y: note.pos_y,
    },
  }));
}

// Frontend → Backend (same as your API version)
function transformToBackend(frontendNote) {
  return {
    id: frontendNote.$id,
    body: frontendNote.body,
    color_id: frontendNote.colors?.id,
    color_header: frontendNote.colors?.colorHeader,
    color_body: frontendNote.colors?.colorBody,
    color_text: frontendNote.colors?.colorText,
    pos_x: frontendNote.position?.x,
    pos_y: frontendNote.position?.y,
  };
}

// ---- Utility Functions ----

// Clear all notes (useful for demos/testing)
export function clearAllNotes() {
  localStorage.removeItem(STORAGE_KEY);
}

// Export notes data (for backup/sharing)
export function exportNotes() {
  const notes = getStoredNotes();
  return JSON.stringify(notes, null, 2);
}

// Import notes data (for backup/sharing)
export function importNotes(jsonData) {
  try {
    const notes = JSON.parse(jsonData);
    saveStoredNotes(notes);
    return true;
  } catch (error) {
    console.error('Failed to import notes:', error);
    return false;
  }
}

// Add some default demo notes if storage is empty
export function addDemoNotes() {
  const existingNotes = getStoredNotes();
  if (existingNotes.length > 0) return; // Don't add if notes already exist
  
  const demoNotes = [
    {
      id: generateId(),
      body: "Welcome to this Notes App\n\nYou can:\n• Drag me around\n• Edit this text\n• Create new notes",
      color_id: "yellow",
      color_header: "#FFD700",
      color_body: "#FFFACD",
      color_text: "#000000",
      pos_x: 100,
      pos_y: 100,
      owner_id: null
    },
    {
      id: generateId(),
      body: "This version uses localStorage",
      color_id: "blue",
      color_header: "#4A90E2",
      color_body: "#E8F4FD",
      color_text: "#2C3E50",
      pos_x: 350,
      pos_y: 200,
      owner_id: null
    }
  ];
  
  saveStoredNotes(demoNotes);
}