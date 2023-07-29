import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Dropzone from "react-dropzone"
import ProfileImage from "./ProfileImage";

const UserProfile = ({ user }) => {


    return (
        <div className="userProfile">
            <div class="cell medium-6">
                <div class="profile-info">
                <p>Your Username: {user.username}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile