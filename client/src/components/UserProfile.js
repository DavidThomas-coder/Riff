import React, { useEffect, useState } from "react";

const UserProfile = (props) => {
    const [riffs, setRiffs] = useState([])

    // console.log(user)
    console.log(props)

    const fetchUsersRiffs = async () => {
        try {
            const response = await fetch (`api/v1/riffs/${props.user.id}`)
            if (!response.ok) {
                throw new Error(`${response.status} (${response.statusText})`)
            }

            const { riff } = await response.json()
        }
    }

useEffect(() => {

})


    return (
        <div className="userProfile">
            <div class="cell medium-6">
                <div class="profile-info">
                <p>Username: {props.user.username}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile