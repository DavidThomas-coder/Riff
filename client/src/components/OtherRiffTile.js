import React from "react";

const OtherRiffTile = ({ riff }) => {
    return (
        <div className="other-riff-tile">
            <p>Other User's Riff:</p>
            <p>{riff}</p>
        </div>
    );
};

export default OtherRiffTile;