# Chat Room Project Proposal

## **Motivation**

### 1. Motivation

#### Identify the Problem or Need
In today's globalized and digitally connected world, online chat rooms have become a vital platform for communication, collaboration, and community building. However, two significant challenges persist in enhancing the user experience of chat rooms:  

1. **Lack of Intelligent Interaction**:  
   Traditional chat rooms rely solely on human-to-human communication, lacking the ability to integrate intelligent, AI-driven interactions that can provide instant assistance, answer questions, or even engage in meaningful conversations.  

2. **Language Barriers**:  
   As chat rooms often bring together users from diverse linguistic backgrounds, real-time communication can be hindered by language differences, making it difficult for users to fully participate and connect.  

#### Why This Project is Worth Pursuing
This project is worth pursuing because it addresses these critical pain points by integrating cutting-edge AI technologies into chat rooms, thereby revolutionizing the way users interact and communicate. Here are some reasons:  

1. **Enhanced User Engagement**:  
   By introducing an AI-powered chatbot (e.g., `@chatbot`) that leverages large language models (LLMs), users can interact with an intelligent assistant capable of providing instant responses, answering queries, and even facilitating discussions. 
   
2. **Breaking Language Barriers**:  
   The integration of real-time translation capabilities allows users to communicate seamlessly across different languages. This feature is particularly valuable in global communities, enabling inclusivity and fostering cross-cultural collaboration.  

3. **Competitive Advantage**:  
   As AI and real-time translation technologies become increasingly prevalent, incorporating these features into a chat room positions the platform as innovative and forward-thinking, attracting a broader user base and staying ahead of competitors.  

By addressing these challenges and leveraging the power of AI, this project aims to create a more intelligent, inclusive, and engaging chat room experience, ultimately redefining how people connect and communicate in digital spaces.

#### Describe the Target Users

1. **General Social Users**
   This platform is designed for everyday users who rely on instant messaging tools to stay connected. Through the chatroom, they can easily communicate with friends, family, or like-minded communities. The integrated file-sharing and notification features further enhance the overall experience.

2. **Tech Enthusiasts and Developers**
   For users passionate about technology, this chatroom offers more than just basic messaging—it incorporates an AI Bot (integrated via ollama) that can assist in answering technical questions, providing development advice, or discussing code. This additional feature not only streamlines interactions but also adds value for users seeking smart, tech-driven support.

3. **Businesses and Collaborative Teams**
   Small enterprises or teams looking for an efficient internal communication tool will benefit from the platform's ability to create, manage, and join multiple chatrooms. The robust role-based access control ensures proper permissions, while message logging and search functionalities support seamless collaboration. The integrated AI Bot further assists in answering common queries or providing data insights during team discussions.

4. **Educational Institutions and Learners**
   Students and educators can use the platform for online discussions, Q&A sessions, and collaborative group work. The AI Bot can serve as a real-time tutor—responding to @mentions by providing additional learning resources or clarifying doubts, thus creating an interactive and supportive learning environment.

5. **Customer Support and Service Channels**
   Businesses may repurpose the platform as a live support channel. With real-time messaging and AI assistance, support agents can quickly triage issues and provide answers, enhancing the customer experience.

#### Discuss Existing Solutions and Their Limitations

1. **Complexity**:

   While these platforms offer a plethora of features, they can be overly complex for regular users or small communities, with a steep learning curve.

2. **Customization Constraints**:

   Although somewhat extensible, these platforms often lack the flexibility to cater to specific needs such as integrating a dedicated AI bot or customizing file handling processes.

3. **Lack of Real-Time Interaction**:

   While some platforms have begun to introduce AI features, most remain at a basic level and do not support direct real-time interaction via @mentions. This limits their ability to significantly enhance the overall user engagement and experience.

4. **Limited Extensibility and Integration**:
   Many existing chat solutions offer limited options for integrating with external services or third-party plugins. This limitation makes it challenging for developers to extend functionality—such as incorporating a custom AI bot or specialized file handling—without significant custom development.

## **Objective and Key Features**

### **Objective:**

  The goal of this project is to develop a real-time chatroom web application that enhances user communication through intelligent AI-driven interactions, real-time messaging, and seamless file sharing. By integrating AI capabilities, this system will improve engagement and accessibility for users from a varity of backgrounds. This project also aims to provide a scalable and maintainable solution that aligns with modern web development practices.

### **Key Features:**

#### **Features and Implementation:**

| Feature | Implementation |
| :------- | :------ |
| User Authentication | Basic login/signup using JWT authentication. Users will have usernames and profile pictures. |
| Real-Time Chat | Implemented using Express.js with Socket.io for real-time messaging between users. |
| Tag Mention AI Models | Users can mention an Ollama AI model (e.g., @ollama) in chat, and the AI will generate a response. The backend will handle requests to the Ollama API and return responses to users. |
| Message Storage | Messages will be stored in PostgreSQL using Prisma ORM with timestamps and sender details. |
| File Sharing | Users can upload and share files in chat. Files will be stored on a MinIO object storage server and referenced in the database. |
| User Management | Admins can moderate chatrooms, delete messages, and manage users. |
| Frontend Routing | Implemented using React Router, with pages for login, chatroom list, and individual chatrooms. |
| Responsive UI Design | Built with React + Ant Design for a modern and user-friendly interface. |
| Typing Indicators and Read Receipts | Show when users are typing and indicate message read status. |
| Dark Mode & Theming | User preference-based theming using Ant Design components. |

#### **Database Schema:**

1. ***Users Table***

| Column | Description |
| :------- | :------ |
| id (PK) | Unique user ID |
| username | User's display name |
| email | User's email |
| password | Hashed password |
| profile_picture | URL to MinIO storage |
| created_at | Timestamp |

2. ***Chatrooms Table***

| Column | Description |
| :------- | :------ |
| id (PK) | Unique chatroom ID |
| name | Chatroom name |
| created_by (FK) | User who created the chatroom |
| created_at | Timestamp |

3. ***Messages  Table***

| Column | Description |
| :------- | :------ |
| id (PK) | Unique message ID |
| chatroom_id (FK) | Chatroom the message belongs to |
| user_id (FK) | Sender of the message |
| content | Message text |
| file_url | Reference to file storage (if applicable) |
| created_at | Timestamp |

4. ***Files Table***

| Column | Description |
| :------- | :------ |
| id (PK) | Unique file  ID |
| user_id (FK) | Uploader |
| chatroom_id (FK) |  Associated chatroom |
| file_url | MinIO storage link |
| created_at | Timestamp |

#### **User Interface and Experience Design:**

1. ***Homepage：*** Login/signup form with a modern UI.
2. ***Chatroom List Page：*** Displays available chatrooms, option to create/join a chatroom.
3. ***Chat Interface：***
   
      - Message history
      - Real-time typing indicators
      - Mentions (@username or @ollama)
      - File upload button
      - Scrollable UI with infinite scroll for message history
4. ***Dark Mode and Theming：*** Users can toggle between light and dark modes using Ant Design’s theming options.
5. ***Mobile-Friendly Design：*** UI will be optimized for both desktop and mobile devices.

#### **Integration with External Services:**

1. ***Ollama API：*** Used for AI chatbot responses when mentioned in chat.
2. ***MinIO Storage：*** External storage for user-uploaded files.
3. ***PostgreSQL (Home Server)：*** Local hosting for chat messages and user data.

#### **Course Requirements:**

| Core Technical Requirements | Implementaion |
| :------- | :------ |
| **Frontend Requirements** |  |
| React or Next.js for UI development | Yes |
| Tailwind CSS for styling | Yes |
| shadcn/ui or similar component libraries | Yes |
| Responsive design implementation | Yes |
| **Data Storage Requirements** |  |
| PostgreSQL or SQLite for relational database | Yes |
| Cloud storage for file handling | Yes |
| **Architecture Approach** |  |
| Separate Frontend and Backend | Yes |
| Next.js Full-Stack | No |
| **Advanced Features** |  |
| User authentication and authorization | Yes |
| Real-time functionality (e.g., WebSocket) | Yes |
| File handling and processing | Yes |
| Advanced state management | Yes |
| API integration with external services | Yes |

#### **Potential Extra Features:**

Other than the mentioned core features that we plan to implement, there are more features that worth introducing but are limited by the time we have. Here is a list of extra features that we might add if we are ahead of inplementation schedule.

| Extra Feature | Implementation |
| :------- | :------ |
| Friend List | Users can add other users as friends and maintain a friend list for quick access to private chats. Implemented using a relational table in PostgreSQL linking user IDs. |
| Emoji Chat | Users can send emojis in chat messages using an integrated emoji picker. Implemented using a React emoji library (e.g., emoji-mart) and rendered within chat messages. |
| File Analysis by AI | Uploaded files (e.g., text, PDFs) can be analyzed by the AI chatbot. The backend will extract file contents and send them to the Ollama AI API for summarization or insights. |

#### **Project Scope:**

This project aims to develop a full-featured chatroom application that enables live messaging, AI-driven interactions, and file sharing while ensuring accessibility, security, and usability. The chatroom application will support all core features outlined in the previous section, such as user authentication, real-time messaging, AI chatbot integration, message storage, and role-based permissions.

#### **Feasibility:** 

The project is planned to be completed within a 7-week timeframe. Given the scope and complexity, the timeline is realistic and achievable, provided that the team adheres to the structured development plan. The feasibility assessment is based on the division of tasks, estimated workload, and potential risks. A more detailed plan is provided in the Tentative Plan section below.

## **Tentative Plan**

The development will follow a structured and modular approach, ensuring clear separation between the frontend and backend components. Our primary goal is to deliver a robust and user-friendly chat platform while effectively distributing responsibilities among team members to ensure timely completion. Starting from the week of March 3rd, we have durations of 7 weeks till the project deadline on April 20th. And below are the specific plan breakdown within this 7 weeks:

### **Project Timeline and Milestones:**

1. **Week 1: Project Setup and Initial Planning**
   - Establish the project repository and development environment.
   - Define API endpoints and draft initial API documentation.
   - Research and finalize the technology stack and dependencies.
   - Assign specific tasks to each team member.

2. **Week 2-3: Backend Development**
   - Set up the Express.js server and define RESTful API routes.
   - Implement user authentication (login, registration, session management).
   - Develop database models and storage mechanisms.
   - Set up WebSocket communication for real-time messaging.

3. **Week 4: Frontend Development**
   - Implement the React frontend structure with necessary UI components.
   - Develop user authentication flows.
   - Establish API calls to interact with the backend.
   - Integrate WebSocket for real-time messaging.

4. **Week 5: AI Chatbot Integration**
   - Implement Ollama AI chatbot within the backend service.
   - Develop API endpoints for chatbot responses.
   - Fine-tune chatbot interactions and ensure smooth integration with the chat interface.

5. **Week 6: Testing and Refinements**
   - Conduct unit and integration testing for both frontend and backend.
   - Perform UI/UX improvements and bug fixes.
   - Finalize API documentation and ensure proper functionality.

6. **Week 7: Deployment and Final Adjustments**
   - Deploy the application on a cloud platform.
   - Conduct final testing and collect feedback.
   - Prepare the final report and project presentation.

### **Team Responsibilities:**

- **Member 1:** Backend Lead – Develop RESTful API with Express.js, manage database interactions, and implement authentication.
- **Member 2:** Frontend Lead – Develop React UI, handle API integration, and ensure user experience optimization.
- **Member 3:** WebSocket and AI Integration – Implement WebSocket for real-time communication and integrate the Ollama chatbot.
- **Member 4:** Documentation and Testing – Maintain API documentation, conduct testing, and assist in deployment.

This well-structured plan ensures that all aspects of the project are covered efficiently and can be realistically completed within the given timeframe.
