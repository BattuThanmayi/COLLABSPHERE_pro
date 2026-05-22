# CollabSphere Frontend

A modern React-based frontend application for CollabSphere - a platform to connect collaborators and build amazing projects together.

## 🚀 Features

- **Authentication**: User registration and login with JWT tokens
- **Projects**: Browse, create, and join projects
- **User Profiles**: View and edit user profiles with skills
- **Messaging**: Real-time chat between collaborators
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern gradient design with smooth animations

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/                 # Authentication components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Auth.css
│   ├── Layout/               # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.css
│   │   └── Footer.css
│   ├── Projects/             # Project components
│   │   ├── ProjectCard.jsx
│   │   ├── CreateProject.jsx
│   │   ├── ProjectCard.css
│   │   └── Projects.css
│   ├── Users/                # User profile components
│   │   ├── Profile.jsx
│   │   └── Profile.css
│   └── Messages/             # Messaging components
│       ├── ChatList.jsx
│       ├── ChatWindow.jsx
│       └── Messages.css
├── pages/
│   ├── HomePage.jsx          # Home page
│   ├── ProjectsPage.jsx      # Projects listing
│   ├── ProfilePage.jsx       # User profile
│   ├── MessagesPage.jsx      # Messaging interface
│   ├── NotFoundPage.jsx      # 404 page
│   └── Pages.css
├── services/
│   └── api.js                # API service layer
├── context/
│   ├── AuthContext.jsx       # Authentication context
│   └── AppContext.jsx        # App-wide context
├── hooks/
│   └── useAuth.js            # Custom hook for auth
├── App.jsx                   # Main app component
├── App.css
├── index.js
└── index.css
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Navigate to the project directory**:
   ```bash
   cd c:\workspace\collabshephere\frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 🔧 Configuration

### API Base URL

The API base URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Make sure your backend server is running on `http://localhost:5000` or update this URL accordingly.

## 📝 Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the production bundle
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## 🎨 Styling

The project uses CSS with a modern gradient design:
- **Primary Color**: #667eea (soft purple)
- **Secondary Color**: #764ba2 (darker purple)
- **Accent Color**: #ff6b6b (red)

All CSS files are modular and located alongside their respective components.

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. Tokens are stored in localStorage
2. Protected routes redirect unauthenticated users to login
3. `AuthContext` manages authentication state globally
4. `useAuth` hook provides easy access to auth state

## 📱 Pages

### Home Page (`/`)
- Landing page with features and statistics
- CTA for registration

### Login (`/login`)
- User login form
- Email and password authentication

### Register (`/register`)
- User registration form
- Account creation with validation

### Projects (`/projects`)
- Browse all projects
- Create new projects (authenticated users)
- Join existing projects
- Project cards with skills and member info

### Profile (`/profile`) - Protected
- View user profile information
- Edit profile details
- Add skills and GitHub link

### Messages (`/messages`) - Protected
- Chat list with all conversations
- Real-time messaging interface
- Message history

## 🚀 Deployment

To build for production:

```bash
npm run build
```

This creates an optimized build in the `build/` directory ready for deployment.

## 📚 API Endpoints Used

The frontend communicates with these backend endpoints:

- **Auth**
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `GET /api/auth/verify` - Verify token

- **Projects**
  - `GET /api/projects/all` - Get all projects
  - `POST /api/projects/create` - Create new project
  - `POST /api/projects/join/:projectId` - Join project

- **Users**
  - `GET /api/users/profile` - Get user profile
  - `PUT /api/users/update` - Update profile
  - `GET /api/users/:userId` - Get user by ID

- **Messages**
  - `GET /api/messages/conversations` - Get conversations
  - `GET /api/messages/chat/:userId` - Get messages with user
  - `POST /api/messages/send` - Send message

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
PORT=3001 npm start
```

### API Connection Issues
1. Ensure backend server is running on port 5000
2. Check the `API_BASE_URL` in `src/services/api.js`
3. Check browser console for CORS errors

### Build Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
npm build
```

## 📄 License

This project is part of CollabSphere. All rights reserved.

## 🤝 Contributing

To contribute, follow the existing code structure and styling conventions. Make sure to:

1. Keep components modular
2. Use descriptive naming
3. Add CSS modules for style isolation
4. Test on mobile and desktop

## 📞 Support

For issues or questions, please contact the development team.

---

**Happy Coding! 🚀**
