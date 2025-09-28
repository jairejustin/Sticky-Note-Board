const API_URL = import.meta.env.VITE_API_URL;

// ---- Fetch ----
export async function fetchNotes() {
  const resp = await fetch(`${API_URL}/notes/`);
  if (!resp.ok) {
    throw new Error("Failed to fetch notes");
  }
  const data = await resp.json();
  return transformFromBackend(data);
}

// ---- Create ----
export async function createNote(frontendNote) {
  const payload = transformToBackend(frontendNote);
  const resp = await fetch(`${API_URL}/notes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    throw new Error("Failed to create note");
  }
  return await resp.json();
}

// ---- Update ----
export async function updateNote(id, frontendNote) {
  const payload = transformToBackend(frontendNote);
  const resp = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    throw new Error("Failed to update note");
  }
  return await resp.json();
}

// ---- Delete ----
export async function deleteNote(id) {
  const resp = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
  });
  if (!resp.ok) {
    throw new Error("Failed to delete note");
  }
  return true;
}

// ---- Transformations ----

// Backend → Frontend
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

// Frontend → Backend
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
