// Global data object
const cvData = {
    personalInfo: {
        name: "",
        phone: "",
        email: "",
        location: "",
        websites: ["", ""],
    },
    professionalProfile: "",
    experience: [],
    education: [],
    achievements: [],
    languages: [],
    references: [],
    certifications: [],
    skills: [],
    coreStrengths: [],
}

// Counters for dynamic sections
const counters = {
    experience: 0,
    education: 0,
    achievements: 0,
    languages: 0,
    references: 0,
    certifications: 0,
    skills: 0,
    coreStrengths: 0,
}

// Constants
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString())

const languageLevels = [
    "Native or Proficient (C2)",
    "Advanced (C1)",
    "Upper Intermediate (B2)",
    "Intermediate (B1)",
    "Elementary (A2)",
    "Beginner (A1)",
]

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners()
    updatePreview()
})

function setupEventListeners() {
    // Personal information listeners
    document.getElementById("name").addEventListener("input", updatePreview)
    document.getElementById("phone").addEventListener("input", updatePreview)
    document.getElementById("email").addEventListener("input", updatePreview)
    document.getElementById("location").addEventListener("input", updatePreview)
    document.getElementById("website1").addEventListener("input", updatePreview)
    document.getElementById("website2").addEventListener("input", updatePreview)
    document.getElementById("professionalProfile").addEventListener("input", updatePreview)

    // Download button
    document.getElementById("download-btn").addEventListener("click", downloadPDF)
}

// Utility functions
function createSelect(options, selectedValue = "", onChange = null) {
    const select = document.createElement("select")
    select.className = "form-control"

    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Select..."
    select.appendChild(defaultOption)

    options.forEach((option) => {
        const optionElement = document.createElement("option")
        optionElement.value = option
        optionElement.textContent = option
        if (option === selectedValue) {
        optionElement.selected = true
        }
        select.appendChild(optionElement)
    })

    if (onChange) {
        select.addEventListener("change", onChange)
    }

    return select
}

function formatDate(startDate, endDate, isCurrent = false, isEnrolled = false) {
    const start = startDate.month && startDate.year ? `${startDate.month} ${startDate.year}` : ""
    const end =
        isCurrent || isEnrolled ? "Present" : endDate.month && endDate.year ? `${endDate.month} ${endDate.year}` : ""
    return start && end ? `${start} - ${end}` : start || end
}

function getLanguageLevel(level) {
    const levels = {
        "Native or Proficient (C2)": 100,
        "Advanced (C1)": 85,
        "Upper Intermediate (B2)": 70,
        "Intermediate (B1)": 55,
        "Elementary (A2)": 40,
        "Beginner (A1)": 25,
    }
    return levels[level] || 0
}

function getSkillLevel(level) {
    const levels = {
        Expert: 100,
        Advanced: 75,
        Intermediate: 50,
        Beginner: 25,
    }
    return levels[level] || 0
}

// Experience functions
function addExperience() {
    if (cvData.experience.length >= 3) return

    const id = counters.experience++
    const experience = {
        id,
        jobTitle: "",
        companyName: "",
        jobDescription: "",
        country: "",
        startDate: { month: "", year: "" },
        endDate: { month: "", year: "" },
        isCurrent: false,
    }

    cvData.experience.push(experience)
    renderExperience()
    updatePreview()
}

function renderExperience() {
    const container = document.getElementById("experience-container")
    container.innerHTML = ""

    cvData.experience.forEach((exp, index) => {
        const div = document.createElement("div")
        div.className = "dynamic-item"
        div.innerHTML = `
                <h4>Experience ${index + 1} <button type="button" class="remove-btn" onclick="removeExperience(${index})">Remove</button></h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" value="${exp.jobTitle}" onchange="updateExperience(${index}, 'jobTitle', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" value="${exp.companyName}" onchange="updateExperience(${index}, 'companyName', this.value)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Job Description</label>
                    <textarea rows="3" onchange="updateExperience(${index}, 'jobDescription', this.value)">${exp.jobDescription}</textarea>
                </div>
                <div class="form-group">
                    <label>Country</label>
                    <input type="text" value="${exp.country}" onchange="updateExperience(${index}, 'country', this.value)">
                </div>
                <div class="date-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <div class="date-inputs">
                            <select onchange="updateExperienceDate(${index}, 'startDate', 'month', this.value)">
                                <option value="">Month</option>
                                ${months.map((month) => `<option value="${month}" ${exp.startDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                            </select>
                            <select onchange="updateExperienceDate(${index}, 'startDate', 'year', this.value)">
                                <option value="">Year</option>
                                ${years.map((year) => `<option value="${year}" ${exp.startDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <div class="date-inputs">
                            <select onchange="updateExperienceDate(${index}, 'endDate', 'month', this.value)" ${exp.isCurrent ? "disabled" : ""}>
                                <option value="">Month</option>
                                ${months.map((month) => `<option value="${month}" ${exp.endDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                            </select>
                            <select onchange="updateExperienceDate(${index}, 'endDate', 'year', this.value)" ${exp.isCurrent ? "disabled" : ""}>
                                <option value="">Year</option>
                                ${years.map((year) => `<option value="${year}" ${exp.endDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                            </select>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="current-${index}" ${exp.isCurrent ? "checked" : ""} onchange="updateExperience(${index}, 'isCurrent', this.checked)">
                            <label for="current-${index}">Current job</label>
                        </div>
                    </div>
                </div>
            `
        container.appendChild(div)
    })
}

function updateExperience(index, field, value) {
    cvData.experience[index][field] = value
    if (field === "isCurrent" && value) {
        cvData.experience[index].endDate = { month: "", year: "" }
        renderExperience()
    }
    updatePreview()
}

function updateExperienceDate(index, dateType, field, value) {
    cvData.experience[index][dateType][field] = value
    updatePreview()
}

function removeExperience(index) {
    cvData.experience.splice(index, 1)
    renderExperience()
    updatePreview()
}

// Education functions
function addEducation() {
    if (cvData.education.length >= 4) return

    const id = counters.education++
    const education = {
        id,
        title: "",
        institutionName: "",
        country: "",
        startDate: { month: "", year: "" },
        endDate: { month: "", year: "" },
        isCurrentlyEnrolled: false,
    }

    cvData.education.push(education)
    renderEducation()
    updatePreview()
}

function renderEducation() {
    const container = document.getElementById("education-container")
    container.innerHTML = ""

    cvData.education.forEach((edu, index) => {
        const div = document.createElement("div")
        div.className = "dynamic-item"
        div.innerHTML = `
                <h4>Education ${index + 1} <button type="button" class="remove-btn" onclick="removeEducation(${index})">Remove</button></h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Degree Title</label>
                        <input type="text" value="${edu.title}" onchange="updateEducation(${index}, 'title', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Institution Name</label>
                        <input type="text" value="${edu.institutionName}" onchange="updateEducation(${index}, 'institutionName', this.value)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Country</label>
                    <input type="text" value="${edu.country}" onchange="updateEducation(${index}, 'country', this.value)">
                </div>
                <div class="date-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <div class="date-inputs">
                            <select onchange="updateEducationDate(${index}, 'startDate', 'month', this.value)">
                                <option value="">Month</option>
                                ${months.map((month) => `<option value="${month}" ${edu.startDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                            </select>
                            <select onchange="updateEducationDate(${index}, 'startDate', 'year', this.value)">
                                <option value="">Year</option>
                                ${years.map((year) => `<option value="${year}" ${edu.startDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <div class="date-inputs">
                            <select onchange="updateEducationDate(${index}, 'endDate', 'month', this.value)" ${edu.isCurrentlyEnrolled ? "disabled" : ""}>
                                <option value="">Month</option>
                                ${months.map((month) => `<option value="${month}" ${edu.endDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                            </select>
                            <select onchange="updateEducationDate(${index}, 'endDate', 'year', this.value)" ${edu.isCurrentlyEnrolled ? "disabled" : ""}>
                                <option value="">Year</option>
                                ${years.map((year) => `<option value="${year}" ${edu.endDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                            </select>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="enrolled-${index}" ${edu.isCurrentlyEnrolled ? "checked" : ""} onchange="updateEducation(${index}, 'isCurrentlyEnrolled', this.checked)">
                            <label for="enrolled-${index}">Currently enrolled</label>
                        </div>
                    </div>
                </div>
            `
        container.appendChild(div)
    })
}

function updateEducation(index, field, value) {
    cvData.education[index][field] = value
    if (field === "isCurrentlyEnrolled" && value) {
        cvData.education[index].endDate = { month: "", year: "" }
        renderEducation()
    }
    updatePreview()
}

function updateEducationDate(index, dateType, field, value) {
    cvData.education[index][dateType][field] = value
    updatePreview()
}

function removeEducation(index) {
    cvData.education.splice(index, 1)
    renderEducation()
    updatePreview()
}

// Achievement functions
function addAchievement() {
    if (cvData.achievements.length >= 3) return

    const achievement = {
        title: "",
        description: "",
    }

    cvData.achievements.push(achievement)
    renderAchievements()
    updatePreview()
}

function renderAchievements() {
    const container = document.getElementById("achievements-container")
    container.innerHTML = ""

    cvData.achievements.forEach((ach, index) => {
        const div = document.createElement("div")
        div.className = "dynamic-item"
        div.innerHTML = `
                <h4>Achievement ${index + 1} <button type="button" class="remove-btn" onclick="removeAchievement(${index})">Remove</button></h4>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" value="${ach.title}" onchange="updateAchievement(${index}, 'title', this.value)">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea rows="3" onchange="updateAchievement(${index}, 'description', this.value)">${ach.description}</textarea>
                </div>
            `
        container.appendChild(div)
    })
}

function updateAchievement(index, field, value) {
    cvData.achievements[index][field] = value
    updatePreview()
}

function removeAchievement(index) {
    cvData.achievements.splice(index, 1)
    renderAchievements()
    updatePreview()
}

// Language functions
function addLanguage() {
    const language = {
        language: "",
        level: "",
    }

    cvData.languages.push(language)
    renderLanguages()
    updatePreview()
}

function renderLanguages() {
    const container = document.getElementById("languages-container")
    container.innerHTML = ""

    cvData.languages.forEach((lang, index) => {
        const div = document.createElement("div")
        div.className = "dynamic-item"
        div.innerHTML = `
                <h4>Language ${index + 1} <button type="button" class="remove-btn" onclick="removeLanguage(${index})">Remove</button></h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Language</label>
                        <input type="text" value="${lang.language}" onchange="updateLanguage(${index}, 'language', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Level</label>
                        <select onchange="updateLanguage(${index}, 'level', this.value)">
                            <option value="">Select level</option>
                            ${languageLevels.map((level) => `<option value="${level}" ${lang.level === level ? "selected" : ""}>${level}</option>`).join("")}
                        </select>
                    </div>
                </div>
            `
        container.appendChild(div)
    })
}

function updateLanguage(index, field, value) {
    cvData.languages[index][field] = value
    updatePreview()
}

function removeLanguage(index) {
    cvData.languages.splice(index, 1)
    renderLanguages()
    updatePreview()
}

// Reference functions
function addReference() {
    if (cvData.references.length >= 3) return

    const reference = {
        contactName: "",
        companyName: "",
        jobTitle: "",
        phoneNumber: "",
        email: "",
    }

    cvData.references.push(reference)
    renderReferences()
    updatePreview()
}

function renderReferences() {
    const container = document.getElementById("references-container")
    container.innerHTML = ""

    cvData.references.forEach((ref, index) => {
        const div = document.createElement("div")
        div.className = "dynamic-item"
        div.innerHTML = `
                <h4>Reference ${index + 1} <button type="button" class="remove-btn" onclick="removeReference(${index})">Remove</button></h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contact Name</label>
                        <input type="text" value="${ref.contactName}" onchange="updateReference(${index}, 'contactName', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" value="${ref.companyName}" onchange="updateReference(${index}, 'companyName', this.value)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" value="${ref.jobTitle}" onchange="updateReference(${index}, 'jobTitle', this.value)">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="text" value="${ref.phoneNumber}" onchange="updateReference(${index}, 'phoneNumber', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="${ref.email}" onchange="updateReference(${index}, 'email', this.value)">
                    </div>
                </div>
            `
        container.appendChild(div)
    })
}

function updateReference(index, field, value) {
    cvData.references[index][field] = value
    updatePreview()
}

function removeReference(index) {
    cvData.references.splice(index, 1)
    renderReferences()
    updatePreview()
}

// Certification functions
function addCertification() {
    const certification = {
        title: "",
        institutionName: "",
        startDate: { month: "", year: "" },
        endDate: { month: "", year: "" },
    }

    cvData.certifications.push(certification)
    renderCertifications()
    updatePreview()
}

function renderCertifications() {
    const container = document.getElementById("certifications-container")
    container.innerHTML = ""

    cvData.certifications.forEach((cert, index) => {
        const div = document.createElement("div")
        div.className = "dynamic-item"
        div.innerHTML = `
                <h4>Certification ${index + 1} <button type="button" class="remove-btn" onclick="removeCertification(${index})">Remove</button></h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" value="${cert.title}" onchange="updateCertification(${index}, 'title', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Institution Name</label>
                        <input type="text" value="${cert.institutionName}" onchange="updateCertification(${index}, 'institutionName', this.value)">
                    </div>
                </div>
                <div class="date-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <div class="date-inputs">
                            <select onchange="updateCertificationDate(${index}, 'startDate', 'month', this.value)">
                                <option value="">Month</option>
                                ${months.map((month) => `<option value="${month}" ${cert.startDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                            </select>
                            <select onchange="updateCertificationDate(${index}, 'startDate', 'year', this.value)">
                                <option value="">Year</option>
                                ${years.map((year) => `<option value="${year}" ${cert.startDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <div class="date-inputs">
                            <select onchange="updateCertificationDate(${index}, 'endDate', 'month', this.value)">
                                <option value="">Month</option>
                                ${months.map((month) => `<option value="${month}" ${cert.endDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                            </select>
                            <select onchange="updateCertificationDate(${index}, 'endDate', 'year', this.value)">
                                <option value="">Year</option>
                                ${years.map((year) => `<option value="${year}" ${cert.endDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                            </select>
                        </div>
                    </div>
                </div>
            `
        container.appendChild(div)
    })
}

function updateCertification(index, field, value) {
    cvData.certifications[index][field] = value
    updatePreview()
}

function updateCertificationDate(index, dateType, field, value) {
    cvData.certifications[index][dateType][field] = value
    updatePreview()
}

function removeCertification(index) {
    cvData.certifications.splice(index, 1)
    renderCertifications()
    updatePreview()
}

// Skill functions
function addSkill() {
    const skill = {
        skillName: "",
        level: "",
    }

    cvData.skills.push(skill)
    renderSkills()
    updatePreview()
}

function renderSkills() {
    const container = document.getElementById("skills-container")
    container.innerHTML = ""

    cvData.skills.forEach((skill, index) => {
        const div = document.createElement("div")
        div.className = "dynamic-item"
        div.innerHTML = `
                <h4>Skill ${index + 1} <button type="button" class="remove-btn" onclick="removeSkill(${index})">Remove</button></h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Skill Name</label>
                        <input type="text" value="${skill.skillName}" onchange="updateSkill(${index}, 'skillName', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Level</label>
                        <select onchange="updateSkill(${index}, 'level', this.value)">
                            <option value="">Select level</option>
                            ${skillLevels.map((level) => `<option value="${level}" ${skill.level === level ? "selected" : ""}>${level}</option>`).join("")}
                        </select>
                    </div>
                </div>
            `
        container.appendChild(div)
    })
}

function updateSkill(index, field, value) {
    cvData.skills[index][field] = value
    updatePreview()
}

function removeSkill(index) {
    cvData.skills.splice(index, 1)
    renderSkills()
    updatePreview()
}

// Core Strength functions
function addCoreStrength() {
    if (cvData.coreStrengths.length >= 10) return

    const strength = {
        coreName: "",
    }

    cvData.coreStrengths.push(strength)
    renderCoreStrengths()
    updatePreview()
}

function renderCoreStrengths() {
    const container = document.getElementById("core-strengths-container")
    container.innerHTML = ""

    cvData.coreStrengths.forEach((strength, index) => {
        const div = document.createElement("div")
        div.className = "dynamic-item"
        div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="text" value="${strength.coreName}" onchange="updateCoreStrength(${index}, this.value)" placeholder="Core strength ${index + 1}" style="flex: 1;">
                    <button type="button" class="remove-btn" onclick="removeCoreStrength(${index})">Remove</button>
                </div>
            `
        container.appendChild(div)
    })
}

function updateCoreStrength(index, value) {
    cvData.coreStrengths[index].coreName = value
    updatePreview()
}

function removeCoreStrength(index) {
    cvData.coreStrengths.splice(index, 1)
    renderCoreStrengths()
    updatePreview()
}

// Preview update function
function updatePreview() {
    // Update personal info
    cvData.personalInfo.name = document.getElementById("name").value
    cvData.personalInfo.phone = document.getElementById("phone").value
    cvData.personalInfo.email = document.getElementById("email").value
    cvData.personalInfo.location = document.getElementById("location").value
    cvData.personalInfo.websites[0] = document.getElementById("website1").value
    cvData.personalInfo.websites[1] = document.getElementById("website2").value
    cvData.professionalProfile = document.getElementById("professionalProfile").value

    // Update preview elements
    document.getElementById("preview-name").textContent = cvData.personalInfo.name || "Your Name"
    document.getElementById("preview-phone").textContent = cvData.personalInfo.phone
    document.getElementById("preview-email").textContent = cvData.personalInfo.email
    document.getElementById("preview-location").textContent = cvData.personalInfo.location

    // Update professional profile
    updateSection("preview-professional-profile", "Professional Profile", cvData.professionalProfile)

    // Update websites
    const websites = cvData.personalInfo.websites.filter((w) => w.trim())
    if (websites.length > 0) {
        const websitesHtml = websites
        .map((website) => `<p style="font-size: 12px; color: #3b82f6; word-break: break-all;">${website}</p>`)
        .join("")
        updateSection("preview-websites", "Websites", websitesHtml)
    } else {
        hideSection("preview-websites")
    }

    // Update core strengths
    if (cvData.coreStrengths.length > 0 && cvData.coreStrengths.some((s) => s.coreName.trim())) {
        const tagsHtml = cvData.coreStrengths
        .filter((s) => s.coreName.trim())
        .map((strength) => `<span class="tag">${strength.coreName}</span>`)
        .join("")
        updateSection("preview-core-strengths", "Core Strengths", `<div class="tags">${tagsHtml}</div>`)
    } else {
        hideSection("preview-core-strengths")
    }

    // Update skills
    if (cvData.skills.length > 0 && cvData.skills.some((s) => s.skillName.trim())) {
        const skillsHtml = cvData.skills
        .filter((s) => s.skillName.trim())
        .map(
            (skill) => `
                    <div class="skill-item">
                        <div class="skill-header">
                            <span class="skill-name">${skill.skillName}</span>
                            <span class="skill-level">${skill.level}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${getSkillLevel(skill.level)}%"></div>
                        </div>
                    </div>
                `,
        )
        .join("")
        updateSection("preview-skills", "Skills", skillsHtml)
    } else {
        hideSection("preview-skills")
    }

    // Update languages
    if (cvData.languages.length > 0 && cvData.languages.some((l) => l.language.trim())) {
        const languagesHtml = cvData.languages
        .filter((l) => l.language.trim())
        .map(
            (language) => `
                    <div class="language-item">
                        <div class="language-header">
                            <span class="language-name">${language.language}</span>
                            <span class="language-level">${language.level.split(" ")[0]}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${getLanguageLevel(language.level)}%"></div>
                        </div>
                    </div>
                `,
        )
        .join("")
        updateSection("preview-languages", "Languages", languagesHtml)
    } else {
        hideSection("preview-languages")
    }

    // Update references
    if (cvData.references.length > 0 && cvData.references.some((r) => r.contactName.trim())) {
        const referencesHtml = cvData.references
        .filter((r) => r.contactName.trim())
        .map(
            (reference) => `
                    <div class="reference-item">
                        <div class="reference-name">${reference.contactName}</div>
                        <div class="reference-details">
                            ${reference.jobTitle}<br>
                            ${reference.companyName}<br>
                            ${reference.phoneNumber}<br>
                            <span style="color: #3b82f6;">${reference.email}</span>
                        </div>
                    </div>
                `,
        )
        .join("")
        updateSection("preview-references", "References", referencesHtml)
    } else {
        hideSection("preview-references")
    }

    // Update experience
    if (cvData.experience.length > 0 && cvData.experience.some((e) => e.jobTitle.trim())) {
        const experienceHtml = cvData.experience
        .filter((e) => e.jobTitle.trim())
        .map(
            (exp) => `
                    <div class="item">
                        <div class="item-header">
                            <div class="item-title">${exp.jobTitle}</div>
                            <div class="item-date">${formatDate(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                        </div>
                        <div class="item-subtitle">${exp.companyName}${exp.country ? " • " + exp.country : ""}</div>
                        ${exp.jobDescription ? `<div class="item-description">${exp.jobDescription}</div>` : ""}
                    </div>
                `,
        )
        .join("")
        updateSection("preview-experience", "Experience", experienceHtml)
    } else {
        hideSection("preview-experience")
    }

    // Update education
    if (cvData.education.length > 0 && cvData.education.some((e) => e.title.trim())) {
        const educationHtml = cvData.education
        .filter((e) => e.title.trim())
        .map(
            (edu) => `
                    <div class="item">
                        <div class="item-header">
                            <div class="item-title">${edu.title}</div>
                            <div class="item-date">${formatDate(edu.startDate, edu.endDate, false, edu.isCurrentlyEnrolled)}</div>
                        </div>
                        <div class="item-subtitle">${edu.institutionName}${edu.country ? " • " + edu.country : ""}</div>
                    </div>
                `,
        )
        .join("")
        updateSection("preview-education", "Education", educationHtml)
    } else {
        hideSection("preview-education")
    }

    // Update certifications
    if (cvData.certifications.length > 0 && cvData.certifications.some((c) => c.title.trim())) {
        const certificationsHtml = cvData.certifications
        .filter((c) => c.title.trim())
        .map(
            (cert) => `
                    <div class="item">
                        <div class="item-header">
                            <div class="item-title">${cert.title}</div>
                            <div class="item-date">${formatDate(cert.startDate, cert.endDate)}</div>
                        </div>
                        <div class="item-subtitle">${cert.institutionName}</div>
                    </div>
                `,
        )
        .join("")
        updateSection("preview-certifications", "Courses & Certifications", certificationsHtml)
    } else {
        hideSection("preview-certifications")
    }

    // Update achievements
    if (cvData.achievements.length > 0 && cvData.achievements.some((a) => a.title.trim())) {
        const achievementsHtml = cvData.achievements
        .filter((a) => a.title.trim())
        .map(
            (achievement) => `
                    <div class="item">
                        <div class="item-title" style="margin-bottom: 4px;">${achievement.title}</div>
                        ${achievement.description ? `<div class="item-description">${achievement.description}</div>` : ""}
                    </div>
                `,
        )
        .join("")
        updateSection("preview-achievements", "Achievements", achievementsHtml)
    } else {
        hideSection("preview-achievements")
    }
    }

    function updateSection(elementId, title, content) {
    const element = document.getElementById(elementId)
    if (content && content.trim()) {
        element.innerHTML = `<h3>${title}</h3>${content}`
        element.classList.add("visible")
    } else {
        element.classList.remove("visible")
    }
}

function hideSection(elementId) {
    document.getElementById(elementId).classList.remove("visible")
}

// PDF Download function
function downloadPDF() {
    window.print()
}
