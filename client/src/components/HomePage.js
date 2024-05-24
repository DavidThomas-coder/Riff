import React, { useState, useEffect } from "react";
import UserRiffTile from "./UserRiffTile";
import RiffForm from "./RiffForm";
import OtherRiffTile from "./OtherRiffTile";

const HomePage = (props) => {
    // Define the initial state
    const [homepage, setHomepage] = useState({
        prompt: "",
        promptId: null,
        userAnswer: "",
        submittedAnswer: "",
    });
    
    // Define the state for other user's riffs
    const [otherRiffs, setOtherRiffs] = useState([]);
    
    // Define the state for errors
    const [error, setError] = useState(null);

    // Fetch initial data when the component mounts
    useEffect(() => {
        const fetchInitialData = async () => {
            // Fetch the current prompt
            await fetchCurrentPrompt();
            
            // If a user is logged in, fetch other riffs and the user's submitted riff
            if (props.user && props.user.id) {
                await fetchOtherRiffs();
                await fetchSubmittedRiff();
            }
        };

        // Call fetchInitialData when the page loads
        fetchInitialData();

        // Calculate the time until midnight
        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight - Date.now();

        // Set up a daily update interval
        const dailyUpdateInterval = setInterval(async () => {
            await fetchCurrentPrompt();
            if (props.user && props.user.id) {
                await fetchOtherRiffs();
                await fetchSubmittedRiff();
            }
        }, timeUntilMidnight);

        // Clear the interval when the component changes
        return () => {
            clearInterval(dailyUpdateInterval);
        };
    }, [props.user]);

    // Function to fetch the user's submitted riff
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

            if (riff && riff.riffBody) {
                setHomepage((prevHomepage) => ({ ...prevHomepage, submittedAnswer: riff.riffBody }));
            } else {
                console.log("Time To Riff!");
            }
        } catch (error) {
            console.error("Error fetching the user's submitted riff:", error);
        }
    };

    // Function to fetch the current prompt (for that day)
    const fetchCurrentPrompt = async () => {
        try {
            const response = await fetch("/api/v1/prompts/current");
            if (!response.ok) {
                throw new Error(`${response.status} (${response.statusText})`);
            }
            const { prompt: [currentPrompt] } = await response.json();

            if (currentPrompt) {
                setHomepage((prevHomepage) => ({
                    ...prevHomepage,
                    prompt: currentPrompt.promptBody,
                    promptId: currentPrompt.id,
                }));
            } else {
                const defaultPrompt = "Today's prompt:";
                setHomepage((prevHomepage) => ({ ...prevHomepage, prompt: defaultPrompt }));
            }
        } catch (error) {
            console.error("Error fetching the current prompt:", error);
            const defaultPrompt = "Today's prompt:";
            setHomepage((prevHomepage) => ({ ...prevHomepage, prompt: defaultPrompt }));
        }
    };

    // Function to fetch other user's riffs
    const fetchOtherRiffs = async () => {
        try {
            const response = await fetch("/api/v1/riffs");
            if (!response.ok) {
                throw new Error(`${response.status} (${response.statusText})`);
            }

            const { riffs } = await response.json();
            
            // Get the current date in the format "YYYY-MM-DD"
            const currentDate = new Date().toISOString().slice(0, 10);

            // Filter the riffs whose createdAt date is equal to the current date
            const filteredRiffs = riffs.filter((riff) => {
                const createdAtDate = new Date(riff.createdAt).toISOString().slice(0, 10);
                return riff.userId !== props.user.id && createdAtDate === currentDate;
            });

            setOtherRiffs(filteredRiffs);
        } catch (error) {
            console.error("Error fetching other users' riffs:", error);
        }
    };

    // Function to handle user answer change
    const handleUserAnswerChange = (event) => {
        const newUserAnswer = event.target.value;
        setHomepage((prevHomepage) => ({
            ...prevHomepage,
            userAnswer: newUserAnswer,
        }));
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if the user has already submitted a riff for today
        if (props.user.lastSubmittedRiffDate) {
            const currentDate = new Date().toISOString().slice(0, 10);
            if (props.user.lastSubmittedRiffDate === currentDate) {
                setError("You have already submitted a riff for today!"); // Set the error message
                return;
            }
        }

        try {
            if (!props.user || !props.user.id) {
                console.error("Error: userId not available");
                return;
            }

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

            // Update the lastSubmittedRiffDate for the user on the server-side
            props.user.lastSubmittedRiffDate = new Date().toISOString().slice(0, 10);

            setHomepage((prevHomepage) => ({ ...prevHomepage, submittedAnswer: prevHomepage.userAnswer, userAnswer: "" }));
        } catch (error) {
            console.error("Error saving riff:", error);
        }
    };

    return (
        <div>
            <div>
                <h1>It's Riff Time!</h1>
                {error && <div className="error-message">{error}</div>}
            </div>
    
            {props.user ? (
                <>
                    <RiffForm
                        prompt={homepage.prompt}
                        userAnswer={homepage.userAnswer}
                        onUserAnswerChange={handleUserAnswerChange}
                        onSubmit={handleSubmit}
                    />
                    {homepage.submittedAnswer && <UserRiffTile submittedAnswer={homepage.submittedAnswer} />}
                    {homepage.submittedAnswer && otherRiffs.length > 0 && <h2>Other Users' Riffs:</h2>}
                    {homepage.submittedAnswer && otherRiffs.length > 0 && (
                        <div className="grid-container">
                            {otherRiffs.map((riff, index) => (
                                <OtherRiffTile key={index} userId={riff.userId} riff={riff.riffBody} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <h2>Sign in and Riff!</h2>
            )}
        </div>
    );
    
    
};

export default HomePage;

