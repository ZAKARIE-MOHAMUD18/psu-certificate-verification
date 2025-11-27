from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os
from datetime import datetime

def generate_certificate_pdf(certificate, student, qr_path):
    """Generate PDF certificate"""
    # Ensure certificates directory exists
    os.makedirs('certificates', exist_ok=True)
    
    pdf_path = os.path.join('certificates', f'certificate_{certificate.uuid}.pdf')
    
    doc = SimpleDocTemplate(pdf_path, pagesize=A4)
    story = []
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.darkblue
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=18,
        spaceAfter=20,
        alignment=TA_CENTER,
        textColor=colors.darkblue
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=12,
        alignment=TA_CENTER
    )
    
    # Header
    story.append(Paragraph("PUNTLAND STATE UNIVERSITY", title_style))
    story.append(Paragraph("CERTIFICATE OF COMPLETION", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Certificate content
    story.append(Paragraph("This is to certify that", body_style))
    story.append(Spacer(1, 5))
    
    name_style = ParagraphStyle(
        'StudentName',
        parent=styles['Normal'],
        fontSize=20,
        spaceAfter=20,
        alignment=TA_CENTER,
        textColor=colors.darkblue,
        fontName='Helvetica-Bold'
    )
    
    story.append(Paragraph(f"{student.first_name} {student.last_name}", name_style))
    story.append(Spacer(1, 20))
    
    # Brief description of completion
    completion_text = f"has successfully completed all required coursework and examinations for the {certificate.degree} program in {certificate.program}, demonstrating proficiency in the field and meeting all academic standards set forth by Puntland State University."
    story.append(Paragraph(completion_text, body_style))
    story.append(Spacer(1, 20))
    
    degree_style = ParagraphStyle(
        'Degree',
        parent=styles['Normal'],
        fontSize=16,
        spaceAfter=10,
        alignment=TA_CENTER,
        textColor=colors.darkblue,
        fontName='Helvetica-Bold'
    )
    
    story.append(Paragraph(f"{certificate.degree}", degree_style))
    story.append(Paragraph(f"in {certificate.program}", body_style))
    story.append(Spacer(1, 40))
    
    # Signature section
    signature_style = ParagraphStyle(
        'Signature',
        parent=styles['Normal'],
        fontSize=10,
        alignment=TA_CENTER,
        spaceAfter=5
    )
    
    # Create signature table
    signature_data = [[
        'Dr. Ahmed Hassan\nRegistrar',
        'Prof. Fatima Ali\nDean of Academic Affairs',
        'Dr. Mohamed Omar\nUniversity President'
    ]]
    
    signature_table = Table(signature_data, colWidths=[2*inch, 2*inch, 2*inch])
    signature_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 20),
        ('LINEABOVE', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    story.append(signature_table)
    story.append(Spacer(1, 20))
    
    # Date and signature section
    date_str = certificate.issue_date.strftime("%B %d, %Y")
    story.append(Paragraph(f"Issued on: {date_str}", body_style))
    story.append(Spacer(1, 20))
    
    # QR Code
    if os.path.exists(qr_path):
        story.append(Paragraph("Scan QR code to verify:", body_style))
        story.append(Spacer(1, 10))
        qr_img = Image(qr_path, width=1.5*inch, height=1.5*inch)
        qr_img.hAlign = 'CENTER'
        story.append(qr_img)
        story.append(Spacer(1, 10))
    
    story.append(Paragraph(f"Certificate ID: {certificate.uuid}", body_style))
    
    doc.build(story)
    return pdf_path