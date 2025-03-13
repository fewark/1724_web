#### **Potential Extra Features:**

Other than the mentioned core features that we plan to implement, there are more features that worth introducing but are limited by the time we have. Here is a list of extra features that we might add if we are ahead of inplementation schedule.

| Extra Feature | Implementation |
| :------- | :------ |
| Friend List | Users can add other users as friends and maintain a friend list for quick access to private chats. Implemented using a relational table in PostgreSQL linking user IDs. |
| Emoji Chat | Users can send emojis in chat messages using an integrated emoji picker. Implemented using a React emoji library (e.g., emoji-mart) and rendered within chat messages. |
| File Analysis by AI | Uploaded files (e.g., text, PDFs) can be analyzed by the AI chatbot. The backend will extract file contents and send them to the Ollama AI API for summarization or insights. |
