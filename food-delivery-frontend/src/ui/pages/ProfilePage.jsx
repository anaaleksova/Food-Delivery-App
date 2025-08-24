import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token"); // or wherever you store it
        axios
            .get("http://localhost:8080/api/user/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUser(res.data))
            .catch((err) => console.error(err));
    }, []);

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4">My Profile</Typography>
            <TextField label="Name" value={user.name} fullWidth margin="normal" disabled />
            <TextField label="Surname" value={user.surname} fullWidth margin="normal" disabled />
            <TextField label="Username" value={user.username} fullWidth margin="normal" disabled />
            <TextField label="Email" value={user.email} fullWidth margin="normal" disabled/>
            {/* add more fields if needed */}
        </Box>
    );
};

export default ProfilePage;
