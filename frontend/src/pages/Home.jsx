import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
const Vregister= () => {
    window.location.href = "/vregister";
};
function Home() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        getNotes();
        getUserDetails();
    }, []);

    const getNotes = () => {
        api.get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const getUserDetails = () => {
        api.get("/api/user/details/")
            .then((res) => res.data)
            .then((data) => {
                setUser(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api.delete(`api/notes/delete/${id}/`)
            .then((res) => {
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const logout = () => {
        window.location.href = "/logout";
    };

    const createNote = (e) => {
        e.preventDefault();
        api.post("/api/notes/", { content, title })
            .then((res) => {
                getNotes();
            })
            .catch((err) => alert(err));
    };

    return (
        <div>
                {user && (
                    <div>
                        <h2>User Details</h2>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Credits: {user.credits}</p>
                        <h3>Vehicles</h3>
                        <ul>
                            {user.vehicles.map((vehicle) => (
                                <li key={vehicle.license_plate}>{vehicle.license_plate}</li>
                            ))}
                        </ul>
                    </div>
                )}
            <button className="logout-btn" onClick={logout}>Logout</button>

            <button className="Vregister-btn" onClick={Vregister}>
        Register New Vehicle
      </button>
            <h2>Create a Note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <br />
                <button className="submit-btn" type="submit">Submit</button>
            </form>


            <div>
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
            </div>
        </div>
    );
}

export default Home;