# Chat Room Web Project Proposal

## **Authors**

| Name | Student Number |
| :------- | :------ |
| Kaifeng Lu | 1003012633 |
| Zenan Jiang | 1004996846 |
| Xiaoyang Xie | 1005755103 |
| Yanhao Li | 1010253618 |

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

1. **Complexity:**

   Platforms like Slack and Microsoft Teams offer many features and integrations. However, this abundance of options makes them quite complex for everyday users or small communities. Their many settings can create a steep learning curve, which means users may struggle to quickly find and use the features they need, leading to a less smooth experience.

2. **Customization Constraints:**

   Although platforms such as Slack and **Discord** allow for some third-party integrations and bots, they still have limits when it comes to deep customization. For example, Slack provides APIs that let you add extra functions, but it isn’t very flexible for integrating a dedicated AI chatbot or tailoring file handling processes. Similarly, while Discord supports various bots, these often require extra development work and still offer limited customization due to the platform’s fixed interfaces and permission rules.

3. **Lack of Real-Time Interaction:**

   Some platforms, like Microsoft Teams, have started to include basic AI features, such as simple chatbots that can answer common questions. However, these are usually based on preset commands and do not support dynamic, context-aware interactions triggered by @mentions. Ideally, a chat platform should offer immediate, intelligent, and personalized responses when users are mentioned, something that most existing products are not yet able to do effectively.

4. **Limited Extensibility and Integration:**

   Many current chat solutions have limited options for extending functionality or integrating with external services. For example, Telegram offers a Bot API that lets developers create bots, but its features are restricted when it comes to integrating advanced AI models or custom file management systems. Likewise, Discord supports many third-party bots, but adding a custom AI bot often requires significant extra work. This limited flexibility means that developers need to invest more time and effort to build the features they want.

By comparing these real products, we can see that although the chat platforms currently on the market are powerful, they still have shortcomings in terms of ease of use, customization, real-time interaction and scalability.

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

#### **Project Scope:**

This project aims to develop a full-featured chatroom application that enables live messaging, AI-driven interactions, and file sharing while ensuring accessibility, security, and usability. The chatroom application will support all core features outlined in the previous section, such as user authentication, real-time messaging, AI chatbot integration, message storage, and role-based permissions.

#### **Feasibility:** 

The project is planned to be completed within a 7-week timeframe. Given the scope and complexity, the timeline is realistic and achievable, provided that the team adheres to the structured development plan. The feasibility assessment is based on the division of tasks, estimated workload, and potential risks. A more detailed plan is provided in the Tentative Plan section below.

## **Tentative Plan**

Our project aims to develop a fully functional chat room website featuring core messaging capabilities and an AI chatbot powered by the Ollama framework. We will follow a modular approach, clearly separating frontend and backend components to ensure a robust, user-friendly platform. Tasks will be effectively distributed among team members to meet our deadline. The project timeline spans 7 weeks, starting March 3rd and ending April 20th. Below is the detailed weekly plan:

### **Project Timeline and Milestones:**

1. **Week 1: Project Setup**
   - Create repository and dev environment.
   - Define API endpoints and documentation.
   - Finalize tech stack and dependencies.
   - Assign team responsibilities.

2. **Week 2-3: Backend Development**
   - Set up Express.js server and RESTful APIs.
   - Implement JWT-based user authentication.
   - Develop PostgreSQL database models with Prisma ORM.
   - Enable real-time messaging with Socket.io.
   - Store messages with timestamps and sender info.
   - Add admin moderation features.

3. **Week 4: Frontend Development**
   - Build React app with Ant Design components.
   - Implement user auth flows and profile management.
   - Integrate backend API calls and WebSockets.
   - Add responsive UI, dark mode, and themes.
   - Set up routing (login, chatroom list, chat pages).

4. **Week 5: AI Chatbot & File Sharing**
   - Integrate Ollama AI chatbot in backend.
   - Create chatbot response endpoints and "@mentions."
   - Enable file uploads in chats.
   - Manage file storage with MinIO.

5. **Week 6: Testing and Refinement**
   - Conduct unit/integration tests.
   - Add typing indicators and read receipts.
   - Optimize for mobile and address UI/UX issues.
   - Complete API documentation.

6. **Week 7: Deployment and Finalization**
   - Deploy to cloud hosting.
   - Perform final testing and security checks.
   - Verify PostgreSQL and MinIO stability.
   - Optimize performance and finalize presentation/report.

### **Team Responsibilities:**

- **Member 1:** Backend Lead – Develop RESTful API with Express.js, manage database interactions, and implement authentication.
- **Member 2:** Frontend Lead – Develop React UI, handle API integration, and ensure user experience optimization.
- **Member 3:** WebSocket and AI Integration – Implement WebSocket for real-time communication and integrate the Ollama chatbot.
- **Member 4:** Documentation and Testing – Maintain API documentation, conduct testing, and assist in deployment.

This well-structured plan ensures that all aspects of the project are covered efficiently and can be realistically completed within the given timeframe.
