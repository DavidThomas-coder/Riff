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

        const currentDate = new Date().toLocaleDateString();
        const filteredRiffs = riffs.filter((riff) => {
          const riffCreatedAt = new Date(riff.createdAt).toLocaleDateString();
          return riff.userId !== props.user.id && riffCreatedAt === currentDate;
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
    const dailyUpdateInterval = setInterval(() => {
      fetchCurrentPrompt();
      fetchSubmittedRiff();
      if (props.user && props.user.id) {
        fetchOtherRiffs();
      }
    }, timeUntilMidnight);

    return () => {
      clearInterval(dailyUpdateInterval);
    };
  }, [props.user]);

  const handleSubmit = async (event) => {
    // ... (unchanged code for handleSubmit)
  };

  return (
    <div>
      <h1>It's time to Riff!</h1>

      <RiffForm
        prompt={homepage.prompt}
        onSubmit={handleSubmit}
      />

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
