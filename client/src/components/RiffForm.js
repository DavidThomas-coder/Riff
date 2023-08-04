import React from "react";

const RiffForm = ({ prompt, userAnswer, onUserAnswerChange, onSubmit }) => {
  const handleChange = (event) => {
    console.log("User Answer Change:", event.target.value);
    onUserAnswerChange(event);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form Submitted!");
    onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <p>{prompt}</p>
      </label>
      <label>
        Your Answer:
        <input
          type="text"
          value={userAnswer}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RiffForm;

