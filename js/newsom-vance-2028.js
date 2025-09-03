const polls2028 = [
  {
    pollster: "Emerson College Polling",
    start_date: "2025-07-21",
    end_date: "2025-07-22",
    sample_size: 1400,
    vance: 45,
    newsom: 42,
    moe: 2.5,
    star_rating: 2.9,
    house_effect: -0.8
  },
  {
    pollster: "Emerson College Polling",
    start_date: "2025-08-25",
    end_date: "2025-08-26",
    sample_size: 1000,
    vance: 44,
    newsom: 44,
    moe: 3.0,
    star_rating: 2.9,
    house_effect: -0.8
  },
  {
    pollster: "SoCal Strategies",
    start_date: "2025-08-18",
    end_date: "2025-08-19",
    sample_size: 700,
    vance: 37,
    newsom: 39,
    moe: 3.5,
    star_rating: 1.0,
    house_effect: 2.0
  }
];

export function aggregateNewsomVance(polls) {
  let weightedVance = 0;
  let weightedNewsom = 0;
  let weightedMoe = 0;
  let totalWeight = 0;
  let latestDate = null;
  const today = new Date();

  polls.forEach(poll => {
    const bias = poll.house_effect || 0;
    const vanceAdj = poll.vance + bias;
    const newsomAdj = poll.newsom - bias;

    const daysOld = (today - new Date(poll.end_date)) / (1000 * 60 * 60 * 24);
    const weight = Math.sqrt(poll.sample_size) * (poll.star_rating / 3.0) * Math.exp(-daysOld / 90);

    weightedVance += vanceAdj * weight;
    weightedNewsom += newsomAdj * weight;
    weightedMoe += poll.moe * weight;
    totalWeight += weight;

    if (!latestDate || new Date(poll.end_date) > latestDate) {
      latestDate = new Date(poll.end_date);
    }
  });

  const vanceAvg = weightedVance / totalWeight;
  const newsomAvg = weightedNewsom / totalWeight;
  const moeAvg = weightedMoe / totalWeight;

  return {
    date: latestDate.toISOString().split('T')[0],
    vance_avg: vanceAvg,
    newsom_avg: newsomAvg,
    moe: moeAvg
  };
}

export function plotNewsomVance(data) {
  const labels = data.map(d => d.date);
  const vance = data.map(d => d.vance_avg);
  const newsom = data.map(d => d.newsom_avg);
  const moe = data.map(d => d.moe);

  const vanceUpper = data.map((d, i) => vance[i] + moe[i]);
  const vanceLower = data.map((d, i) => vance[i] - moe[i]);
  const newsomUpper = data.map((d, i) => newsom[i] + moe[i]);
  const newsomLower = data.map((d, i) => newsom[i] - moe[i]);

  const ctx = document.getElementById('newsomVanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'JD Vance',
          data: vance,
          borderColor: '#ef4444',
          backgroundColor: '#ef4444',
          tension: 0.3,
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
          order: 3
        },
        {
          label: 'Vance Upper',
          data: vanceUpper,
          borderColor: 'rgba(0,0,0,0)',
          backgroundColor: 'rgba(239,68,68,0.2)',
          fill: '-1',
          pointRadius: 0,
          borderWidth: 0,
          order: 1
        },
        {
          label: 'Vance Lower',
          data: vanceLower,
          borderColor: 'rgba(0,0,0,0)',
          backgroundColor: 'rgba(239,68,68,0.2)',
          fill: '1',
          pointRadius: 0,
          borderWidth: 0,
          order: 1
        },
        {
          label: 'Gavin Newsom',
          data: newsom,
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          tension: 0.3,
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
          order: 6
        },
        {
          label: 'Newsom Upper',
          data: newsomUpper,
          borderColor: 'rgba(0,0,0,0)',
          backgroundColor: 'rgba(59,130,246,0.2)',
          fill: '-1',
          pointRadius: 0,
          borderWidth: 0,
          order: 4
        },
        {
          label: 'Newsom Lower',
          data: newsomLower,
          borderColor: 'rgba(0,0,0,0)',
          backgroundColor: 'rgba(59,130,246,0.2)',
          fill: '1',
          pointRadius: 0,
          borderWidth: 0,
          order: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }
  });
}

// Auto-render on load with provided polls
const aggregate = aggregateNewsomVance(polls2028);
plotNewsomVance([aggregate]);
