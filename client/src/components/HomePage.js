import React, { useState, useEffect } from "react";
import UserRiffTile from "./UserRiffTile";
import RiffForm from "./RiffForm";
import OtherRiffTile from "./OtherRiffTile";

const HomePage = (props) => {
    const [homepage, setHomepage] = useState({
        prompt: "",
        promptId: null,
        userAnswer: "",
        submittedAnswer: "",
    });
    const [otherRiffs, setOtherRiffs] = useState([]);

    useEffect(() => {
        const fetchCurrentPrompt = async () => {
        try {
            const response = await fetch("/api/v1/prompts/current");
            if (!response.ok) {
            throw new Error(`${response.status} (${response.statusText})`);
            }
            const { prompt: [currentPrompt] } = await response.json();
            console.log("Current prompt from the backend:", currentPrompt);

            if (currentPrompt) {
            setHomepage((prevHomepage) => ({
                ...prevHomepage,
                prompt: currentPrompt.promptBody,
                promptId: currentPrompt.id,
            }));
            } else {
            const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
            setHomepage((prevHomepage) => ({ ...prevHomepage, prompt: defaultPrompt }));
            }
        } catch (error) {
            console.error("Error fetching the current prompt:", error);
            const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
            setHomepage((prevHomepage) => ({ ...prevHomepage, prompt: defaultPrompt }));
        }
        };

        const fetchSubmittedRiff = async () => {
        try {
            if (!props.user || !props.user.id) {
            console.error("Error: userId not available");
            return;
            }

            const response = await fetch(`/api/v1/riffs/${props.user.id}`);
            if (!response.ok) {
            throw new Error(`${response.status} (${response.statusText})`);
            }

            const { riff } = await response.json();
            console.log("User's submitted riff from the backend:", riff);

            if (riff && riff.riffBody) {
            setHomepage((prevHomepage) => ({ ...prevHomepage, submittedAnswer: riff.riffBody }));
            }
        } catch (error) {
            console.error("Error fetching the user's submitted riff:", error);
        }
        };

        const fetchOtherRiffs = async () => {
        try {
            const response = await fetch("/api/v1/riffs");
            if (!response.ok) {
            throw new Error(`${response.status} (${response.statusText})`);
            }

            const { riffs } = await response.json();
            console.log("Other users' submitted riffs from the backend:", riffs);

            const filteredRiffs = riffs.filter((riff) => riff.userId !== props.user.id);
            setOtherRiffs(filteredRiffs);
        } catch (error) {
            console.error("Error fetching other users' riffs:", error);
        }
        };

        // Function to clear riffs at midnight
        const clearRiffsAtMidnight = () => {
        setHomepage((prevHomepage) => ({ ...prevHomepage, submittedAnswer: "" }));
        setOtherRiffs([]); // Clear other users' riffs
        };

        // Set up interval to fetch the current prompt and clear riffs at midnight
        const dailyUpdateInterval = setInterval(() => {
        fetchCurrentPrompt();
        fetchSubmittedRiff();
        if (props.user && props.user.id) {
            fetchOtherRiffs();
        }
        }, 60000); // Check every minute, you can adjust this time based on your needs

        // Clean up the interval when the component unmounts
        return () => {
        clearInterval(dailyUpdateInterval);
        };
    }, [props.user]);

    // Additional useEffect hook to reset the state at midnight
    useEffect(() => {
        const now = new Date();
        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight - now;

        setTimeout(() => {
        clearRiffsAtMidnight();
        fetchCurrentPrompt();
        }, timeUntilMidnight);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
        if (!props.user || !props.user.id) {
            console.error("Error: userId not available");
            return;
        }

        console.log("UserId:", props.user.id);

        const response = await fetch("/api/v1/riffs", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ riffBody: homepage.userAnswer, userId: props.user.id, promptId: homepage.promptId }),
        });

        if (!response.ok) {
            throw new Error(`${response.status} (${response.statusText})`);
        }

        const data = await response.json();
        const { id } = data.riff;
        console.log(`Riff with ID ${id} saved successfully!`);

        setHomepage((prevHomepage) => ({ ...prevHomepage, submittedAnswer: prevHomepage.userAnswer, userAnswer: "" }));
        } catch (error) {
        console.error("Error saving riff:", error);
        }
    };

    return (
        <div>
        <h1>It's time to Riff!</h1>

        <RiffForm prompt={homepage.prompt} onSubmit={handleSubmit} />

        {homepage.submittedAnswer && <UserRiffTile submittedAnswer={homepage.submittedAnswer} />}

        <h2>Other Users' Riffs:</h2>
        <div className="grid-container grid-x">
            {otherRiffs.map((riff, index) => (
            <div key={index} className="cell small-4">
                <OtherRiffTile userId={riff.userId} riff={riff.riffBody} />
            </div>
            ))}
        </div>
        </div>
    );
};

export default HomePage;

