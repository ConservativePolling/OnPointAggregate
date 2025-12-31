// Pollster filter functionality
(function() {
    const filterToggle = document.getElementById('filterToggle');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterSearch = document.getElementById('filterSearch');
    const filterSuggestions = document.getElementById('filterSuggestions');

    let selectedPollster = null;
    let allPollsters = [];

    // Toggle dropdown
    filterToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = filterDropdown.classList.contains('open');

        if (!isOpen) {
            // Show dropdown and focus search
            filterDropdown.classList.add('open');
            filterToggle.classList.add('active');
            setTimeout(() => filterSearch.focus(), 100);
        } else {
            // Close dropdown
            closeDropdown();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!filterToggle.contains(e.target) && !filterDropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    // Close dropdown function
    function closeDropdown() {
        filterDropdown.classList.remove('open');
        filterToggle.classList.remove('active');
        filterSuggestions.classList.remove('show');
    }

    // Search functionality - show suggestions as user types
    filterSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();

        if (searchTerm.length === 0) {
            // Hide suggestions when search is empty
            filterSuggestions.classList.remove('show');
            return;
        }

        // Get unique pollsters
        allPollsters = getUniquePollsters();

        // Filter pollsters by search term
        const filtered = allPollsters.filter(pollster =>
            pollster.toLowerCase().includes(searchTerm)
        );

        // Show suggestions
        showSuggestions(filtered);
    });

    // Get unique pollsters from current dataset
    function getUniquePollsters() {
        const currentType = window.currentAggregate ? window.currentAggregate() : 'trump';
        const data = currentType === 'ballot' ? ballotData : pollsData;

        const pollstersSet = new Set();
        data.forEach(poll => {
            if (poll.pollster) {
                pollstersSet.add(poll.pollster);
            }
        });

        return Array.from(pollstersSet).sort();
    }

    // Show suggestions dropdown
    function showSuggestions(pollsters) {
        filterSuggestions.innerHTML = '';

        if (pollsters.length === 0) {
            filterSuggestions.classList.remove('show');
            return;
        }

        // Add pollster suggestions
        pollsters.forEach(pollster => {
            const item = document.createElement('div');
            item.className = 'filter-suggestion-item';
            item.textContent = pollster;

            if (selectedPollster === pollster) {
                item.classList.add('selected');
            }

            item.addEventListener('click', () => selectPollster(pollster));
            filterSuggestions.appendChild(item);
        });

        // Add clear filter option if a pollster is selected
        if (selectedPollster) {
            const clearItem = document.createElement('div');
            clearItem.className = 'filter-suggestion-clear';
            clearItem.textContent = 'Clear filter';
            clearItem.addEventListener('click', clearFilter);
            filterSuggestions.appendChild(clearItem);
        }

        filterSuggestions.classList.add('show');
    }

    // Select a pollster
    function selectPollster(pollster) {
        selectedPollster = pollster;
        filterSearch.value = pollster;
        closeDropdown();
        applyFilter();
    }

    // Clear filter
    function clearFilter() {
        selectedPollster = null;
        filterSearch.value = '';
        closeDropdown();
        applyFilter();
    }

    // Apply filter to chart and table
    function applyFilter() {
        const currentType = window.currentAggregate ? window.currentAggregate() : 'trump';
        const data = currentType === 'ballot' ? ballotData : pollsData;

        // First apply pollster filter
        let filteredData = selectedPollster
            ? data.filter(poll => poll.pollster === selectedPollster)
            : data;

        // Then apply RV/LV/A filters if getFilteredPolls is available
        if (window.getFilteredPolls) {
            filteredData = window.getFilteredPolls(filteredData);
        }

        // Rebuild chart with filtered data
        if (window.buildChart) {
            window.buildChart(currentType, filteredData);
        }

        // Filter table
        if (window.filterTableByPollster) {
            window.filterTableByPollster(selectedPollster);
        }
    }

    // Clear filter function (for external use)
    function clearFilterState() {
        selectedPollster = null;
        filterSearch.value = '';
        filterSuggestions.classList.remove('show');
        filterDropdown.classList.remove('open');
        filterToggle.classList.remove('active');
    }

    // Export functions
    window.getSelectedPollster = () => selectedPollster;
    window.reapplyPollsterFilter = applyFilter;
    window.clearPollsterFilter = clearFilterState;
})();
