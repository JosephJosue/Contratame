// User Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile page functionality
    initProfileAnimations();
    initProfileInteractions();
    initSkillAnimations();
    initEditProfile();
});

// Initialize scroll-based animations
function initProfileAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize profile interactions
function initProfileInteractions() {
    // Profile avatar hover effect
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        profileAvatar.addEventListener('click', function() {
            // This would typically open a file picker for avatar upload
            showAvatarUploadModal();
        });
    }

    // Skill tags interaction
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
            // Could show skill details or filter related content
            showSkillDetails(this.textContent);
        });
    });

    // Contact info interactions
    const contactItems = document.querySelectorAll('.contact-info li');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const contactType = this.querySelector('.contact-label').textContent;
            const contactValue = this.querySelector('.contact-value').textContent;
            handleContactClick(contactType, contactValue);
        });
    });

    // Social links tracking
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.title;
            trackSocialClick(platform);
            // In a real app, this would open the actual social profile
            console.log(`Opening ${platform} profile`);
        });
    });

    // Profile action buttons
    const downloadBtn = document.querySelector('.profile-actions .btn-primary');
    const contactBtn = document.querySelector('.profile-actions .btn-outline-light');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadResume();
        });
    }

    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            openContactModal();
        });
    }
}

// Initialize skill progress bar animations
function initSkillAnimations() {
    const progressBars = document.querySelectorAll('.progress-bar');

    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;

                // Reset width and animate
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Initialize edit profile functionality
function initEditProfile() {
    const editBtn = document.getElementById('editProfileBtn');

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            toggleEditMode();
        });
    }

    // Add keyboard shortcut for edit mode
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            toggleEditMode();
        }
    });
}

// Profile interaction functions
function showAvatarUploadModal() {
    // Create a simple modal for avatar upload
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update Profile Picture</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input type="file" class="form-control" accept="image/*" id="avatarUpload">
                    <div class="mt-3">
                        <img id="avatarPreview" class="img-fluid rounded" style="max-height: 200px; display: none;">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="uploadAvatar()">Upload</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // Handle file preview
    const fileInput = modal.querySelector('#avatarUpload');
    const preview = modal.querySelector('#avatarPreview');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Clean up modal after closing
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

function showSkillDetails(skillName) {
    // Show skill details in a tooltip or modal
    console.log(`Showing details for skill: ${skillName}`);

    // Create a simple tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h6>${skillName}</h6>
            <p>Experience: 3+ years</p>
            <p>Projects: 15+ completed</p>
            <p>Proficiency: Advanced</p>
        </div>
    `;

    // Position and show tooltip (simplified implementation)
    document.body.appendChild(tooltip);

    // Remove tooltip after 3 seconds
    setTimeout(() => {
        if (document.body.contains(tooltip)) {
            document.body.removeChild(tooltip);
        }
    }, 3000);
}

function handleContactClick(type, value) {
    switch(type.toLowerCase()) {
        case 'email':
            window.location.href = `mailto:${value}`;
            break;
        case 'phone':
            window.location.href = `tel:${value}`;
            break;
        case 'website':
            window.open(`https://${value}`, '_blank');
            break;
        default:
            console.log(`Contact clicked: ${type} - ${value}`);
    }
}

function trackSocialClick(platform) {
    // Analytics tracking for social media clicks
    console.log(`Social media click tracked: ${platform}`);

    // In a real application, you would send this to your analytics service
    // analytics.track('social_link_clicked', { platform: platform });
}

function downloadResume() {
    // Simulate resume download
    console.log('Downloading resume...');

    // In a real application, this would trigger an actual file download
    const link = document.createElement('a');
    link.href = '/path/to/resume.pdf'; // Replace with actual resume URL
    link.download = 'Sarah_Johnson_Resume.pdf';
    link.click();

    // Show success message
    showNotification('Resume download started!', 'success');
}

function openContactModal() {
    // Create contact modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Contact Sarah Johnson</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="contactForm">
                        <div class="mb-3">
                            <label for="contactName" class="form-label">Your Name</label>
                            <input type="text" class="form-control" id="contactName" required>
                        </div>
                        <div class="mb-3">
                            <label for="contactEmail" class="form-label">Your Email</label>
                            <input type="email" class="form-control" id="contactEmail" required>
                        </div>
                        <div class="mb-3">
                            <label for="contactSubject" class="form-label">Subject</label>
                            <input type="text" class="form-control" id="contactSubject" required>
                        </div>
                        <div class="mb-3">
                            <label for="contactMessage" class="form-label">Message</label>
                            <textarea class="form-control" id="contactMessage" rows="4" required></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="sendContactMessage()">Send Message</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // Clean up modal after closing
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

function toggleEditMode() {
    const editBtn = document.getElementById('editProfileBtn');
    const isEditing = editBtn.classList.contains('editing');

    if (isEditing) {
        // Exit edit mode
        exitEditMode();
    } else {
        // Enter edit mode
        enterEditMode();
    }
}

function enterEditMode() {
    const editBtn = document.getElementById('editProfileBtn');
    editBtn.classList.add('editing');
    editBtn.innerHTML = '<i class="fas fa-save"></i>';
    editBtn.title = 'Save Changes';

    // Make profile elements editable
    makeProfileEditable();

    showNotification('Edit mode enabled. Click elements to edit them.', 'info');
}

function exitEditMode() {
    const editBtn = document.getElementById('editProfileBtn');
    editBtn.classList.remove('editing');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.title = 'Edit Profile';

    // Save changes and make elements non-editable
    saveProfileChanges();

    showNotification('Changes saved successfully!', 'success');
}

function makeProfileEditable() {
    // Make text elements editable
    const editableElements = [
        '.profile-name',
        '.profile-title',
        '.about-text',
        '.experience-company',
        '.experience-position',
        '.experience-description'
    ];

    editableElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.contentEditable = true;
            element.classList.add('editable');
        });
    });
}

function saveProfileChanges() {
    // Remove editable attributes and classes
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.contentEditable = false;
        element.classList.remove('editable');
    });

    // In a real application, you would send the changes to your backend
    console.log('Profile changes saved');
}

function uploadAvatar() {
    const fileInput = document.getElementById('avatarUpload');
    const file = fileInput.files[0];

    if (file) {
        // Simulate upload process
        const reader = new FileReader();
        reader.onload = function(e) {
            const profileAvatar = document.getElementById('profileAvatar');
            profileAvatar.src = e.target.result;

            // Close modal
            const modal = fileInput.closest('.modal');
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();

            showNotification('Profile picture updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function sendContactMessage() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);

    // Simulate sending message
    console.log('Sending contact message...');

    // Close modal
    const modal = form.closest('.modal');
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    bootstrapModal.hide();

    showNotification('Message sent successfully!', 'success');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .editable {
        border: 2px dashed #007bff;
        padding: 0.25rem;
        border-radius: 4px;
        background: rgba(0, 123, 255, 0.05);
    }
    
    .editable:focus {
        outline: none;
        border-color: #0056b3;
        background: rgba(0, 123, 255, 0.1);
    }
    
    .skill-tooltip {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        padding: 1rem;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
`;

document.head.appendChild(notificationStyles);

// Console welcome message
console.log(`
👤 User Profile Page Loaded Successfully!

Features:
- Interactive profile editing
- Skill progress animations
- Contact functionality
- Avatar upload simulation
- Social media integration
- Responsive design
- Accessibility optimized

Ready for integration with your job portal!
`);