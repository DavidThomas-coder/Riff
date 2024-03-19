import React, { useEffect, useState } from "react";

const UserProfile = (props) => {
    const [riffs, setRiffs] = useState([]);

    const fetchUsersRiffs = async (userId) => {
        try {
            const response = await fetch (`api/v1/riffs/${userId}`);
            if (!response.ok) {
                throw new Error(`${response.status} (${response.statusText})`);
            }

            const fetchedRiffs = await response.json();
            setRiffs(fetchedRiffs);
        } catch (error) {
            console.error("Error fetching riffs:", error);
        }
    };

    useEffect(() => {
        fetchUsersRiffs(props.user.id);
    }, [props.user.id]);

    return (
        <div className="userProfile">
            <div class="cell medium-6">
                <div class="profile-info">
                    <p>Username: {props.user.username}</p>
                    <p>Riffs:</p>
                    <ul>
                        {riffs.map((riff) => (
                            <li key={riff.id}>{riff.title}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;




// const response = await fetch (`api/v1/riffs/${props.user.id}`)
//             if (!response.ok) {
//                 throw new Error(`${response.status} (${response.statusText})`)
//             }

//             const { riff } = await response.json()