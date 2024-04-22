import React, { useEffect, useState } from "react";
import UserRiffTile from "./UserRiffTile";

const UserProfile = (props) => {
    const [riffs, setRiffs] = useState([]);

    const fetchUsersRiffs = async (userId) => {
        try {
            const response = await fetch (`api/v1/riffs/${userId}`);
            if (!response.ok) {
                throw new Error(`${response.status} (${response.statusText})`);
            }
    
            const responseData = await response.json();
            console.log("BUTT BUTT responseData:", responseData)
            const fetchedRiffs = responseData.riff
            console.log("ASS ASS FetchedRiffs:", fetchedRiffs)
            setRiffs([fetchedRiffs]);
        } catch (error) {
            console.error("Error fetching riffs:", error);
        }
    };
    
    

    useEffect(() => {
        fetchUsersRiffs(props.user.id);
    }, [props.user.id,]);

    console.log("Riffs:", riffs); 

    const riffItems = riffs.map((riff) => (
        <UserRiffTile key={riff.id} submittedAnswer={riff.riffBody} />
    ));

    
    return (
        <div className="userProfile">
            <div>
                <div>
                    <p>Username: {props.user.username}</p>
                    <p>All Previous Riffs:</p>
                    <ul>
                        {riffItems}
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
