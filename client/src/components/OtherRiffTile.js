import React, { useState, useEffect } from "react";

const OtherRiffTile = ({ riff, userId }) => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        console.log("Received userId:", userId); // Log the userId to verify if it's correct
        console.log("Received riff:", riff)
        const fetchUsername = async () => {
        try {
            // Fetch the username from the backend using the userId
            const response = await fetch(`/api/v1/users/${userId}`);
            if (!response.ok) {
            throw new Error(`${response.status} (${response.statusText})`);
            }
            const data = await response.json();
            console.log("Data:", data)
            console.log("Username for user ID", userId, ":", data.user.username);
            setUsername(data.user.username);
        } catch (error) {
            // If an error occurs while fetching the username, handle it gracefully
            console.error("Error fetching the username:", error);
        }
        };

        // Call the fetchUsername function when the component mounts
        fetchUsername();
    }, [userId]);

    return (
        <div className="other-riff-tile">
        <p>{username}'s Riff:</p>
        <p>{riff}</p>
        </div>
    );
};

export default OtherRiffTile;