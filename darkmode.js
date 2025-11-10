// Dark Mode Toggle Functionality
const darkModeToggle = document.getElementById('darkModeToggle');

// Check for saved user preference, otherwise use system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Initialize dark mode
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
    updateChartColors(true);
    // Note: Table will render with correct colors when renderTable() is called initially
}

// Toggle dark mode
darkModeToggle.addEventListener('change', () => {
    const isDarkMode = darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);

    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Update chart colors
    updateChartColors(isDarkMode);

    // Re-render table to update dynamic colors
    if (typeof renderTable === 'function') {
        renderTable();
    }
});

// Function to update chart colors for dark mode
function updateChartColors(isDarkMode) {
    if (typeof window.chart !== 'undefined') {
        // Update axis colors
        window.chart.options.scales.x.ticks.color = isDarkMode ? '#a3a3a3' : '#374151';
        window.chart.options.scales.x.grid.color = isDarkMode ? '#1a1a1a' : '#e5e7eb';

        window.chart.options.scales.y.ticks.color = isDarkMode ? '#a3a3a3' : '#374151';
        window.chart.options.scales.y.grid.color = isDarkMode ? '#1a1a1a' : '#e5e7eb';
        window.chart.options.scales.y.border.color = isDarkMode ? '#262626' : '#d1d5db';

        // Update dataset colors
        // Approve scatter points
        window.chart.data.datasets[0].backgroundColor = isDarkMode ? 'rgba(52, 211, 153, 0.15)' : 'rgba(167, 243, 208, 0.5)';
        window.chart.data.datasets[0].pointHoverBackgroundColor = isDarkMode ? 'rgba(52, 211, 153, 0.5)' : 'rgba(167, 243, 208, 0.7)';

        // Disapprove scatter points
        window.chart.data.datasets[1].backgroundColor = isDarkMode ? 'rgba(251, 113, 133, 0.15)' : 'rgba(251, 207, 232, 0.5)';
        window.chart.data.datasets[1].pointHoverBackgroundColor = isDarkMode ? 'rgba(251, 113, 133, 0.5)' : 'rgba(251, 207, 232, 0.7)';

        // Approve CI Upper
        window.chart.data.datasets[2].borderColor = isDarkMode ? 'rgba(52, 211, 153, 0.3)' : 'rgba(16, 185, 129, 0.3)';
        window.chart.data.datasets[2].backgroundColor = isDarkMode ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.25)';

        // Approve CI Lower
        window.chart.data.datasets[3].borderColor = isDarkMode ? 'rgba(52, 211, 153, 0.3)' : 'rgba(16, 185, 129, 0.3)';
        window.chart.data.datasets[3].backgroundColor = isDarkMode ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.25)';

        // Disapprove CI Upper
        window.chart.data.datasets[4].borderColor = isDarkMode ? 'rgba(251, 113, 133, 0.3)' : 'rgba(244, 114, 182, 0.3)';
        window.chart.data.datasets[4].backgroundColor = isDarkMode ? 'rgba(251, 113, 133, 0.2)' : 'rgba(244, 114, 182, 0.25)';

        // Disapprove CI Lower
        window.chart.data.datasets[5].borderColor = isDarkMode ? 'rgba(251, 113, 133, 0.3)' : 'rgba(244, 114, 182, 0.3)';
        window.chart.data.datasets[5].backgroundColor = isDarkMode ? 'rgba(251, 113, 133, 0.2)' : 'rgba(244, 114, 182, 0.25)';

        // Approve trend line
        window.chart.data.datasets[6].borderColor = isDarkMode ? '#34d399' : '#10b981';

        // Disapprove trend line
        window.chart.data.datasets[7].borderColor = isDarkMode ? '#fb7185' : '#f472b6';

        // Update chart
        window.chart.update('none');
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const isDarkMode = e.matches;
        document.body.classList.toggle('dark-mode', isDarkMode);
        darkModeToggle.checked = isDarkMode;
        updateChartColors(isDarkMode);
        if (typeof renderTable === 'function') {
            renderTable();
        }
    }
});
