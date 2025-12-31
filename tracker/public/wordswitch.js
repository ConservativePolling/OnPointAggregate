// Word switching animation for approve/disapprove and Dems/GOP
(function() {
    let approvalInterval = null;
    let ballotInterval = null;
    let isApprove = true;
    let isDem = true;

    function switchApprovalWord() {
        const approvalWord = document.getElementById('approvalWord');
        const approvalText = document.querySelector('.approval-text');
        const approvalPercentage = document.querySelector('.approval-percentage');

        if (!approvalWord) return;

        // Get current percentages from global data
        const approvePercentage = window.currentApprovalData?.approve || '44.9%';
        const disapprovePercentage = window.currentApprovalData?.disapprove || '51.5%';

        // Add pop animation to word
        approvalWord.classList.add('pop');

        // Add pop animation to percentage display
        if (approvalPercentage) {
            approvalPercentage.classList.add('pop');
        }

        // Change word and color after a brief delay
        setTimeout(() => {
            if (isApprove) {
                // Switch to disapprove
                approvalWord.textContent = 'disapprove';
                approvalWord.classList.add('disapprove');
                if (approvalText) approvalText.textContent = 'disapprove';
                if (approvalPercentage) {
                    approvalPercentage.textContent = disapprovePercentage;
                    approvalPercentage.classList.add('disapprove');
                }
            } else {
                // Switch to approve
                approvalWord.textContent = 'approve';
                approvalWord.classList.remove('disapprove');
                if (approvalText) approvalText.textContent = 'approve';
                if (approvalPercentage) {
                    approvalPercentage.textContent = approvePercentage;
                    approvalPercentage.classList.remove('disapprove');
                }
            }
            isApprove = !isApprove;
        }, 200);

        // Remove pop animation class after animation completes
        setTimeout(() => {
            approvalWord.classList.remove('pop');
            if (approvalPercentage) {
                approvalPercentage.classList.remove('pop');
            }
        }, 400);
    }

    function switchBallotWord() {
        const ballotWord = document.getElementById('ballotWord');
        const approvalText = document.querySelector('.approval-text');
        const approvalPercentage = document.querySelector('.approval-percentage');

        if (!ballotWord) return;

        // Get current percentages from global data
        const demPercentage = window.currentBallotData?.dem || '45.0%';
        const gopPercentage = window.currentBallotData?.gop || '43.0%';

        // Add pop animation to word
        ballotWord.classList.add('pop');

        // Add pop animation to percentage display
        if (approvalPercentage) {
            approvalPercentage.classList.add('pop');
        }

        // Change word and color after a brief delay
        setTimeout(() => {
            if (isDem) {
                // Switch to GOP
                ballotWord.textContent = 'Republicans';
                ballotWord.classList.add('gop');
                if (approvalText) approvalText.textContent = 'gop';
                if (approvalPercentage) {
                    approvalPercentage.textContent = gopPercentage;
                    approvalPercentage.classList.add('gop');
                }
            } else {
                // Switch to Dem
                ballotWord.textContent = 'Democrats';
                ballotWord.classList.remove('gop');
                if (approvalText) approvalText.textContent = 'dem';
                if (approvalPercentage) {
                    approvalPercentage.textContent = demPercentage;
                    approvalPercentage.classList.remove('gop');
                }
            }
            isDem = !isDem;
        }, 200);

        // Remove pop animation class after animation completes
        setTimeout(() => {
            ballotWord.classList.remove('pop');
            if (approvalPercentage) {
                approvalPercentage.classList.remove('pop');
            }
        }, 400);
    }

    function startApprovalSwitching() {
        // Stop ballot switching if running
        if (ballotInterval) {
            clearInterval(ballotInterval);
            ballotInterval = null;
        }
        // Start approval switching
        if (!approvalInterval) {
            approvalInterval = setInterval(switchApprovalWord, 10000);
        }
    }

    function startBallotSwitching() {
        // Stop approval switching if running
        if (approvalInterval) {
            clearInterval(approvalInterval);
            approvalInterval = null;
        }
        // Start ballot switching
        if (!ballotInterval) {
            ballotInterval = setInterval(switchBallotWord, 10000);
        }
    }

    function stopAllSwitching() {
        if (approvalInterval) {
            clearInterval(approvalInterval);
            approvalInterval = null;
        }
        if (ballotInterval) {
            clearInterval(ballotInterval);
            ballotInterval = null;
        }
    }

    // Export functions for use by aggregate-switcher
    window.approvalWordSwitch = startApprovalSwitching;
    window.ballotWordSwitch = startBallotSwitching;
    window.stopWordSwitching = stopAllSwitching;

    // Start approval switching by default
    startApprovalSwitching();
})();
