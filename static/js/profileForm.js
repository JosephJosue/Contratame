import { firestoreService } from './firestore-service.js'; // se agrega la importación del servicio Firestore porque daba un error al guardar el CV.

class MultiStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 10;
        this.formData = {};
        this.isTransitioning = false;
        this.selectedSkills = [];
        this.counters = {
            portafolio: 0,
            experiencia: 0,
            educacion: 0,
            idioma: 0,
            logro: 0,
            curso: 0
        };

        this.skillsList = [
            'JavaScript', 'Python', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'Git', 'Docker',
            'AWS', 'MongoDB', 'Vue.js', 'Angular', 'PHP', 'Java', 'C#', 'Photoshop', 'Figma',
            'Liderazgo', 'Comunicación', 'Trabajo en equipo', 'TypeScript', 'Redux', 'Express.js',
            'PostgreSQL', 'MySQL', 'Firebase', 'GraphQL', 'REST APIs', 'Scrum', 'Agile',
            'Testing', 'Jest', 'Cypress', 'Webpack', 'Sass', 'Bootstrap', 'Tailwind CSS',
            'Adobe Illustrator', 'Sketch', 'InVision', 'Zeplin', 'Resolución de problemas',
            'Pensamiento crítico', 'Gestión de proyectos', 'Mentoring', 'Presentaciones'
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.initSkillsInput();
        this.loadFormData();
        this.addInitialSections();
        this.updateStepVisibility(); //agregado para mostrar la sección correcta al cargar el formulario
    }

    addInitialSections() {
        if (this.counters.portafolio === 0) this.addPortafolio();
        if (this.counters.experiencia === 0) this.addExperiencia();
        if (this.counters.educacion === 0) this.addEducacion();
        if (this.counters.idioma === 0) this.addIdioma();
        if (this.counters.logro === 0) this.addLogro();
        if (this.counters.curso === 0) this.addCurso();
    }

    bindEvents() {
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());

        document.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.add-section-btn');
            if (addBtn) {
                const action = addBtn.dataset.action;
                if (this[action]) {
                    this[action]();
                }
                return;
            }

            const removeSectionBtn = e.target.closest('.remove-section');
            if (removeSectionBtn) {
                const section = removeSectionBtn.closest('.dynamic-section');
                this.removeSection(section);
                return;
            }

            const removeSkillBtn = e.target.closest('.remove-skill');
            if (removeSkillBtn) {
                const skill = removeSkillBtn.dataset.skill;
                if (skill) {
                    this.removeSkill(skill);
                }
                return;
            }

            const editBtn = e.target.closest('.edit-section-btn');
            if (editBtn) {
                const step = parseInt(editBtn.dataset.step, 10);
                if (!isNaN(step)) {
                    this.goToStep(step);
                }
                return;
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.matches('.form-control, .form-select')) {
                this.validateField(e.target);
            }
        }, true);

        document.addEventListener('input', (e) => {
            if (e.target.matches('.form-control, .form-select')) {
                this.clearValidation(e.target);
                this.saveFormData();
            }
        }, true);

        document.addEventListener('change', (e) => {
            if (e.target.matches('.form-control, .form-select, .form-check-input')) {
                this.saveFormData();
            }

            if (e.target.matches('input[name*="experiencia_actual_"]')) {
                const index = e.target.name.split('_').pop();
                const fechaFin = document.querySelector(`input[name="experiencia_fin_${index}"]`);
                if (fechaFin) {
                    fechaFin.disabled = e.target.checked;
                    if (e.target.checked) {
                        fechaFin.value = '';
                        this.clearValidation(fechaFin);
                    }
                }
            }

            if (e.target.matches('input[name*="educacion_actual_"]')) {
                const index = e.target.name.split('_').pop();
                const fechaFin = document.querySelector(`input[name="educacion_fin_${index}"]`);
                if(fechaFin) {
                    fechaFin.disabled = e.target.checked;
                    if (e.target.checked) {
                        fechaFin.value = '';
                        this.clearValidation(fechaFin);
                    }
                }
            }
        });
    }

    saveFormData() {
        const form = document.getElementById('multiStepForm');
        if (!form) return;
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.disabled) {
                if (input.type === 'checkbox') {
                    this.formData[input.name] = input.checked;
                } else {
                    this.formData[input.name] = input.value;
                }
            } else {
                 delete this.formData[input.name];
            }
        });

        this.formData.habilidades = this.selectedSkills.join(',');
        localStorage.setItem('multiStepFormData', JSON.stringify(this.formData));
        localStorage.setItem('multiStepFormSkills', JSON.stringify(this.selectedSkills));
    }

loadFormData() {
    try {
        const savedData = localStorage.getItem('multiStepFormData');
        const savedSkills = localStorage.getItem('multiStepFormSkills');

        if (savedData) {
            this.formData = JSON.parse(savedData);
            setTimeout(() => {
                Object.keys(this.formData).forEach(key => {
                    const element = document.querySelector(`[name="${key}"]`);
                    if (element) {
                        if (element.type === 'checkbox') {
                            element.checked = this.formData[key];
                            // Trigger change event for checkboxes
                            element.dispatchEvent(new Event('change'));
                        } else {
                            element.value = this.formData[key];
                        }
                    }
                });
            }, 100);
        }

        if (savedSkills) {
            this.selectedSkills = JSON.parse(savedSkills);
            setTimeout(() => {
                this.renderSkills();
                this.updateHiddenSkillsInput();
            }, 100);
        }
    } catch (error) {
        console.error('Error cargando datos guardados:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('multiStepFormData');
        localStorage.removeItem('multiStepFormSkills');
    }
}

    initSkillsInput() {
        const skillInput = document.getElementById('skillInput');
        const suggestions = document.getElementById('skillSuggestions');
        if (!skillInput || !suggestions) return;

        let currentSuggestionIndex = -1;

        skillInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase().trim();
            if (value.length === 0) {
                suggestions.style.display = 'none';
                return;
            }
            const filteredSkills = this.skillsList.filter(skill =>
                skill.toLowerCase().includes(value) && !this.selectedSkills.includes(skill)
            );
            if (filteredSkills.length > 0) {
                suggestions.innerHTML = filteredSkills.map(skill =>
                    `<div class="skill-suggestion" data-skill="${skill}">${skill}</div>`
                ).join('');
                suggestions.style.display = 'block';
                currentSuggestionIndex = -1;
            } else {
                suggestions.style.display = 'none';
            }
        });

        skillInput.addEventListener('keydown', (e) => {
            const suggestionElements = suggestions.querySelectorAll('.skill-suggestion');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentSuggestionIndex = Math.min(currentSuggestionIndex + 1, suggestionElements.length - 1);
                this.updateSuggestionHighlight(suggestionElements, currentSuggestionIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentSuggestionIndex = Math.max(currentSuggestionIndex - 1, -1);
                this.updateSuggestionHighlight(suggestionElements, currentSuggestionIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentSuggestionIndex >= 0 && suggestionElements[currentSuggestionIndex]) {
                    this.addSkill(suggestionElements[currentSuggestionIndex].dataset.skill);
                } else if (skillInput.value.trim()) {
                    this.addSkill(skillInput.value.trim());
                }
                skillInput.value = '';
                suggestions.style.display = 'none';
                currentSuggestionIndex = -1;
            } else if (e.key === 'Escape') {
                suggestions.style.display = 'none';
                currentSuggestionIndex = -1;
            }
        });

        suggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('skill-suggestion')) {
                this.addSkill(e.target.dataset.skill);
                skillInput.value = '';
                suggestions.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!skillInput.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.style.display = 'none';
            }
        });
    }

    updateSuggestionHighlight(elements, index) {
        elements.forEach((el, i) => el.classList.toggle('highlighted', i === index));
    }

    addSkill(skill) {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !this.selectedSkills.includes(trimmedSkill)) {
        this.selectedSkills.push(trimmedSkill);
        this.renderSkills();
        this.updateHiddenSkillsInput();
        this.saveFormData();
    }
}

    removeSkill(skill) {
        this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
        this.renderSkills();
        this.updateHiddenSkillsInput();
        this.saveFormData();
    }

    renderSkills() {
        const container = document.getElementById('skillsContainer');
        if (!container) return;
        container.innerHTML = this.selectedSkills.map(skill =>
            `<div class="skill-tag selected">
                ${skill}
                <button type="button" class="remove-skill" data-skill="${skill}">
                    <i class="fas fa-times"></i>
                </button>
            </div>`
        ).join('');
    }

    updateHiddenSkillsInput() {
        const hiddenInput = document.getElementById('habilidades');
        if (!hiddenInput) return;
        hiddenInput.value = this.selectedSkills.join(',');
        this.validateField(hiddenInput);
    }

     resetValidation() { //agregado porque en la consola aparecía un error de validación al cargar el formulario
        const currentSection = document.querySelector(`.form-section[data-section="${this.currentStep}"]`);
        if (!currentSection) return;

        const inputs = currentSection.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            const errorElement = document.getElementById(`${input.id}Error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });

        
    }

     updateStepVisibility() { //agregado para mostrar la sección correcta al cargar el formulario
        const formSections = document.querySelectorAll('.form-section');
        formSections.forEach(section => {
            const step = parseInt(section.dataset.section, 10);
            if (step === this.currentStep) {
                section.style.display = 'block'; // O 'flex', 'grid', según tu CSS
            } else {
                section.style.display = 'none';
            }
        });

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressBar = document.getElementById('progressBar');

        if (this.currentStep === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-block';
        }

        if (this.currentStep === this.totalSteps) {
            nextBtn.textContent = 'Enviar';
            nextBtn.innerHTML = 'Enviar <i class="fas fa-paper-plane"></i>';
        } else {
            nextBtn.textContent = 'Siguiente';
            nextBtn.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
        }

        // Actualizar la barra de progreso
        const progress = (this.currentStep - 1) / (this.totalSteps - 1) * 100;
        progressBar.style.width = `${progress}%`;
    }

    nextStep() {
        if (this.isTransitioning) return;
        if (this.currentStep === this.totalSteps) {
            this.submitForm();
            return;
        }
        if (this.validateCurrentSection()) {
            this.saveFormData();
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                if (this.currentStep === this.totalSteps) {
                    this.generatePreview();
                }
                this.showSection(this.currentStep, 'next');
                this.updateProgress();
                this.updateNavigation();
            }
        }
    }

    prevStep() {
        if (this.isTransitioning) return;
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showSection(this.currentStep, 'prev');
            this.updateProgress();
            this.updateNavigation();
        }
    }

    goToStep(stepNumber) {
        if (this.isTransitioning || stepNumber === this.currentStep) return;
        const direction = stepNumber > this.currentStep ? 'next' : 'prev';
        this.currentStep = stepNumber;
        if (this.currentStep === this.totalSteps) {
            this.generatePreview();
        }
        this.showSection(this.currentStep, direction);
        this.updateProgress();
        this.updateNavigation();
    }

    generatePreview() {
        const container = document.getElementById('previewContainer');
        if (!container) return;
        let html = '';
        html += this.generatePreviewSection('Información Personal', 1, [
            {label: 'Nombre Completo', value: this.formData.nombreCompleto}
        ]);
        html += this.generatePreviewSection('Información de Contacto', 2, [
            {label: 'Teléfono', value: `${this.formData.codigoPais || ''} ${this.formData.numeroTelefono || ''}`.trim()},
            {label: 'Email', value: this.formData.email},
            {label: 'Portafolio', value: this.formData.portafolio},
            {label: 'Ubicación', value: this.formData.ubicacion}
        ]);
        html += this.generatePreviewSection('Descripción Personal', 3, [
            {label: 'Descripción', value: this.formData.descripcion, isTextarea: true}
        ]);
        html += this.generateDynamicPreviewSection('Experiencia Profesional', 4, 'experiencia', [
            'titulo', 'compania', 'inicio', 'fin', 'actual', 'ubicacion', 'logros'
        ]);
        html += this.generateDynamicPreviewSection('Educación', 5, 'educacion', [
            'titulo', 'institucion', 'inicio', 'fin', 'actual'
        ]);
        html += this.generateDynamicPreviewSection('Idiomas', 6, 'idioma', ['nombre', 'nivel']);
        html += this.generateDynamicPreviewSection('Logros', 7, 'logro', ['titulo', 'descripcion']);
        const skillsHtml = this.selectedSkills.length > 0 ?
            `<div class="preview-skills">${this.selectedSkills.map(skill => `<span class="preview-skill">${skill}</span>`).join('')}</div>` :
            '<span class="preview-empty">No se han agregado habilidades</span>';
        html += this.generatePreviewSection('Habilidades', 8, [
            {label: 'Habilidades', value: skillsHtml, isHtml: true}
        ]);
        html += this.generateDynamicPreviewSection('Cursos y Certificaciones', 9, 'curso', ['titulo', 'inicio', 'fin']);
        container.innerHTML = html;
    }

    generatePreviewSection(title, stepNumber, items) {
        let content = items.map(item => {
            const value = item.value || '';
            const displayValue = item.isHtml ? value : (value ? (item.isTextarea ? value.replace(/\n/g, '<br>') : value) : '<span class="preview-empty">No especificado</span>');
            return `<div class="preview-item"><div class="preview-label">${item.label}:</div><div class="preview-value">${displayValue}</div></div>`;
        }).join('');

        return `
            <div class="preview-section">
                <div class="preview-title">
                    ${title}
                    <button type="button" class="edit-section-btn" data-step="${stepNumber}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
                ${content}
            </div>`;
    }

    generateDynamicPreviewSection(title, stepNumber, type, fields) {
        let content = '';
        let hasData = false;
        let index = 0;
        while (true) {
            const firstFieldKey = `${type}_${fields[0]}_${index}`;
            if (!(firstFieldKey in this.formData)) break;

            hasData = true;
            let sectionContent = `<h5>${title.slice(0, -1)} #${index + 1}</h5>`;
            fields.forEach(field => {
                const key = `${type}_${field}_${index}`;
                const value = this.formData[key];
                if (field === 'actual' && value) {
                    sectionContent += `<div class="preview-item"><div class="preview-value"><strong>Actualmente aquí</strong></div></div>`;
                } else if (field !== 'actual' && value) {
                    sectionContent += `<div class="preview-item"><div class="preview-label">${this.getFieldLabel(field)}:</div><div class="preview-value">${value}</div></div>`;
                }
            });
            content += `<div class="dynamic-preview">${sectionContent}</div>`;
            index++;
        }

        if (!hasData) {
            content = '<span class="preview-empty">No se ha agregado información</span>';
        }

        return `
            <div class="preview-section">
                <div class="preview-title">
                    ${title}
                    <button type="button" class="edit-section-btn" data-step="${stepNumber}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
                ${content}
            </div>`;
    }

    getFieldLabel(field) {
        const labels = {
            titulo: 'Título', compania: 'Compañía', inicio: 'Fecha de Inicio', fin: 'Fecha de Finalización',
            ubicacion: 'Ubicación', logros: 'Logros', institucion: 'Institución', nombre: 'Idioma',
            nivel: 'Nivel', descripcion: 'Descripción'
        };
        return labels[field] || field;
    }

    showSection(sectionNumber, direction = 'next') {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const currentSection = document.querySelector('.form-section.active');
        const targetSection = document.querySelector(`[data-section="${sectionNumber}"]`);

        if (!targetSection) {
            this.isTransitioning = false;
            return;
        }

        const container = document.querySelector('.form-sections-container');
        const containerHeight = currentSection ? currentSection.offsetHeight : 0;
        container.style.height = `${containerHeight}px`;

        targetSection.style.display = 'block';
        const targetHeight = targetSection.offsetHeight;

        if (currentSection) {
            currentSection.classList.remove('active');
            currentSection.style.opacity = '0';
            setTimeout(() => {
                currentSection.style.display = 'none';
            }, 300);
        }

        targetSection.classList.add('active');
        targetSection.style.opacity = '0';
        container.style.height = `${targetHeight}px`;

        setTimeout(() => {
            targetSection.style.opacity = '1';
            this.isTransitioning = false;
        }, 300);

        setTimeout(() => {
            container.style.height = 'auto';
        }, 600);
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
        progressBar.style.width = `${progress}%`;

        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (!prevBtn || !nextBtn) return;

        prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';
        if (this.currentStep === this.totalSteps) {
            nextBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Aplicación';
        } else {
            nextBtn.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
        }
    }

    validateCurrentSection() {
        const currentSection = document.querySelector(`[data-section="${this.currentStep}"]`);
        if (!currentSection) return true;
        
        const requiredFields = currentSection.querySelectorAll('[required]');
        let isValid = true;
        
        // Validar campos requeridos
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validar rangos de fechas para experiencia
        const experienciaStartFields = currentSection.querySelectorAll('input[name*="experiencia_inicio_"]');
        experienciaStartFields.forEach(startField => {
            const index = startField.name.split('_').pop();
            const endField = currentSection.querySelector(`input[name="experiencia_fin_${index}"]`);
            const currentCheckbox = currentSection.querySelector(`input[name="experiencia_actual_${index}"]`);
            
            if (endField && !this.validateDateRange(startField, endField, currentCheckbox)) {
                isValid = false;
            }
        });
        
        // Validar rangos de fechas para educación
        const educacionStartFields = currentSection.querySelectorAll('input[name*="educacion_inicio_"]');
        educacionStartFields.forEach(startField => {
            const index = startField.name.split('_').pop();
            const endField = currentSection.querySelector(`input[name="educacion_fin_${index}"]`);
            const currentCheckbox = currentSection.querySelector(`input[name="educacion_actual_${index}"]`);
            
            if (endField && !this.validateDateRange(startField, endField, currentCheckbox)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        if (field.disabled) return true;
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        this.clearValidation(field);

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Este campo es obligatorio';
        } else if (field.type === 'email' && value && !/^[^\n@]+@[^\n@]+\.[^\n@]+$/.test(value)) {
            isValid = false;
            message = 'Ingresa un email válido';
        } else if (field.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
            isValid = false;
            message = 'Ingresa una URL válida';
        } else if (field.name === 'habilidades' && this.selectedSkills.length === 0) {
            isValid = false;
            message = 'Selecciona al menos una habilidad';
        }
        // Validación de número de teléfono
        else if (field.name === 'numeroTelefono' && value && !/^\d{7,15}$/.test(value.replace(/\s/g, ''))) {
        isValid = false;
        message = 'Ingresa un número de teléfono válido';
}

        if (!isValid) {
            field.classList.add('is-invalid');
            this.showValidationMessage(field, message);
        } else {
            field.classList.remove('is-invalid');
        }
        return isValid;
    }

    validateDateRange(startField, endField, currentCheckbox) {
    if (currentCheckbox && currentCheckbox.checked) {
        return true; // Si es trabajo actual, no validar fecha fin
    }
    
    const startDate = new Date(startField.value);
    const endDate = new Date(endField.value);
    
    if (startField.value && endField.value && startDate > endDate) {
        this.showValidationMessage(endField, 'La fecha de fin no puede ser anterior a la fecha de inicio');
        endField.classList.add('is-invalid');
        return false;
    }
    
    this.clearValidation(endField);
    return true;
}

    clearValidation(field) {
        field.classList.remove('is-invalid');
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    showValidationMessage(field, message) {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

async submitForm() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.saveFormData(this.currentStep);

    // Limpiar formData: eliminar campos con valores de cadena vacíos y CLAVES VACÍAS
    const dataToSave = {};
    for (const key in this.formData) {
        const value = this.formData[key];
        
        // ¡CAMBIO CLAVE AQUÍ! Añadir 'key !== ""'
        if (key !== "" && value !== "" && value !== null && value !== undefined) {
            // Si es un array, asegura que no esté vacío si esperas contenido
            if (Array.isArray(value) && value.length === 0) {
                continue; // Saltar arrays vacíos si no quieres almacenarlos
            }
            dataToSave[key] = value;
        }
    }

    try {
        // Asegúrate de tener un userId válido aquí (por ejemplo, del usuario autenticado)
        const userId = "aBUQPP1SFha0RSl2ElwrYkcMJNn2"; // Reemplaza esto con el ID de usuario real de Firebase Auth
        const result = await firestoreService.saveUserCV(userId, dataToSave);

        if (result.success) {
            console.log('CV guardado exitosamente:', result.id);
            this.currentStep++;
            this.updateProgress();
            this.updateStepVisibility();
            this.resetValidation();
        } else {
            console.error('Error al guardar el CV:', result.error);
            alert(`Error al enviar el formulario: ${result.error}`);
        }
    } catch (error) {
        console.error('Error en submitForm:', error);
        alert(`Ocurrió un error inesperado: ${error.message}`);
    } finally {
        this.isTransitioning = false;
    }
}

    addDynamicSection(type, containerId, content, limit = null) {
        if (limit && this.counters[type] >= limit) {
            const addBtn = document.querySelector(`[data-action="add${type.charAt(0).toUpperCase() + type.slice(1)}"]`);
            if (addBtn) {
                addBtn.disabled = true;
                addBtn.innerHTML = '<i class="fas fa-ban"></i> Límite alcanzado';
            }
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) return;
        const index = this.counters[type]++;
        const newSection = document.createElement('div');
        newSection.className = 'dynamic-section';
        newSection.setAttribute('data-section-type', type);
        newSection.setAttribute('data-index', index);
        newSection.innerHTML = content(index);
        container.appendChild(newSection);
    }

    addPortafolio() {
        this.addDynamicSection('portafolio', 'portafolioContainer', index => `
            <div class="dynamic-section-header">
                <h4 class="dynamic-section-title">Portafolio #${index + 1}</h4>
                <button type="button" class="remove-section"><i class="fas fa-times"></i></button>
            </div>
            <div class="form-group">
                <label for="portafolio_${index}" class="form-label">Portafolio</label>
                <div class="input-group">
                    <i class="fas fa-globe input-icon"></i>
                    <input type="url" class="form-control" id="portafolio_${index}" name="portafolio_${index}"
                           placeholder="https://tu-portafolio.com">
                </div>
                <div class="validation-message" id="portafolio_${index}Error"></div>
            </div>
        `, 2);
    }

    addExperiencia() {
        this.addDynamicSection('experiencia', 'experienciaContainer', index => `
            <div class="dynamic-section-header">
                <h4 class="dynamic-section-title">Experiencia #${index + 1}</h4>
                <button type="button" class="remove-section"><i class="fas fa-times"></i></button>
            </div>
            <div class="form-group"><label class="form-label">Título del Puesto *</label><div class="input-group"><i class="fas fa-id-badge input-icon"></i><input type="text" class="form-control" id="experiencia_titulo_${index}" name="experiencia_titulo_${index}" placeholder="Ej: Desarrollador Frontend" required></div><div class="validation-message" id="experiencia_titulo_${index}Error"></div></div>
            <div class="form-group"><label class="form-label">Nombre de la Compañía *</label><div class="input-group"><i class="fas fa-building input-icon"></i><input type="text" class="form-control" id="experiencia_compania_${index}" name="experiencia_compania_${index}" placeholder="Ej: Tech Solutions Inc." required></div><div class="validation-message" id="experiencia_compania_${index}Error"></div></div>
            <div class="date-row"><div class="form-group"><label class="form-label">Fecha de Inicio *</label><input type="month" class="form-control" id="experiencia_inicio_${index}" name="experiencia_inicio_${index}" required></div><div class="form-group"><label class="form-label">Fecha de Finalización</label><input type="month" class="form-control" id="experiencia_fin_${index}" name="experiencia_fin_${index}"><div class="checkbox-group"><input type="checkbox" class="form-check-input" name="experiencia_actual_${index}"><label class="form-check-label">Actualmente trabajo aquí</label></div></div></div>
            <div class="form-group"><label class="form-label">Ubicación *</label><div class="input-group"><i class="fas fa-map-marker-alt input-icon"></i><input type="text" class="form-control" id="experiencia_ubicacion_${index}" name="experiencia_ubicacion_${index}" placeholder="Ciudad, País" required></div><div class="validation-message" id="experiencia_ubicacion_${index}Error"></div></div>
            <div class="form-group"><label class="form-label">Logros *</label><textarea class="form-control" id="experiencia_logros_${index}" name="experiencia_logros_${index}" rows="4" placeholder="Describe tus logros..." required></textarea><div class="validation-message" id="experiencia_logros_${index}Error"></div></div>
        `);
    }

    addEducacion() {
        this.addDynamicSection('educacion', 'educacionContainer', index => `
            <div class="dynamic-section-header"><h4 class="dynamic-section-title">Educación #${index + 1}</h4><button type="button" class="remove-section"><i class="fas fa-times"></i></button></div>
            <div class="form-group"><label class="form-label">Título o Campo de Estudio *</label><div class="input-group"><i class="fas fa-certificate input-icon"></i><input type="text" class="form-control" id="educacion_titulo_${index}" name="educacion_titulo_${index}" placeholder="Ej: Ingeniería en Sistemas" required></div><div class="validation-message" id="educacion_titulo_${index}Error"></div></div>
            <div class="form-group"><label class="form-label">Escuela o Universidad *</label><div class="input-group"><i class="fas fa-university input-icon"></i><input type="text" class="form-control" id="educacion_institucion_${index}" name="educacion_institucion_${index}" placeholder="Ej: Universidad Nacional" required></div><div class="validation-message" id="educacion_institucion_${index}Error"></div></div>
            <div class="date-row"><div class="form-group"><label class="form-label">Periodo de Inicio *</label><input type="month" class="form-control" id="educacion_inicio_${index}" name="educacion_inicio_${index}" required></div><div class="form-group"><label class="form-label">Periodo de Finalización</label><input type="month" class="form-control" id="educacion_fin_${index}" name="educacion_fin_${index}"><div class="checkbox-group"><input type="checkbox" class="form-check-input" name="educacion_actual_${index}"><label class="form-check-label">Actualmente estudio aquí</label></div></div></div>
        `);
    }

    addIdioma() {
        this.addDynamicSection('idioma', 'idiomasContainer', index => `
            <div class="dynamic-section-header"><h4 class="dynamic-section-title">Idioma #${index + 1}</h4><button type="button" class="remove-section"><i class="fas fa-times"></i></button></div>
            <div class="form-group"><label class="form-label">Idioma *</label><div class="input-group"><i class="fas fa-globe input-icon"></i><input type="text" class="form-control" id="idioma_nombre_${index}" name="idioma_nombre_${index}" placeholder="Ej: Inglés" required></div><div class="validation-message" id="idioma_nombre_${index}Error"></div></div>
            <div class="form-group"><label class="form-label">Nivel *</label><select class="form-select" id="idioma_nivel_${index}" name="idioma_nivel_${index}" required><option value="">Selecciona tu nivel</option><option value="principiante">Principiante</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option><option value="competente">Competente</option><option value="nativo">Nativo</option></select><div class="validation-message" id="idioma_nivel_${index}Error"></div></div>
        `);
    }

    addLogro() {
        this.addDynamicSection('logro', 'logrosContainer', index => `
            <div class="dynamic-section-header"><h4 class="dynamic-section-title">Logro #${index + 1}</h4><button type="button" class="remove-section"><i class="fas fa-times"></i></button></div>
            <div class="form-group"><label class="form-label">Título del Logro *</label><div class="input-group"><i class="fas fa-award input-icon"></i><input type="text" class="form-control" id="logro_titulo_${index}" name="logro_titulo_${index}" placeholder="Ej: Empleado del Mes" required></div><div class="validation-message" id="logro_titulo_${index}Error"></div></div>
            <div class="form-group"><label class="form-label">Descripción *</label><textarea class="form-control" id="logro_descripcion_${index}" name="logro_descripcion_${index}" rows="4" placeholder="Describe el logro..." required></textarea><div class="validation-message" id="logro_descripcion_${index}Error"></div></div>
        `);
    }

    addCurso() {
        this.addDynamicSection('curso', 'cursosContainer', index => `
            <div class="dynamic-section-header"><h4 class="dynamic-section-title">Curso #${index + 1}</h4><button type="button" class="remove-section"><i class="fas fa-times"></i></button></div>
            <div class="form-group"><label class="form-label">Título del Curso *</label><div class="input-group"><i class="fas fa-certificate input-icon"></i><input type="text" class="form-control" id="curso_titulo_${index}" name="curso_titulo_${index}" placeholder="Ej: Curso de React Avanzado" required></div><div class="validation-message" id="curso_titulo_${index}Error"></div></div>
            <div class="date-row"><div class="form-group"><label class="form-label">Fecha de Inicio *</label><input type="month" class="form-control" id="curso_inicio_${index}" name="curso_inicio_${index}" required></div><div class="form-group"><label class="form-label">Fecha de Finalización *</label><input type="month" class="form-control" id="curso_fin_${index}" name="curso_fin_${index}" required></div></div>
        `);
    }

    removeSection(section) {
        if (section) {
            const type = section.dataset.sectionType;
            section.remove();
            this.reindexSections(type);
            this.saveFormData();

            const addBtn = document.querySelector(`[data-action="add${type.charAt(0).toUpperCase() + type.slice(1)}"]`);
            if (addBtn && addBtn.disabled) {
                addBtn.disabled = false;
                let buttonText = `Agregar otr${type === 'experiencia' || type === 'educacion' ? 'a' : 'o'} ${type}`;
                if(type === 'portafolio') buttonText = 'Agregar otro portafolio';
                addBtn.innerHTML = `<i class="fas fa-plus"></i> ${buttonText}`;
            }
        }
    }

    reindexSections(type) {
        const sections = document.querySelectorAll(`.dynamic-section[data-section-type="${type}"]`);
        const newCounter = sections.length;
        const tempFormData = {};

        // First, copy all non-related form data to the temp object
        Object.keys(this.formData).forEach(key => {
            if (!key.startsWith(`${type}_`)) {
                tempFormData[key] = this.formData[key];
            }
        });

        sections.forEach((section, newIndex) => {
            const oldIndex = parseInt(section.dataset.index, 10);
            section.dataset.index = newIndex;

            const title = section.querySelector('.dynamic-section-title');
            if (title) {
                const titleType = type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
                title.textContent = `${titleType} #${newIndex + 1}`;
            }

            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const oldName = input.name;
                const nameParts = oldName.split('_');
                const oldIndexFromName = nameParts.pop();
                const newName = `${nameParts.join('_')}_${newIndex}`;

                if (this.formData[oldName] !== undefined) {
                    tempFormData[newName] = this.formData[oldName];
                }

                input.name = newName;
                input.id = newName;

                const errorElement = section.querySelector(`#${oldName.replace(/(:|\.|[|])/g, '\$1')}Error`);
                if (errorElement) {
                    errorElement.id = `${newName}Error`;
                }
            });
        });

        this.formData = tempFormData;
        this.counters[type] = newCounter;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MultiStepForm();
});
