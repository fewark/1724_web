# Chat Room Web Application

A real-time chat room application consists of separate frontend and backend components located in different folders. This application allows users to register, log in, create chat rooms, send messages, and share files.

## **1. Team Information**

| Name         | Student Number | Email                      |
|--------------|----------------|----------------------------|
| Kaifeng Lu   | 1003012633     | kaifeng.lu@mail.utoronto.ca |
| Zenan Jiang  | 1004996846     | zenan.jiang@mail.utoronto.ca |
| Xiaoyang Xie | 1005755103     | xiaoyang.xie@mail.utoronto.ca |
| Yanhao Li    | 1010253618     | yanhao.li@mail.utoronto.ca |

---

## **2. Video Demo**

Link URL: 

---

## **3. Motivation**

### **Identify the Problem or Need:**
In today's globalized and digitally connected world, online chat rooms have become a vital platform for communication, collaboration, and community building. However, two significant challenges persist in enhancing the user experience of chat rooms:  

1. **Lack of Intelligent Interaction**:  
   Traditional chat rooms rely solely on human-to-human communication, lacking the ability to integrate intelligent, AI-driven interactions that can provide instant assistance, answer questions, or even engage in meaningful conversations.  

2. **Language Barriers**:  
   As chat rooms often bring together users from diverse linguistic backgrounds, real-time communication can be hindered by language differences, making it difficult for users to fully participate and connect.  

### **Why This Project is Worth Pursuing:**
This project is worth pursuing because it addresses these critical pain points by integrating cutting-edge AI technologies into chat rooms, thereby revolutionizing the way users interact and communicate. Here are some reasons:  

1. **Enhanced User Engagement**:  
   By introducing an AI-powered chatbot (e.g., `@chatbot`) that leverages large language models (LLMs), users can interact with an intelligent assistant capable of providing instant responses, answering queries, and even facilitating discussions. 
   
2. **Breaking Language Barriers**:  
   The integration of real-time translation capabilities allows users to communicate seamlessly across different languages. This feature is particularly valuable in global communities, enabling inclusivity and fostering cross-cultural collaboration.  

3. **Competitive Advantage**:  
   As AI and real-time translation technologies become increasingly prevalent, incorporating these features into a chat room positions the platform as innovative and forward-thinking, attracting a broader user base and staying ahead of competitors.  

By addressing these challenges and leveraging the power of AI, this project aims to create a more intelligent, inclusive, and engaging chat room experience, ultimately redefining how people connect and communicate in digital spaces.

### **Describe the Target Users:**

1. **General Social Users**
   This platform is designed for everyday users who rely on instant messaging tools to stay connected. Through the chatroom, they can easily communicate with friends, family, or like-minded communities. The integrated file-sharing and notification features further enhance the overall experience.

2. **Tech Enthusiasts and Developers**
   For users passionate about technology, this chatroom offers more than just basic messaging—it incorporates an AI Bot (integrated via ollama) that can assist in answering technical questions, providing development advice, or discussing code. This additional feature not only streamlines interactions but also adds value for users seeking smart, tech-driven support.

3. **Businesses and Collaborative Teams**
   Small enterprises or teams looking for an efficient internal communication tool will benefit from the platform's ability to create, manage, and join multiple chatrooms. The robust role-based access control ensures proper permissions, while message logging and search functionalities support seamless collaboration. The integrated AI Bot further assists in answering common queries or providing data insights during team discussions.

4. **Educational Institutions and Learners**
   Students and educators can use the platform for online discussions, Q&A sessions, and collaborative group work. The AI Bot can serve as a real-time tutor—responding to @mentions by providing additional learning resources or clarifying doubts, thus creating an interactive and supportive learning environment.

### **Discuss any existing solutions and their limitations:**

1. **Complexity:**

   Platforms like Slack and Microsoft Teams offer many features and integrations. However, this abundance of options makes them quite complex for everyday users or small communities. Their many settings can create a steep learning curve, which means users may struggle to quickly find and use the features they need, leading to a less smooth experience.

2. **Customization Constraints:**

   Although platforms such as Slack and Discord allow for some third-party integrations and bots, they still have limits when it comes to deep customization. For example, Slack provides APIs that let you add extra functions, but it isn’t very flexible for integrating a dedicated AI chatbot or tailoring file handling processes. Similarly, while Discord supports various bots, these often require extra development work and still offer limited customization due to the platform’s fixed interfaces and permission rules.

3. **Lack of Real-Time Interaction:**

   Some platforms, like Microsoft Teams, have started to include basic AI features, such as simple chatbots that can answer common questions. However, these are usually based on preset commands and do not support dynamic, context-aware interactions triggered by @mentions. Ideally, a chat platform should offer immediate, intelligent, and personalized responses when users are mentioned, something that most existing products are not yet able to do effectively.

4. **Limited Extensibility and Integration:**

   Many current chat solutions have limited options for extending functionality or integrating with external services. For example, Telegram offers a Bot API that lets developers create bots, but its features are restricted when it comes to integrating advanced AI models or custom file management systems. Likewise, Discord supports many third-party bots, but adding a custom AI bot often requires significant extra work. This limited flexibility means that developers need to invest more time and effort to build the features they want.

By comparing these real products, we can see that although the chat platforms currently on the market are powerful, they still have shortcomings in terms of ease of use, customization, real-time interaction and scalability.

---

## **4. Objectives**

  The goal of this project is to develop a real-time chatroom web application that enhances user communication through intelligent AI-driven interactions, real-time messaging, and seamless file sharing. By integrating AI capabilities, this system will improve engagement and accessibility for users from a varity of backgrounds. This project also aims to provide a scalable and maintainable solution that aligns with modern web development practices.

---

## **5. Technical Stack**

- **Frontend**: React 19, Ant Design v5, TailwindCSS, React Router DOM, Socket.IO Client, Emoji Mart
- **Backend**: Node.js, Express.js, Prisma ORM, Socket.IO, MinIO, Multer
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Tooling**: Vite, ESLint, Jest, dotenv

---

## **6. Features**

| Feature | Implementation |
| :------- | :------ |
| User Authentication | Sign‑up / sign‑in, JWT issuance & verification, "Remember Me" persistent sessions|
| User Profile | View / edit display name & avatar, and it has picture for profile. |
| Chat Room Management | Create room, join/leave room, list user’s rooms with unread counts.|
| Real‑time Messaging | Bi‑directional WebSocket via Socket.IO, room‑scoped events, optimistic UI update, server persistence. |
| Message Storage | Messages will be stored in PostgreSQL using Prisma ORM with timestamps and sender details. |
| Frontend Routing | Implemented using React Router, with pages for login, chatroom list, and individual chatrooms. |
| Responsive UI Design | Built with React + Ant Design for a modern and user-friendly interface. |

---

## **7. User Guide**

This section outlines how users can interact with our web application. It walks through the core features including authentication, chat functionality, and overall navigation.

### 1. Sign Up / Log In

Upon visiting the website, users are greeted with a welcome screen where they can either **sign up** or **log in**.

- **Sign Up**: Create a new account by providing a username and password. A profile picture can be added (optional).
- **Log In**: Enter your registered credentials to access your account.
- Authentication is secured using **JWT tokens** and supports a "Remember Me" option for persistent sessions.

<img width="1920" alt="image" src="https://github.com/user-attachments/assets/fac33b27-71c4-44d4-b360-b45c2feddf85" />
Picture for of welcome/login screen


### 2. Chatroom List View

After successful login, users are redirected to the **Chatroom List** page.

- Users will see all existing chatrooms they are part of, sorted by the most recent message.
- Each chatroom shows a preview of the latest message and a timestamp.
- Users can **create or join chatrooms**, and upon clicking one, they are taken to that specific chat.

<img width="692" alt="image" src="https://github.com/user-attachments/assets/088b7526-fe5a-4946-83a7-a51197057a5f" />

Picture of chatroom list view


### 3. Real-Time Messaging

Inside a chatroom, users can communicate in real-time.

- **Messages** are sent and received instantly using **Socket.io**.
- The chat supports:
  - Sending and receiving emojis via an emoji picker.
  - Hoverable timestamps on each message.
  - Auto-scrolling to the newest message.
- Messages are stored persistently in the PostgreSQL database with timestamp and sender info.

<img width="1919" alt="image" src="https://github.com/user-attachments/assets/0e059e86-982f-4690-b056-9ada0b70ee7d" />
Picture of active chatroom with messages and emojis



### 4. User Profile and Sign Out

- Users can view and manage their **profile** from the chatroom list page.
- Profile settings allow users to update their display name and profile image.
- A **Sign Out** button is available in the top menu, which clears the token and returns the user to the login page.
<img width="1917" alt="image" src="https://github.com/user-attachments/assets/c1067578-d879-4bc1-b53f-da9c1d6566ee" />
Picture of user profile dropdown


### 5. Responsive Design

The application is fully responsive and optimized for desktop usage.

- Built with **React** and **Ant Design**, the interface adapts to various screen sizes.
- All pages, including login, chatroom list, and chatroom view, remain accessible and usable on Desktop.

---

## **8. Development Guide**

## Getting Started

### **Clone the Repository**
```bash
git clone https://github.com/fewark/1724_web.git
cd 1724_web
```

## Backend Setup

The Backend is built using Node.js with Postgresql and Prisma.

### **1. Navigate to the Backend Directory**
```bash
cd ./backend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set up environment variables**
Make a copy of the `.env` file as `.env.local` in the backend folder, and replace the `DATABASE_URL` with your actual database url inside the `.env.local` file:
```bash
cp .env .env.local
```
And make sure your postgresql server is started.

> [!WARNING]
> Do not commit your `.env.local` file to version control.

### **4. Run Prisma migration**
```bash
npm run prisma:migrate
```

### **5. Start the Backend**
```bash
npm run dev
```

### **6. Lint the code before committing**
```bash
npm run lint
```


## Frontend Setup

The frontend is built using React.js with Ant Design for UI components.

### **1. Navigate to the Frontend Directory**
```bash
cd ./frontend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start the Frontend**
```bash
npm run dev
```

### **4. Lint the code before committing**
```bash
npm run lint
```

---


## **9. Deployment Information**



---

## **10. Individual Contributions**

### Kaifeng Lu (fewark)
- Led the development of chatroom features: creation, retrieval, messaging, pagination, and notifications.
- Refactored authentication flow, improving JWT handling and implementing "remember me" functionality.
- Enhanced frontend components: emoji picker, layout improvements, timestamp formatting, and welcome screen.
- Improved user session management with localStorage/sessionStorage handling and auto-navigation logic.
- Maintained code quality through regular refactors, ESLint configuration updates, and detailed logging cleanup.

### Jason Xie (jasonxiexy)
- Set up the initial backend and frontend structure for the project.
- Implemented user registration and login features for authentication.
- Managed configuration files, including `.env`, and updated the `README.md`.
- Enhanced the authentication handler by adding token expiry validation logic.
- Authored and submitted the final project report.

### Zenan Jiang (ZenanJ)
- Contributed to the backend by developing the presigned URL API for file uploads.
- Set up Docker support by creating the Dockerfiles and docker-compose configuration.
- Updated the `README.md` with team contact information and ensured documentation accuracy.
- Participated in backend API development and deployment readiness.

### Yanhao (Yanhao63)
- Assisted with containerization and deployment setup using Docker.
- Updated and refined the Docker environment for consistent development experience.
- Contributed to backend infrastructure setup and testing during initial project phases.
- Provided support for cross-platform compatibility and team environment syncing.
- Updated the `README.md`.

---

## **11. Lessons Learned and Concluding Remarks**

Throughout the development of this chat room web application, our team gained valuable insights into full-stack development, collaborative workflows, and the practical challenges of building a real-time, scalable system from scratch.

### **Lessons Learned**

- **Full-Stack Integration**:  
  Working on both the frontend and backend helped us deepen our understanding of how different layers of a web application interact. We learned how to design and implement RESTful APIs, manage state between client and server, and ensure secure authentication using JWT.

- **Real-Time Communication**:  
  Implementing Socket.IO for real-time messaging introduced us to WebSocket-based communication. We gained experience in handling socket events, managing message broadcasts, and dealing with race conditions and synchronization issues in multi-user environments.

- **Database Modeling and ORM**:  
  Using PostgreSQL with Prisma ORM taught us the importance of structured schema design and how to leverage migrations to evolve our database reliably during development.

- **Code Quality and Team Collaboration**:  
  By enforcing linting rules and adopting clear commit messages, we ensured maintainable and readable code across the team. Our use of GitHub workflows and proper project management helped coordinate tasks efficiently.

- **DevOps and Deployment Preparation**:  
  Setting up Docker and preparing environment configurations for development and production helped us appreciate the importance of portability, consistent environments, and deployment-readiness.

- **UI/UX Considerations**:  
  Using Ant Design and TailwindCSS, we learned how to build a responsive and clean user interface that enhances usability, while also implementing dynamic features like emoji pickers, hover effects, and real-time updates.

### **Concluding Remarks**

This project was both challenging and rewarding. It allowed us to apply theoretical knowledge from our coursework into a practical, working system. We collaborated effectively across various responsibilities and learned how to break down complex problems into manageable tasks.

We’re proud of what we’ve built — a secure, real-time chat platform that supports user authentication, message storage, file sharing, and an enhanced UI. While there are still features we’d love to explore (like AI chatbots and live translation), this experience has laid a strong foundation for future development.

Overall, this project has greatly improved our skills in modern web development, teamwork, and problem-solving. It was a fulfilling capstone experience, and we are confident that the knowledge gained will serve us well in future academic or industry roles.

---
