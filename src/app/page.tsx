"use client";

import { Note } from "@/types";
import { useEffect, useState, FC } from "react";

const Home: FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL || "");
      const data: Note[] = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addClick = async () => {
    if (newNote.trim() === "") {
      alert("Please enter a note");
      return;
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_POST_DATA || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newNote }),
      });
      const result = await response.json();
      alert(result.message || "Note added successfully");
      setNewNote("");
      loadData();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };
  const deleteClick = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DELETE_DATA}?id=${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      alert(result.message || "Note deleted successfully");
      loadData();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      <input
        type="text"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />
      &nbsp;
      <button onClick={addClick}>Add Notes</button>
      {notes.map((note) => (
        <div key={note.id}>
          <p>* {note.description}</p>
          <button onClick={() => deleteClick(Number(note.id))}>
            Delete Notes
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;
