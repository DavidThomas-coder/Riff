import React, { useState, useEffect } from "react";

const HomePage = () => {
    const [prompt, setPrompt] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [submittedAnswer, setSubmittedAnswer] = useState("");

    useEffect(() => {
        // Fetch a random prompt from the backend API
        const fetchRandomPrompt = async () => {
        try {
            const response = await fetch("/api/v1/prompts"); // Replace "/api/prompts" with the actual endpoint URL for fetching prompts
            if (!response.ok) {
            throw new Error(`${response.status} (${response.statusText})`);
            }
            const body = await response.json();
            const promptsFromBackend = body.prompts;

            if (promptsFromBackend && promptsFromBackend.length > 0) {
            // If prompts were retrieved successfully, choose a random prompt from the fetched prompts
            const randomIndex = Math.floor(Math.random() * promptsFromBackend.length);
            setPrompt(promptsFromBackend[randomIndex].content);
            } else {
            // If no prompts were retrieved or an error occurred, fallback to a daily prompt from the frontend list
            const dailyPrompts = [
                "Describe your first date.",
                "What's your favorite story to tell at family gatherings? It could be one you've told 100 times.",
                "What's the most embarrassing thing to happen to you recently?",
                "If you could have any superpower, what would it be?",
                // Add more prompts here...
            ];
            const randomIndex = Math.floor(Math.random() * dailyPrompts.length);
            setPrompt(dailyPrompts[randomIndex]);
            }
        } catch (error) {
            // If an error occurs while fetching prompts, fallback to a daily prompt from the frontend list
            console.error("Error fetching prompts:", error);
            const dailyPrompts = [
            "Describe your first date.",
            "What's your favorite story to tell at family gatherings? It could be one you've told 100 times.",
            "What's the most embarrassing thing to happen to you recently?",
            "If you could have any superpower, what would it be?",
            // Add more prompts here...
            ];
            const randomIndex = Math.floor(Math.random() * dailyPrompts.length);
            setPrompt(dailyPrompts[randomIndex]);
        }
        };

        // Call the fetchRandomPrompt function to retrieve a random prompt when the component mounts
        fetchRandomPrompt();

        // Set up interval to fetch prompts daily at midnight (UTC)
        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0); // Set time to midnight UTC
        const timeUntilMidnight = midnight - Date.now();
        const dailyUpdateInterval = setInterval(fetchRandomPrompt, timeUntilMidnight);

        // Clean up the interval when the component unmounts
        return () => {
        clearInterval(dailyUpdateInterval);
        };
    }, []);

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedAnswer(userAnswer);
        setUserAnswer("");
    };

    return (
        <div>
        <h1>It's time to Riff!</h1>
        <p>Prompt: {prompt}</p>

        {/* Form to answer the prompt */}
        <form onSubmit={handleSubmit}>
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

