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
In today's globalized and digitally connected world, online chat rooms have become a vital platform for communication, collaboration, and community building. However, many existing platforms still face challenges in delivering a seamless and user-friendly chat experience:

1. **Lack of Lightweight, Customizable Tools**:  
   Traditional platforms can be overly complex or restrictive, especially for smaller communities or developer teams who require flexibility and simplicity without losing key features.

2. **Limited Support for Real-Time Communication & File Sharing**:  
   Many solutions don’t provide fully responsive real-time messaging or easy file-sharing capabilities without third-party plugins or added cost.

### **Why This Project is Worth Pursuing:**
This project aims to build a real-time web-based chatroom application that prioritizes simplicity, usability, and flexibility. It offers a clean interface, seamless messaging, and file-sharing features that make it a useful tool for social users, teams, and learning groups. Key reasons for pursuing this include:

1. **Enhanced User Experience**:  
   By developing an intuitive interface with responsive design, chat previews, and emoji support, we offer a comfortable and modern user experience across devices.

2. **Support for Communication and Collaboration**:  
   With the ability to create and join multiple chatrooms, view message history, and manage user sessions, this platform facilitates more organized and effective group interaction.

3. **Scalability and Maintainability**:  
   By following modern development practices and separating the frontend and backend, the system is easier to extend and deploy for future use cases — including potential AI-based features down the line.

### **Describe the Target Users:**

1. **General Social Users**  
   Everyday users looking for a simple messaging platform to stay in touch with friends, family, or communities. The app’s emoji support, responsive UI, and file-sharing features provide an engaging experience.

2. **Tech Enthusiasts and Developers**  
   Developers may benefit from the clean structure and potential to extend the platform. While AI chat was considered, the current version focuses on real-time, socket-based communication and backend extensibility.

3. **Businesses and Collaborative Teams**  
   Teams can create private chatrooms for specific discussions and securely share files. The role-based interactions and reliable message delivery make it useful for internal collaboration.

4. **Educational Institutions and Learners**  
   Students and educators can use the chatrooms for focused discussions or group work. The platform supports asynchronous messaging and persistent message storage, making it useful for ongoing Q&A and resource sharing.

### **Discuss any existing solutions and their limitations:**

1. **Complexity:**  
   Platforms like Slack and Microsoft Teams offer many features, but they can be overwhelming for casual users or small teams. Their feature-rich nature introduces a learning curve.

2. **Customization Constraints:**  
   While platforms like Slack and Discord allow integrations, they have limited flexibility in core feature modification and UI customization for niche use cases.

3. **Lack of Lightweight Real-Time Solutions:**  
   Many tools lack simple, browser-based real-time chat implementations that are easy to deploy and use. Some rely heavily on paid plans or third-party services.

4. **Limited Extensibility:**  
   Adding new features (e.g., file storage customization, direct socket handling) in existing platforms can be challenging. By building our own system, we retain full control over future enhancements.

---

## **4. Objectives**

The goal of this project is to develop a real-time chatroom web application that enhances user communication through real-time messaging, responsive design, and seamless file sharing. The system is designed to be lightweight, customizable, and scalable — laying the foundation for future integration of advanced features like AI chatbots or real-time translation. This project also emphasizes best practices in full-stack web development, including modular architecture, secure authentication, and modern UI/UX design.

---

## **5. Technical Stack**

- **Frontend**: React 19, Ant Design v5, TailwindCSS, React Router DOM, Socket.IO Client, Emoji Mart
- **Backend**: Node.js, Express.js, Prisma ORM, Socket.IO, MinIO, Multer
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Tooling**: Vite, ESLint, Jest, dotenv

---

## **6. Features**

Our application fulfills the core and advanced technical requirements outlined in the course by implementing a modern full-stack architecture with clear separation between frontend and backend, real-time features, secure authentication, file handling, and a responsive UI.

| Feature | Implementation |
|:--------|:---------------|
| **User Authentication** | Supports sign-up and sign-in using JWT-based authentication. Includes token verification, session persistence with "Remember Me", and secure credential storage using bcrypt. |
| **User Profile** | Users can view and update their display name and profile avatar. Profile pictures are uploaded via form input and rendered dynamically in the UI. |
| **Chat Room Management** | Users can create, join, and leave chatrooms. The system displays a personalized chatroom list, sorted by latest message, with unread message counts. |
| **Real-Time Messaging** | Built with WebSockets via Socket.IO. Enables room-specific message events, real-time updates with optimistic UI rendering, and ensures backend persistence of messages. |
| **File Sharing** | Users can upload and send image or PDF files through chat. Files are stored in MinIO using private, pre-signed URLs for secure access. Supports authentication, encryption, and scalable file handling. |
| **Message Storage** | All chat messages are stored in a PostgreSQL database using Prisma ORM. Each message includes a timestamp, sender info, and room association for auditability and history retrieval. |
| **Frontend Routing** | Implemented with React Router for structured navigation across login, chatroom list, and chat views. URL-based routing supports direct access and smooth user flow. |
| **Responsive UI Design** | Developed using React 19, Tailwind CSS, and Ant Design v5. The UI adapts to various screen sizes and provides a modern, accessible user experience across devices. |

### ✅ Requirement Coverage

- **Frontend Stack**: React, TailwindCSS, Ant Design v5 (meets styling and UI library requirements)
- **Backend Stack**: Express.js with RESTful API design
- **Data Storage**: PostgreSQL for relational data, MinIO for file storage (meets storage requirements)
- **Architecture**: Separate frontend and backend structure (Option B)
- **Advanced Features**:
  - ✅ User Authentication & Authorization (JWT, bcrypt)
  - ✅ Real-time Functionality (WebSockets with Socket.IO)
  - ✅ File Handling & Secure Uploads (MinIO, Multer)

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


### 6. File Upload and Sharing

Users can upload and share image or PDF files in any chatroom.

- File upload is done via the message input toolbar.
- Supported file types include images (`.png`, `.jpg`) and PDFs (`.pdf`).
- Uploaded files are stored securely in **MinIO**, and accessed via pre-signed private URLs.
- Files are immediately available in chat and can be viewed/downloaded by all participants in the room.


---

## **8. Development Guide**

## Getting Started

### **Clone the Repository**
```bash
git clone https://github.com/fewark/1724_web.git
cd 1724_web
```
## Minio Setup

The minio service is started using docker container

### **1. Navigate to the Docker Directory**
```bash
cd ./docker
```

### **2. Make the script executable (if needed)**
```bash
chmod +x run-official.sh
```

### **3. Run script**
```bash
./run-official.sh
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
And make sure your postgresql server is started, and you could leave rest of the env variables as default.

> [!WARNING]
> Do not commit your `.env.local` file to version control.

### **4. Change the username and password in DATABASE_URL in .env.local to your own**
![image](https://github.com/user-attachments/assets/6b6e3ae8-c5ac-4d6a-a001-f60f71171f88)


### **5. Run Prisma migration**
```bash
npm run prisma:migrate
```

### **6. Start the Backend**
```bash
npm run dev
```
Once the backend server is successfully started, the server will be at `http://localhost:3000/`.
And next, prepare to set up for the frontend.

### **7. Lint the code before committing**
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
Once you started the frontend server, you should be able to access it through `http://localhost:5173/`.
Finally, open this address in a browser, and enjoy our chat room applications.

### **4. Lint the code before committing**
```bash
npm run lint
```

---


## **9. Deployment Information**

The application is deployed on an **AWS EC2 instance** using a separate frontend and backend structure.

- **Live URL**: http://34.230.5.238/
- **Frontend**: React app served via Vite build and hosted using a lightweight Node server
- **Backend**: Node.js (Express.js) server
- **Process Management**: Both frontend and backend are managed using systemd for automatic startup and reliability
- **Reverse Proxy**: Handled via Caddy, which provides automatic TLS, reverse proxy to both services
- **Database**: PostgreSQL hosted locally
- **File Storage**: MinIO instance running on the same EC2
- **Deployment Platform**: AWS EC2 (Ubuntu 22.04)

Security, storage, and environment configurations are managed through `.env` files.


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
- Implemented user registration, login, and JWT-based authentication logic.
- Managed configuration files, updated project documentation, and enhanced token expiry validation.
- Deployed the application to AWS EC2 using systemd and Caddy for process management and HTTPS.
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
