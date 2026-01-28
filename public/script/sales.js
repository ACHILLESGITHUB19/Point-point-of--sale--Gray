document.addEventListener('DOMContentLoaded', function() {
    loadSalesData();
    setupEventListeners();
});

function loadSalesData() {
    try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        if (orders.length === 0) {
            showNoDataMessage();
            return;
        }
        
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.timestamp).toDateString();
            return orderDate === today;
        });
        
        updateSalesCards(todayOrders);
        updateCategoryChart(todayOrders);
        updateProductPerformance(todayOrders);
    } catch (error) {
        console.error('Error loading sales data:', error);
    }
}

function showNoDataMessage() {
    const categoryList = document.querySelector('.category-list');
    const tableBody = document.querySelector('.products-table tbody');
    
    if (categoryList) {
        categoryList.innerHTML = '<div class="no-data">No sales data available</div>';
    }
    
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="3" class="no-data">No product data available</td></tr>';
    }
    
    const cards = document.querySelectorAll('.summary-card');
    if (cards[0]) cards[0].querySelector('.amount').textContent = '₱0.00';
    if (cards[1]) cards[1].querySelector('.amount').textContent = '0';
    if (cards[2]) cards[2].querySelector('.amount').textContent = '₱0.00';
}

function updateSalesCards(orders) {
    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgOrder = orders.length > 0 ? totalSales / orders.length : 0;
    
    const cards = document.querySelectorAll('.summary-card');
    if (cards[0]) cards[0].querySelector('.amount').textContent = `₱${totalSales.toFixed(2)}`;
    if (cards[1]) cards[1].querySelector('.amount').textContent = orders.length;
    if (cards[2]) cards[2].querySelector('.amount').textContent = `₱${avgOrder.toFixed(2)}`;
}

function updateCategoryChart(orders) {
    const categories = {};
    
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const category = item.category || 'Uncategorized';
                if (!categories[category]) {
                    categories[category] = { count: 0, total: 0 };
                }
                categories[category].count += item.quantity || 1;
                categories[category].total += (item.price || 0) * (item.quantity || 1);
            });
        }
    });
    
    const categoryList = document.querySelector('.category-list');
    if (categoryList) {
        categoryList.innerHTML = '';
        Object.entries(categories).forEach(([category, data]) => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <span>${category}</span>
                <strong>₱${data.total.toFixed(2)}</strong>
            `;
            categoryList.appendChild(categoryItem);
        });
    }
}

function updateProductPerformance(orders) {
    const products = {};
    
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const name = item.name || 'Unknown';
                if (!products[name]) {
                    products[name] = { quantity: 0, revenue: 0 };
                }
                products[name].quantity += item.quantity || 1;
                products[name].revenue += (item.price || 0) * (item.quantity || 1);
            });
        }
    });
    
    const sorted = Object.entries(products)
        .sort(([,a], [,b]) => b.revenue - a.revenue)
        .slice(0, 10);
    
    const tableBody = document.querySelector('.products-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        sorted.forEach(([name, data]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${name}</td>
                <td>${data.quantity}</td>
                <td>₱${data.revenue.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function setupEventListeners() {
    const periodSelects = document.querySelectorAll('.period-select');
    periodSelects.forEach(select => {
        select.addEventListener('change', function() {
            loadSalesData();
        });
    });
    
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportSalesReport();
        });
    }
    
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadSalesData();
        });
    }
}

function exportSalesReport() {
    try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const dataStr = JSON.stringify(orders, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    } catch (error) {
        console.error('Error exporting report:', error);
        alert('Failed to export report');
    }
}