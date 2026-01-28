let settingsData = {
    personalInfo: {
        fullName: "",
        email: "",
        phoneNumber: "",
        accountCreated: "",
        profilePic: ""
    },
    security: {
        twoFactorAuth: false
    },
    notifications: {
        outOfStock: false,
        dailySales: false,
        newOrderAlerts: false
    },
    preferences: {
        darkMode: false,
        language: "en",
        timeZone: ""
    }
};

let personalInfoSection, securitySection, notificationsSection, preferencesSection;
let saveBtn, cancelBtn;
let profilePicElement, profilePicUploadBtn, profilePicRemoveBtn;

document.addEventListener('DOMContentLoaded', function() {
    initDOMElements();
    loadSettingsFromStorage();
    renderSettingsData();
    setupEventListeners();
    
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 500);
});

function initDOMElements() {
    personalInfoSection = document.querySelector('.profile-info');
    securitySection = document.querySelector('.security-item:nth-child(2)');
    notificationsSection = document.querySelectorAll('.notification-item');
    preferencesSection = document.querySelectorAll('.preference-item');
    
    saveBtn = document.querySelector('.btn-save');
    cancelBtn = document.querySelector('.btn-secondary:last-child');
    
    profilePicElement = document.querySelector('.profile-pic img');
    profilePicUploadBtn = document.querySelector('.profile-pic .btn-secondary');
    profilePicRemoveBtn = document.querySelector('.profile-pic .btn-remove');
}

function loadSettingsFromStorage() {
    const savedSettings = localStorage.getItem('cafeSettings');
    if (savedSettings) {
        settingsData = JSON.parse(savedSettings);
    }
}

function saveSettingsToStorage() {
    localStorage.setItem('cafeSettings', JSON.stringify(settingsData));
    showToast('Settings saved successfully!', 'success');
}

function renderSettingsData() {
    const nameElement = document.querySelector('.info-item:nth-child(1) .info-value');
    const emailElement = document.querySelector('.info-item:nth-child(2) .info-value');
    const phoneElement = document.querySelector('.info-item:nth-child(3) .info-value');
    const createdElement = document.querySelector('.info-item:nth-child(4) .info-value');
    
    if (nameElement) nameElement.textContent = settingsData.personalInfo.fullName || "Not set";
    if (emailElement) emailElement.textContent = settingsData.personalInfo.email || "Not set";
    if (phoneElement) phoneElement.textContent = settingsData.personalInfo.phoneNumber || "Not set";
    if (createdElement) createdElement.textContent = settingsData.personalInfo.accountCreated || "Not set";
    
    if (profilePicElement) {
        if (settingsData.personalInfo.profilePic) {
            profilePicElement.src = settingsData.personalInfo.profilePic;
        } else {
            profilePicElement.src = 'https://via.placeholder.com/150/cccccc/808080?text=Profile';
        }
    }
    
    const twoFactorToggle = securitySection?.querySelector('input[type="checkbox"]');
    if (twoFactorToggle) {
        twoFactorToggle.checked = settingsData.security.twoFactorAuth;
    }
    
    const notificationToggles = document.querySelectorAll('.notification-item input[type="checkbox"]');
    if (notificationToggles.length >= 3) {
        notificationToggles[0].checked = settingsData.notifications.outOfStock;
        notificationToggles[1].checked = settingsData.notifications.dailySales;
        notificationToggles[2].checked = settingsData.notifications.newOrderAlerts;
    }
    
    const darkModeToggle = preferencesSection[0]?.querySelector('input[type="checkbox"]');
    const languageSelect = preferencesSection[1]?.querySelector('select');
    const timezoneSelect = preferencesSection[2]?.querySelector('select');
    
    if (darkModeToggle) darkModeToggle.checked = settingsData.preferences.darkMode;
    if (languageSelect) languageSelect.value = settingsData.preferences.language || "en";
    if (timezoneSelect) timezoneSelect.value = settingsData.preferences.timeZone || "";
    
    if (settingsData.preferences.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function setupEventListeners() {
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetSettings);
    }
    
    const editBtn = document.getElementById('editPersonalInfoBtn') || document.querySelector('.btn-edit');
    if (editBtn) {
        editBtn.addEventListener('click', editPersonalInfo);
    }
    
    const changePasswordBtn = document.querySelector('.security-item:nth-child(1) .btn-secondary');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', changePassword);
    }
    
    if (profilePicUploadBtn) {
        profilePicUploadBtn.addEventListener('click', uploadProfilePic);
    }
    
    if (profilePicRemoveBtn) {
        profilePicRemoveBtn.addEventListener('click', removeProfilePic);
    }
    
    setupToggleListeners();
    setupSelectListeners();
    
    const logoutEverywhereBtn = document.querySelector('.danger-item .btn-secondary');
    if (logoutEverywhereBtn) {
        logoutEverywhereBtn.addEventListener('click', logoutEverywhere);
    }
    
    const darkModeBtn = document.getElementById('toggleDarkModeBtn');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', toggleDarkMode);
    }
    
    const editPreferencesBtn = document.getElementById('editPreferencesBtn');
    if (editPreferencesBtn) {
        editPreferencesBtn.addEventListener('click', editPreferences);
    }
}

function setupToggleListeners() {
    const twoFactorToggle = securitySection?.querySelector('input[type="checkbox"]');
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener('change', function() {
            settingsData.security.twoFactorAuth = this.checked;
        });
    }
    
    const notificationToggles = document.querySelectorAll('.notification-item input[type="checkbox"]');
    notificationToggles.forEach((toggle, index) => {
        toggle.addEventListener('change', function() {
            switch(index) {
                case 0:
                    settingsData.notifications.outOfStock = this.checked;
                    break;
                case 1:
                    settingsData.notifications.dailySales = this.checked;
                    break;
                case 2:
                    settingsData.notifications.newOrderAlerts = this.checked;
                    break;
            }
        });
    });
    
    const darkModeToggle = preferencesSection[0]?.querySelector('input[type="checkbox"]');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            settingsData.preferences.darkMode = this.checked;
            if (this.checked) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        });
    }
}

function setupSelectListeners() {
    const languageSelect = preferencesSection[1]?.querySelector('select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            settingsData.preferences.language = this.value;
        });
    }
    
    const timezoneSelect = preferencesSection[2]?.querySelector('select');
    if (timezoneSelect) {
        timezoneSelect.addEventListener('change', function() {
            settingsData.preferences.timeZone = this.value;
        });
    }
}

function editPersonalInfo() {
    const currentData = settingsData.personalInfo;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Edit Personal Information</h3>
            <form id="editPersonalForm">
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" value="${currentData.fullName || ''}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" value="${currentData.email || ''}" required>
                </div>
                <div class="form-group">
                    <label for="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" value="${currentData.phoneNumber || ''}">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('editPersonalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        settingsData.personalInfo = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            profilePic: currentData.profilePic,
            accountCreated: currentData.accountCreated || new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        renderSettingsData();
        closeModal();
        showToast('Personal information updated!', 'success');
    });
}

function editPreferences() {
    const currentData = settingsData.preferences;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Edit Preferences</h3>
            <form id="editPreferencesForm">
                <div class="form-group">
                    <label class="switch">
                        <input type="checkbox" id="editDarkMode" ${currentData.darkMode ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <label for="editDarkMode" class="preference-label">Dark Mode</label>
                    <p class="preference-description">Switch to dark theme</p>
                </div>
                
                <div class="form-group">
                    <label for="editLanguage">Language</label>
                    <select id="editLanguage">
                        <option value="en" ${currentData.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="es" ${currentData.language === 'es' ? 'selected' : ''}>Spanish</option>
                        <option value="fr" ${currentData.language === 'fr' ? 'selected' : ''}>French</option>
                        <option value="de" ${currentData.language === 'de' ? 'selected' : ''}>German</option>
                        <option value="zh" ${currentData.language === 'zh' ? 'selected' : ''}>Chinese</option>
                    </select>
                    <p class="preference-description">Select your preferred language</p>
                </div>
                
                <div class="form-group">
                    <label for="editTimezone">Time Zone</label>
                    <select id="editTimezone">
                        <option value="" ${!currentData.timeZone ? 'selected' : ''}>Select Time Zone</option>
                        <option value="America/New_York" ${currentData.timeZone === 'America/New_York' ? 'selected' : ''}>Eastern Time (ET)</option>
                        <option value="America/Chicago" ${currentData.timeZone === 'America/Chicago' ? 'selected' : ''}>Central Time (CT)</option>
                        <option value="America/Denver" ${currentData.timeZone === 'America/Denver' ? 'selected' : ''}>Mountain Time (MT)</option>
                        <option value="America/Los_Angeles" ${currentData.timeZone === 'America/Los_Angeles' ? 'selected' : ''}>Pacific Time (PT)</option>
                        <option value="Europe/London" ${currentData.timeZone === 'Europe/London' ? 'selected' : ''}>London (GMT)</option>
                        <option value="Europe/Paris" ${currentData.timeZone === 'Europe/Paris' ? 'selected' : ''}>Paris (CET)</option>
                        <option value="Asia/Tokyo" ${currentData.timeZone === 'Asia/Tokyo' ? 'selected' : ''}>Tokyo (JST)</option>
                        <option value="Australia/Sydney" ${currentData.timeZone === 'Australia/Sydney' ? 'selected' : ''}>Sydney (AEST)</option>
                    </select>
                    <p class="preference-description">Set your local time zone</p>
                </div>
                
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Save Preferences</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('editPreferencesForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        settingsData.preferences = {
            darkMode: document.getElementById('editDarkMode').checked,
            language: document.getElementById('editLanguage').value,
            timeZone: document.getElementById('editTimezone').value
        };
        
        renderSettingsData();
        closeModal();
        showToast('Preferences updated!', 'success');
    });
}

function toggleDarkMode() {
    settingsData.preferences.darkMode = !settingsData.preferences.darkMode;
    
    if (settingsData.preferences.darkMode) {
        document.body.classList.add('dark-mode');
        showToast('Dark mode enabled', 'success');
    } else {
        document.body.classList.remove('dark-mode');
        showToast('Dark mode disabled', 'info');
    }
    
    renderSettingsData();
}

function uploadProfilePic() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            showToast('Please select an image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size should be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            settingsData.personalInfo.profilePic = imageUrl;
            renderSettingsData();
            showToast('Profile picture updated!', 'success');
        };
        reader.readAsDataURL(file);
    };
    
    input.click();
}

function removeProfilePic() {
    if (confirm('Remove profile picture?')) {
        settingsData.personalInfo.profilePic = '';
        renderSettingsData();
        showToast('Profile picture removed', 'info');
    }
}

function changePassword() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Change Password</h3>
            <form id="changePasswordForm">
                <div class="form-group">
                    <label for="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" required minlength="8">
                    <small>Password must be at least 8 characters long</small>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" required>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Change Password</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match!', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showToast('Password must be at least 8 characters!', 'error');
            return;
        }
        
        showToast('Password changed successfully!', 'success');
        closeModal();
    });
}

function saveSettings() {
    collectCurrentSettings();
    saveSettingsToStorage();
    console.log('Saving settings to server:', settingsData);
    showToast('All settings saved successfully!', 'success');
}

function collectCurrentSettings() {
    const twoFactorToggle = securitySection?.querySelector('input[type="checkbox"]');
    if (twoFactorToggle) {
        settingsData.security.twoFactorAuth = twoFactorToggle.checked;
    }
    
    const notificationToggles = document.querySelectorAll('.notification-item input[type="checkbox"]');
    if (notificationToggles.length >= 3) {
        settingsData.notifications = {
            outOfStock: notificationToggles[0].checked,
            dailySales: notificationToggles[1].checked,
            newOrderAlerts: notificationToggles[2].checked
        };
    }
    
    const darkModeToggle = preferencesSection[0]?.querySelector('input[type="checkbox"]');
    const languageSelect = preferencesSection[1]?.querySelector('select');
    const timezoneSelect = preferencesSection[2]?.querySelector('select');
    
    if (darkModeToggle) settingsData.preferences.darkMode = darkModeToggle.checked;
    if (languageSelect) settingsData.preferences.language = languageSelect.value;
    if (timezoneSelect) settingsData.preferences.timeZone = timezoneSelect.value;
}

function resetSettings() {
    loadSettingsFromStorage();
    renderSettingsData();
    showToast('Settings reset to last saved state', 'info');
}

function logoutEverywhere() {
    if (confirm('Are you sure you want to logout from all devices? This will end all active sessions.')) {
        localStorage.removeItem('cafeSettings');
        showToast('Logged out from all devices', 'success');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = 'padding: 12px 20px; margin-bottom: 10px; border-radius: 4px; color: white;';
    
    if (type === 'success') {
        toast.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#dc3545';
    } else if (type === 'info') {
        toast.style.backgroundColor = '#17a2b8';
    } else {
        toast.style.backgroundColor = '#6c757d';
    }
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/login';
    }
}

function debounceSearch(query) {
    console.log('Searching for:', query);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        settingsData,
        editPersonalInfo,
        changePassword,
        saveSettings,
        resetSettings,
        logoutEverywhere,
        toggleDarkMode,
        editPreferences
    };
}