// Menu Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the menu system
    initMenuSystem();
});

function initMenuSystem() {
    // Modal elements
    const addItemBtn = document.getElementById('addItemBtn');
    const modal = document.getElementById('addItemModal');
    
    // Check if essential elements exist
    if (!addItemBtn || !modal) {
        console.error('Required elements not found!');
        return;
    }
    
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const addItemForm = document.getElementById('addItemForm');
    
    // Table elements
    const menuTable = document.getElementById('menuTable');
    const menuFooter = document.getElementById('menuFooter');
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter');
    
    // Menu data - load from localStorage or start empty
    let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    let currentFilter = 'all';
    
    // Calculate next ID from existing items
    let itemCounter = menuItems.length > 0 ? 
        Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    
    // 1. SAVE TO LOCALSTORAGE function
    function saveToLocalStorage() {
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        console.log('Saved to localStorage:', menuItems);
    }
    
    // 2. OPEN MODAL when "Add New Item" is clicked
    addItemBtn.addEventListener('click', () => {
        console.log('Add New Item clicked');
        modal.style.display = 'block';
        addItemForm.reset();
        
        // Set default values - ONLY for elements that exist
        const statusInput = document.getElementById('itemStatus');
        
        if (statusInput) statusInput.value = 'available';
        
        // Reset form to add mode
        const formTitle = modal.querySelector('h3');
        const submitBtn = modal.querySelector('.submit-btn');
        if (formTitle) formTitle.textContent = 'Add New Menu Item';
        if (submitBtn) submitBtn.textContent = 'Add Item';
        
        // Clear any edit ID
        if (addItemForm) addItemForm.removeAttribute('data-edit-id');
    });
    
    // 3. CLOSE MODAL when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // 4. CLOSE MODAL when Cancel button is clicked
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // 5. CLOSE MODAL when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 6. HANDLE FORM SUBMISSION
    if (addItemForm) {
        addItemForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Get form values - with null checks
            const itemNameInput = document.getElementById('itemName');
            const itemCategoryInput = document.getElementById('itemCategory');
            const itemPriceInput = document.getElementById('itemPrice');
            
            // Basic validation
            if (!itemNameInput || !itemNameInput.value.trim() ||
                !itemCategoryInput || !itemCategoryInput.value ||
                !itemPriceInput || !itemPriceInput.value) {
                showToast('Please fill all required fields!', 'error');
                return;
            }
            
            const itemName = itemNameInput.value.trim();
            const itemCategory = itemCategoryInput.value;
            const itemPrice = itemPriceInput.value;
            
            // Check if we're in edit mode
            const isEditMode = addItemForm.hasAttribute('data-edit-id');
            
            if (isEditMode) {
                // Find and update existing item
                const editId = parseInt(addItemForm.dataset.editId);
                const itemIndex = menuItems.findIndex(item => item.id === editId);
                
                if (itemIndex !== -1) {
                    const itemDescriptionInput = document.getElementById('itemDescription');
                    const itemStatusInput = document.getElementById('itemStatus');
                    
                    menuItems[itemIndex] = {
                        ...menuItems[itemIndex],
                        name: itemName,
                        category: itemCategory,
                        description: itemDescriptionInput ? itemDescriptionInput.value.trim() : '',
                        price: parseFloat(itemPrice),
                        status: itemStatusInput ? itemStatusInput.value : 'available'
                    };
                    
                    showToast('Item updated successfully!', 'success');
                }
            } else {
                // Create new item object
                const itemDescriptionInput = document.getElementById('itemDescription');
                const itemStatusInput = document.getElementById('itemStatus');
                
                const newItem = {
                    id: itemCounter++,
                    name: itemName,
                    category: itemCategory,
                    description: itemDescriptionInput ? itemDescriptionInput.value.trim() : '',
                    price: parseFloat(itemPrice),
                    status: itemStatusInput ? itemStatusInput.value : 'available',
                    createdAt: new Date().toISOString()
                };
                
                // Add to menu items array
                menuItems.push(newItem);
                showToast('Item added successfully!', 'success');
            }
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Close modal
            modal.style.display = 'none';
            
            // Update table
            populateMenuTable();
            updateFooterCount();
        });
    }
    
    // 7. FILTER FUNCTIONALITY
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            currentFilter = button.getAttribute('data-filter');
            
            // Update table with filtered items
            populateMenuTable();
            updateFooterCount();
        });
    });
    
    // 8. POPULATE MENU TABLE
    function populateMenuTable() {
        const tableBody = document.getElementById('menuTable');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Filter items based on current filter
        let filteredItems = menuItems;
        if (currentFilter !== 'all') {
            filteredItems = menuItems.filter(item => item.status === currentFilter);
        }
        
        // If no items, show empty message
        if (filteredItems.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="4" style="text-align: center; padding: 40px; color: #666;">
                    ${menuItems.length === 0 ? 'No menu items yet. Click "Add New Item" to get started!' : 'No items match the selected filter.'}
                </td>
            `;
            tableBody.appendChild(emptyRow);
            return;
        }
        
        // Add each item to the table
        filteredItems.forEach(item => {
            const row = document.createElement('tr');
            
            // Determine status
            let statusClass, statusText;
            switch(item.status) {
                case 'available':
                    statusClass = 'status-available';
                    statusText = 'Available';
                    break;
                case 'needrestock':
                    statusClass = 'status-restock';
                    statusText = 'Need Restock';
                    break;
                case 'hidden':
                    statusClass = 'status-hidden';
                    statusText = 'Hidden';
                    break;
                default:
                    statusClass = 'status-available';
                    statusText = 'Available';
            }
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td class="actions">
                    <button class="action-btn edit-btn" data-id="${item.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${item.id}">Delete</button>
                    <button class="action-btn toggle-btn" data-id="${item.id}" data-status="${item.status}">
                        ${item.status === 'hidden' ? 'Show' : 'Hide'}
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        addActionListeners();
    }
    
    // 9. ADD ACTION LISTENERS to Edit/Delete/Toggle buttons
    function addActionListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                const item = menuItems.find(item => item.id === itemId);
                if (item) {
                    // Open modal with item data for editing
                    modal.style.display = 'block';
                    
                    // Fill form with item data - with null checks
                    const itemNameInput = document.getElementById('itemName');
                    const itemCategoryInput = document.getElementById('itemCategory');
                    const itemDescriptionInput = document.getElementById('itemDescription');
                    const itemPriceInput = document.getElementById('itemPrice');
                    const itemStatusInput = document.getElementById('itemStatus');
                    
                    if (itemNameInput) itemNameInput.value = item.name;
                    if (itemCategoryInput) itemCategoryInput.value = item.category;
                    if (itemDescriptionInput) itemDescriptionInput.value = item.description || '';
                    if (itemPriceInput) itemPriceInput.value = item.price;
                    if (itemStatusInput) itemStatusInput.value = item.status;
                    
                    // Change form to edit mode
                    const formTitle = modal.querySelector('h3');
                    const submitBtn = modal.querySelector('.submit-btn');
                    if (formTitle) formTitle.textContent = 'Edit Menu Item';
                    if (submitBtn) submitBtn.textContent = 'Update Item';
                    
                    // Store the ID being edited on the form
                    if (addItemForm) {
                        addItemForm.dataset.editId = itemId;
                    }
                }
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                if (confirm('Are you sure you want to delete this item?')) {
                    menuItems = menuItems.filter(item => item.id !== itemId);
                    saveToLocalStorage();
                    populateMenuTable();
                    updateFooterCount();
                    showToast('Item deleted successfully!', 'success');
                }
            });
        });
        
        // Toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                const item = menuItems.find(item => item.id === itemId);
                if (item) {
                    item.status = item.status === 'hidden' ? 'available' : 'hidden';
                    saveToLocalStorage();
                    populateMenuTable();
                    updateFooterCount();
                    showToast('Item status updated!', 'success');
                }
            });
        });
    }
    
    // 10. UPDATE FOOTER COUNT
    function updateFooterCount() {
        const footer = document.getElementById('menuFooter');
        if (!footer) return;
        
        let filteredItems = menuItems;
        if (currentFilter !== 'all') {
            filteredItems = menuItems.filter(item => item.status === currentFilter);
        }
        
        footer.textContent = `Showing ${filteredItems.length} of ${menuItems.length} items`;
    }
    
    // 11. SHOW TOAST NOTIFICATION
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            console.log('Toast message:', message);
            return;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // Initialize table on load
    populateMenuTable();
    updateFooterCount();
}

// Logout function
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/login';
    }
}