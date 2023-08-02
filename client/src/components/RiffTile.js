import React from "react";

const RiffTile = ({ submittedAnswer }) => {
    return (
        <div>
            <p>Your Answer:</p>
            <p>{submittedAnswer}</p>
        </div>
    );
};

export default RiffTile;
