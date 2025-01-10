import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function AdminPanel() {
    const [notes, setNotes] = useState([]);
    const [parkingRecords, setParkingRecords] = useState([]);
    const [currentSection, setCurrentSection] = useState("notes");

    useEffect(() => {
        getNotes();
        getParkingRecords();
    
        const notesWs = new WebSocket("ws://127.0.0.1:8000/ws/notes/");
        notesWs.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setNotes((prevNotes) => [data.note, ...prevNotes]);
        };
    
        const parkingRecordsWs = new WebSocket("ws://127.0.0.1:8000/ws/parking_records/");
        parkingRecordsWs.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setParkingRecords((prevRecords) => [data.parking_record, ...prevRecords]);
        };
    
        return () => {
            notesWs.close();
            parkingRecordsWs.close();
        };
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

    const getParkingRecords = () => {
        api.get("/api/parkingrecords/")
            .then((res) => res.data)
            .then((data) => {
                setParkingRecords(data);
                console.log(data);
            })
            .catch((err) => console.log(err));
    };

    const handleSectionSwitch = (section) => {
        setCurrentSection(section);
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>ADMIN</h1>
            <div style={{ textAlign: 'center' }}>
                <button onClick={() => handleSectionSwitch("notes")}>Notes</button>
                <button onClick={() => handleSectionSwitch("parking")}>Parking Records</button>
            </div>

            {currentSection === "notes" && (
                <>
                    <h2>All Notes</h2>
                    <div>
                        {notes.map((note) => (
                            <Note note={note} key={note.id} />
                        ))}
                    </div>
                </>
            )}

            {currentSection === "parking" && (
                <>
                    <h2>Vehicle Entry Records</h2>
                    <div>
                        {parkingRecords.map((record) => (
                            <div key={record.id}>
                                <p>Vehicle: {record.Vehicle}</p>
                                <p>Entry Time: {new Date(record.entry_time).toLocaleString()}</p>
                                <p>Exit Time: {record.exit_time ? new Date(record.exit_time).toLocaleString() : "N/A"}</p>
                                <p>Charge: {record.charge}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminPanel;