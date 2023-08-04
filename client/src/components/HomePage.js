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
    const [currentPromptDate, setCurrentPromptDate] = useState(new Date());
    let dailyUpdateInterval;

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
                    setCurrentPromptDate(new Date(currentPrompt.createdAt));
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
        
                const today = new Date();
                const filteredRiffs = riffs.filter((riff) => {
                    const riffDate = new Date(riff.createdAt);
                    return riff.userId !== props.user.id && riffDate.toDateString() === today.toDateString();
                });
        
                setOtherRiffs(filteredRiffs);
            } catch (error) {
                console.error("Error fetching other users' riffs:", error);
            }
        };        

        fetchCurrentPrompt();
        fetchSubmittedRiff();
        if (props.user && props.user.id) {
            fetchOtherRiffs();
        }

        const midnight = new Date();
        midnight.setUTCHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight - Date.now();

        dailyUpdateInterval = setInterval(() => {
            fetchCurrentPrompt();
            fetchSubmittedRiff();
            if (props.user && props.user.id) {
                fetchOtherRiffs();
            }

            if (currentPromptDate.toDateString() !== new Date().toDateString()) {
                setOtherRiffs([]);
            }
        }, timeUntilMidnight);

        return () => {
            clearInterval(dailyUpdateInterval);
        };
    }, [props.user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log("User Answer:", homepage.userAnswer);
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
            const { id, riffBody } = data.riff;
            console.log(`Riff with ID ${id} saved successfully!`);
            console.log("Riff body:", riffBody)
    
            setHomepage((prevHomepage) => ({ ...prevHomepage, submittedAnswer: riffBody, userAnswer: "" }));
            console.log("Submitted Answer:", homepage.submittedAnswer);
        } catch (error) {
            console.error("Error saving riff:", error);
        }
    };    

    return (
        <div>
            <h1>It's time to Riff!</h1>

            <RiffForm
                prompt={homepage.prompt}
                onSubmit={handleSubmit}
            />

            {homepage.submittedAnswer ? (
                <UserRiffTile submittedAnswer={homepage.submittedAnswer} />
            ) : (
                <p>No answer submitted yet.</p>
            )}

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
