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
    const [error, setError] = useState(null); // Add the error state

    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchCurrentPrompt();
            if (props.user && props.user.id) {
                await fetchOtherRiffs();
                await fetchSubmittedRiff(); // Fetch and display user's submitted riff
            }
        };

        // Call fetchInitialData when the page loads
        fetchInitialData();

        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight - Date.now();
        const dailyUpdateInterval = setInterval(async () => {
            await fetchCurrentPrompt();
            if (props.user && props.user.id) {
                await fetchOtherRiffs();
                await fetchSubmittedRiff(); // Fetch and display user's submitted riff
            }
        }, timeUntilMidnight);

        return () => {
            clearInterval(dailyUpdateInterval);
        };
    }, [props.user]);

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
                const currentDate = new Date().toISOString().slice(0, 10);
                const riffDate = new Date(riff.createdAt).toISOString().slice(0, 10);

                if (currentDate === riffDate) {
                    setHomepage((prevHomepage) => ({ ...prevHomepage, submittedAnswer: riff.riffBody }));
                } else {
                    console.log("Time To Riff!");
                }
            } else {
                console.log("Time To Riff!");
            }
        } catch (error) {
            console.error("Error fetching the user's submitted riff:", error);
        }
    };

    const fetchCurrentPrompt = async () => {
        try {
            const response = await fetch("/api/v1/prompts/current");
            if (!response.ok) {
                throw new Error(`${response.status} (${response.statusText})`);
            }
            const { prompt: [currentPrompt] } = await response.json();
            console.log("Today's prompt from the backend:", currentPrompt);

            if (currentPrompt) {
                setHomepage((prevHomepage) => ({
                    ...prevHomepage,
                    prompt: currentPrompt.promptBody,
                    promptId: currentPrompt.id,
                }));
            } else {
                const defaultPrompt = "Here's your daily prompt! Riff away!";
                setHomepage((prevHomepage) => ({ ...prevHomepage, prompt: defaultPrompt }));
            }
        } catch (error) {
            console.error("Error fetching the current prompt:", error);
            const defaultPrompt = "Here's your daily prompt! Riff away!";
            setHomepage((prevHomepage) => ({ ...prevHomepage, prompt: defaultPrompt }));
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

    const handleUserAnswerChange = (event) => {
        const newUserAnswer = event.target.value;
        setHomepage((prevHomepage) => ({
            ...prevHomepage,
            userAnswer: newUserAnswer,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if the user has already submitted a riff for today
        if (props.user.lastSubmittedRiffDate) {
            const currentDate = new Date().toISOString().slice(0, 10);
            if (props.user.lastSubmittedRiffDate === currentDate) {
                setError("You've already riffed today!"); // Set the error message
                return;
            }
        }

        console.log("Data sent to the backend:", {
            riffBody: homepage.userAnswer,
            userId: props.user.id,
            promptId: homepage.promptId,
        });

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
            console.log("RESPONSE:", data);
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
            <h1>Riff Time!</h1>
            {error && <div className="error-message">{error}</div>}
        </div>

        {props.user ? (
            // User is signed in, render the form
            <RiffForm
                prompt={homepage.prompt}
                userAnswer={homepage.userAnswer}
                onUserAnswerChange={handleUserAnswerChange}
                onSubmit={handleSubmit}
            />
        ) : (
            // User is not signed in, render the "Sign In To Riff!" header
            <h2>Sign In To Riff!</h2>
        )}

        {homepage.submittedAnswer && <UserRiffTile submittedAnswer={homepage.submittedAnswer} />}

        <h2>Other Users' Riffs:</h2>
        <div className="grid-container">
            {otherRiffs.map((riff, index) => (
                <OtherRiffTile key={index} userId={riff.userId} riff={riff.riffBody} />
            ))}
        </div>
    </div>
    );
};

export default HomePage;
