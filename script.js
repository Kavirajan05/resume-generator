// Dynamic form field management
function addExperience() {
    const container = document.getElementById('experienceContainer');
    const itemCount = container.children.length;
    
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.innerHTML = `
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">✕ Remove</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Role</label>
                <input type="text" name="exp_role[]" placeholder="Software Engineer">
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" name="exp_company[]" placeholder="Company Name">
            </div>
            <div class="form-group">
                <label>From</label>
                <input type="text" name="exp_from[]" placeholder="Jan 2020">
            </div>
            <div class="form-group">
                <label>To</label>
                <input type="text" name="exp_to[]" placeholder="Present">
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="exp_description[]" rows="2" placeholder="Key responsibilities and achievements..."></textarea>
        </div>
    `;
    container.appendChild(newItem);
}

function addEducation() {
    const container = document.getElementById('educationContainer');
    
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.innerHTML = `
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">✕ Remove</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Degree</label>
                <input type="text" name="edu_degree[]" placeholder="Bachelor of Science">
            </div>
            <div class="form-group">
                <label>Institution</label>
                <input type="text" name="edu_institution[]" placeholder="University Name">
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" name="edu_year[]" placeholder="2020">
            </div>
        </div>
    `;
    container.appendChild(newItem);
}

function addProject() {
    const container = document.getElementById('projectsContainer');
    
    const newItem = document.createElement('div');
    newItem.className = 'project-item';
    newItem.innerHTML = `
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">✕ Remove</button>
        <div class="form-group">
            <label>Project Name</label>
            <input type="text" name="proj_name[]" placeholder="E-commerce Platform">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="proj_detail[]" rows="2" placeholder="Project details and technologies used..."></textarea>
        </div>
    `;
    container.appendChild(newItem);
}

// Form submission and PDF generation
document.getElementById('resumeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Show loader
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    
    try {
        // Collect form data
        const formData = new FormData(e.target);
        
        // Get skills from checkboxes
        const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
            .map(cb => cb.value);
        
        // Add other skills if provided
        const otherSkills = formData.get('otherSkills');
        if (otherSkills) {
            const extras = otherSkills.split(',').map(s => s.trim()).filter(s => s);
            skills.push(...extras);
        }
        
        // Get certifications
        const certifications = formData.get('certifications')
            ? formData.get('certifications').split(',').map(s => s.trim()).filter(s => s)
            : [];
        
        // Collect experience entries
        const experience = [];
        const expRoles = formData.getAll('exp_role[]');
        const expCompanies = formData.getAll('exp_company[]');
        const expFroms = formData.getAll('exp_from[]');
        const expTos = formData.getAll('exp_to[]');
        const expDescriptions = formData.getAll('exp_description[]');
        
        for (let i = 0; i < expRoles.length; i++) {
            if (expRoles[i] || expCompanies[i]) {
                experience.push({
                    role: expRoles[i],
                    company: expCompanies[i],
                    from_date: expFroms[i],
                    to_date: expTos[i],
                    description: expDescriptions[i]
                });
            }
        }
        
        // Collect education entries
        const education = [];
        const eduDegrees = formData.getAll('edu_degree[]');
        const eduInstitutions = formData.getAll('edu_institution[]');
        const eduYears = formData.getAll('edu_year[]');
        
        for (let i = 0; i < eduDegrees.length; i++) {
            if (eduDegrees[i] || eduInstitutions[i]) {
                education.push({
                    degree: eduDegrees[i],
                    institution: eduInstitutions[i],
                    year: eduYears[i]
                });
            }
        }
        
        // Collect project entries
        const projects = [];
        const projNames = formData.getAll('proj_name[]');
        const projDetails = formData.getAll('proj_detail[]');
        
        for (let i = 0; i < projNames.length; i++) {
            if (projNames[i]) {
                projects.push({
                    name: projNames[i],
                    detail: projDetails[i]
                });
            }
        }
        
        // Get portfolio links
        const portfolioLinks = formData.get('portfolioLinks')
            ? formData.get('portfolioLinks').split('\n').map(s => s.trim()).filter(s => s)
            : [];
        
        // Build resume data object
        const resumeData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            website: formData.get('website') || '',
            objective: formData.get('objective') || '',
            skills: skills,
            certifications: certifications,
            experience: experience,
            education: education,
            projects: projects,
            portfolio_links: portfolioLinks
        };
        
        // Send to API
        const response = await fetch('/api/generate-resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resumeData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to generate resume');
        }
        
        // Download PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume_${resumeData.name.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.style.display = 'block';
    } finally {
        // Hide loader
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});
