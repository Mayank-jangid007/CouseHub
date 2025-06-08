# CourseHub - AI-Powered Learning Resource Aggregator

A modern, full-stack web application that helps learners discover and organize educational resources from multiple sources including GitHub repositories, YouTube videos, blogs, and study materials. Enhanced with AI-powered summaries and smart recommendations.

## ✨ Features

### 🔍 Smart Search
- **Multi-source search** across GitHub, YouTube, blogs, and notes
- **Real-time suggestions** with debounced input
- **Voice search** using Web Speech API
- **Advanced filtering** and sorting options

### 🤖 AI Integration
- **Intelligent summaries** for videos, articles, and documentation
- **Smart recommendations** based on search history
- **Content analysis** for better resource discovery

### 👤 User Features
- **Firebase Authentication** with Google/GitHub login
- **Cloud-synced bookmarks** across devices
- **Resource submission** with validation
- **Personalized dashboard**

### 🎨 Modern UI/UX
- **Responsive design** for all devices
- **Dark/light mode** toggle
- **Smooth animations** with Framer Motion
- **Professional card layouts** for different content types
- **Progressive Web App** (PWA) support

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** + **shadcn/ui** for styling
- **Framer Motion** for animations
- **React Router DOM** for navigation
- **React Hook Form** + **Zod** for forms

### Backend (Planned)
- **Node.js** + **Express**
- **External API integrations** (GitHub, YouTube, OpenAI)
- **Redis** for caching (optional)

### Services
- **Firebase Auth** for authentication
- **Firestore** for user data and bookmarks
- **Firebase Storage** for file uploads
- **OpenAI API** for AI features

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase project
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course-resource-aggregator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration and API keys in the `.env` file.

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password, Google, and GitHub providers
3. Create a Firestore database
4. Copy your Firebase configuration to the `.env` file

### API Keys
- **OpenAI**: Required for AI summaries and recommendations
- **YouTube**: For video search functionality
- **GitHub**: Optional, for higher API rate limits

## 📱 Features in Detail

### Search Components
- **SearchBar**: Advanced search with voice input and suggestions
- **ResultsPanel**: Tabbed interface for different content types
- **Resource Cards**: Specialized layouts for repos, videos, blogs, and notes

### Authentication
- Email/password registration and login
- Social login with Google and GitHub
- Persistent authentication state
- User profile management

### AI Features
- Content summarization using OpenAI GPT
- Smart resource recommendations
- Enhanced search relevance

## 🎯 Roadmap

- [ ] Backend API implementation
- [ ] Real GitHub/YouTube API integration
- [ ] Advanced user dashboard
- [ ] Resource submission system
- [ ] Community features and ratings
- [ ] Mobile app (React Native)
- [ ] Offline support and caching

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide](https://lucide.dev/) for the icon set
- [Pexels](https://pexels.com/) for stock images
- [Firebase](https://firebase.google.com/) for backend services