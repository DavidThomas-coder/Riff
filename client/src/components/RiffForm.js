import React from "react";

const RiffForm = ({ prompt, userAnswer, onUserAnswerChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <label>
        <p>{prompt}</p>
      </label>
      <label>
        Your Answer:
        <input
          type="text"
          value={userAnswer}
          onChange={onUserAnswerChange} // Call the onUserAnswerChange prop when the input value changes
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RiffForm;
