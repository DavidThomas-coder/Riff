import React, { useState, useEffect } from "react";

const HomePage = (props) => {
    const [homepage, setHomepage] = useState({
        prompt: "",
        promptId: null,
        userAnswer: "",
        submittedAnswer: ""
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
                    setHomepage({
                        ...homepage,
                        prompt: currentPrompt.promptBody,
                        promptId: currentPrompt.id
                    });
                } else {
                    // If no current prompt is available (e.g., server restart or before the first midnight update), fallback to a default prompt
                    const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
                    setHomepage({ ...homepage, prompt: defaultPrompt });
                }
            } catch (error) {
                // If an error occurs while fetching the current prompt, fallback to a default prompt
                console.error("Error fetching the current prompt:", error);
                const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
                setHomepage({ ...homepage, prompt: defaultPrompt });
            }
        };

        // Call the fetchCurrentPrompt function to retrieve the current prompt when the component mounts
        fetchCurrentPrompt();

        // Set up interval to refetch the current prompt daily at midnight (UTC)
        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0); // Set time to midnight UTC
        const timeUntilMidnight = midnight - Date.now();
        const dailyUpdateInterval = setInterval(fetchCurrentPrompt, timeUntilMidnight);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(dailyUpdateInterval);
        };
    }, []);

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
            setHomepage({ ...homepage, submittedAnswer: homepage.userAnswer, userAnswer: "" });
        } catch (error) {
            console.error("Error saving riff:", error);
        }
    };

    return (
        <div>
            <h1>It's time to Riff!</h1>

            {/* Form to answer the prompt */}
            <form onSubmit={handleSubmit}>
                <label>
                    <p>{homepage.prompt}</p>
                </label>
                <label>
                    Your Answer:
                    <input
                        type="text"
                        value={homepage.userAnswer}
                        onChange={(event) => setHomepage({ ...homepage, userAnswer: event.target.value })}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>

            {/* Display the user's submitted answer */}
            {homepage.submittedAnswer && (
                <div>
                    <p>Your Answer:</p>
                    <p>{homepage.submittedAnswer}</p>
                </div>
            )}

            {/* Your other content */}
        </div>
    );
};

export default HomePage;
