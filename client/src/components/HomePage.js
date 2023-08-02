import React, { useState, useEffect } from "react";
import RiffTile from "./RiffTile";
import RiffForm from "./RiffForm";

const HomePage = (props) => {
    const [homepage, setHomepage] = useState({
        prompt: "",
        promptId: null,
        userAnswer: "",
        submittedAnswer: "",
    });

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

        // Call the fetchCurrentPrompt and fetchSubmittedRiff functions to retrieve the current prompt and user's submitted riff when the component mounts
        fetchCurrentPrompt();
        fetchSubmittedRiff();

        // Set up interval to refetch the current prompt daily at midnight (UTC)
        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0); // Set time to midnight UTC
        const timeUntilMidnight = midnight - Date.now();
        const dailyUpdateInterval = setInterval(() => {
            fetchCurrentPrompt();
            fetchSubmittedRiff();
        }, timeUntilMidnight);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(dailyUpdateInterval);
        };
    }, [props.user]);

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Ensure the userId is available and set correctly in state
            if (!props.user || !props.user.id) {
                console.error("Error: userId not available");
                return;
            }

            // Logging the userId to check its value
            console.log("UserId:", props.user.id);

            const response = await fetch("/api/v1/riffs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ riffBody: homepage.userAnswer, userId: props.user.id, promptId: homepage.promptId }), // Include the userId and promptId in the request payload
            });

            if (!response.ok) {
                throw new Error(`${response.status} (${response.statusText})`);
            }

            const data = await response.json();
            // Assuming the response data contains the saved riff object with an "id" field
            const { id } = data.riff;
            console.log(`Riff with ID ${id} saved successfully!`);

            // Clear the user's answer after submission
            setHomepage((prevHomepage) => ({ ...prevHomepage, submittedAnswer: prevHomepage.userAnswer, userAnswer: "" }));
        } catch (error) {
            console.error("Error saving riff:", error);
        }
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

            {/* Display the user's submitted answer using RiffTile component */}
            {homepage.submittedAnswer && <RiffTile submittedAnswer={homepage.submittedAnswer} />}

            {/* Your other content */}
        </div>
    );
};

export default HomePage;