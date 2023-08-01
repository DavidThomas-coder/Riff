import React, { useState, useEffect } from "react";

const HomePage = () => {
    const [prompt, setPrompt] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [submittedAnswer, setSubmittedAnswer] = useState("");

    useEffect(() => {
        // Fetch the daily prompt from the backend API
        const fetchDailyPrompt = async () => {
            try {
                const response = await fetch("/api/v1/prompts"); // Update the endpoint URL to match the backend "/daily" endpoint
                if (!response.ok) {
                    throw new Error(`${response.status} (${response.statusText})`);
                }
                const body = await response.json();
                const dailyPrompt = body.prompt;
                console.log("Daily prompt from the backend:", dailyPrompt);

                if (dailyPrompt) {
                    setPrompt(dailyPrompt);
                } else {
                    // If no prompt was retrieved or an error occurred, fallback to a default prompt
                    const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
                    setPrompt(defaultPrompt);
                }
            } catch (error) {
                // If an error occurs while fetching the daily prompt, fallback to a default prompt
                console.error("Error fetching the daily prompt:", error);
                const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
                setPrompt(defaultPrompt);
            }
        };

        // Call the fetchDailyPrompt function to retrieve the daily prompt when the component mounts
        fetchDailyPrompt();

        // Set up interval to fetch the daily prompt daily at midnight (UTC)
        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0); // Set time to midnight UTC
        const timeUntilMidnight = midnight - Date.now();
        const dailyUpdateInterval = setInterval(fetchDailyPrompt, timeUntilMidnight);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(dailyUpdateInterval);
        };
    }, []);

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/v1/riffs", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ riffBody: userAnswer }), // Send the user's answer as JSON
            });
        
            if (!response.ok) {
                throw new Error(`${response.status} (${response.statusText})`);
            }
        
            const data = await response.json();
            // Assuming the response data contains the saved riff object with an "id" field
            const { id } = data.riff;
            console.log(`Riff with ID ${id} saved successfully!`);
        
            // Clear the user's answer after submission
            setSubmittedAnswer(userAnswer);
            setUserAnswer("");
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
                    <p>{prompt}</p>
                </label>
                <label>
                    Your Answer:
                    <input
                    type="text"
                    value={userAnswer}
                    onChange={(event) => setUserAnswer(event.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>

            {/* Display the user's submitted answer */}
            {submittedAnswer && (
            <div>
                <p>Your Answer:</p>
                <p>{submittedAnswer}</p>
            </div>
            )}

            {/* Your other content */}
        </div>
    );
};

export default HomePage;