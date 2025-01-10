import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Vregister = () => {
    window.location.href = "/vregister";
};

function Home() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [parkingrecords, setParkingrecords] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [user, setUser] = useState(null);
    const [vehicle, setVehicle] = useState("");
    const [entry_time, setEntry_time] = useState("");

    useEffect(() => {
        getNotes();
        getUserDetails();
        getParkingRecords();
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

    const getParkingRecords = () => {
        api.get("/api/parkingrecords/")
            .then((res) => res.data)
            .then((data) => {
                setParkingrecords(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const createNote = (e) => {
        e.preventDefault();
        api.post("/api/notes/", { content, title })
            .then((res) => {
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const createParkingRecord = (e) => {
        e.preventDefault();
        const currentDateTime=new Date().toISOString().slice(0,19)
        api.post("/api/parkingrecords/", { Vehicle: vehicle, entry_time:currentDateTime })
            .then((res) => {
                getParkingRecords();
            })
            .catch((err) => {
                console.log(err.response.data); // Corrected logging
                alert(err.response.data);
            });
    };

    const deleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const logout = () => {
        window.location.href = "/logout";
    };

    return (
        <div>
            <button className="logout-btn" onClick={logout}>Logout</button>
            <button className="Vregister-btn" onClick={Vregister}>Register New Vehicle</button>

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

            <h2>Create Vehicle Parking Record</h2>
            <form onSubmit={createParkingRecord}>
                <label htmlFor="vehicle">Vehicle:</label>
                <br />
                <input
                    type="text"
                    id="vehicle"
                    name="vehicle"
                    required
                    onChange={(e) => setVehicle(e.target.value)}
                    value={vehicle}
                />
                {/* <label htmlFor="entry_time">Entry Time:</label>
                <br />
                <input
                    type="datetime-local"
                    id="entry_time"
                    name="entry_time"
                    required
                    value={entry_time}
                    onChange={(e) => setEntry_time(e.target.value)}
                />
                <br /> */}
                <button className="submit-btn" type="submit">Submit</button>
            </form>

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

            <div>
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
            </div>

            <div>
                <h2>Parking Records</h2>
                {parkingrecords.map((record) => (
                    <div key={record.id}>
                        <p>Vehicle: {record.Vehicle}</p>
                        <p>Entry Time: {record.entry_time}</p>
                        <p>Exit Time: {record.exit_time}</p>
                        <p>Charge: {record.charge}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;