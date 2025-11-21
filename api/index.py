from fastapi import FastAPI, HTTPException
from fastapi.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import io
from datetime import datetime
import os
from pathlib import Path

app = FastAPI(title="Resume Builder API")

# Get the directory containing this file
BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = BASE_DIR / "public"

# CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Experience(BaseModel):
    role: str
    company: str
    from_date: str
    to_date: str
    description: str

class Education(BaseModel):
    degree: str
    institution: str
    year: str

class Project(BaseModel):
    name: str
    detail: str

class ResumeData(BaseModel):
    name: str
    phone: str
    email: str
    website: Optional[str] = ""
    objective: Optional[str] = ""
    skills: List[str] = []
    certifications: List[str] = []
    experience: List[Experience] = []
    education: List[Education] = []
    projects: List[Project] = []
    portfolio_links: List[str] = []

def create_pdf(data: ResumeData) -> bytes:
    """Generate PDF resume using ReportLab"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, 
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=18)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a1a1a'),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    contact_style = ParagraphStyle(
        'Contact',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#555555'),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    heading_style = ParagraphStyle(
        'Heading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1a1a1a'),
        spaceAfter=10,
        spaceBefore=12,
        fontName='Helvetica-Bold',
        borderColor=colors.HexColor('#cccccc'),
        borderWidth=1,
        borderPadding=5,
        borderRadius=2
    )
    
    normal_style = styles['Normal']
    normal_style.fontSize = 10
    normal_style.leading = 14
    
    # Name
    elements.append(Paragraph(data.name, title_style))
    
    # Contact info
    contact_parts = [data.phone, data.email]
    if data.website:
        contact_parts.append(data.website)
    contact_text = " | ".join(contact_parts)
    elements.append(Paragraph(contact_text, contact_style))
    
    # Objective
    if data.objective:
        elements.append(Paragraph("CAREER OBJECTIVE", heading_style))
        elements.append(Paragraph(data.objective, normal_style))
        elements.append(Spacer(1, 0.2*inch))
    
    # Skills
    if data.skills:
        elements.append(Paragraph("SKILLS", heading_style))
        skills_text = " • ".join(data.skills)
        elements.append(Paragraph(skills_text, normal_style))
        elements.append(Spacer(1, 0.2*inch))
    
    # Certifications
    if data.certifications:
        elements.append(Paragraph("CERTIFICATIONS", heading_style))
        for cert in data.certifications:
            elements.append(Paragraph(f"• {cert}", normal_style))
        elements.append(Spacer(1, 0.2*inch))
    
    # Experience
    if data.experience:
        elements.append(Paragraph("WORK EXPERIENCE", heading_style))
        for exp in data.experience:
            exp_title = f"<b>{exp.role}</b> at {exp.company}"
            elements.append(Paragraph(exp_title, normal_style))
            exp_date = f"<i>{exp.from_date} - {exp.to_date}</i>"
            elements.append(Paragraph(exp_date, normal_style))
            if exp.description:
                elements.append(Paragraph(exp.description, normal_style))
            elements.append(Spacer(1, 0.15*inch))
    
    # Education
    if data.education:
        elements.append(Paragraph("EDUCATION", heading_style))
        for edu in data.education:
            edu_text = f"<b>{edu.degree}</b> - {edu.institution} ({edu.year})"
            elements.append(Paragraph(edu_text, normal_style))
            elements.append(Spacer(1, 0.1*inch))
    
    # Projects
    if data.projects:
        elements.append(Paragraph("PROJECTS", heading_style))
        for proj in data.projects:
            proj_title = f"<b>{proj.name}</b>"
            elements.append(Paragraph(proj_title, normal_style))
            if proj.detail:
                elements.append(Paragraph(proj.detail, normal_style))
            elements.append(Spacer(1, 0.1*inch))
    
    # Portfolio Links
    if data.portfolio_links:
        elements.append(Paragraph("PORTFOLIO", heading_style))
        for link in data.portfolio_links:
            elements.append(Paragraph(f"• {link}", normal_style))
    
    # Build PDF
    doc.build(elements)
    
    # Get the value of the BytesIO buffer
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes

@app.get("/api")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Resume Builder API is running"}

@app.post("/api/generate-resume")
async def generate_resume(data: ResumeData):
    """Generate and return PDF resume"""
    try:
        pdf_bytes = create_pdf(data)
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=resume_{data.name.replace(' ', '_')}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@app.get("/api/health")
async def health():
    """Health check"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Mount static files last - this will serve the frontend at root
if PUBLIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(PUBLIC_DIR), html=True), name="static")
