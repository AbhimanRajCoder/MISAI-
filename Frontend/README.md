# MISAI Frontend

MISAI (Misinformation AI Shield) is a comprehensive platform designed to detect and combat misinformation using advanced AI techniques. This repository contains the frontend application built with React and Vite.

## Features

- **Home**: Landing page with information about MISAI's capabilities
- **TestAI**: Test and evaluate AI models for hallucination and factual accuracy
- **TestImage**: Verify the authenticity of images and detect manipulations
- **TestVideo**: Analyze videos for potential deepfakes or alterations
- **MisBot**: AI-powered chatbot for real-time misinformation detection

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd MISAI-/Frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following content:
```
VITE_HOST_URL=http://localhost:3000
```
Adjust the URL to match your backend server.

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` by default.

## Build for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
Frontend/
├── public/             # Static assets
│   └── Images/         # Image assets
├── src/
│   ├── Pages/          # Application pages
│   │   ├── Home/       # Landing page
│   │   ├── Navbar/     # Navigation component
│   │   ├── TestAI/     # AI testing interface
│   │   ├── TestImage/  # Image verification interface
│   │   ├── TestVideo/  # Video verification interface
│   │   ├── MisBot/     # AI chatbot interface
│   │   └── Footer/     # Footer component
│   ├── assets/         # Additional assets
│   ├── App.jsx         # Main application component
│   ├── index.css       # Global styles
│   └── main.jsx        # Application entry point
└── index.html          # HTML template
```

## Backend Integration

The frontend connects to a backend API for processing and analyzing content. Ensure the backend server is running and the `VITE_HOST_URL` environment variable is set correctly.

## Technologies Used

- React
- Vite
- CSS3
- Fetch API for backend communication
- Responsive design for all device sizes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.