import React, { useState, useEffect } from "react";
import UserRiffTile from "./UserRiffTile";
import RiffForm from "./RiffForm";
import OtherRiffTile from "./OtherRiffTile"; // Import the OtherRiffTile component

const HomePage = (props) => {
    const [homepage, setHomepage] = useState({
        prompt: "",
        promptId: null,
        userAnswer: "",
        submittedAnswer: "",
    });

    const [otherRiffs, setOtherRiffs] = useState([]); // State to hold other users' riffs

    useEffect(() => {
        // Fetch the current prompt from the backend API
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
            // If no current prompt is available (e.g., server restart or before the first midnight update), fallback to a default prompt
            const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
            setHomepage((prevHomepage) => ({ ...prevHomepage, prompt: defaultPrompt }));
            }
        } catch (error) {
            // If an error occurs while fetching the current prompt, fallback to a default prompt
            console.error("Error fetching the current prompt:", error);
            const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
            setHomepage((prevHomepage) => ({ ...prevHomepage, prompt: defaultPrompt }));
        }
        };

        // Fetch the user's submitted riff from the backend API
        const fetchSubmittedRiff = async () => {
        try {
            if (!props.user || !props.user.id) {
            // If userId is not available, do not make the API call
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
            // If an error occurs while fetching the user's submitted riff, handle it gracefully
            console.error("Error fetching the user's submitted riff:", error);
        }
        };

        // Fetch other users' submitted riffs from the backend API
        const fetchOtherRiffs = async () => {
        try {
            const response = await fetch("/api/v1/riffs");
            if (!response.ok) {
            throw new Error(`${response.status} (${response.statusText})`);
            }

            const { riffs } = await response.json();
            console.log("Other users' submitted riffs from the backend:", riffs);

            // Filter out the riffs whose userId matches the logged-in user's ID
            const filteredRiffs = riffs.filter((riff) => riff.userId !== props.user.id);

            // Update the state with the filtered data
            setOtherRiffs(filteredRiffs);
        } catch (error) {
            // If an error occurs while fetching other users' riffs, handle it gracefully
            console.error("Error fetching other users' riffs:", error);
        }
        };

        // Call the fetchCurrentPrompt, fetchSubmittedRiff, and fetchOtherRiffs functions to retrieve the current prompt, user's submitted riff, and other users' riffs when the component mounts
        fetchCurrentPrompt();
        fetchSubmittedRiff();
        fetchOtherRiffs();

        // Set up interval to refetch the current prompt daily at midnight (UTC)
        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0); // Set time to midnight UTC
        const timeUntilMidnight = midnight - Date.now();
        const dailyUpdateInterval = setInterval(() => {
        fetchCurrentPrompt();
        fetchSubmittedRiff();
        fetchOtherRiffs();
        }, timeUntilMidnight);

        // Clean up the interval when the component unmounts
        return () => {
        clearInterval(dailyUpdateInterval);
        };
    }, [props.user]);

    // Function to handle form submission
    const handleSubmit = async (event) => {
        // ... (rest of your existing handleSubmit code)
    };

    return (
        <div>
        <h1>It's time to Riff!</h1>

        {/* Form to answer the prompt using RiffForm component */}
        <RiffForm
            prompt={homepage.prompt}
            userAnswer={homepage.userAnswer}
            onUserAnswerChange={(event) => setHomepage({ ...homepage, userAnswer: event.target.value })}
            onSubmit={handleSubmit}
        />

        {/* Display the user's submitted answer using UserRiffTile component */}
        {homepage.submittedAnswer && <UserRiffTile submittedAnswer={homepage.submittedAnswer} />}

        {/* Display other users' submitted riffs using OtherRiffTile components */}
        <div className="grid-container">
            {otherRiffs.map((riff, index) => (
            <OtherRiffTile key={index} riff={riff.riffBody} />
            ))}
        </div>

        {/* Your other content */}
        </div>
    );
};

export default HomePage;
