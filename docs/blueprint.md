# **App Name**: HopeBot

## Core Features:

- Secure Authentication: User authentication using Expo Go with Clerk for secure access.
- Text Display: Real-time display of textual responses in a sleek and modern UI. UI will be built with Javascript and Tailwind CSS.
- Speech-to-Text Input: Record speech input from the user, send this as a request to the model, then render text to the screen. Implemented in Javascript and Tailwind.
- Text-to-Speech Output: Playback a textual AI response, using text-to-speech, after having rendered text to the screen. UI built with Javascript and Tailwind.
- Listener Agent: Receives and processes user input (text or voice) via Flask backend and transmits it to the LLM.
- Mood Detection: Utilizes Groq API to analyze the emotional tone of user input and provide context to other agents. Tool: if the mood seems low, mention possible reasons, and then consider a response with optimism or gratitude.
- Recommender Agent: Suggests calming exercises or Cognitive Behavioral Therapy (CBT) prompts based on the user's mood and situation.

## Style Guidelines:

- Primary color: Soft teal (#74C69D) for a calming and approachable feel. It balances the technological aspect with a sense of serenity.
- Background color: Very light gray (#F5F5F5) for a clean and modern interface that is easy on the eyes.
- Accent color: Muted purple (#A35BFF) for interactive elements and highlights to draw attention without overwhelming.
- Font: 'Inter' sans-serif font, used for both headers and body text. The font lends a modern and neutral appearance suitable for the application's tone.
- Use minimalist, line-based icons for a modern and clean aesthetic.
- Employ a clean, single-column layout for easy navigation and focus on content.
- Incorporate subtle transitions and animations for a smooth and engaging user experience.