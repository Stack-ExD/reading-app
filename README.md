# Reading Comprehension App

This is a React/Next.js application designed to test reading comprehension using AI-generated questions and evaluation.

## Feedback Decisions

- **Paragraph Separation**: Separated into different passages as a user requested for broken up passages. Also helps with finding specific parts quickly.
- **Written Answers**: Created text fields instead of multiple choice to prevent guessing.
- **Inferred Answers**: Answers to some questions generated are not found in the text and require reasoning to answer requiring users to understand the passage.
- **No timer**: As this is a comprehension exercise, no timers were implemented to cater to users of different reading speeds.

## AI Question Generation Approach

### 1. Question Generation (`/api/generate-questions`)

- **Model:** Mistral AI was used as it was free and has a well performing model.
- **Prompting Strategy:** The system acts as a "teacher." It is fed the reading passage and instructed to generate 3 specific reading comprehension questions.
- **Output Handling:** The model is strictly prompted to return a raw JSON object. The API route includes robust parsing logic to strip potential Markdown formatting (e.g., ` ```json ` blocks) ensures the frontend receives a clean array of question objects.

### 2. Answer Evaluation (`/api/evaluate-answers`)

- **Context Awareness:** The evaluation prompt receives the original passage, the generated questions, and the user's provided answers.
- **Feedback:** It generates a qualitative feedback string alongside a quantitative score (e.g., 2/3), offering the user specific insights into what they understood or missed.

---

## Key Decisions

- **State Management:** React's local state (`useState`) handles the linear flow of the application:
  1.  **Reading Phase:** User focuses solely on the text.
  2.  **Question Phase:** Questions are generated after the passage is read to prevent peeking.
  3.  **Result Phase:** Feedback and score are displayed.

---

## Improvements & Future Considerations

If given more time, the following improvements would be prioritized:

1.  **Correct Wrong Answers** Allow users to re-do an incorrectly answered question so they can learn from mistakes (fulfilling another user feedback).
2.  **Dynamic Difficulty:** Allow users to select a difficulty level (Easy, Medium, Hard) which dynamically adjusts the system prompt temperature and complexity insmtructions.
3.  **Persistent Storage:** Save user sessions and scores to a database (e.g., PostgreSQL/Supabase) to track progress over time.
4.  **Gamification:** Add progress bars, streaks and rewards to motivate users to continue learning without it feeling like a chore.

---

## Time Spent

- **Core Setup & UI:** 3 hours
- **AI Integration:** 1 hours
- **Refining Prompts & Error Handling:** 3 hours
- **Documentation & Polish:** 1 hours
