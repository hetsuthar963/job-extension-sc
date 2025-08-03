# AI Web Content Analyzer

A comprehensive system for capturing web content via Chrome extension and analyzing it with AI for job hunting and business prospecting.

## 🚀 Features

### Chrome Extension
- **One-click capture** of any web page content
- **Smart content extraction** focusing on main content areas
- **Automatic categorization** (jobs vs business prospects)
- **Local storage** for offline functionality
- **Clean, intuitive popup interface**

### Web Application
- **AI-powered analysis** using OpenAI GPT models
- **Intelligent categorization** and priority scoring
- **Job hunting insights**: salary analysis, skill matching, preparation recommendations
- **Business prospecting**: company analysis, pain point identification, outreach strategies
- **Beautiful dashboard** with filtering and search
- **Real-time analysis** with loading states and progress tracking

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **AI**: OpenAI GPT-4, Vercel AI SDK
- **Database**: PostgreSQL (configurable)
- **Extension**: Chrome Extension Manifest V3
- **Deployment**: Vercel, AWS EC2

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- Chrome browser
- OpenAI API key
- Database (PostgreSQL recommended)

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd ai-web-analyzer
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a `.env.local` file:
\`\`\`env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration (if using external DB)
DATABASE_URL=postgresql://username:password@localhost:5432/webanalyzer

# App Configuration
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 4. Database Setup
\`\`\`bash
# If using PostgreSQL, run the setup script
psql -d your_database -f scripts/setup-database.sql
\`\`\`

### 5. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 6. Install Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder from this project
5. The extension should now appear in your Chrome toolbar

## 🎯 Usage Guide

### For Job Hunting

1. **Browse job listings** on LinkedIn, Indeed, or company websites
2. **Click the extension icon** when viewing a job posting
3. **Click "Capture This Page"** to save the job details
4. **Open the dashboard** to see AI analysis including:
   - Priority level (High/Medium/Low)
   - Salary analysis and market comparison
   - Key requirements and skill matching
   - Preparation recommendations
   - Company culture insights

### For Business Prospecting

1. **Visit company websites**, LinkedIn profiles, or business directories
2. **Capture prospect information** using the extension
3. **Review AI insights** for:
   - Company size and revenue analysis
   - Decision maker identification
   - Pain point detection
   - Recommended outreach strategies
   - Optimal timing and approach methods

## 🧠 AI Prompting Strategies

### Job Analysis Prompts
The system uses sophisticated prompts to analyze job postings:

\`\`\`
You are an expert career advisor analyzing job postings. Focus on:
1. Salary competitiveness and market positioning
2. Required vs preferred qualifications
3. Company growth indicators and culture
4. Career advancement opportunities
5. Specific preparation recommendations
\`\`\`

### Business Prospect Prompts
For business analysis, the AI uses:

\`\`\`
You are a business development expert analyzing prospects. Evaluate:
1. Company financial health and growth trajectory
2. Decision maker accessibility and influence
3. Current business challenges and pain points
4. Competitive landscape and positioning
5. Optimal outreach timing and messaging
\`\`\`

## 🔧 Configuration

### API Endpoints
- `GET /api/pages` - Retrieve all captured pages
- `POST /api/pages` - Save new captured page
- `DELETE /api/pages?id=<id>` - Delete specific page
- `POST /api/analyze` - Analyze single page with AI
- `POST /api/analyze-batch` - Batch analyze multiple pages

### Chrome Extension Configuration
Update `chrome-extension/popup.js`:
\`\`\`javascript
const API_BASE_URL = 'https://your-deployed-app.vercel.app'
\`\`\`

## 🚀 Deployment

### Deploy to Vercel
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Deploy to AWS EC2
1. Set up EC2 instance with Node.js
2. Clone repository and install dependencies
3. Configure environment variables
4. Set up reverse proxy (nginx)
5. Use PM2 for process management

\`\`\`bash
# On EC2 instance
pm2 start npm --name "web-analyzer" -- start
pm2 startup
pm2 save
\`\`\`

## 📊 Analytics & Insights

The system provides detailed analytics:

- **Capture Statistics**: Pages captured over time
- **Category Distribution**: Jobs vs business prospects
- **Priority Analysis**: High-value opportunities identification
- **Success Tracking**: Application/outreach outcomes
- **AI Performance**: Analysis accuracy and user feedback

## 🔒 Security & Privacy

- **Data Encryption**: All captured content is encrypted at rest
- **API Security**: Rate limiting and authentication
- **Privacy Controls**: Users can delete their data anytime
- **Minimal Permissions**: Extension only requests necessary permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@webanalyzer.com
- Documentation: [docs.webanalyzer.com](https://docs.webanalyzer.com)

## 🎉 Acknowledgments

- OpenAI for providing the GPT API
- Vercel for the AI SDK and hosting platform
- Chrome Extensions team for the robust extension framework
