# 📝 Resume Builder - Professional Resume Generator

A modern, serverless resume builder web application that generates professional PDF resumes. Built with **FastAPI** backend and vanilla **HTML/CSS/JavaScript** frontend, fully deployable on **Vercel**.

![Resume Builder](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🌟 Features

✅ **Modern Web Interface** - Clean, responsive design with gradient styling  
✅ **Dynamic Forms** - Add unlimited experiences, education entries, and projects  
✅ **Skills Selection** - Pre-defined skills + custom skills input  
✅ **Instant PDF Generation** - Real-time PDF creation using ReportLab  
✅ **Serverless Ready** - Optimized for Vercel deployment  
✅ **No External Dependencies** - Pure Python PDF generation (no wkhtmltopdf needed)  
✅ **Mobile Responsive** - Works seamlessly on all devices  
✅ **Zero Configuration** - Deploy with one click  

---

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kavirajan05/resume-generator.git
   cd resume-generator
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the development server**
   ```bash
   uvicorn api.index:app --reload
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:8000`

---

## 📁 Project Structure

```
resume-generator/
├── api/
│   └── index.py          # FastAPI backend with PDF generation logic
├── public/
│   ├── index.html        # Main web interface
│   ├── styles.css        # Modern gradient styling
│   └── script.js         # Frontend logic and form handling
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel deployment configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

---

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"New Project"**
4. Import your `resume-generator` repository
5. Vercel automatically detects the configuration
6. Click **"Deploy"**
7. Done! Your app is live 🎉

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from the resume-generator directory
cd resume-generator
vercel

# Follow the prompts
```

### Option 3: Deploy Button

Click the button below to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kavirajan05/resume-generator)

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | FastAPI (Python) |
| **PDF Generation** | ReportLab |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Deployment** | Vercel (Serverless Functions) |
| **Database** | None (Stateless) |

---

## 📋 How to Use

1. **Fill in Personal Information**
   - Name, Phone, Email, Website

2. **Add Career Objective**
   - Brief professional summary

3. **Select Skills**
   - Choose from predefined skills or add custom ones

4. **Add Work Experience**
   - Click "+ Add Experience" for multiple entries
   - Include role, company, dates, and description

5. **Add Education**
   - Degree, institution, and graduation year

6. **Add Projects**
   - Project name and description

7. **Add Portfolio Links**
   - GitHub, LinkedIn, personal website, etc.

8. **Generate Resume**
   - Click "Generate Resume PDF"
   - PDF downloads automatically

---

## 🎨 Customization

### Modify PDF Styling

Edit `api/index.py` to customize:
- Colors and fonts
- Section layouts
- Spacing and margins

### Change Web Interface

Edit `public/styles.css` to customize:
- Color schemes
- Button styles
- Responsive breakpoints

---

## 📦 Dependencies

```txt
fastapi==0.121.3
pydantic==2.11.9
reportlab==4.2.5
```

---

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Issue: Module not found errors

**Solution:** Install dependencies
```bash
pip install -r requirements.txt
```

### Issue: Port already in use

**Solution:** Change the port or kill the existing process
```bash
# Use different port
uvicorn api.index:app --reload --port 8001

# Or kill existing process (Windows)
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

### Issue: PDF not downloading

**Solution:** Check browser console for errors and ensure API is running

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - feel free to use it for personal or commercial purposes.

---

## 🎯 Future Enhancements

- [ ] Multiple resume templates
- [ ] Live preview before download
- [ ] Save/load resume data (local storage)
- [ ] Export to DOCX format
- [ ] ATS-friendly formatting options
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Resume scoring and tips

---

## 📞 Contact

**Kavirajan**  
GitHub: [@Kavirajan05](https://github.com/Kavirajan05)

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

**Made with ❤️ for job seekers everywhere!**

Happy Resume Building! 🎉
