# Chat Room Web Application

A real-time chat room application consists of separate frontend and backend components located in different folders. This application allows users to register, log in, create chat rooms, send messages, and share files.

## **1. Team Information**

| Name         | Student Number | Email                      |
|--------------|----------------|----------------------------|
| Kaifeng Lu   | 1003012633     |                               |
| Zenan Jiang  | 1004996846     |                               |
| Xiaoyang Xie | 1005755103     | xiaoyang.xie@mail.utoronto.ca |
| Yanhao Li    | 1010253618     |                               |


## **2. Video Demo**


## **3. Motivation**


## **4. Objectives**


## **5. Technical Stack**

- **Frontend**: React.js, Ant Design, TailwindCSS
- **Backend**: Node.js, Express.js, Prisma
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Real-Time Communication**: Socket.IO

## **6. Features**

## **7. User Guide**

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
Make a copy of the `.env` file as `.env.local` in the backend folder, and add your url and key inside:
```bash
cp .env .env.local
```

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


## **9. Deployment Information**

## **10. Individual Contributions**

## **11. Lessons Learned and Concluding Remarks**


---
