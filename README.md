# 📧 Email Spam Detection & Summarization

A full-stack web application that intelligently detects spam emails and provides AI-powered email summaries using advanced machine learning models.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-blue?style=for-the-badge)](https://sarthak536.github.io/spam_detection_email_summarizer/)
[![Backend](https://img.shields.io/badge/Backend-Flask_+_ML-green?style=flat-square)](backend/)
[![Frontend](https://img.shields.io/badge/Frontend-React_+_Vite-blue?style=flat-square)](frontend/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

## ✨ Features

- **🛡️ Spam Detection**: Advanced Logistic Regression with TF-IDF vectorization for accurate spam/ham classification
- **📝 Email Summarization**: HuggingFace T5-small transformer model for intelligent email summarization  
- **🔄 Smart Fallback**: Automatically switches to demo mode when backend is unavailable
- **⚡ Real-time Analysis**: Instant spam detection and summarization with confidence scores
- **🎨 Modern UI**: Beautiful React frontend with responsive design and real-time feedback
- **🚀 GitHub Pages Ready**: Deployable as a static demo with identical UI/UX

## 🎬 Demo

### Live Demo: [View Here](https://sarthak536.github.io/spam_detection_email_summarizer/)

| Feature | Real Backend | Demo Mode |
|---------|-------------|-----------|
| **Spam Detection** | Logistic Regression + TF-IDF | Keyword-based simulation |
| **Email Summarization** | T5-small Transformer | Extractive summarization |
| **Response Format** | ✅ Identical | ✅ Identical |
| **UI/UX** | ✅ Full features | ✅ Full features |
| **Processing Time** | ~1-3 seconds | ~1-3 seconds (simulated) |

### 📸 Application Preview

![Main Interface](screenshots/Screenshot%201.png)
*Clean, modern interface with email input and real-time analysis*

![Analysis Results](screenshots/Screenshot%202.png)
*Comprehensive spam detection and summarization results*

### Screenshots

<details>
<summary>📸 Click to view all screenshots</summary>

#### Main Application Interface
![Main Interface](screenshots/Screenshot%201.png)
*The main application interface showing email input area and real-time analysis results*

#### Spam Detection Results
![Spam Detection](screenshots/Screenshot%202.png)
*Spam detection results displaying confidence scores and classification details*

#### Email Summarization
![Email Summary](screenshots/Screenshot%203.png)
*Email summarization feature showing original text compression and intelligent summary generation*

#### Complete Analysis Dashboard
![Complete Analysis](screenshots/Screenshot%204.png)
*Full analysis view combining both spam detection and email summarization with detailed metrics*

</details>

## 🛠 Tech Stack

### Backend
- **Framework**: Flask (Python 3.8+)
- **ML Models**: 
  - **Spam Detection**: scikit-learn (Logistic Regression + TF-IDF)
  - **Summarization**: HuggingFace Transformers (T5-small)
- **Data Processing**: pandas, numpy, nltk
- **API**: RESTful endpoints with CORS support

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Material Design)
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Toastify
- **Deployment**: GitHub Pages compatible

### DevOps
- **CI/CD**: GitHub Actions
- **Deployment**: Automatic GitHub Pages deployment
- **Build Tools**: Vite, npm scripts
- **Linting**: ESLint

## 📁 Project Structure

```
spam_detection_email_summarizer/
├── 🗂️ backend/
│   ├── 🐍 app.py                    # Flask application server
│   ├── 📄 requirements.txt          # Python dependencies
│   ├── 🤖 train_models.py          # ML model training script
│   ├── 📊 spam_ham_dataset.csv     # Training dataset
│   ├── 🔧 models/
│   │   ├── 🛡️ spam_detector.py     # Spam detection model
│   │   └── 📝 email_summarizer.py  # Email summarization model
│   └── 🛠️ utils/
│       └── ⚙️ data_preprocessing.py # Data processing utilities
├── 🎨 frontend/
│   ├── 📦 package.json             # Node.js dependencies
│   ├── ⚡ vite.config.js           # Vite build configuration
│   ├── 🎨 tailwind.config.js       # Tailwind CSS config
│   └── 📂 src/
│       ├── 🏠 App.jsx              # Main React component
│       ├── 🧩 components/          # Reusable UI components
│       │   ├── 📝 EmailInput.jsx   # Email input form
│       │   ├── 🛡️ SpamDetection.jsx # Spam results display
│       │   └── 📄 EmailSummary.jsx  # Summary results display
│       └── 🔌 services/
│           ├── 🌐 api.js           # Real API service
│           └── 🎭 mockApi.js       # Demo fallback service
├── 🤖 .github/workflows/
│   └── 🚀 deploy.yml              # GitHub Actions deployment
├── 📸 screenshots/                 # Application screenshots
├── 📜 README.md                    # This file
└── 🚀 deploy-github-pages.sh      # Deployment script
```
│   │   └── services/         # API service layer
│   └── dist/                 # Build output
├── spam_ham_dataset.csv      # Training dataset
└── README.md
```

## � Quick Start

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **Git** (for version control)

### 🔧 Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/sarthak536/spam_detection_email_summarizer.git
cd spam_detection_email_summarizer
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Train models (optional - will auto-train on first run)
python train_models.py

# Start Flask server
python app.py
```
💡 Backend runs on `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```
💡 Frontend runs on `http://localhost:3000`

### 🌐 GitHub Pages Deployment

#### Option 1: Automatic Deployment (Recommended)

1. **Fork this repository** to your GitHub account
2. **Update the demo URL** in this README (replace `sarthak536` if needed)
3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` (will be created automatically)
4. **Push to main branch** - GitHub Actions will automatically build and deploy
5. **Access your demo** at: `https://sarthak536.github.io/spam_detection_email_summarizer/`

#### Option 2: Manual Deployment

```bash
# Install dependencies and build
cd frontend
npm install
npm run build:github

# Deploy to GitHub Pages
npx gh-pages -d dist
```

Or use the provided script:
```bash
# Make script executable (Unix/macOS)
chmod +x deploy-github-pages.sh
./deploy-github-pages.sh

# Windows
deploy-github-pages.bat
```

## 📊 API Endpoints

### Health Check
```
GET /health
```

### Spam Detection
```
POST /predict
Content-Type: application/json

{
  "text": "Email content here..."
}
```

### Email Summarization
```
POST /summarize
Content-Type: application/json

{
  "text": "Email content here...",
  "max_length": 50,
  "min_length": 10
}
```

### Full Analysis (Spam + Summary)
```
POST /analyze
Content-Type: application/json

{
  "text": "Email content here...",
  "max_length": 50,
  "min_length": 10,
  "force_summary": false
}
```

## 🎯 Usage

1. **Open the application** in your browser at `http://localhost:3000`

2. **Enter email content** in the text area or use sample emails

3. **Choose analysis type**:
   - **Full Analysis**: Spam detection + summarization
   - **Spam Detection Only**: Quick spam/ham classification
   - **Summarization Only**: Generate email summary

4. **Review results** with confidence scores and detailed insights

## 🔧 Configuration

### Summary Options
- **Max Length**: Maximum words in summary (10-100)
- **Min Length**: Minimum words in summary (5-50)
- **Force Summary**: Generate summaries even for spam emails

### Model Parameters
- **Spam Detection**: Configurable in `models/spam_detector.py`
- **Summarization**: Adjustable in `models/email_summarizer.py`

## 📈 Model Performance

### Spam Detection Model
- **Algorithm**: Logistic Regression with TF-IDF
- **Features**: 5000 TF-IDF features with 1-2 gram tokens
- **Preprocessing**: Text cleaning, stemming, stopword removal
- **Performance**: Typically achieves >95% accuracy on spam/ham classification

### Email Summarization Model
- **Model**: T5-small (60M parameters)
- **Framework**: HuggingFace Transformers
- **Technique**: Extractive and abstractive summarization
- **Optimization**: Beam search with length penalty

## 🐛 Troubleshooting

### Common Issues

1. **Backend server not starting**:
   - Check Python version (3.8+)
   - Ensure all dependencies are installed
   - Verify port 5000 is available

2. **Frontend not connecting to backend**:
   - Verify backend is running on port 5000
   - Check for CORS issues
   - Ensure firewall allows connections

3. **Model training errors**:
   - Check dataset file location
   - Verify sufficient disk space
   - Ensure internet connection for downloading models

4. **Memory issues**:
   - Close unnecessary applications
   - Consider using CPU-only mode for transformers
   - Reduce batch size in model configuration

### Performance Tips

- **First run**: Initial model downloads may take time
- **Large emails**: Processing time increases with email length
- **Memory usage**: T5 model requires ~2GB RAM minimum

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Dataset**: Spam/Ham email dataset for training
- **Models**: scikit-learn and HuggingFace communities
- **UI Components**: Tailwind CSS and React ecosystem

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Look through existing GitHub issues
3. Create a new issue with detailed information
4. Include error logs and system information

---

**Happy Email Analysis! 📧✨**
