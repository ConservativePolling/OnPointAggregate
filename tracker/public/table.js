let currentSort = {
    column: 'date',
    direction: 'desc'
};

let activeFilters = {
    RV: true,
    LV: true,
    A: true
};

let currentData = pollsData;
let currentType = 'trump';
let selectedPollsterFilter = null;

// Parse date function (shared with chart)
function parseDate(dateStr) {
    const currentYear = 2025;

    if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        let endDate = parts[parts.length - 1].trim();

        let month, day;
        if (endDate.includes('.')) {
            const dateParts = endDate.split('.');
            if (dateParts.length === 2) {
                month = dateParts[0].trim();
                day = parseInt(dateParts[1].trim());
            }
        } else if (endDate.match(/^\d+$/)) {
            day = parseInt(endDate);
            const firstPart = parts[0].trim();
            month = firstPart.split('.')[0].trim();
        }

        const monthMap = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };

        const monthNum = monthMap[month];
        if (monthNum !== undefined && day) {
            return new Date(currentYear, monthNum, day);
        }
    }

    return new Date();
}

// Update table function
function updateTable(type) {
    currentType = type;
    currentData = type === 'trump' ? pollsData : ballotData;

    // Clear pollster filter when switching aggregates
    selectedPollsterFilter = null;

    // Update table headers
    const headers = document.querySelectorAll('#pollsTable thead th');
    if (type === 'trump') {
        headers[4].innerHTML = 'Approve <span class="sort-arrow">↓</span>';
        headers[4].dataset.sort = 'approve';
        headers[5].innerHTML = 'Disapprove';
        headers[5].dataset.sort = 'disapprove';
    } else {
        headers[4].innerHTML = 'Dem <span class="sort-arrow">↓</span>';
        headers[4].dataset.sort = 'dem';
        headers[5].innerHTML = 'GOP';
        headers[5].dataset.sort = 'gop';
    }

    // Reset sort to date when switching
    currentSort = {
        column: 'date',
        direction: 'desc'
    };

    renderTable();
}

// Render table
function renderTable() {
    const tbody = document.getElementById('pollsTableBody');
    tbody.innerHTML = '';

    // Filter polls using shared function
    let filteredPolls = getFilteredPolls(currentData);

    // Define field names based on type
    const field1 = currentType === 'trump' ? 'approve' : 'dem';
    const field2 = currentType === 'trump' ? 'disapprove' : 'gop';

    // Sort polls
    filteredPolls.sort((a, b) => {
        let aVal, bVal;

        switch (currentSort.column) {
            case 'date':
                aVal = parseDate(a.dates).getTime();
                bVal = parseDate(b.dates).getTime();
                break;
            case 'sample':
                aVal = a.sample;
                bVal = b.sample;
                break;
            case 'pollster':
                aVal = a.pollster.toLowerCase();
                bVal = b.pollster.toLowerCase();
                break;
            case 'sponsor':
                aVal = a.sponsor.toLowerCase();
                bVal = b.sponsor.toLowerCase();
                break;
            case 'approve':
            case 'dem':
                aVal = a[field1];
                bVal = b[field1];
                break;
            case 'disapprove':
            case 'gop':
                aVal = a[field2];
                bVal = b[field2];
                break;
            default:
                return 0;
        }

        if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Render rows
    filteredPolls.forEach(poll => {
        const row = document.createElement('tr');

        // Calculate color intensity based on the actual percentage value
        const isDarkMode = document.body.classList.contains('dark-mode');
        const minOpacity = isDarkMode ? 0.08 : 0.15;
        const maxOpacity = isDarkMode ? 0.25 : 0.35;

        // Map percentage to opacity (30% -> min opacity, 60% -> max opacity)
        const value1 = poll[field1];
        const value2 = poll[field2];

        const intensity1 = minOpacity + ((value1 - 30) / 30) * (maxOpacity - minOpacity);
        const intensity2 = minOpacity + ((value2 - 30) / 30) * (maxOpacity - minOpacity);

        // Clamp values between min and max
        const opacity1 = Math.max(minOpacity, Math.min(maxOpacity, intensity1));
        const opacity2 = Math.max(minOpacity, Math.min(maxOpacity, intensity2));

        // Define colors based on type
        let color1, color2, cellClass1, cellClass2;

        if (currentType === 'trump') {
            color1 = 'rgba(16, 185, 129, ';  // Green for approve
            color2 = 'rgba(236, 72, 153, ';   // Pink for disapprove
            cellClass1 = 'approve-cell';
            cellClass2 = 'disapprove-cell';
        } else {
            color1 = 'rgba(37, 99, 235, ';    // Darker blue for Dem
            color2 = 'rgba(220, 38, 38, ';    // Darker red for GOP
            cellClass1 = 'dem-cell';
            cellClass2 = 'gop-cell';
        }

        row.innerHTML = `
            <td class="date-cell">${poll.dates}</td>
            <td>
                ${poll.sample > 0 ? poll.sample.toLocaleString() : '-'}
                <span class="sample-badge">${poll.type}</span>
            </td>
            <td class="pollster-cell">${poll.pollster}</td>
            <td>${poll.sponsor}</td>
            <td class="${cellClass1}" style="background-color: ${color1}${opacity1})">${value1}%</td>
            <td class="${cellClass2}" style="background-color: ${color2}${opacity2})">${value2}%</td>
        `;

        tbody.appendChild(row);
    });

    // Update sort indicators
    document.querySelectorAll('.sortable').forEach(th => {
        th.classList.remove('active');
        const arrow = th.querySelector('.sort-arrow');
        if (arrow) arrow.textContent = '↓';
    });

    const activeTh = document.querySelector(`[data-sort="${currentSort.column}"]`);
    if (activeTh) {
        activeTh.classList.add('active');
        const arrow = activeTh.querySelector('.sort-arrow');
        if (arrow) {
            arrow.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
        }
    }
}

// Handle sort
document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => {
        const column = th.dataset.sort;

        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'desc';
        }

        renderTable();
    });
});

// Get filtered polls based on active filters and pollster filter
function getFilteredPolls(data) {
    return data.filter(poll => {
        // Filter by sample type (RV, LV, A)
        if (!activeFilters[poll.type]) return false;

        // Filter by pollster if selected
        if (selectedPollsterFilter && poll.pollster !== selectedPollsterFilter) return false;

        return true;
    });
}

// Export for use by other modules
window.getFilteredPolls = getFilteredPolls;
window.activeFilters = activeFilters;

// Handle filters
document.getElementById('filterRV').addEventListener('change', (e) => {
    activeFilters.RV = e.target.checked;
    renderTable();
    renderPollBox();
    rebuildChartWithFilters();
});

document.getElementById('filterLV').addEventListener('change', (e) => {
    activeFilters.LV = e.target.checked;
    renderTable();
    renderPollBox();
    rebuildChartWithFilters();
});

document.getElementById('filterA').addEventListener('change', (e) => {
    activeFilters.A = e.target.checked;
    renderTable();
    renderPollBox();
    rebuildChartWithFilters();
});

// Rebuild chart with current filters
function rebuildChartWithFilters() {
    if (window.buildChart) {
        const filteredData = getFilteredPolls(currentData);
        window.buildChart(currentType, filteredData);
    }
}

// Filter table by pollster
function filterTableByPollster(pollster) {
    selectedPollsterFilter = pollster;
    renderTable();
    renderPollBox();
}

// Render poll box with visual bars
function renderPollBox() {
    const tbody = document.getElementById('pollBoxTableBody');
    const table = document.getElementById('pollBoxTable');

    if (!tbody || !table) {
        console.error('Poll box elements not found!', { tbody, table });
        return; // Exit if elements don't exist yet
    }

    console.log('Rendering poll box with', currentData.length, 'polls');
    tbody.innerHTML = '';

    // Filter polls using shared function
    let filteredPolls = getFilteredPolls(currentData);

    // Define field names based on type
    const field1 = currentType === 'trump' ? 'approve' : 'dem';
    const field2 = currentType === 'trump' ? 'disapprove' : 'gop';

    // Always sort by date descending (latest first) for poll box
    filteredPolls.sort((a, b) => {
        const aVal = parseDate(a.dates).getTime();
        const bVal = parseDate(b.dates).getTime();
        return bVal - aVal; // Descending order
    });

    // Update table headers based on type
    const headers = table.querySelectorAll('thead th');
    if (headers.length >= 6) {
        if (currentType === 'trump') {
            headers[4].textContent = 'Approve';
            headers[5].textContent = 'Disapprove';
        } else {
            headers[4].textContent = 'Dem';
            headers[5].textContent = 'GOP';
        }
    }

    // Render rows
    filteredPolls.forEach(poll => {
        const row = document.createElement('tr');

        // Get values
        const value1 = poll[field1];
        const value2 = poll[field2];

        // Calculate bar widths (scale 0-100% to represent 0-100% of votes)
        const barWidth1 = `${value1}%`;
        const barWidth2 = `${value2}%`;

        // Define classes based on type
        let barClass1, barClass2;

        if (currentType === 'trump') {
            barClass1 = 'poll-approve-bar';
            barClass2 = 'poll-disapprove-bar';
        } else {
            barClass1 = 'poll-dem-bar';
            barClass2 = 'poll-gop-bar';
        }

        row.innerHTML = `
            <td class="poll-date-cell">${poll.dates}</td>
            <td class="poll-sample-cell">
                <span class="poll-sample-number">${poll.sample > 0 ? poll.sample.toLocaleString() : '-'}</span>
                <span class="poll-sample-badge">${poll.type}</span>
            </td>
            <td class="poll-pollster-cell">${poll.pollster}</td>
            <td class="poll-sponsor-cell">${poll.sponsor || '-'}</td>
            <td class="poll-bar-cell ${barClass1}">
                <div class="poll-bar-bg" style="width: ${barWidth1}"></div>
                <div class="poll-bar-content">${value1}%</div>
            </td>
            <td class="poll-bar-cell ${barClass2}">
                <div class="poll-bar-bg" style="width: ${barWidth2}"></div>
                <div class="poll-bar-content">${value2}%</div>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Update both tables when aggregate type changes
function updateBothTables(type) {
    updateTable(type);
    renderPollBox();
}

// Export functions globally
window.updateTable = updateBothTables; // Use wrapper to update both tables
window.filterTableByPollster = filterTableByPollster;

// Initial render - ensure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderTable();
        renderPollBox();
    });
} else {
    renderTable();
    renderPollBox();
}
