import React, { useEffect, useState } from "react";

const UserProfile = (props) => {

    // console.log(user)
    console.log(props)


    return (
        <div className="userProfile">
            <div class="cell medium-6">
                <div class="profile-info">
                <p>Your Username: {props.user.username}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile