# Chat Room Web Application Project Proposal

## **Authors**

| Name         | Student Number | Section                    |
|--------------|----------------|----------------------------|
| Kaifeng Lu   | 1003012633     | Objective and Key Features |
| Zenan Jiang  | 1004996846     | Problem & Why Worth Pursuing |
| Xiaoyang Xie | 1005755103     | Tentative Plan             |
| Yanhao Li    | 1010253618     |Target Users and limitations|

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

#### Discuss any existing solutions and their limitations

1. **Complexity:**

   Platforms like Slack and Microsoft Teams offer many features and integrations. However, this abundance of options makes them quite complex for everyday users or small communities. Their many settings can create a steep learning curve, which means users may struggle to quickly find and use the features they need, leading to a less smooth experience.

2. **Customization Constraints:**

   Although platforms such as Slack and Discord allow for some third-party integrations and bots, they still have limits when it comes to deep customization. For example, Slack provides APIs that let you add extra functions, but it isn’t very flexible for integrating a dedicated AI chatbot or tailoring file handling processes. Similarly, while Discord supports various bots, these often require extra development work and still offer limited customization due to the platform’s fixed interfaces and permission rules.

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
| File Sharing | Users can upload and share files (images, PDFs) in chat. Files are stored in MinIO with private URLs for controlled access. Supports authentication, encryption, and scalable storage (~50MB/user, 500 files/chatroom) to ensure security and performance. |
| User Management | Admins can moderate chatrooms, delete messages, and manage users. |
| Frontend Routing | Implemented using React Router, with pages for login, chatroom list, and individual chatrooms. |
| Responsive UI Design | Built with React + Ant Design for a modern and user-friendly interface. |
| Dark Mode & Theming | User preference-based theming using Ant Design components. |


#### **Database Schema:**
* **PK**: Primary Key
* **FK**: Foreign Key

1. ***Users Table***

   | Column          | Data Type           | Description |
   |----------------|----------------|-------------|
   | `id` (PK)      | `SERIAL`         | Unique user ID (Primary Key) |
   | `username`     | `VARCHAR(50)`    | User's display name |
   | `email`        | `VARCHAR(255) UNIQUE` | User's email (must be unique) |
   | `password`     | `TEXT`           | Hashed password |
   | `profile_picture` | `TEXT`          | MinIO file URL for the profile picture |
   | `created_at`   | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Timestamp when the user was created |

2. ***Chatrooms Table***

   | Column          | Data Type           | Description |
   |---------------|----------------|-------------|
   | `id` (PK)      | `SERIAL`         | Unique chatroom ID (Primary Key) |
   | `name`         | `VARCHAR(100)`   | Chatroom name |
   | `created_by` (FK) | `INTEGER`       | User ID of the chatroom creator (Foreign Key to `Users.id`) |
   | `created_at`   | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Timestamp when the chatroom was created |

3. ***Messages Table***

   | Column          | Data Type           | Description |
   |---------------|----------------|-------------|
   | `id` (PK)      | `SERIAL`         | Unique message ID (Primary Key) |
   | `chatroom_id` (FK) | `INTEGER`   | Chatroom ID the message belongs to (Foreign Key to `Chatrooms.id`) |
   | `user_id` (FK)  | `INTEGER`       | Sender's User ID (Foreign Key to `Users.id`) |
   | `content`      | `TEXT`          | Message text content |
   | `file_id` (FK)  | `INTEGER NULL`  | Optional reference to an uploaded file (Foreign Key to `Files.id`) |
   | `created_at`   | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Timestamp when the message was sent |

5. ***Files Table***

   | Column          | Data Type           | Description |
   |---------------|----------------|-------------|
   | `id` (PK)      | `SERIAL`         | Unique file ID (Primary Key) |
   | `user_id` (FK)  | `INTEGER`       | Uploader's User ID (Foreign Key to `Users.id`) |
   | `chatroom_id` (FK) | `INTEGER NULL`  | Associated chatroom ID, if applicable (Foreign Key to `Chatrooms.id`) |
   | `file_url`     | `TEXT`          | MinIO storage URL for the file |
   | `created_at`   | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Timestamp when the file was uploaded |

#### **User Interface and Experience Design:**

1. ***Homepage：*** Login/signup form with a modern UI.
2. ***Chatroom List Page：*** Displays available chatrooms, option to create/join a chatroom.
3. ***Chat Interface：***
      - Message history
      - Real-time messaging
      - Mentions (@username or @ollama)
      - File upload button
      - Performance optimizations where appropiate. e.g., inifinite scroll, Web Workers.
4. ***Dark Mode and Theming：*** Users can toggle between light and dark modes using Ant Design’s theming options.
5. ***Mobile-Friendly Design：*** UI will be optimized for both desktop and mobile devices.

#### **Integration with External Services:**

1. ***Ollama API:*** Used for AI chatbot responses when mentioned in chat.
2. ***MinIO Storage:*** External storage for user-uploaded files.
3. ***PostgreSQL:*** Local hosting for chat messages and user data.

#### **Course Requirements Fulfillment:**

| Core Technical Requirements | Fulfillment |
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

Our team brings industry experience in full-stack development, including React, Express.js, PostgreSQL, WebSockets, and AI APIs (Ollama), ensuring efficient implementation. We have access to all necessary resources, including PostgreSQL (database), MinIO (file storage), Ollama AI API, and cloud hosting, with early setup planned to prevent delays. The project is planned for completion within seven weeks. Given its scope and complexity, this timeline is realistic and achievable if the team follows the structured development plan provided in the Tentative Plan section below.

## **Tentative Plan**

Our project aims to develop a fully functional chat room website featuring core messaging capabilities and an AI chatbot powered by the Ollama framework. We will follow a modular approach, clearly separating frontend and backend components to ensure a robust, user-friendly platform. Tasks will be effectively distributed among team members to meet our deadline. The project timeline spans 7 weeks, starting March 3rd and ending April 20th. Below is the detailed weekly plan:

### **Project Timeline and Milestones:**

1. **Week 1: Project Setup**: March 3 - 9
   - Create repository and dev environment.
   - Define API endpoints and documentation.
   - Finalize tech stack and dependencies.
   - Assign team responsibilities.

2. **Week 2: Backend Development**: March 10 - 16
   - Set up Express.js server and RESTful APIs.
   - Develop PostgreSQL database models with Prisma ORM.
   - Implement JWT-based user authentication.

3. **Week 3: Backend Development**: March 17 - 23
   - Enable real-time messaging with Socket.io.
   - Store messages with timestamps and sender info.
   - Add admin moderation features.

4. **Week 4: Frontend Development**: March 24 - 30
   - Build React app with Ant Design components.
   - Implement user auth flows and profile management.
   - Integrate backend API calls and WebSockets.
   - Add responsive UI, dark mode, and themes.
   - Set up routing (login, chatroom list, chat pages).

5. **Week 5: AI Chatbot & File Sharing**: March 31 - April 6
   - Integrate Ollama AI chatbot in backend.
   - Create chatbot response endpoints and "@mentions."
   - Enable file uploads in chats.
   - Manage file storage with MinIO.

6. **Week 6: Testing and Refinement**: April 7 - 13
   - Conduct unit/integration tests.
   - Optimize for mobile and address UI/UX issues.
   - Complete API documentation.
   - Optimize performance (e.g. Infinite scroll)

7. **Week 7: Deployment and Finalization**: April 14 - 20
   - Deploy to cloud hosting.
   - Perform final testing and security checks.
   - Verify PostgreSQL and MinIO stability.
   - Finalize presentation/report.

### **Team Responsibilities:**

- **Kaifeng Lu:** Backend Lead – Develop RESTful API with Express.js, manage database interactions, and implement authentication.
- **Xiaoyang Xie:** Frontend Lead – Develop React UI, handle API integration, and ensure user experience optimization.
- **Zenan Jiang:** WebSocket and AI Integration – Implement WebSocket for real-time communication and integrate the Ollama chatbot.
- **Yanhao Li:** Documentation and Testing – Maintain API documentation, conduct testing, and assist in deployment.
