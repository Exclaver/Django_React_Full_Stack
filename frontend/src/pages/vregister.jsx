import React, { useState } from "react";
import api from "../api";

const Home= () => {
    window.location.href = "/";
};
const Vregister = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/api/user/vregister/", {
                username,
                password,
                license_plate: licensePlate,
            });
            alert("Vehicle registered successfully.");
        } catch (error) {
            const errorData = error.response?.data;
            let errorMessage = "Error registering vehicle.";
            if (errorData) {
                errorMessage = Object.values(errorData).flat().join(", ");
            }
            alert(`Error registering vehicle: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
        Home();
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="New Plate Number to Add"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Vregister;