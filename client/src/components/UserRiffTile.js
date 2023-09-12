import React from "react";

const RiffTile = ({ submittedAnswer }) => {
    return (
        <div className="user-riff-tile">
            <p>Your Riff:</p>
            <p>{submittedAnswer}</p>
        </div>
    );
};

export default RiffTile;
