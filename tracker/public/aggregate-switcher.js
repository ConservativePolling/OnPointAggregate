// Aggregate switching functionality
(function() {
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const customDropdown = document.querySelector('.custom-dropdown');
    const selectedText = document.getElementById('selectedText');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    let currentAggregate = 'trump';

    // Store original title and subtitle
    const headerText = document.querySelector('.header-text h1');
    const subtitleText = document.querySelector('.subtitle');
    const presidentApproval = document.querySelector('.president-approval');
    const presidentImage = document.querySelector('.president-image');
    const originalTrumpTitle = headerText.innerHTML;
    const originalTrumpSubtitle = subtitleText.textContent;

    // Toggle dropdown
    dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        customDropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!customDropdown.contains(e.target)) {
            customDropdown.classList.remove('open');
        }
    });

    // Handle item selection
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const value = item.dataset.value;
            const title = item.querySelector('.item-title').textContent;

            // Update selected text
            selectedText.textContent = title;

            // Update active state
            dropdownItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Close dropdown
            customDropdown.classList.remove('open');

            // Switch aggregate
            switchAggregate(value);
        });
    });

    function switchAggregate(type) {
        currentAggregate = type;

        // Clear pollster filter when switching aggregates
        if (window.clearPollsterFilter) {
            window.clearPollsterFilter();
        }

        if (presidentApproval) {
            presidentApproval.classList.remove('house-mode');
        }
        if (presidentImage) {
            presidentImage.style.display = '';
        }

        if (type === 'ballot') {
            // Switch to generic ballot
            headerText.innerHTML = 'Do Americans want <span id="ballotWord" class="ballot-word">Democrats</span> in Congress?';
            subtitleText.textContent = 'Live, time-weighted average of support for Democrats vs. Republicans in the 2026 congressional elections.';

            // Hide Trump image and percentage
            if (presidentApproval) {
                presidentApproval.style.display = 'none';
            }

            // Rebuild chart with ballot data (filtered by active RV/LV/A filters)
            const filteredBallotData = window.getFilteredPolls ? window.getFilteredPolls(ballotData) : ballotData;
            window.buildChart('ballot', filteredBallotData);

            // Start ballot word switching
            if (window.ballotWordSwitch) {
                window.ballotWordSwitch();
            }
        } else if (type === 'house') {
            // Switch to house projection
            headerText.innerHTML = 'Who will control the <span id="houseWord" class="house-word">House</span> in 2026?';
            subtitleText.textContent = 'Projected seat counts based on district-level uniform swing model applied to generic ballot polling.';

            // Repurpose approval display for seat counts
            if (presidentApproval) {
                presidentApproval.style.display = 'flex';
                presidentApproval.classList.add('house-mode');
            }
            if (presidentImage) {
                presidentImage.style.display = 'none';
            }

            // Rebuild chart with ballot data converted to seats (filtered by active RV/LV/A filters)
            const filteredHouseData = window.getFilteredPolls ? window.getFilteredPolls(ballotData) : ballotData;
            window.buildChart('house', filteredHouseData);

            // Stop word switching animations while in seat mode
            if (window.stopWordSwitching) {
                window.stopWordSwitching();
            }
        } else {
            // Switch to Trump approval
            headerText.innerHTML = originalTrumpTitle;
            subtitleText.textContent = originalTrumpSubtitle;

            // Show Trump image and percentage
            if (presidentApproval) {
                presidentApproval.style.display = 'flex';
            }
            if (presidentImage) {
                presidentImage.style.display = '';
            }

            // Rebuild chart with Trump data (filtered by active RV/LV/A filters)
            const filteredTrumpData = window.getFilteredPolls ? window.getFilteredPolls(pollsData) : pollsData;
            window.buildChart('trump', filteredTrumpData);

            // Restart approval word switching
            if (window.approvalWordSwitch) {
                window.approvalWordSwitch();
            }
        }

        // Update table - use ballot data for house projection
        if (window.updateTable) {
            const tableType = (type === 'house') ? 'ballot' : type;
            window.updateTable(tableType);
        }

        // Toggle seat projection display
        if (window.toggleSeatProjectionDisplay) {
            window.toggleSeatProjectionDisplay(type);
        }
    }

    // Initialize
    window.switchAggregate = switchAggregate;
    window.currentAggregate = () => currentAggregate;
})();
