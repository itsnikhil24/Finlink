## To execute this application follow the mentioned steps below :

Step 1: Git clone this repository using  this command : git clone https://github.com/itsnikhil24/Finlink.git

Step 2: Install all the packages needed for the application using : npm install

Step 3: Open the terminal in directory and run the server using command: node index.js

Step 4: Open any browser and write Local : http://localhost:3000



## User caan register and create own login details otherwise use given below details:

- username: 23BCC70030
- password: 123

second username

- username: 20BCS4122
- password: 123







# 🥁Introduction

FinTechGrow is a dynamic web application designed to connect users with industry experts for financial guidance, foster skill-sharing through a barter system, and track personal growth in their financial journey. By leveraging real-time communication and a collaborative ecosystem, our platform empowers users to grow financially and professionally.

## 💡Inspiration:


The idea for FinTechGrow stems from the increasing need for accessible, expert-driven financial guidance and the power of collaborative growth. Many individuals face challenges in accessing expert advice or resources to achieve their financial goals. We also recognized the untapped potential in skill-sharing among individuals with diverse expertise. With FinTechGrow, we aim to create a platform where users can connect with industry experts and each other to foster shared growth, while tracking the impact of these interactions on their financial journey.
  
## 💬 What it does:

* Request and Expert Assistance
Users can create requests for financial guidance, which are catered to by experienced industry professionals.

* After logging in, users can detail their needs and connect with experts for personalized advice.
Real-Time Chat Application
Users can engage in live, real-time conversations with industry experts, ensuring seamless communication and guidance.

* Barter System
Facilitates a skill-sharing ecosystem where users can exchange expertise and services.

Example: A financial analyst can offer investment advice in return for branding or marketing services from another user.
Profile and Growth Tracker
Each user has a profile section that highlights their progress and achievements after using the platform, offering insights into their growth journey.


## 🛠 How we built it
### Frontend:

We used EJS for dynamic rendering, CSS for responsive styling, and JavaScript for interactive client-side functionality.

### Backend:

The server is built using Node.js and Express.js to handle requests efficiently.
Socket.IO powers the real-time chat functionality.

### Database:

MongoDB serves as the primary database for managing user data, requests.
### File Management:

Multer is used for handling file uploads, such as profile pictures and request-related files.


## ❗Challenges we ran into:

- **Real-Time Communication** :
Integrating Socket.IO for live chats was initially challenging, particularly in managing private chat rooms and ensuring smooth message delivery.

- **Database Access and Security**:
Managing sensitive user data while ensuring secure and scalable database access required careful configuration of authentication and data validation.

- **Barter System Logic**:
Creating a matching algorithm for pairing users based on their offered and required services involved significant planning and iteration.