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

// WYSIWYG Editors
const editors = {}

// Constants
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString())

const languageLevels = [
  "Nativo (C2)",
  "Avanzado (C1)",
  "Intermedia superior (B2)",
  "Intermedio (B1)",
  "Elemental (A2)",
  "Principiante (A1)",
]

const skillLevels = ["Principante", "Intermedio", "Avanzado", "Experto"]

// Import Quill library
const Quill = window.Quill

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  initializeWYSIWYG()
  setupResizeHandle()
  setupMobileToggle()
  setupAIAssistant()
  initializeSections()
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

  // Download button
  document.getElementById("download-btn").addEventListener("click", downloadPDF)

  // Make sure all add button functions are globally available
  window.addExperience = addExperience
  window.addEducation = addEducation
  window.addAchievement = addAchievement
  window.addLanguage = addLanguage
  window.addReference = addReference
  window.addCertification = addCertification
  window.addSkill = addSkill
  window.addCoreStrength = addCoreStrength

  // Make sure all remove functions are globally available
  window.removeExperience = removeExperience
  window.removeEducation = removeEducation
  window.removeAchievement = removeAchievement
  window.removeLanguage = removeLanguage
  window.removeReference = removeReference
  window.removeCertification = removeCertification
  window.removeSkill = removeSkill
  window.removeCoreStrength = removeCoreStrength

  // Make sure all update functions are globally available
  window.updateExperience = updateExperience
  window.updateEducation = updateEducation
  window.updateAchievement = updateAchievement
  window.updateLanguage = updateLanguage
  window.updateReference = updateReference
  window.updateCertification = updateCertification
  window.updateSkill = updateSkill
  window.updateCoreStrength = updateCoreStrength
  window.updateExperienceDate = updateExperienceDate
  window.updateEducationDate = updateEducationDate
  window.updateCertificationDate = updateCertificationDate
}

function initializeWYSIWYG() {
  // Professional Profile Editor
  editors.professionalProfile = new Quill("#professionalProfile-editor", {
    theme: "snow",
    modules: {
      toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], [{ align: [] }], ["clean"]],
    },
  })

  editors.professionalProfile.on("text-change", () => {
    const content = editors.professionalProfile.root.innerHTML
    document.getElementById("professionalProfile").value = content
    cvData.professionalProfile = content
    updatePreview()
  })
}

function setupResizeHandle() {
  const resizeHandle = document.getElementById("resize-handle")
  const formSection = document.getElementById("form-section")
  const previewSection = document.getElementById("preview-section")
  let isResizing = false

  resizeHandle.addEventListener("mousedown", (e) => {
    isResizing = true
    document.addEventListener("mousemove", handleResize)
    document.addEventListener("mouseup", stopResize)
    e.preventDefault()
  })

  function handleResize(e) {
    if (!isResizing) return

    const containerWidth = document.querySelector(".container").offsetWidth
    const newFormWidth = (e.clientX / containerWidth) * 100

    if (newFormWidth >= 25 && newFormWidth <= 65) {
      formSection.style.width = `${newFormWidth}%`
    }
  }

  function stopResize() {
    isResizing = false
    document.removeEventListener("mousemove", handleResize)
    document.removeEventListener("mouseup", stopResize)
  }
}

function setupMobileToggle() {
  const toggleBtn = document.getElementById("mobile-toggle-btn")
  const formSection = document.getElementById("form-section")
  const previewSection = document.getElementById("preview-section")
  const toggleText = document.getElementById("toggle-text")
  let showingForm = false

  toggleBtn.addEventListener("click", () => {
    showingForm = !showingForm

    if (showingForm) {
      formSection.classList.add("active")
      previewSection.classList.add("hidden")
      toggleText.textContent = "Preview"
    } else {
      formSection.classList.remove("active")
      previewSection.classList.remove("hidden")
      toggleText.textContent = "Form"
    }
  })
}

function setupAIAssistant() {
  const aiToggleBtn = document.getElementById("ai-toggle-btn")
  const aiPanel = document.getElementById("ai-panel")
  const aiCloseBtn = document.getElementById("ai-close-btn")
  const optimizeBtn = document.getElementById("optimize-cv-btn")

  aiToggleBtn.addEventListener("click", () => {
    aiPanel.classList.toggle("active")
  })

  aiCloseBtn.addEventListener("click", () => {
    aiPanel.classList.remove("active")
  })

  optimizeBtn.addEventListener("click", optimizeCV)

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    if (!aiPanel.contains(e.target) && !aiToggleBtn.contains(e.target)) {
      aiPanel.classList.remove("active")
    }
  })
}

async function optimizeCV() {
  const jobDescription = document.getElementById("job-description").value.trim()
  const optimizeBtn = document.getElementById("optimize-cv-btn")

  if (!jobDescription) {
    alert("Please enter a job description first.")
    return
  }

  optimizeBtn.disabled = true
  optimizeBtn.textContent = "🔄 Optimizing..."

  try {
    // Get current CV data as JSON
    const currentCVData = JSON.stringify(cvData)
    const response = await fetch("/api/optimize-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cvData: currentCVData,
        jobDescription: jobDescription,
      }),
    })

    if (response.ok) {
      const optimizedData = await response.json()
      // Update the CV with optimized data
      updateCVWithOptimizedData(optimizedData)
      alert("CV optimized successfully!")
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to optimize CV from server");
    }
  } catch (error) {
    console.error("Error optimizando CV:", error)
    alert(`Failed to optimize CV. Please try again. Error: ${error.message}`)
  } finally {
    optimizeBtn.disabled = false
    optimizeBtn.textContent = "🚀 Optimize CV"
  }
}

function updateCVWithOptimizedData(optimizedData) {
  // Update the global cvData object with optimized data
  Object.assign(cvData, optimizedData)

  // Update form fields
  document.getElementById("name").value = cvData.personalInfo.name
  document.getElementById("phone").value = cvData.personalInfo.phone
  document.getElementById("email").value = cvData.personalInfo.email
  document.getElementById("location").value = cvData.personalInfo.location
  document.getElementById("website1").value = cvData.personalInfo.websites[0] || ""
  document.getElementById("website2").value = cvData.personalInfo.websites[1] || ""

  // Update WYSIWYG editor
  editors.professionalProfile.root.innerHTML = cvData.professionalProfile

  // Re-render dynamic sections
  renderExperience()
  renderEducation()
  renderAchievements()
  renderLanguages()
  renderReferences()
  renderCertifications()
  renderSkills()
  renderCoreStrengths()

  // Update preview
  updatePreview()
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
    isCurrent || isEnrolled ? "Actualmente" : endDate.month && endDate.year ? `${endDate.month} ${endDate.year}` : ""
  return start && end ? `${start} - ${end}` : start || end
}

function getLanguageLevel(level) {
  const levels = {
    "Nativo (C2)": 100,
    "Advanzado (C1)": 85,
    "Intermedia superior (B2)": 70,
    "Intermedio (B1)": 55,
    "Elemental (A2)": 40,
    "Principiante (A1)": 25,
  }
  return levels[level] || 0
}

function getSkillLevel(level) {
  const levels = {
    Experto: 100,
    Advanzado: 75,
    Intermedio: 50,
    Principiante: 25,
  }
  return levels[level] || 0
}

function createWYSIWYGEditor(containerId, textareaId, onChange) {
  const editor = new Quill(containerId, {
    theme: "snow",
    modules: {
      toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], [{ align: [] }], ["clean"]],
    },
  })

  editor.on("text-change", () => {
    const content = editor.root.innerHTML
    document.getElementById(textareaId).value = content
    if (onChange) onChange(content)
  })

  return editor
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
            <h4>Experiencia ${index + 1} <button type="button" class="remove-btn" onclick="removeExperience(${index})">Remover</button></h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Título de trabajo</label>
                    <input type="text" value="${exp.jobTitle}" maxlength="60" onchange="updateExperience(${index}, 'jobTitle', this.value)">
                </div>
                <div class="form-group">
                    <label>Nombre de la Compañía</label>
                    <input type="text" value="${exp.companyName}" maxlength="30" onchange="updateExperience(${index}, 'companyName', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>Descripción del empleo</label>
                <div id="experience-desc-editor-${index}" class="wysiwyg-editor"></div>
                <textarea id="experience-desc-${index}" style="display: none;">${exp.jobDescription}</textarea>
            </div>
            <div class="form-group">
                <label>País</label>
                <input type="text" value="${exp.country}" maxlength="20" onchange="updateExperience(${index}, 'country', this.value)">
            </div>
            <div class="date-row">
                <div class="form-group">
                    <label>Fecha de inicio</label>
                    <div class="date-inputs">
                        <select onchange="updateExperienceDate(${index}, 'startDate', 'month', this.value)">
                            <option value="">Mes</option>
                            ${months.map((month) => `<option value="${month}" ${exp.startDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                        </select>
                        <select onchange="updateExperienceDate(${index}, 'startDate', 'year', this.value)">
                            <option value="">Año</option>
                            ${years.map((year) => `<option value="${year}" ${exp.startDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Fecha de finalización</label>
                    <div class="date-inputs">
                        <select onchange="updateExperienceDate(${index}, 'endDate', 'month', this.value)" ${exp.isCurrent ? "disabled" : ""}>
                            <option value="">Mes</option>
                            ${months.map((month) => `<option value="${month}" ${exp.endDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                        </select>
                        <select onchange="updateExperienceDate(${index}, 'endDate', 'year', this.value)" ${exp.isCurrent ? "disabled" : ""}>
                            <option value="">Año</option>
                            ${years.map((year) => `<option value="${year}" ${exp.endDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                        </select>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="current-${index}" ${exp.isCurrent ? "checked" : ""} onchange="updateExperience(${index}, 'isCurrent', this.checked)">
                        <label for="current-${index}">Trabajo actualmente aquí</label>
                    </div>
                </div>
            </div>
        `
    container.appendChild(div)

    // Initialize WYSIWYG editor for job description
    setTimeout(() => {
      const editor = createWYSIWYGEditor(`#experience-desc-editor-${index}`, `experience-desc-${index}`, (content) =>
        updateExperience(index, "jobDescription", content),
      )
      editor.root.innerHTML = exp.jobDescription
    }, 100)
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
            <h4>Educación ${index + 1} <button type="button" class="remove-btn" onclick="removeEducation(${index})">Remover</button></h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Nombre del Título</label>
                    <input type="text" value="${edu.title}" maxlength="100" onchange="updateEducation(${index}, 'title', this.value)">
                </div>
                <div class="form-group">
                    <label>Nombre de la Institución</label>
                    <input type="text" value="${edu.institutionName}" maxlength="100" onchange="updateEducation(${index}, 'institutionName', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>País</label>
                <input type="text" value="${edu.country}" maxlength="20" onchange="updateEducation(${index}, 'country', this.value)">
            </div>
            <div class="date-row">
                <div class="form-group">
                    <label>Fecha de Inicio</label>
                    <div class="date-inputs">
                        <select onchange="updateEducationDate(${index}, 'startDate', 'month', this.value)">
                            <option value="">Mes</option>
                            ${months.map((month) => `<option value="${month}" ${edu.startDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                        </select>
                        <select onchange="updateEducationDate(${index}, 'startDate', 'year', this.value)">
                            <option value="">Año</option>
                            ${years.map((year) => `<option value="${year}" ${edu.startDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Fecha de Finalización</label>
                    <div class="date-inputs">
                        <select onchange="updateEducationDate(${index}, 'endDate', 'month', this.value)" ${edu.isCurrentlyEnrolled ? "disabled" : ""}>
                            <option value="">Mes</option>
                            ${months.map((month) => `<option value="${month}" ${edu.endDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                        </select>
                        <select onchange="updateEducationDate(${index}, 'endDate', 'year', this.value)" ${edu.isCurrentlyEnrolled ? "disabled" : ""}>
                            <option value="">Año</option>
                            ${years.map((year) => `<option value="${year}" ${edu.endDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                        </select>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="enrolled-${index}" ${edu.isCurrentlyEnrolled ? "checked" : ""} onchange="updateEducation(${index}, 'isCurrentlyEnrolled', this.checked)">
                        <label for="enrolled-${index}">Actualmente estudio aquí</label>
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
            <h4>Logro ${index + 1} <button type="button" class="remove-btn" onclick="removeAchievement(${index})">Remover</button></h4>
            <div class="form-group">
                <label>Titulo</label>
                <input type="text" value="${ach.title}" maxlength="60" onchange="updateAchievement(${index}, 'title', this.value)">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <div id="achievement-desc-editor-${index}" class="wysiwyg-editor"></div>
                <textarea id="achievement-desc-${index}" style="display: none;">${ach.description}</textarea>
            </div>
        `
    container.appendChild(div)

    // Initialize WYSIWYG editor for achievement description
    setTimeout(() => {
      const editor = createWYSIWYGEditor(`#achievement-desc-editor-${index}`, `achievement-desc-${index}`, (content) =>
        updateAchievement(index, "description", content),
      )
      editor.root.innerHTML = ach.description
    }, 100)
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
            <h4>Idioma ${index + 1} <button type="button" class="remove-btn" onclick="removeLanguage(${index})">Remover</button></h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Idioma</label>
                    <input type="text" value="${lang.language}" maxlength="15" onchange="updateLanguage(${index}, 'language', this.value)">
                </div>
                <div class="form-group">
                    <label>Nivel</label>
                    <select onchange="updateLanguage(${index}, 'level', this.value)">
                        <option value="">Seleccionar Nivel</option>
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
            <h4>Referencia ${index + 1} <button type="button" class="remove-btn" onclick="removeReference(${index})">Remover</button></h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Nombre de contacto</label>
                    <input type="text" value="${ref.contactName}" maxlength="20" onchange="updateReference(${index}, 'contactName', this.value)">
                </div>
                <div class="form-group">
                    <label>Nombre de la compañía</label>
                    <input type="text" value="${ref.companyName}" maxlength="30" onchange="updateReference(${index}, 'companyName', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>Título del trabajo</label>
                <input type="text" value="${ref.jobTitle}" maxlength="30" onchange="updateReference(${index}, 'jobTitle', this.value)">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Número de teléfono</label>
                    <input type="text" value="${ref.phoneNumber}" maxlength="20" onchange="updateReference(${index}, 'phoneNumber', this.value)">
                </div>
                <div class="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" value="${ref.email}" maxlength="40" onchange="updateReference(${index}, 'email', this.value)">
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
            <h4>Certificación ${index + 1} <button type="button" class="remove-btn" onclick="removeCertification(${index})">Remover</button></h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Titulo</label>
                    <input type="text" value="${cert.title}" maxlength="100" onchange="updateCertification(${index}, 'title', this.value)">
                </div>
                <div class="form-group">
                    <label>Nombre de Institución</label>
                    <input type="text" value="${cert.institutionName}" maxlength="100" onchange="updateCertification(${index}, 'institutionName', this.value)">
                </div>
            </div>
            <div class="date-row">
                <div class="form-group">
                    <label>Fecha de incio</label>
                    <div class="date-inputs">
                        <select onchange="updateCertificationDate(${index}, 'startDate', 'month', this.value)">
                            <option value="">Mes</option>
                            ${months.map((month) => `<option value="${month}" ${cert.startDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                        </select>
                        <select onchange="updateCertificationDate(${index}, 'startDate', 'year', this.value)">
                            <option value="">Año</option>
                            ${years.map((year) => `<option value="${year}" ${cert.startDate.year === year ? "selected" : ""}>${year}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Fecha de finalización</label>
                    <div class="date-inputs">
                        <select onchange="updateCertificationDate(${index}, 'endDate', 'month', this.value)">
                            <option value="">Mes</option>
                            ${months.map((month) => `<option value="${month}" ${cert.endDate.month === month ? "selected" : ""}>${month}</option>`).join("")}
                        </select>
                        <select onchange="updateCertificationDate(${index}, 'endDate', 'year', this.value)">
                            <option value="">Año</option>
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
            <h4>Habilidades ${index + 1} <button type="button" class="remove-btn" onclick="removeSkill(${index})">Remover</button></h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Nombre de Habilidad</label>
                    <input type="text" value="${skill.skillName}" maxlength="30" onchange="updateSkill(${index}, 'skillName', this.value)">
                </div>
                <div class="form-group">
                    <label>Nivel</label>
                    <select onchange="updateSkill(${index}, 'level', this.value)">
                        <option value="">Seleccionar nivel</option>
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
                <input type="text" value="${strength.coreName}" maxlength="50" onchange="updateCoreStrength(${index}, this.value)" placeholder="Fortaleza ${index + 1}" style="flex: 1;">
                <button type="button" class="remove-btn" onclick="removeCoreStrength(${index})">Remover</button>
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

// Multi-page support functions
function checkPageOverflow() {
  const cvPreview = document.getElementById("cv-preview")
  const pages = cvPreview.querySelectorAll(".cv-page")

  pages.forEach((page, pageIndex) => {
    if (pageIndex === 0) return // Skip first page

    const pageHeight = page.offsetHeight
    const maxHeight = 297 * 3.779527559 // A4 height in pixels (297mm)

    if (pageHeight > maxHeight) {
      createNewPage()
    }
  })
}

function createNewPage() {
  const cvPreview = document.getElementById("cv-preview")
  const pageCount = cvPreview.querySelectorAll(".cv-page").length

  const newPage = document.createElement("div")
  newPage.className = "cv-page"
  newPage.id = `cv-page-${pageCount + 1}`
  newPage.innerHTML = `
        <div class="cv-body">
            <div class="cv-left-column"></div>
            <div class="cv-right-column"></div>
        </div>
    `

  cvPreview.appendChild(newPage)
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

  // Update preview elements
  document.getElementById("preview-name").textContent = cvData.personalInfo.name || "Tu Nombre"
  document.getElementById("preview-phone").textContent = cvData.personalInfo.phone
  document.getElementById("preview-email").textContent = cvData.personalInfo.email
  document.getElementById("preview-location").textContent = cvData.personalInfo.location

  // Update professional profile
  updateSection("preview-professional-profile", "Perfil Profesional", cvData.professionalProfile)

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
    updateSection("preview-core-strengths", "Fortalezas", `<div class="tags">${tagsHtml}</div>`)
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
    updateSection("preview-skills", "Habilidades", skillsHtml)
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
    updateSection("preview-languages", "Idiomas", languagesHtml)
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
    updateSection("preview-references", "Referencias", referencesHtml)
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
    updateSection("preview-experience", "Experiencia", experienceHtml)
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
    updateSection("preview-education", "Educación", educationHtml)
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
    updateSection("preview-certifications", "Cursos & Certificaciones", certificationsHtml)
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
    updateSection("preview-achievements", "Logros", achievementsHtml)
  } else {
    hideSection("preview-achievements")
  }

  // Check for page overflow and create new pages if needed
  setTimeout(checkPageOverflow, 100)
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
  const element = document.getElementById("cv-preview");
  document.body.classList.add("pdf-generating");

  const opt = {
    margin: 0,
    filename: "cv.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      logging: true,
      useCORS: true,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  // Use a small timeout to allow the DOM to update with the new CSS classes
  setTimeout(() => {
    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        document.body.classList.remove("pdf-generating");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        document.body.classList.remove("pdf-generating");
      });
  }, 150);
}

// Export CV data as JSON for AI processing
function exportCVData() {
  return JSON.stringify(cvData, null, 2)
}

// Import CV data from JSON (for AI updates)
function importCVData(jsonData) {
  try {
    const newData = JSON.parse(jsonData)
    Object.assign(cvData, newData)
    updateCVWithOptimizedData(cvData)
    return true
  } catch (error) {
    console.error("Error importing CV data:", error)
    return false
  }
}

function initializeSections() {
  // Initialize empty containers for all dynamic sections
  renderExperience()
  renderEducation()
  renderAchievements()
  renderLanguages()
  renderReferences()
  renderCertifications()
  renderSkills()
  renderCoreStrengths()
}

// --- FUNCIÓN DE AUTOCOMPLETADO PARA PRUEBAS ---

function autofillMyCV() {
  const myCVData = {
    "personalInfo": {
    "name": "ALEJANDRO AUGUSTO PINZÓN",
    "phone": "+507 6548-0466",
    "email": "alejandro.pinzon19@gmail.com",
    "location": "Panamá",
    "websites": [
      "LinkedIn/Portafolio",
      ""
    ]
  },
  "professionalProfile": "<p>Poseo habilidades para el aprendizaje profundo y aplicado en áreas tanto técnicas como de gestión. Cuento con experiencia en la comunicación efectiva de ideas, así como en la interacción con diversas personas y equipos. Me adapto con facilidad a distintos entornos de trabajo y desafío. He participado en la conceptualización y desarrollo de proyectos, abarcando desde la toma de decisiones estratégicas hasta la ejecución técnica directa.</p>",
  "experience": [
    {
      "jobTitle": "Asistente estudiantil",
      "companyName": "Odyssey Labs - Universidad Interamericana de Panamá",
      "jobDescription": "<ul><li>Mentor y facilitador para más de 10 estudiantes del programa PISTA del SENACYT, apoyando su desarrollo académico y profesional.</li><li>Asistente técnico en la instalación de 24 puntos de acceso con códigos QR y electromagnetos en puertas del campus, facilitando el control de asistencia de profesores y mejorando la seguridad en la Universidad Interamericana de Panamá.</li><li>Brindé soporte técnico en la cobertura de más de 7 eventos universitarios, asegurando el correcto funcionamiento de los sistemas tecnológicos y la generación de contenido para redes.</li></ul>",
      "country": "Panamá",
      "startDate": { "month": "August", "year": "2023" },
      "endDate": { "month": "April", "year": "2025" },
      "isCurrent": false
    },
    {
      "jobTitle": "Encargado de Tecnología",
      "companyName": "CODEM - Centro Educativo Stella Sierra",
      "jobDescription": "<ul><li>Diseño, implementación y lanzamiento de un sitio web funcional para apoyar la difusión y operación del proyecto.</li><li>Contribución al desarrollo del interés y participación en los objetivos del proyecto en más de 23 estudiantes jóvenes.</li></ul>",
      "country": "Panamá",
      "startDate": { "month": "January", "year": "2025" },
      "endDate": { "month": "June", "year": "2025" },
      "isCurrent": false
    }
  ],
  "education": [
    {
      "title": "Licenciatura en Sistemas Computacionales con énfasis en Desarrollo de Sistemas Avanzados en Redes y Software",
      "institutionName": "Universidad Interamericana de Panamá",
      "country": "Panamá",
      "startDate": { "month": "May", "year": "2022" },
      "endDate": { "month": "January", "year": "2026" },
      "isCurrentlyEnrolled": true
    },
    {
      "title": "Bachillerato en Ciencias",
      "institutionName": "Colegio Bilingüe de Panamá",
      "country": "Panamá",
      "startDate": { "month": "March", "year": "2016" },
      "endDate": { "month": "December", "year": "2021" },
      "isCurrentlyEnrolled": false
    }
  ],
  "achievements": [
    {
      "title": "Semifinalista - Huawei Seeds for the Future 2024",
      "description": "Destacado por habilidades en trabajo colaborativo, liderazgo de proyectos y comunicación efectiva de ideas en un entorno multicultural y tecnológico de alto nivel."
    },
    {
      "title": "Egresado - Laboratorio Latinoamericano de Acción Ciudadana (LLAC) 2025",
      "description": "Formación en planificación estratégica para proyectos de impacto ciudadano. Participación activa en la evaluación de ideas, coordinación de equipos, y fortalecimiento de habilidades de resiliencia y trabajo colaborativo."
    }
  ],
  "languages": [
    {
      "language": "Español",
      "level": "Native or Proficient (C2)"
    },
    {
      "language": "Inglés",
      "level": "Advanced (C1)"
    }
  ],
  "references": [],
  "certifications": [
    {
      "title": "Cisco Certified Support Technician (CCST): Networking Essentials",
      "institutionName": "Cisco Networking Academy",
      "startDate": { "month": "", "year": "" },
      "endDate": { "month": "", "year": "" }
    }
  ],
  "skills": [
    { "skillName": "Redes", "level": "Advanced" },
    { "skillName": "Software", "level": "Advanced" },
    { "skillName": "Gestión de equipos", "level": "Advanced" }
  ],
  "coreStrengths": [
    { "coreName": "Pensamiento Crítico" },
    { "coreName": "Resolución de Problemas" },
    { "coreName": "Proactividad" },
    { "coreName": "Capacidad de Adaptación" },
    { "coreName": "Liderazgo" }
  ]
};

  // Sobrescribe el objeto global cvData con tus datos
  Object.assign(cvData, myCVData);

  // Actualiza los campos del formulario con los nuevos datos
  document.getElementById("name").value = cvData.personalInfo.name;
  document.getElementById("phone").value = cvData.personalInfo.phone;
  document.getElementById("email").value = cvData.personalInfo.email;
  document.getElementById("location").value = cvData.personalInfo.location;
  document.getElementById("website1").value = cvData.personalInfo.websites[0] || "";
  document.getElementById("website2").value = cvData.personalInfo.websites[1] || "";

  // Actualiza el editor WYSIWYG de perfil profesional
  editors.professionalProfile.root.innerHTML = cvData.professionalProfile;

  // Vuelve a renderizar todas las secciones dinámicas del formulario
  renderExperience();
  renderEducation();
  renderAchievements();
  renderLanguages();
  renderReferences();
  renderCertifications();
  renderSkills();
  renderCoreStrengths();

  // Finalmente, actualiza la vista previa del CV
  updatePreview();

  console.log("¡Formulario autocompletado con los datos de Joseph Loo!");
}

// Para que el botón de prueba sea globalmente accesible desde el HTML
window.autofillMyCV = autofillMyCV;