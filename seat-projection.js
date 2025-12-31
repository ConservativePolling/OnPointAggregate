// House Seat Projection Model
// District-level uniform swing model based on 2024 results

(function() {
    // 2024 baseline data
    const BASELINE_2024_MARGIN = -2.6;  // R+2.6 in 2024 national popular vote

    let useGerrymanderingAdjustment = false;

    /**
     * Project seats using district-level uniform swing model
     * @param {number} currentGenericBallot - Current generic ballot margin (D positive, R negative)
     * @returns {object} Projection with seat counts and flipped districts
     */
    function projectSeatsDistrictLevel(currentGenericBallot) {
        if (!window.districts2024 || districts2024.length === 0) {
            console.error('District data not loaded');
            return { democrat: 215, republican: 220, flipped: [] };
        }

        // Calculate swing from 2024 baseline
        const swing = currentGenericBallot - BASELINE_2024_MARGIN;

        let demSeats = 0;
        let repSeats = 0;
        const flippedDistricts = [];

        // Apply uniform swing to each district
        districts2024.forEach(district => {
            // Apply swing to district margin
            const newMargin = district.margin + swing;
            const newWinner = newMargin > 0 ? 'D' : 'R';

            // Count seats
            if (newWinner === 'D') {
                demSeats++;
            } else {
                repSeats++;
            }

            // Track flipped districts
            if (newWinner !== district.winner) {
                flippedDistricts.push({
                    id: district.id,
                    state: district.state,
                    district: district.district,
                    oldWinner: district.winner,
                    newWinner: newWinner,
                    oldMargin: district.margin,
                    newMargin: newMargin
                });
            }
        });

        return {
            democrat: demSeats,
            republican: repSeats,
            demMargin: currentGenericBallot,
            swing: swing,
            flipped: flippedDistricts,
            totalDistricts: districts2024.length
        };
    }

    /**
     * Get the current generic ballot margin from ballot data
     * @returns {number} Democratic margin (positive = D lead, negative = R lead)
     */
    function getCurrentGenericBallotMargin() {
        // Use the current ballot data from chart if available
        if (window.currentBallotData) {
            return window.currentBallotData.dem - window.currentBallotData.gop;
        }

        // Fallback: use most recent poll from ballotData (array is reverse chronological)
        if (window.ballotData && ballotData.length > 0) {
            const latest = ballotData[0];
            return latest.dem - latest.gop;
        }

        return 0;
    }

    /**
     * Toggle gerrymandering adjustment
     */
    function toggleGerrymandering(enabled) {
        useGerrymanderingAdjustment = enabled;
        updateProjection();
    }

    /**
     * Update seat projection based on current data
     */
    function updateProjection() {
        const demMargin = getCurrentGenericBallotMargin();
        const projection = projectSeatsDistrictLevel(demMargin);

        // Store projection globally for other components to access
        window.currentSeatProjection = projection;

        // Dispatch event for UI to update
        const event = new CustomEvent('seatProjectionUpdated', { detail: projection });
        document.dispatchEvent(event);

        return projection;
    }

    /**
     * Convert ballot trend data (Dem%, GOP%) to seat projection time series
     * @param {Array} demTrend - Array of {date, value} for Dem %
     * @param {Array} gopTrend - Array of {date, value} for GOP %
     * @returns {Object} {demSeats: [{date, value}], repSeats: [{date, value}]}
     */
    function convertBallotTrendToSeats(demTrend, gopTrend) {
        if (!demTrend || !gopTrend || demTrend.length !== gopTrend.length) {
            console.error('Invalid trend data for seat projection');
            return { demSeats: [], repSeats: [] };
        }

        const demSeatsTimeSeries = [];
        const repSeatsTimeSeries = [];

        // For each time point, calculate seat projection
        for (let i = 0; i < demTrend.length; i++) {
            const demPct = demTrend[i].value;
            const gopPct = gopTrend[i].value;
            const margin = demPct - gopPct;
            const date = demTrend[i].date;

            // Project seats at this point in time
            const projection = projectSeatsDistrictLevel(margin);

            demSeatsTimeSeries.push({
                date: date,
                value: projection.democrat
            });

            repSeatsTimeSeries.push({
                date: date,
                value: projection.republican
            });
        }

        return {
            demSeats: demSeatsTimeSeries,
            repSeats: repSeatsTimeSeries
        };
    }

    // Export functions globally
    window.projectSeatsDistrictLevel = projectSeatsDistrictLevel;
    window.getCurrentGenericBallotMargin = getCurrentGenericBallotMargin;
    window.toggleGerrymandering = toggleGerrymandering;
    window.updateSeatProjection = updateProjection;
    window.convertBallotTrendToSeats = convertBallotTrendToSeats;
    window.currentSeatProjection = null;
})();
