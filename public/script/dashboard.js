let dashboardStats = {
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalInventoryItems: 0,
    inventoryLowStock: 0,
    inventoryOutOfStock: 0
};

function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCurrency(amount) {
    if (amount === undefined || amount === null) {
        return '₱0.00';
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
        return '₱0.00';
    }

    try {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numAmount);
    } catch (error) {
        return '₱' + numAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}

async function fetchDashboardStats() {
    try {
        console.log('Fetching dashboard stats...');

        const response = await fetch('/api/dashboard/stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch dashboard stats');
        }

        if (data.success) {
            dashboardStats = data.data;
            updateDashboardDisplay();
            console.log('Dashboard stats updated:', dashboardStats);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

function updateDashboardDisplay() {
    // Update stat cards
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalProductsEl = document.getElementById('totalProducts');
    const totalCustomersEl = document.getElementById('totalCustomers');
    const totalRevenueEl = document.getElementById('totalRevenue');

    if (totalOrdersEl) totalOrdersEl.textContent = formatNumber(dashboardStats.totalOrders || 0);
    if (totalProductsEl) totalProductsEl.textContent = formatNumber(dashboardStats.totalProducts || 0);
    if (totalCustomersEl) totalCustomersEl.textContent = formatNumber(dashboardStats.totalCustomers || 0);
    if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(dashboardStats.totalRevenue || 0);

    console.log('Dashboard display updated');
}

function debounceSearch(query) {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        performMenuSearch(query);
    }, 300);
}

function performMenuSearch(query) {
 
    console.log('Searching menu items:', query);
  
}

function showSection(section) {
 
    console.log('📱 Showing section:', section);
}

function handleLogout() {
    showLoading("Logging out...");

    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(() => {
        setTimeout(() => {
            hideLoading();
            window.location.href = '/login';
        }, 500);
    })
    .catch(error => {
        console.error('Logout error:', error);
        hideLoading();
        showToast('Logout failed', 'error');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    });
}

function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        const spinner = overlay.querySelector('.spinner');
        if (spinner) {
            spinner.textContent = message;
        }
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard page loaded');

    fetchDashboardStats();

    setInterval(fetchDashboardStats, 30000);
});

window.handleLogout = handleLogout;
window.debounceSearch = debounceSearch;
window.showSection = showSection;