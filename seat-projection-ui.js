// Seat Projection UI Handler
(function() {
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsDropdown = document.getElementById('settingsDropdown');
    const showSeatsToggle = document.getElementById('showSeatsToggle');
    const seatProjectionSection = document.getElementById('seatProjection');
    const demSeatsDisplay = document.getElementById('demSeats');
    const repSeatsDisplay = document.getElementById('repSeats');

    let isBallotMode = false;

    // Toggle settings dropdown
    settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = settingsDropdown.classList.contains('open');

        if (!isOpen) {
            settingsDropdown.classList.add('open');
            settingsToggle.classList.add('active');
        } else {
            closeDropdown();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsToggle.contains(e.target) && !settingsDropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    function closeDropdown() {
        settingsDropdown.classList.remove('open');
        settingsToggle.classList.remove('active');
    }

    // Handle "Show Seat Projection" toggle
    showSeatsToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            // Show seat projection
            seatProjectionSection.style.display = 'block';
            // Update projection
            if (window.updateSeatProjection) {
                window.updateSeatProjection();
            }
        } else {
            // Hide seat projection
            seatProjectionSection.style.display = 'none';
        }
    });

    // Listen for seat projection updates
    document.addEventListener('seatProjectionUpdated', (e) => {
        const projection = e.detail;
        updateSeatDisplay(projection);
    });

    // Update seat display
    function updateSeatDisplay(projection) {
        if (!projection) return;

        demSeatsDisplay.textContent = projection.democrat;
        repSeatsDisplay.textContent = projection.republican;

        // Add winner class to the party with majority
        const demCard = demSeatsDisplay.closest('.seat-card');
        const repCard = repSeatsDisplay.closest('.seat-card');

        demCard.classList.remove('majority');
        repCard.classList.remove('majority');

        if (projection.democrat > 217) {
            demCard.classList.add('majority');
        } else if (projection.republican > 217) {
            repCard.classList.add('majority');
        }
    }

    // Show/hide settings button and manage seat projection based on aggregate type
    function handleAggregateSwitch(aggregateType) {
        isBallotMode = (aggregateType === 'ballot');

        if (isBallotMode) {
            // Show settings button when in ballot mode
            settingsToggle.style.display = 'flex';

            // If seat projection checkbox is checked, show projection
            if (showSeatsToggle.checked && window.updateSeatProjection) {
                seatProjectionSection.style.display = 'block';
                window.updateSeatProjection();
            }
        } else {
            // Hide settings button when not in ballot mode
            settingsToggle.style.display = 'none';
            // Also hide seat projection
            seatProjectionSection.style.display = 'none';
            // Close dropdown if open
            closeDropdown();
        }
    }

    // Export function for aggregate switcher to use
    window.toggleSeatProjectionDisplay = handleAggregateSwitch;

    // Initialize based on current aggregate
    const currentAgg = window.currentAggregate ? window.currentAggregate() : 'trump';
    handleAggregateSwitch(currentAgg);
})();
