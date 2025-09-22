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

if (typeof Chart !== "undefined") {
  Chart.defaults.color = "#e2e8f0";
  Chart.defaults.font.family = "'Inter','system-ui','sans-serif'";
  Chart.defaults.font.size = 13;
}

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

  if (totalWeight === 0 || !latestDate) {
    return {
      date: null,
      vance_avg: 0,
      newsom_avg: 0,
      moe: 0
    };
  }

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
  const labels = data.map(d => formatDate(d.date));
  const vance = data.map(d => d.vance_avg);
  const newsom = data.map(d => d.newsom_avg);
  const moe = data.map(d => d.moe);

  const vanceUpper = data.map((d, i) => vance[i] + moe[i]);
  const vanceLower = data.map((d, i) => vance[i] - moe[i]);
  const newsomUpper = data.map((d, i) => newsom[i] + moe[i]);
  const newsomLower = data.map((d, i) => newsom[i] - moe[i]);

  const canvas = document.getElementById('newsomVanceChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'JD Vance',
          data: vance,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.2)',
          fill: false,
          borderWidth: 2.2,
          pointRadius: 3.5,
          pointHoverRadius: 5,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#0f172a',
          order: 3
        },
        {
          label: 'Vance Upper',
          data: vanceUpper,
          borderColor: 'rgba(0,0,0,0)',
          backgroundColor: 'rgba(239,68,68,0.18)',
          fill: '-1',
          pointRadius: 0,
          borderWidth: 0,
          order: 1
        },
        {
          label: 'Vance Lower',
          data: vanceLower,
          borderColor: 'rgba(0,0,0,0)',
          backgroundColor: 'rgba(239,68,68,0.18)',
          fill: '1',
          pointRadius: 0,
          borderWidth: 0,
          order: 1
        },
        {
          label: 'Gavin Newsom',
          data: newsom,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56,189,248,0.2)',
          fill: false,
          borderWidth: 2.2,
          pointRadius: 3.5,
          pointHoverRadius: 5,
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#0f172a',
          order: 6
        },
        {
          label: 'Newsom Upper',
          data: newsomUpper,
          borderColor: 'rgba(0,0,0,0)',
          backgroundColor: 'rgba(56,189,248,0.18)',
          fill: '-1',
          pointRadius: 0,
          borderWidth: 0,
          order: 4
        },
        {
          label: 'Newsom Lower',
          data: newsomLower,
          borderColor: 'rgba(0,0,0,0)',
          backgroundColor: 'rgba(56,189,248,0.18)',
          fill: '1',
          pointRadius: 0,
          borderWidth: 0,
          order: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      layout: {
        padding: {
          top: 16,
          right: 24,
          bottom: 16,
          left: 12
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#e2e8f0',
            usePointStyle: true,
            padding: 18
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.92)',
          borderColor: 'rgba(148,163,184,0.25)',
          borderWidth: 1,
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0'
        }
      },
      elements: {
        line: {
          tension: 0.35
        }
      },
      scales: {
        x: {
          ticks: { color: 'rgba(226,232,240,0.9)' },
          grid: { color: 'rgba(148,163,184,0.18)' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: 'rgba(226,232,240,0.9)' },
          grid: { color: 'rgba(148,163,184,0.18)' }
        }
      }
    }
  });
}

function hydrateSnapshot(snapshot, polls) {
  const dateEl = document.getElementById('aggregateDate');
  if (dateEl) {
    dateEl.textContent = formatDate(snapshot.date);
  }

  const vanceEl = document.getElementById('vanceAverage');
  if (vanceEl) vanceEl.textContent = snapshot.vance_avg.toFixed(1);

  const newsomEl = document.getElementById('newsomAverage');
  if (newsomEl) newsomEl.textContent = snapshot.newsom_avg.toFixed(1);

  const moeEl = document.getElementById('moeValue');
  if (moeEl) moeEl.textContent = `±${snapshot.moe.toFixed(1)}`;

  const margin = snapshot.vance_avg - snapshot.newsom_avg;
  const marginEl = document.getElementById('marginValue');
  if (marginEl) {
    const sign = margin > 0 ? '+' : margin < 0 ? '−' : '';
    marginEl.textContent = `${sign}${Math.abs(margin).toFixed(1)}`;
  }

  const descriptor = document.getElementById('marginDescriptor');
  const badge = document.getElementById('leadingBadge');
  const badgeText = document.getElementById('leadingText');
  if (descriptor && badge && badgeText) {
    badge.classList.remove(
      'border-emerald-400/40',
      'bg-emerald-500/10',
      'text-emerald-200',
      'border-rose-400/40',
      'bg-rose-500/10',
      'text-rose-200',
      'border-slate-400/40',
      'bg-slate-500/10',
      'text-slate-200'
    );

    if (margin > 0) {
      descriptor.textContent = `Vance leads by ${Math.abs(margin).toFixed(1)} pts after weighting.`;
      badgeText.textContent = 'Vance Advantage';
      badge.classList.add('border-emerald-400/40', 'bg-emerald-500/10', 'text-emerald-200');
    } else if (margin < 0) {
      descriptor.textContent = `Newsom leads by ${Math.abs(margin).toFixed(1)} pts after weighting.`;
      badgeText.textContent = 'Newsom Advantage';
      badge.classList.add('border-rose-400/40', 'bg-rose-500/10', 'text-rose-200');
    } else {
      descriptor.textContent = 'The matchup is effectively tied right now.';
      badgeText.textContent = 'Even Race';
      badge.classList.add('border-slate-400/40', 'bg-slate-500/10', 'text-slate-200');
    }
  }

  const pollCount = document.getElementById('pollCountValue');
  if (pollCount) pollCount.textContent = polls.length.toString();

  const totalSample = polls.reduce((sum, poll) => sum + (poll.sample_size || 0), 0);
  const sampleEl = document.getElementById('totalSampleValue');
  if (sampleEl) sampleEl.textContent = formatNumber(totalSample);
}

function formatDate(isoDate) {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatNumber(value) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

const sortedPolls = [...polls2028].sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
const aggregatedTimeline = sortedPolls.map((_, idx) => aggregateNewsomVance(sortedPolls.slice(0, idx + 1)));

if (aggregatedTimeline.length) {
  plotNewsomVance(aggregatedTimeline);
  hydrateSnapshot(aggregatedTimeline[aggregatedTimeline.length - 1], sortedPolls);
} else {
  plotNewsomVance([]);
}
