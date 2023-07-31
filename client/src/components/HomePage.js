import React, { useState, useEffect } from "react";

const HomePage = () => {
    const [prompt, setPrompt] = useState("");

    // Example list of daily prompts
    const dailyPrompts = [
        "Describe your first date.",
        "What's your favorite story to tell at family gatherings?  It could be one you've told 100 times.",
        "What's the most embarrassing thing to happen to you recently?",
        "If you could have any superpower, what would it be?",
        // Add more prompts here...
    ];

    // Function to get a random prompt from the dailyPrompts list
    const getRandomPrompt = () => {
        const randomIndex = Math.floor(Math.random() * dailyPrompts.length);
        return dailyPrompts[randomIndex];
    };

    useEffect(() => {
        // Update the prompt daily when the component mounts and at midnight
        const updateDailyPrompt = () => {
        const newPrompt = getRandomPrompt();
        setPrompt(newPrompt);
        };

        // Update the prompt when the component mounts
        updateDailyPrompt();

        // Set up interval to update the prompt daily at midnight (UTC)
        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0); // Set time to midnight UTC
        const timeUntilMidnight = midnight - Date.now();
        const dailyUpdateInterval = setInterval(updateDailyPrompt, timeUntilMidnight);

        // Clean up the interval when the component unmounts
        return () => {
        clearInterval(dailyUpdateInterval);
        };
    }, []);

    return (
        <div>
        <h1>It's time to Riff!</h1>
        <p>Prompt: {prompt}</p>
        {/* Your other content */}
        </div>
    );
};

export default HomePage;
