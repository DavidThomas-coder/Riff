import React from "react"

const UserProfile = ({ user }) => {
    const [riffs, setRiffs] = useState([])

    return (
        <div className="userProfile">
            <div className="profile-info">
                <p>Username: {user.username}</p>
            </div>
        </div>
    )
}

export default UserProfile