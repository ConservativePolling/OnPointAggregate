// Global chart instance and event listeners
let chartInstance = null;
let mouseMoveListener = null;
let mouseLeaveListener = null;
let cursorX = null;
let currentChartType = 'trump';
let currentTrend1 = null;
let currentTrend2 = null;
let currentLabel1 = null;
let currentLabel2 = null;
let currentColor1 = null;
let currentColor2 = null;

// Parse dates and prepare data for chart
function parseDate(dateStr) {
    const currentYear = 2025;

    // Handle different date formats
    if (dateStr.includes('-')) {
        // Get the end date (most recent)
        const parts = dateStr.split('-');
        let endDate = parts[parts.length - 1].trim();

        // Extract month and day
        let month, day;
        if (endDate.includes('.')) {
            const dateParts = endDate.split('.');
            if (dateParts.length === 2) {
                month = dateParts[0].trim();
                day = parseInt(dateParts[1].trim());
            }
        } else if (endDate.match(/^\d+$/)) {
            // Just a day number, use the first part for month
            day = parseInt(endDate);
            const firstPart = parts[0].trim();
            month = firstPart.split('.')[0].trim();
        }

        // Convert month name to number
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

// Calculate time-weighted average with 14-day half-life
function calculateTimeWeightedAverage(pollsData, field) {
    // Group polls by pollster
    const pollsterGroups = {};
    pollsData.forEach(poll => {
        if (!pollsterGroups[poll.pollster]) {
            pollsterGroups[poll.pollster] = [];
        }
        pollsterGroups[poll.pollster].push({
            date: parseDate(poll.dates),
            value: poll[field]
        });
    });

    // Sort each pollster's polls by date
    Object.keys(pollsterGroups).forEach(pollster => {
        pollsterGroups[pollster].sort((a, b) => a.date - b.date);
    });

    // Get date range
    const allDates = pollsData.map(p => parseDate(p.dates));
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    // Calculate weighted average MULTIPLE TIMES PER DAY for extreme detail
    const result = [];
    const startTime = minDate.getTime();
    const endTime = maxDate.getTime();
    const hoursIncrement = 6; // Calculate every 6 hours for balanced squiggly detail
    const timeStep = hoursIncrement * 60 * 60 * 1000; // in milliseconds

    let currentTime = startTime;

    while (currentTime <= endTime) {
        const currentDate = new Date(currentTime);
        let totalWeight = 0;
        let weightedSum = 0;

        // For each pollster
        Object.keys(pollsterGroups).forEach(pollster => {
            const polls = pollsterGroups[pollster];

            // Get polls up to current date
            const relevantPolls = polls.filter(p => p.date <= currentDate);

            if (relevantPolls.length > 0) {
                // Calculate pollster's weighted average
                let pollsterWeight = 0;
                let pollsterWeightedSum = 0;

                relevantPolls.forEach(poll => {
                    const daysAgo = (currentDate - poll.date) / (1000 * 60 * 60 * 24);
                    // 10-day half-life for more responsive curves: weight = 0.5^(days_ago / 10)
                    const weight = Math.pow(0.5, daysAgo / 10);
                    pollsterWeight += weight;
                    pollsterWeightedSum += poll.value * weight;
                });

                const pollsterAvg = pollsterWeightedSum / pollsterWeight;

                // Most recent poll determines pollster weight in overall average
                const mostRecentPoll = relevantPolls[relevantPolls.length - 1];
                const daysAgo = (currentDate - mostRecentPoll.date) / (1000 * 60 * 60 * 24);
                const pollsterOverallWeight = Math.pow(0.5, daysAgo / 10);

                totalWeight += pollsterOverallWeight;
                weightedSum += pollsterAvg * pollsterOverallWeight;
            }
        });

        if (totalWeight > 0) {
            result.push({
                date: new Date(currentTime),
                value: weightedSum / totalWeight
            });
        }

        // Increment by 6 hours for detail
        currentTime += timeStep;
    }

    return result;
}

// Helper function to get value at specific date
function getValueAtDate(trendData, targetDate) {
    if (!trendData || trendData.length === 0) return null;

    let closest = trendData[0];
    let minDiff = Math.abs(trendData[0].date - targetDate);

    for (let i = 1; i < trendData.length; i++) {
        const diff = Math.abs(trendData[i].date - targetDate);
        if (diff < minDiff) {
            minDiff = diff;
            closest = trendData[i];
        }
    }

    return closest.value;
}

// Helper function to draw label with strong glow
function drawLabel(ctx, title, value, x, y, color, chartRight) {
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI"';
    const titleWidth = ctx.measureText(title).width;
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI"';
    const valueWidth = ctx.measureText(value).width;
    const maxWidth = Math.max(titleWidth, valueWidth);

    const padding = 8;
    const lineHeight = 15;
    const labelOffset = 15;

    // Smart positioning
    let labelX;
    if (x > chartRight - 150) {
        labelX = x - maxWidth - labelOffset;
    } else {
        labelX = x + labelOffset;
    }

    const labelY = y - lineHeight - 8;

    // Draw with glow
    ctx.textAlign = 'left';

    const isDarkMode = document.body.classList.contains('dark-mode');
    const glowColor = isDarkMode ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';

    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 25;
    ctx.globalAlpha = 1;

    // Draw title with glow
    ctx.fillStyle = color;
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI"';
    for (let i = 0; i < 4; i++) {
        ctx.fillText(title, labelX, labelY);
    }

    // Draw value with glow
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI"';
    for (let i = 0; i < 4; i++) {
        ctx.fillText(value, labelX, labelY + lineHeight + 4);
    }

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}

// Crosshair plugin (defined globally, registered once)
const crosshairPlugin = {
    id: 'crosshairPlugin',
    beforeDatasetsDraw(chart) {
        const { ctx, chartArea: { left, right, top, bottom }, scales: { y } } = chart;

        const isHouseChart = currentChartType === 'house';
        const referenceValue = isHouseChart ? 218 : 50;
        const referenceY = y.getPixelForValue(referenceValue);

        if (!Number.isNaN(referenceY) && referenceY >= top && referenceY <= bottom) {
            ctx.save();
            const isDarkMode = document.body.classList.contains('dark-mode');
            ctx.strokeStyle = isHouseChart
                ? (isDarkMode ? '#1f2937' : '#cbd5f5')
                : (isDarkMode ? '#262626' : '#d1d5db');
            ctx.lineWidth = 1.5;
            ctx.setLineDash(isHouseChart ? [6, 6] : [5, 5]);
            ctx.beginPath();
            ctx.moveTo(left, referenceY);
            ctx.lineTo(right, referenceY);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }
    },
    afterDatasetsDraw(chart) {
        const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;

        if (cursorX !== null && cursorX >= left && cursorX <= right) {
            ctx.save();

            // Draw vertical dashed line
            const isDarkMode = document.body.classList.contains('dark-mode');
            ctx.strokeStyle = isDarkMode ? '#404040' : '#9ca3af';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(cursorX, top);
            ctx.lineTo(cursorX, bottom);
            ctx.stroke();
            ctx.setLineDash([]);

            // Get date at cursor position
            const dateValue = x.getValueForPixel(cursorX);
            const date = new Date(dateValue);

            // Draw date at top with strong background
            ctx.textAlign = 'center';
            ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI"';
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dateText = `${monthNames[date.getMonth()]} ${date.getDate()}`;

            const textMetrics = ctx.measureText(dateText);
            const textWidth = textMetrics.width;
            const textHeight = 22;
            const padding = 12;
            const topPosition = 10;

            // Draw background
            ctx.fillStyle = isDarkMode ? '#0a0a0a' : '#ffffff';
            ctx.fillRect(
                cursorX - textWidth / 2 - padding,
                topPosition,
                textWidth + padding * 2,
                textHeight + padding
            );

            // Draw text
            ctx.fillStyle = isDarkMode ? '#737373' : '#6b7280';
            ctx.fillText(dateText, cursorX, topPosition + 20);

            // Find values at cursor position
            const value1 = getValueAtDate(currentTrend1, date);
            const value2 = getValueAtDate(currentTrend2, date);
            const isHouseChart = currentChartType === 'house';

            const formatValueForDisplay = (value) => {
                if (value === null || value === undefined) {
                    return '';
                }
                if (isHouseChart) {
                    return Math.round(value).toString();
                }
                return value.toFixed(1) + '%';
            };

            // Calculate positions
            const yPos1 = value1 !== null ? y.getPixelForValue(value1) : null;
            const yPos2 = value2 !== null ? y.getPixelForValue(value2) : null;

            // Adjust positions to prevent overlap
            const minDistance = 40;
            let adjustedY1 = yPos1;
            let adjustedY2 = yPos2;

            if (yPos1 !== null && yPos2 !== null) {
                const distance = Math.abs(yPos1 - yPos2);

                if (distance < minDistance) {
                    // Labels would overlap - need to adjust spacing
                    // Use centered spacing around the midpoint
                    const midpoint = (yPos1 + yPos2) / 2;

                    // Position both labels around the midpoint
                    // The one with higher value gets the upper position (lower Y)
                    if (value1 > value2) {
                        // value1 is leading - put it on top
                        adjustedY1 = midpoint - minDistance / 2;
                        adjustedY2 = midpoint + minDistance / 2;
                    } else {
                        // value2 is leading - put it on top
                        adjustedY2 = midpoint - minDistance / 2;
                        adjustedY1 = midpoint + minDistance / 2;
                    }
                }
            }

            // Draw filled circles on trendlines
            if (value1 !== null && currentColor1) {
                ctx.beginPath();
                ctx.arc(cursorX, yPos1, 5, 0, 2 * Math.PI);
                ctx.fillStyle = currentColor1.line;
                ctx.fill();
            }

            if (value2 !== null && currentColor2) {
                ctx.beginPath();
                ctx.arc(cursorX, yPos2, 5, 0, 2 * Math.PI);
                ctx.fillStyle = currentColor2.line;
                ctx.fill();
            }

            // Draw labels - ALWAYS draw leader last (so it appears on top)
            if (value1 !== null && value2 !== null && currentColor1 && currentColor2) {
                const labelColor1 = isDarkMode ? currentColor1.labelDark : currentColor1.label;
                const labelColor2 = isDarkMode ? currentColor2.labelDark : currentColor2.label;
                const formattedValue1 = formatValueForDisplay(value1);
                const formattedValue2 = formatValueForDisplay(value2);

                // ALWAYS draw the non-leader first, then the leader
                // This ensures the leader's label appears on top in the canvas
                if (value1 > value2) {
                    // value1 is leader - draw value2 first, then value1 on top
                    drawLabel(ctx, currentLabel2, formattedValue2, cursorX, adjustedY2, labelColor2, right);
                    drawLabel(ctx, currentLabel1, formattedValue1, cursorX, adjustedY1, labelColor1, right);
                } else {
                    // value2 is leader - draw value1 first, then value2 on top
                    drawLabel(ctx, currentLabel1, formattedValue1, cursorX, adjustedY1, labelColor1, right);
                    drawLabel(ctx, currentLabel2, formattedValue2, cursorX, adjustedY2, labelColor2, right);
                }
            } else {
                // Only one value exists
                if (value1 !== null && currentColor1) {
                    const labelColor = isDarkMode ? currentColor1.labelDark : currentColor1.label;
                    drawLabel(ctx, currentLabel1, formatValueForDisplay(value1), cursorX, adjustedY1, labelColor, right);
                }
                if (value2 !== null && currentColor2) {
                    const labelColor = isDarkMode ? currentColor2.labelDark : currentColor2.label;
                    drawLabel(ctx, currentLabel2, formatValueForDisplay(value2), cursorX, adjustedY2, labelColor, right);
                }
            }

            ctx.restore();
        }
    }
};

// Register the plugin once
Chart.register(crosshairPlugin);

// Main build chart function
function buildChart(type, pollsData) {
    // Destroy existing chart if it exists
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const canvas = document.getElementById('approvalChart');
    const ctx = canvas.getContext('2d');
    const isHouse = type === 'house';

    // Define field names and colors based on type
    let field1, field2, label1, label2, color1, color2;

    if (type === 'trump') {
        field1 = 'approve';
        field2 = 'disapprove';
        label1 = 'Approve';
        label2 = 'Disapprove';
        color1 = {
            scatter: 'rgba(167, 243, 208, 0.5)',
            scatterHover: 'rgba(167, 243, 208, 0.7)',
            line: '#10b981',
            ci: 'rgba(16, 185, 129, 0.3)',
            ciFill: 'rgba(16, 185, 129, 0.25)',
            label: '#059669',
            labelDark: '#34d399'
        };
        color2 = {
            scatter: 'rgba(251, 207, 232, 0.5)',
            scatterHover: 'rgba(251, 207, 232, 0.7)',
            line: '#f472b6',
            ci: 'rgba(244, 114, 182, 0.3)',
            ciFill: 'rgba(244, 114, 182, 0.25)',
            label: '#ec4899',
            labelDark: '#fb7185'
        };
    } else if (type === 'ballot') {
        // ballot - darker, richer colors
        field1 = 'dem';
        field2 = 'gop';
        label1 = 'Democrats';
        label2 = 'Republicans';
        color1 = {
            scatter: 'rgba(96, 165, 250, 0.5)',
            scatterHover: 'rgba(96, 165, 250, 0.7)',
            line: '#2563eb',
            ci: 'rgba(37, 99, 235, 0.3)',
            ciFill: 'rgba(37, 99, 235, 0.25)',
            label: '#1e40af',
            labelDark: '#60a5fa'
        };
        color2 = {
            scatter: 'rgba(248, 113, 113, 0.5)',
            scatterHover: 'rgba(248, 113, 113, 0.7)',
            line: '#dc2626',
            ci: 'rgba(220, 38, 38, 0.3)',
            ciFill: 'rgba(220, 38, 38, 0.25)',
            label: '#b91c1c',
            labelDark: '#f87171'
        };
    } else {
        // house - seat projections (use ballot data, convert to seats)
        field1 = 'dem';
        field2 = 'gop';
        label1 = 'Democratic Seats';
        label2 = 'Republican Seats';
        color1 = {
            scatter: 'rgba(96, 165, 250, 0.5)',
            scatterHover: 'rgba(96, 165, 250, 0.7)',
            line: '#2563eb',
            ci: 'rgba(37, 99, 235, 0.3)',
            ciFill: 'rgba(37, 99, 235, 0.25)',
            label: '#1e40af',
            labelDark: '#60a5fa'
        };
        color2 = {
            scatter: 'rgba(248, 113, 113, 0.5)',
            scatterHover: 'rgba(248, 113, 113, 0.7)',
            line: '#dc2626',
            ci: 'rgba(220, 38, 38, 0.3)',
            ciFill: 'rgba(220, 38, 38, 0.25)',
            label: '#b91c1c',
            labelDark: '#f87171'
        };
    }

    // Prepare chart data
    const data1 = pollsData.map(poll => ({
        x: parseDate(poll.dates),
        y: poll[field1],
        pollster: poll.pollster,
        dates: poll.dates,
        sample: poll.sample,
        type: poll.type
    }));

    const data2 = pollsData.map(poll => ({
        x: parseDate(poll.dates),
        y: poll[field2],
        pollster: poll.pollster,
        dates: poll.dates,
        sample: poll.sample,
        type: poll.type
    }));

    // Calculate trend lines using actual methodology
    let trend1 = calculateTimeWeightedAverage(pollsData, field1);
    let trend2 = calculateTimeWeightedAverage(pollsData, field2);

    // Convert to seat projections if type is 'house'
    if (isHouse && window.convertBallotTrendToSeats) {
        const seatProjections = window.convertBallotTrendToSeats(trend1, trend2);
        trend1 = seatProjections.demSeats;
        trend2 = seatProjections.repSeats;
    }

    // Store trends and colors globally for crosshair plugin
    currentTrend1 = trend1;
    currentTrend2 = trend2;
    currentLabel1 = label1;
    currentLabel2 = label2;
    currentColor1 = color1;
    currentColor2 = color2;
    currentChartType = type;

    // Create confidence interval data (1.5 point margin) - skip for house projections
    const upper1 = isHouse ? [] : trend1.map(d => ({ x: d.date, y: d.value + 1.5 }));
    const lower1 = isHouse ? [] : trend1.map(d => ({ x: d.date, y: d.value - 1.5 }));
    const upper2 = isHouse ? [] : trend2.map(d => ({ x: d.date, y: d.value + 1.5 }));
    const lower2 = isHouse ? [] : trend2.map(d => ({ x: d.date, y: d.value - 1.5 }));

    // Configure Y-axis bounds dynamically for house projections
    let yAxisMin = 30;
    let yAxisMax = 65;
    let yAxisStep = 5;
    let yAxisFormatter = (value) => value + '%';

    if (isHouse) {
        const allValues = [...trend1, ...trend2].map(point => point.value);
        const majorityLine = 218;

        if (allValues.length > 0) {
            const minValue = Math.min(...allValues, majorityLine);
            const maxValue = Math.max(...allValues, majorityLine);
            const padding = 5;

            yAxisMin = Math.floor((minValue - padding) / 5) * 5;
            yAxisMax = Math.ceil((maxValue + padding) / 5) * 5;

            // Ensure the band is wide enough and sensible
            yAxisMin = Math.max(150, yAxisMin);
            yAxisMax = Math.min(280, yAxisMax);
            if (yAxisMax - yAxisMin < 30) {
                const mid = (yAxisMax + yAxisMin) / 2;
                yAxisMin = Math.floor((mid - 15) / 5) * 5;
                yAxisMax = Math.ceil((mid + 15) / 5) * 5;
            }
        } else {
            yAxisMin = 180;
            yAxisMax = 260;
        }

        yAxisStep = 5;
        yAxisFormatter = (value) => Math.round(value);
    }

    // Create chart
    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: label1,
                    data: data1,
                    backgroundColor: color1.scatter,
                    borderColor: 'transparent',
                    borderWidth: 0,
                    pointRadius: isHouse ? 0 : 5,
                    pointHoverRadius: isHouse ? 0 : 7,
                    pointHoverBackgroundColor: color1.scatterHover,
                    pointHoverBorderColor: 'transparent',
                    pointHoverBorderWidth: 0,
                    order: 2
                },
                {
                    label: label2,
                    data: data2,
                    backgroundColor: color2.scatter,
                    borderColor: 'transparent',
                    borderWidth: 0,
                    pointRadius: isHouse ? 0 : 5,
                    pointHoverRadius: isHouse ? 0 : 7,
                    pointHoverBackgroundColor: color2.scatterHover,
                    pointHoverBorderColor: 'transparent',
                    pointHoverBorderWidth: 0,
                    order: 2
                },
                {
                    label: label1 + ' CI Upper',
                    data: upper1,
                    type: 'line',
                    borderColor: color1.ci,
                    backgroundColor: color1.ciFill,
                    borderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: '+1',
                    tension: 0.3,
                    cubicInterpolationMode: 'default',
                    spanGaps: false,
                    order: 3
                },
                {
                    label: label1 + ' CI Lower',
                    data: lower1,
                    type: 'line',
                    borderColor: color1.ci,
                    backgroundColor: color1.ciFill,
                    borderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false,
                    tension: 0.3,
                    cubicInterpolationMode: 'default',
                    spanGaps: false,
                    order: 3
                },
                {
                    label: label2 + ' CI Upper',
                    data: upper2,
                    type: 'line',
                    borderColor: color2.ci,
                    backgroundColor: color2.ciFill,
                    borderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: '+1',
                    tension: 0.3,
                    cubicInterpolationMode: 'default',
                    spanGaps: false,
                    order: 3
                },
                {
                    label: label2 + ' CI Lower',
                    data: lower2,
                    type: 'line',
                    borderColor: color2.ci,
                    backgroundColor: color2.ciFill,
                    borderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false,
                    tension: 0.3,
                    cubicInterpolationMode: 'default',
                    spanGaps: false,
                    order: 3
                },
                {
                    label: label1 + ' Trend',
                    data: trend1.map(d => ({ x: d.date, y: d.value })),
                    type: 'line',
                    borderColor: color1.line,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false,
                    tension: 0.3,
                    cubicInterpolationMode: 'default',
                    spanGaps: false,
                    order: 1
                },
                {
                    label: label2 + ' Trend',
                    data: trend2.map(d => ({ x: d.date, y: d.value })),
                    type: 'line',
                    borderColor: color2.line,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false,
                    tension: 0.3,
                    cubicInterpolationMode: 'default',
                    spanGaps: false,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: 3,
            interaction: {
                mode: 'nearest',
                axis: 'xy',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false,
                    filter: function(tooltipItem) {
                        // Hide confidence interval datasets from tooltip
                        return !tooltipItem.dataset.label.includes('CI');
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'MMM'
                        }
                    },
                    title: {
                        display: false
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: '600',
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                        },
                        color: '#374151',
                        padding: 10
                    }
                },
                y: {
                    min: yAxisMin,
                    max: yAxisMax,
                    title: {
                        display: false
                    },
                    grid: {
                        display: true,
                        drawOnChartArea: false,
                        drawTicks: true,
                        tickLength: 8,
                        color: '#e5e7eb'
                    },
                    border: {
                        display: true,
                        color: '#d1d5db',
                        width: 1
                    },
                    ticks: {
                        callback: function(value) {
                            return yAxisFormatter(value);
                        },
                        font: {
                            size: 13,
                            weight: '700',
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                        },
                        color: '#374151',
                        padding: 8,
                        stepSize: yAxisStep
                    }
                }
            }
        }
    });

    // Remove old event listeners if they exist
    if (mouseMoveListener) {
        canvas.removeEventListener('mousemove', mouseMoveListener);
    }
    if (mouseLeaveListener) {
        canvas.removeEventListener('mouseleave', mouseLeaveListener);
    }

    // Create new event listeners
    mouseMoveListener = (event) => {
        const rect = canvas.getBoundingClientRect();
        cursorX = event.clientX - rect.left;
        if (chartInstance) {
            chartInstance.update('none');
        }
    };

    mouseLeaveListener = () => {
        cursorX = null;
        if (chartInstance) {
            chartInstance.update('none');
        }
    };

    // Add new event listeners
    canvas.addEventListener('mousemove', mouseMoveListener);
    canvas.addEventListener('mouseleave', mouseLeaveListener);

    // Update current stats
    updateCurrentStats(type, trend1, trend2, label1, label2);
}

// Update current stats based on latest trend
function updateCurrentStats(type, trend1, trend2, label1, label2) {
    const latest1 = trend1[trend1.length - 1];
    const latest2 = trend2[trend2.length - 1];

    if (latest1 && latest2) {
        let value1, value2, value1Numeric, value2Numeric;

        if (type === 'house') {
            // Seat counts - whole numbers, no % sign
            value1Numeric = Math.round(latest1.value);
            value2Numeric = Math.round(latest2.value);
            value1 = value1Numeric.toString();
            value2 = value2Numeric.toString();
        } else {
            // Percentages - one decimal place with % sign
            value1Numeric = parseFloat(latest1.value.toFixed(1));
            value2Numeric = parseFloat(latest2.value.toFixed(1));
            value1 = value1Numeric + '%';
            value2 = value2Numeric + '%';
        }

        // Update stat cards
        document.querySelector('.stat-card.approve .stat-value').textContent = value1;
        document.querySelector('.stat-card.disapprove .stat-value').textContent = value2;

        // Update labels
        document.querySelector('.stat-card.approve .stat-label').textContent = label1.toUpperCase();
        document.querySelector('.stat-card.disapprove .stat-label').textContent = label2.toUpperCase();

        // Update header percentage
        const approvalPercentage = document.querySelector('.approval-percentage');
        const approvalText = document.querySelector('.approval-text');
        if (approvalPercentage) {
            approvalPercentage.classList.remove('disapprove', 'gop');
            approvalPercentage.textContent = value1;
        }
        if (approvalText) {
            approvalText.classList.remove('disapprove', 'gop');
            approvalText.textContent = label1.toLowerCase();
        }

        // Store current values globally (as numbers for calculations)
        if (type === 'trump') {
            window.currentApprovalData = {
                approve: value1Numeric,
                disapprove: value2Numeric
            };
        } else if (type === 'ballot') {
            window.currentBallotData = {
                dem: value1Numeric,
                gop: value2Numeric
            };
        } else if (type === 'house') {
            window.currentHouseData = {
                dem: value1Numeric,
                rep: value2Numeric
            };
        }
    }

    // Update seat projection if in ballot mode
    if (type === 'ballot' && window.updateSeatProjection) {
        // Delay to ensure chart data is fully rendered
        setTimeout(() => {
            window.updateSeatProjection();
        }, 100);
    }
}

// Export buildChart globally
window.buildChart = buildChart;

// Initialize with Trump data - will be called after DOM is ready
window.initializeChart = function() {
    // Use filtered data if available, otherwise use all data
    const initialData = window.getFilteredPolls ? window.getFilteredPolls(pollsData) : pollsData;
    buildChart('trump', initialData);
};
