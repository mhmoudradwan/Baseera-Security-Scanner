# 🔒 Baseera Security Scanner - بصيرة ماسح الأمان

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Complete web vulnerability scanner with Chrome Extension, .NET 8 Backend, React Frontend, and SQL Server database.

ماسح ثغرات ويب متكامل مع امتداد Chrome، خلفية .NET 8، واجهة React، وقاعدة بيانات SQL Server.

## ✨ Features - الميزات

### 🛡️ Security Scanning
- **20+ Vulnerability Types** - أكثر من 20 نوع ثغرة
- **Passive Scanning** - فحص سلبي (لا يؤثر على الموقع)
- **Real-time Results** - نتائج فورية
- **Detailed Reports** - تقارير مفصلة مع توصيات

### 🔍 Vulnerability Categories
**Critical (5):** XSS, SQL Injection, Command Injection, API Keys, Insecure Forms
**High (3):** Missing CSP, Weak CSP, Sensitive Files
**Medium (9):** Mixed Content, Missing HSTS, Clickjacking, Insecure Cookies, Missing SRI, CORS, Debug Pages, Open Redirect, CSRF
**Low (2):** Deprecated HTML, Trackers

### 💻 Tech Stack
- **Backend:** .NET 8, Entity Framework Core, SQL Server, JWT Authentication, Hangfire
- **Frontend:** React, Tailwind CSS, React Router, Axios, Chart.js
- **Extension:** Chrome Manifest V3, Passive Scanners
- **Database:** SQL Server with EF Core Migrations

## 📁 Project Structure

```
Baseera-Security-Scanner/
├── backend/                    # .NET 8 Web API
│   └── BaseeraSecurity.API/
│       ├── Controllers/        # API Controllers (Auth, Scans, Vulnerabilities)
│       ├── Entities/           # Database Entities
│       ├── DTOs/               # Data Transfer Objects
│       ├── Repositories/       # Repository Pattern Implementation
│       ├── Services/           # Business Logic (Auth, JWT)
│       ├── Middleware/         # Rate Limiting Middleware
│       ├── BackgroundJobs/     # Hangfire Cleanup Jobs
│       └── Data/               # DbContext & Migrations
├── frontend/                   # React Application
│   └── src/
│       ├── pages/              # Landing, Login, Register, Dashboard, About, Contact
│       ├── components/         # Reusable Components
│       ├── context/            # Auth Context
│       └── api/                # Axios Configuration
└── extension/                  # Chrome Extension
    ├── manifest.json           # Extension Manifest V3
    ├── popup/                  # Extension Popup UI
    ├── background/             # Service Worker
    ├── content/                # Content Script
    └── scanners/               # 20 Vulnerability Scanners
```

## 🚀 Getting Started - البدء

### Prerequisites - المتطلبات

- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download)
- **Node.js (v18+)** - [Download](https://nodejs.org/)
- **SQL Server** or **SQL Server LocalDB**
- **Chrome Browser** for extension

### 1. Backend Setup - إعداد الخلفية

```bash
# Navigate to backend - الانتقال للخلفية
cd backend/BaseeraSecurity.API

# Restore packages - استعادة الحزم
dotnet restore

# Update connection string in appsettings.json - تحديث سلسلة الاتصال
# Edit: "ConnectionStrings:DefaultConnection"

# Apply migrations - تطبيق الترحيلات
dotnet ef database update

# Run the API - تشغيل API
dotnet run
```

The API will be available at `https://localhost:5001` and `http://localhost:5000`

### 2. Frontend Setup - إعداد الواجهة

```bash
# Navigate to frontend - الانتقال للواجهة
cd frontend

# Install dependencies - تثبيت التبعيات
npm install

# Create .env file - إنشاء ملف .env
cp .env.example .env
# Edit VITE_API_URL if needed

# Run development server - تشغيل خادم التطوير
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Chrome Extension Setup - إعداد امتداد Chrome

```bash
# The extension is ready to load in Chrome
# يمكن تحميل الامتداد في Chrome مباشرة

1. Open Chrome and go to chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the /extension folder
5. The extension icon will appear in the toolbar
```

**Note:** Icon files need to be created. Use the placeholders in `/extension/icons/` as reference.

## 🔧 Configuration - التكوين

### Backend Configuration

Edit `backend/BaseeraSecurity.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your SQL Server connection string"
  },
  "Jwt": {
    "Key": "your-secret-key-minimum-32-characters",
    "Issuer": "BaseeraSecurity",
    "Audience": "BaseeraSecurityClients"
  }
}
```

### Rate Limiting

- **Guest Users:** 10 scans per hour
- **Registered Users:** 100 scans per day

### Background Jobs

Hangfire jobs run automatically:
- **Cleanup Expired Scans:** Daily
- **Cleanup Expired Rate Limits:** Hourly

Access Hangfire Dashboard at: `http://localhost:5000/hangfire`

## 📖 API Documentation

Once the backend is running, access Swagger documentation at:
- `https://localhost:5001/swagger`
- `http://localhost:5000/swagger`

### Main Endpoints:

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/link-guest-scans` - Link guest scans to account

**Scans:**
- `POST /api/scans/guest` - Create guest scan (10/hour limit)
- `POST /api/scans` - Create authenticated scan (100/day limit)
- `GET /api/scans` - Get all user scans
- `GET /api/scans/{id}` - Get scan by ID
- `DELETE /api/scans/{id}` - Delete scan
- `GET /api/scans/statistics` - Get scan statistics
- `GET /api/scans/{id}/export` - Export scan results

**Vulnerabilities:**
- `GET /api/vulnerabilities/types` - Get all vulnerability types
- `GET /api/vulnerabilities/types/{id}` - Get vulnerability type by ID

## 🎨 UI Design - تصميم الواجهة

### Color Scheme
- **Background:** `#1a1a2e` (Dark blue-black)
- **Secondary Background:** `#16213e`
- **Accent/Primary:** `#00d9ff` (Cyan)
- **Text:** `#ffffff` (White)

### Pages
1. **Landing Page** - Hero section, features, statistics
2. **About Page** - Mission, vision, services
3. **Contact Page** - Contact form with info cards
4. **Register Page** - Complete profile setup
5. **Login Page** - Email/password authentication
6. **Dashboard** - Scan statistics and history

## 🔌 Chrome Extension Usage

1. **Click Extension Icon** - Opens popup
2. **Click "Start Scan"** - Scans current page
3. **View Results** - See vulnerability counts
4. **View Dashboard** - Opens web dashboard with full details
5. **Settings** - Configure auto-scan and notifications

## 🧪 Testing

```bash
# Backend tests
cd backend/BaseeraSecurity.API
dotnet test

# Frontend tests
cd frontend
npm test
```

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Developer** - Full Stack Implementation

## 🙏 Acknowledgments

- OWASP for security guidelines
- Chrome Extension documentation
- .NET and React communities

## 📞 Support - الدعم

For support, email support@baseera-scanner.com or open an issue on GitHub.

---

Made with ❤️ for web security - صُنع بحب من أجل أمان الويب