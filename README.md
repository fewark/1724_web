# Chat Room Web Application

A real-time chat room application consists of separate frontend and backend components located in different folders. This application allows users to register, log in, create chat rooms, send messages, and share files.

---

## Technologies Used

- **Frontend**: React.js, Ant Design, TailwindCSS
- **Backend**: Node.js, Express.js, Prisma
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Real-Time Communication**: Socket.IO

## Getting Started

### **Clone the Repository**
```bash
git clone https://github.com/fewark/1724_web.git
cd 1724_web
```

## **Backend Setup**

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
Modify the `.env` file in the backend folder to add your actual url and key:

```env
DATABASE_URL="postgresql://postgres:randompassword@localhost:5432/mydb?schema=public"
JWT_SECRET=your_jwt_secret_key
```

### **4. Run Prisma migration**
```bash
npx prisma migrate dev --name init
```

### **5. Start the Frontend**
```bash
npm run dev
```


## **Frontend Setup**

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