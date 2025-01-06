// filepath: /home/devansh/Desktop/Djang react/frontend/src/pages/AdminPanel.jsx
import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function AdminPanel() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        getNotes();
        const ws = new WebSocket("ws://127.0.0.1:8000/ws/notes/");
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setNotes((prevNotes) => [data.note, ...prevNotes]);
        };
        return () => ws.close();
    }, []);

    const getNotes = () => {
        api.get("/api/admin/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => console.log(err));
    };

    return (

        <div>
            <h1 style={{textAlign:'center'}}>ADMIN</h1>
            <h2>All Notes</h2>
            <div>
                {notes.map((note) => (
                    <Note key={note.id} note={note} />
                ))}
            </div>
        </div>
    );
}

export default AdminPanel;