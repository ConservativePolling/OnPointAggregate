        // **Constants**
        const MS_PER_DAY = 24 * 60 * 60 * 1000;
        const POLL_QUALITY_WEIGHTS = {
            'A+': 1.0, 'A': 0.95, 'A-': 0.9, 'B+': 0.85, 'B': 0.8, 'B-': 0.75,
            'C+': 0.7, 'C': 0.65, 'C-': 0.6, 'D+': 0.55, 'D': 0.5, 'D-': 0.45, 'F': 0.4
        };
        const HALF_LIFE = 15; 
        const DEFAULT_Y_MIN = 20;
        const DEFAULT_Y_MAX = 60;
        const MINI_CHART_Y_MIN = 30; 
        const MINI_CHART_Y_MAX = 70; 
        
        const FIRST_TERM_END_DATE = new Date('2021-01-20T23:59:59Z'); 
        const BIDEN_TERM_END_DATE = new Date('2025-01-20T23:59:59Z'); 
        const ELECTION_END_DATE_2024 = new Date('2024-11-04T23:59:59Z');
        const MAX_POLLS_PER_AGGREGATE = 10000;
        const SPATIAL_GRID_SIZE = 50;
        
        // Sampling and rendering constants
        const MIN_SAMPLING_INTERVAL = 1; // Minimum days between samples
        const MAX_SAMPLING_INTERVAL = 30; // Maximum days between samples
        const PROGRESSIVE_RENDER_CHUNK_SIZE = 100;
        
        // --- Data Definitions ---
        const AGGREGATES = [
            { 
                id: 'trump', name: 'Trump Approval', shortName: 'Trump Approval', category: 'National', isRace: false, 
                candidates: ['Approve', 'Disapprove'], pollFields: ['approve', 'disapprove'], 
                colors: ['var(--approve-color)', 'var(--disapprove-color)'], directColors: ['#4ade80', '#ff3d71'], 
                colorGlow: ['var(--approve-color-glow)', 'var(--disapprove-color-glow)'], directGlowColors: ['rgba(74,222,128,0.4)', 'rgba(255,61,113,0.4)'], 
                lineClasses: ['approve-line', 'disapprove-line'],
                firstTermPolls: [ 
   { pollster: "Rasmussen Reports", date: "2025-07-22", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },                  
{ pollster: "Rasmussen Reports", date: "2021-01-19", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-18", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-15", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-13", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-12", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-11", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-08", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-07", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-06", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-05", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-31", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-30", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-29", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-23", sampleSize: 1500, approve: 45, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-22", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-21", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-18", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-17", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-16", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-15", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-14", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-11", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-10", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-09", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-08", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-07", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-04", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-03", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-02", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-01", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-30", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-25", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-24", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-23", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-20", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-19", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-18", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-17", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-16", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-13", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-12", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-11", sampleSize: 1500, approve: 53, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-10", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-09", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-06", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-05", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-04", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-03", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-02", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-30", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-29", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-28", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-27", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-26", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-23", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-22", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-21", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-20", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-19", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-16", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-15", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-14", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-13", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-12", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-09", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-08", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-07", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-06", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-05", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-02", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-01", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-30", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-29", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-28", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-25", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-24", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-23", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-22", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-21", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-18", sampleSize: 1500, approve: 53, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-17", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-16", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-15", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-14", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-11", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-10", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-09", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-08", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-07", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-04", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-03", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-02", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-01", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-31", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-28", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-27", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-26", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-25", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-24", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-21", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-20", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-19", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-18", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-17", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-14", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-13", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-12", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-11", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-10", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-07", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-06", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-05", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-04", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-03", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-31", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-30", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-29", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-28", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-27", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-24", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-23", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-22", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-21", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-20", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-17", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-16", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-15", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-14", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-13", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-10", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-09", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-08", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-07", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-06", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-03", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-02", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-01", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-30", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-29", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-26", sampleSize: 1500, approve: 44, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-25", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-24", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-23", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-22", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-19", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-18", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-17", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-16", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-15", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-12", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-11", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-10", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-09", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-08", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-05", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-04", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-03", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-02", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-01", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-29", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-28", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-27", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-26", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-25", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-22", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-21", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-20", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-19", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-18", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-15", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-14", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-13", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-12", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-11", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-08", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-07", sampleSize: 1500, approve: 49, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-06", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-05", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-04", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-01", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-30", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-29", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-28", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-27", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-24", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-23", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-22", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-21", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-20", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-17", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-16", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-15", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-14", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-13", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-10", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-09", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-08", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-07", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-06", sampleSize: 1500, approve: 44, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-03", sampleSize: 1500, approve: 44, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-02", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-01", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-31", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-30", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-27", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-26", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-25", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-24", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-23", sampleSize: 1500, approve: 45, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-20", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-19", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-18", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-17", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-16", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-13", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-12", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-11", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-10", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-09", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-06", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-05", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-04", sampleSize: 1500, approve: 48, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-03", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-02", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-28", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-27", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-26", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-25", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-24", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-21", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-20", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-19", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-18", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-17", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-14", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-13", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-12", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-11", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-10", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-07", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-06", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-05", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-04", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-03", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-31", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-30", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-29", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-28", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-27", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-24", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-23", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-22", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-21", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-20", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-17", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-16", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-15", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-14", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-13", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-10", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-09", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-08", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-07", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-06", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-03", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-31", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-30", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-27", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-24", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-23", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-20", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-19", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-18", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-17", sampleSize: 1500, approve: 48, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-16", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-13", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-12", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-11", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-10", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-09", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-06", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-05", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-04", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-03", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-02", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-26", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-25", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-22", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-21", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-20", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-19", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-18", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-15", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-14", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-13", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-12", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-11", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-08", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-07", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-06", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-05", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-04", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-01", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-31", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-30", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-29", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-28", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-25", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-24", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-23", sampleSize: 1500, approve: 44, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-22", sampleSize: 1500, approve: 45, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-21", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-18", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-17", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-16", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-15", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-14", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-11", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-10", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-09", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-08", sampleSize: 1500, approve: 45, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-07", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-04", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-03", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-02", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-01", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-30", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-27", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-26", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-25", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-24", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-23", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-20", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-19", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-18", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-17", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-16", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-13", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-12", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-11", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-10", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-09", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-06", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-05", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-04", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-03", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-02", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-30", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-29", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-28", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-27", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-26", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-23", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-22", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-21", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-20", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-19", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-16", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-15", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-14", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-13", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-12", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-09", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-08", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-07", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-06", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-05", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-02", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-01", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-31", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-30", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-29", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-26", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-25", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-24", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-23", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-22", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-19", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-18", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-17", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-16", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-15", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-12", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-11", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-10", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-09", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-08", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-03", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-02", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-01", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-28", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-27", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-26", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-25", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-24", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-21", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-20", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-19", sampleSize: 1500, approve: 47, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-18", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-17", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-14", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-13", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-12", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-11", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-10", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-07", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-06", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-05", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-04", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-03", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-31", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-30", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-29", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-28", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-27", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-24", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-23", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-22", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-21", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-20", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-17", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-16", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-15", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-14", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-13", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-10", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-09", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-08", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-07", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-06", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-03", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-02", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-01", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-30", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-29", sampleSize: 1500, approve: 48, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-26", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-25", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-24", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-23", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-22", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-19", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-18", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-17", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-16", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-15", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-12", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-11", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-10", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-09", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-08", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-05", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-04", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-03", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-02", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-01", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-29", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-28", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-27", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-26", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-25", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-22", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-21", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-20", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-19", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-18", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-15", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-14", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-13", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-12", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-11", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-08", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-07", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-06", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-05", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-04", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-01", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-28", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-27", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-26", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-25", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-22", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-21", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-20", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-19", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-18", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-15", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-14", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-13", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-12", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-11", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-08", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-07", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-06", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-05", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-04", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-01", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-31", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-30", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-29", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-28", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-25", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-24", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-23", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-22", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-21", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-18", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-17", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-16", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-15", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-14", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-11", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-10", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-09", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-08", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-07", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-04", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-03", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-28", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-27", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-21", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-20", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-19", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-18", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-17", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-14", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-13", sampleSize: 1500, approve: 49, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-12", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-11", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-10", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-07", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-06", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-05", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-04", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-03", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-30", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-29", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-28", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-27", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-21", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-20", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-19", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-16", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-15", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-14", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-13", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-12", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-09", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-08", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-07", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-06", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-05", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-02", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-01", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-31", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-30", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-29", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-26", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-25", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-24", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-23", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-22", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-19", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-18", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-17", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-16", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-15", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-12", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-11", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-10", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-09", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-08", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-05", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-04", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-03", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-02", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-01", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-28", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-27", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-26", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-25", sampleSize: 1500, approve: 47, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-24", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-21", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-20", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-19", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-18", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-17", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-14", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-13", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-12", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-11", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-10", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-07", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-06", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-05", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-04", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-31", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-30", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-29", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-28", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-27", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-24", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-23", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-22", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-21", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-20", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-17", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-16", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-15", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-14", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-13", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-10", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-09", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-08", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-07", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-06", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-03", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-02", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-01", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-31", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-30", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-27", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-26", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-25", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-24", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-23", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-20", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-19", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-18", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-17", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-16", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-13", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-12", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-11", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-10", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-09", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-06", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-03", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-02", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-29", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-28", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-27", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-26", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-25", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-22", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-21", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-20", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-19", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-18", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-15", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-14", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-13", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-12", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-11", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-08", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-07", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-06", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-05", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-04", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-01", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-31", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-30", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-29", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-28", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-25", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-24", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-23", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-22", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-21", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-18", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-17", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-16", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-15", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-14", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-11", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-10", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-09", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-08", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-07", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-04", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-03", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-02", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-01", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-30", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-27", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-26", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-25", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-24", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-23", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-20", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-19", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-18", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-17", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-16", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-13", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-12", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-11", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-10", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-09", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-06", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-05", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-04", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-03", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-02", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-30", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-29", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-28", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-27", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-26", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-23", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-22", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-21", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-20", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-19", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-16", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-15", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-14", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-13", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-12", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-09", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-08", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-07", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-06", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-05", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-02", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-01", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-28", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-27", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-26", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-23", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-22", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-21", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-20", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-19", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-16", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-15", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-14", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-13", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-12", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-09", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-08", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-07", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-06", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-05", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-02", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-01", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-31", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-30", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-29", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-26", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-25", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-24", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-23", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-22", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-19", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-18", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-17", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-16", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-15", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-12", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-11", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-10", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-09", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-08", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-05", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-04", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-03", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-29", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-28", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-27", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-22", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-21", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-20", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-19", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-18", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-15", sampleSize: 1500, approve: 40, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-14", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-13", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-12", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-11", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-08", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-07", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-06", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-05", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-04", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-01", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-30", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-29", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-28", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-27", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-22", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-21", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-20", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-17", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-16", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-15", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-14", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-13", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-10", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-09", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-08", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-07", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-06", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-03", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-02", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-01", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-31", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-30", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-27", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-26", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-25", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-24", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-23", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-20", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-19", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-18", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-17", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-16", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-13", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-12", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-11", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-10", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-09", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-06", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-05", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-04", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-03", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-02", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-29", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-28", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-27", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-26", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-25", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-22", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-21", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-20", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-19", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-18", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-15", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-14", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-13", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-12", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-11", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-08", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-07", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-06", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-05", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-01", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-31", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-30", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-29", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-28", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-25", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-24", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-23", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-22", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-21", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-18", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-17", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-16", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-15", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-14", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-11", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-10", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-09", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-08", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-07", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-04", sampleSize: 1500, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-03", sampleSize: 1500, approve: 39, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-02", sampleSize: 1500, approve: 38, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-01", sampleSize: 1500, approve: 39, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-31", sampleSize: 1500, approve: 39, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-28", sampleSize: 1500, approve: 41, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-27", sampleSize: 1500, approve: 41, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-26", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-25", sampleSize: 1500, approve: 42, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-24", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-21", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-20", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-19", sampleSize: 1500, approve: 42, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-18", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-17", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-14", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-13", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-12", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-11", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-10", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-07", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-06", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-03", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-30", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-29", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-28", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-27", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-26", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-23", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-22", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-21", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-20", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-19", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-16", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-15", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-14", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-13", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-12", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-09", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-08", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-07", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-06", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-05", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-02", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-01", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-31", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-30", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-29", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-26", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-25", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-24", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-23", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-22", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-19", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-18", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-17", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-16", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-15", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-12", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-11", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-10", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-09", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-08", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-05", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-04", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-03", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-02", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-01", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-28", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-27", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-26", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-25", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-24", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-21", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-20", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-19", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-18", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-17", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-14", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-13", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-12", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-11", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-10", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-07", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-06", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-05", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-04", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-03", sampleSize: 1500, approve: 42, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-31", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-30", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-29", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-28", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-27", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-24", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-23", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-22", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-21", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-20", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-17", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-16", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-15", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-14", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-13", sampleSize: 1500, approve: 47, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-10", sampleSize: 1500, approve: 48, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-09", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-08", sampleSize: 1500, approve: 49, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-07", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-06", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-03", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-02", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-01", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-28", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-27", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-24", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-23", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-22", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-21", sampleSize: 1500, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-20", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-17", sampleSize: 1500, approve: 55, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-16", sampleSize: 1500, approve: 55, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-15", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-14", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-13", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-10", sampleSize: 1500, approve: 52, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-09", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-08", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-07", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-06", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-03", sampleSize: 1500, approve: 54, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-02", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-01", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-01-31", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-01-30", sampleSize: 1500, approve: 53, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-01-27", sampleSize: 1500, approve: 55, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-01-26", sampleSize: 1500, approve: 59, disapprove: 41, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-01-25", sampleSize: 1500, approve: 57, disapprove: 43, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-01-24", sampleSize: 1500, approve: 57, disapprove: 43, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-01-23", sampleSize: 1500, approve: 55, disapprove: 44, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-01-20", sampleSize: 1500, approve: 56, disapprove: 44, quality: "A+" },
  { pollster: "Emerson", date: "2017-02-06", sampleSize: 617, approve: 48, disapprove: 47, quality: "A" },
  { pollster: "Emerson", date: "2017-10-14", sampleSize: 820, approve: 44, disapprove: 50, quality: "A" },
  { pollster: "Emerson", date: "2018-01-11", sampleSize: 600, approve: 39, disapprove: 52, quality: "A" },
  { pollster: "Emerson", date: "2018-07-07", sampleSize: 900, approve: 43, disapprove: 50, quality: "A" },
  { pollster: "Emerson", date: "2018-08-31", sampleSize: 1000, approve: 38, disapprove: 53, quality: "A" },
  { pollster: "Emerson", date: "2018-10-04", sampleSize: 1000, approve: 43, disapprove: 50, quality: "A" },
  { pollster: "Emerson", date: "2018-12-09", sampleSize: 942, approve: 43, disapprove: 52, quality: "A" },
  { pollster: "Emerson", date: "2019-01-21", sampleSize: 1000, approve: 42, disapprove: 52, quality: "A" },
  { pollster: "Emerson", date: "2019-02-16", sampleSize: 1000, approve: 43, disapprove: 51, quality: "A" },
  { pollster: "Emerson", date: "2019-03-18", sampleSize: 1153, approve: 43, disapprove: 50, quality: "A" },
  { pollster: "Emerson", date: "2019-04-14", sampleSize: 914, approve: 43, disapprove: 49, quality: "A" },
  { pollster: "Emerson", date: "2019-05-13", sampleSize: 1006, approve: 43, disapprove: 49, quality: "A" },
  { pollster: "Emerson", date: "2019-06-24", sampleSize: 1096, approve: 43, disapprove: 48, quality: "A" },
  { pollster: "Emerson", date: "2019-07-08", sampleSize: 1100, approve: 44, disapprove: 48, quality: "A" },
  { pollster: "Emerson", date: "2019-07-29", sampleSize: 1238, approve: 45, disapprove: 46, quality: "A" },
  { pollster: "Emerson", date: "2019-08-26", sampleSize: 1458, approve: 43, disapprove: 52, quality: "A" },
  { pollster: "Emerson", date: "2019-09-23", sampleSize: 1019, approve: 48, disapprove: 47, quality: "A" },
  { pollster: "Emerson", date: "2019-10-21", sampleSize: 1000, approve: 43, disapprove: 47, quality: "A" },
  { pollster: "Emerson", date: "2019-11-20", sampleSize: 1092, approve: 48, disapprove: 47, quality: "A" },
  { pollster: "Emerson", date: "2019-12-17", sampleSize: 1222, approve: 46, disapprove: 49, quality: "A" },
  { pollster: "Emerson", date: "2020-01-23", sampleSize: 1128, approve: 47, disapprove: 48, quality: "A" },
  { pollster: "Emerson", date: "2020-02-18", sampleSize: 1250, approve: 48, disapprove: 44, quality: "A" },
  { pollster: "Emerson", date: "2020-03-19", sampleSize: 1100, approve: 46, disapprove: 45, quality: "A" },
  { pollster: "Emerson", date: "2020-04-28", sampleSize: 1200, approve: 41, disapprove: 50, quality: "A" },
  { pollster: "Emerson", date: "2020-06-03", sampleSize: 1431, approve: 43, disapprove: 50, quality: "A" },
  { pollster: "Emerson", date: "2020-07-30", sampleSize: 964, approve: 45, disapprove: 51, quality: "A" },
  { pollster: "Emerson", date: "2020-08-31", sampleSize: 1567, approve: 49, disapprove: 47, quality: "A" },
  { pollster: "Emerson", date: "2020-09-23", sampleSize: 1000, approve: 46, disapprove: 50, quality: "A" },
  { pollster: "Emerson", date: "2020-10-26", sampleSize: 1121, approve: 45, disapprove: 51, quality: "A" },
  { pollster: "Emerson", date: "2020-12-07", sampleSize: 1027, approve: 46, disapprove: 48, quality: "A" }
                ],
                polls: [ 
  { pollster: "Rasmussen Reports", date: "2025-07-21", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },  
{ pollster: "Rasmussen Reports", date: "2025-07-18", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-17", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-16", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-15", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-14", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-11", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-10", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-09", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-08", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-07", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-03", sampleSize: 1500, approve: 49, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-02", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-01", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-30", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-27", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-26", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-25", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-24", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-23", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-20", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-19", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-18", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-17", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-16", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-13", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-12", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-11", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-10", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-09", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-06", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-05", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-04", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-03", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-02", sampleSize: 1500, approve: 53, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-30", sampleSize: 1500, approve: 53, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-29", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-28", sampleSize: 1500, approve: 53, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-27", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-26", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-23", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-22", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-21", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-20", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-19", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-16", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-15", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-14", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-13", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-12", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-09", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-08", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-07", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-06", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-05", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-02", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-01", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-30", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-29", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-28", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-25", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-24", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-23", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-22", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-21", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-18", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-17", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-16", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-15", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-14", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-11", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-10", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-09", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-08", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-07", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-04", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-03", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-02", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-01", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-31", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-28", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-27", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-26", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-25", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-24", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-21", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-20", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-19", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-18", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-17", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-14", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-13", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-12", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-11", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-10", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-07", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-06", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-05", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-04", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-03", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-28", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-27", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-26", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-25", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-24", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-21", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-20", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-19", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-18", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-17", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-14", sampleSize: 1500, approve: 54, disapprove: 44, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-13", sampleSize: 1500, approve: 54, disapprove: 44, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-12", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-11", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-10", sampleSize: 1500, approve: 52, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-07", sampleSize: 1500, approve: 51, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-06", sampleSize: 1500, approve: 51, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-05", sampleSize: 1500, approve: 51, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-04", sampleSize: 1500, approve: 52, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-03", sampleSize: 1500, approve: 52, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-01", sampleSize: 1500, approve: 52, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-31", sampleSize: 1500, approve: 52, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-30", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-29", sampleSize: 1500, approve: 52, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-28", sampleSize: 1500, approve: 52, disapprove: 44, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-27", sampleSize: 1500, approve: 52, disapprove: 43, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-24", sampleSize: 1500, approve: 53, disapprove: 42, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-23", sampleSize: 1500, approve: 56, disapprove: 40, quality: "A+" },

  /* =======================================================
     QUANTUS INSIGHTS – RV, n = 1,000 (B+)
  ======================================================= */
  { pollster: "Quantus Insights",  date: "2025-07-16", sampleSize: 1000, approve: 48, disapprove: 50, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-07-02", sampleSize: 1000, approve: 47, disapprove: 49, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-06-25", sampleSize: 1000, approve: 47, disapprove: 50, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-06-11", sampleSize: 1000, approve: 48, disapprove: 49, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-06-04", sampleSize: 1000, approve: 49, disapprove: 48, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-05-20", sampleSize: 1000, approve: 48, disapprove: 48, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-05-07", sampleSize: 1000, approve: 48, disapprove: 48, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-04-23", sampleSize: 1000, approve: 48, disapprove: 50, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-04-09", sampleSize: 1000, approve: 47, disapprove: 50, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-03-27", sampleSize: 1000, approve: 49, disapprove: 46, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-03-12", sampleSize: 1000, approve: 50, disapprove: 47, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-02-26", sampleSize: 1000, approve: 51, disapprove: 45, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-02-12", sampleSize: 1000, approve: 53, disapprove: 44, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-02-03", sampleSize: 1000, approve: 52, disapprove: 45, quality: "B+" },
  { pollster: "Quantus Insights",  date: "2025-01-23", sampleSize: 1000, approve: 54, disapprove: 40, quality: "B+" },
  

  { pollster: "Big Data Poll", date: "2025-07-14", sampleSize: 3022, approve: 48, disapprove: 49, quality: "A+" },
  { pollster: "Big Data Poll", date: "2025-05-05", sampleSize: 3128, approve: 48, disapprove: 47, quality: "A+" },
  { pollster: "Big Data Poll", date: "2025-01-22", sampleSize: 2979, approve: 56, disapprove: 37, quality: "A+" },



  /* =======================================================
     EMERSON COLLEGE – National RV (n ≈&nbsp;1,000, A)
  ======================================================= */
  { pollster: "Emerson College",   date: "2025-06-25", sampleSize: 1000, approve: 45, disapprove: 46, quality: "A"  },
  { pollster: "Emerson College",   date: "2025-04-28", sampleSize: 1000, approve: 45, disapprove: 45, quality: "A"  },
  { pollster: "Emerson College",   date: "2025-03-10", sampleSize: 1000, approve: 47, disapprove: 45, quality: "A"  },
  { pollster: "Emerson College",   date: "2025-03-03", sampleSize: 1000, approve: 48, disapprove: 43, quality: "A"  },
  { pollster: "Emerson College",   date: "2025-02-17", sampleSize: 1000, approve: 48, disapprove: 42, quality: "A"  },
  { pollster: "Emerson College",   date: "2025-01-28", sampleSize: 1000, approve: 49, disapprove: 41, quality: "A"  },

  /* =======================================================
     TRAFALGAR & INSIDERADVANTAGE (LV/RV, A‑)
  ======================================================= */
  { pollster: "Trafalgar Group",       date: "2025-06-20", sampleSize: 1085, approve: 54, disapprove: 45, quality: "A-" },
  { pollster: "Trafalgar Group",       date: "2025-06-01", sampleSize: 1098, approve: 54, disapprove: 46, quality: "A-" },
  { pollster: "Trafalgar/InsiderAdv.", date: "2025-05-01", sampleSize: 1200, approve: 46, disapprove: 44, quality: "A-" },
  { pollster: "Trafalgar/InsiderAdv.", date: "2025-03-05", sampleSize:  800, approve: 50, disapprove: 45, quality: "A-" },
  { pollster: "Trafalgar/InsiderAdv.", date: "2025-02-09", sampleSize: 1321, approve: 54, disapprove: 45, quality: "A-" },

  /* =======================================================
     ATLASINTEL – Adults (A+)
  ======================================================= */
   { pollster: "AtlasIntel",      date: "2025-07-19", sampleSize: 1935, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "AtlasIntel",       date: "2025-05-27", sampleSize: 3469, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "AtlasIntel",       date: "2025-04-14", sampleSize: 2347, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "AtlasIntel",       date: "2025-03-12", sampleSize: 2550, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "AtlasIntel",       date: "2025-02-27", sampleSize: 2849, approve: 50, disapprove: 50, quality: "A+" },
  { pollster: "AtlasIntel",       date: "2025-01-23", sampleSize: 1882, approve: 50, disapprove: 50, quality: "A+" },

  /* =======================================================
     I&I / TIPP – Adults (A+)
  ======================================================= */
  { pollster: "I&I/TIPP",         date: "2025-06-27", sampleSize: 1421, approve: 44, disapprove: 45, quality: "A+" },
  { pollster: "I&I/TIPP",         date: "2025-05-30", sampleSize: 1395, approve: 43, disapprove: 45, quality: "A+" },
  { pollster: "I&I/TIPP",         date: "2025-05-02", sampleSize: 1400, approve: 42, disapprove: 47, quality: "A+" },
  { pollster: "I&I/TIPP",         date: "2025-02-28", sampleSize: 1434, approve: 46, disapprove: 43, quality: "A+" },

  /* =======================================================
     FABRIZIO & ANZALONE – RV (A‑)
  ======================================================= */
  { pollster: "Fabrizio & Anzalone", date: "2025-02-01", sampleSize: 3000, approve: 48, disapprove: 47, quality: "A-" },

  /* =======================================================
     NYT / SIENA COLLEGE – RV (A+)
  ======================================================= */
  { pollster: "NYT/Siena College",   date: "2025-04-24", sampleSize: 913, approve: 42, disapprove: 54, quality: "A+" }
                ]
            },
            { 
                id: 'biden', name: 'Biden Approval', shortName: 'Biden Approval', category: 'National', isRace: false, 
                candidates: ['Approve', 'Disapprove'], pollFields: ['approve', 'disapprove'], 
                colors: ['var(--approve-color)', 'var(--disapprove-color)'], directColors: ['#4ade80', '#ff3d71'], 
                colorGlow: ['var(--approve-color-glow)', 'var(--disapprove-color-glow)'], directGlowColors: ['rgba(74,222,128,0.4)', 'rgba(255,61,113,0.4)'],
                polls: [
                     { pollster: "Rasmussen Reports", date: "2025-01-20", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-17", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-16", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-15", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-14", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-13", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-10", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-09", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-08", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-07", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-06", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-03", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-31", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-30", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-27", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-26", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-23", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-20", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-19", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-18", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-17", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-16", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-13", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-12", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-11", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-10", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-09", sampleSize: 1500, approve: 41, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-06", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-05", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-04", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-03", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-02", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-27", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-26", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-25", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-22", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-21", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-20", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-19", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-18", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-15", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-14", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-13", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-12", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-11", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-08", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-07", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-06", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-05", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-04", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-01", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-31", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-30", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-29", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-28", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-25", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-24", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-23", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-22", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-21", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-18", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-17", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-16", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-15", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-14", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-11", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-10", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-09", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-08", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-07", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-04", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-03", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-02", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-01", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-30", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-27", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-26", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-25", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-24", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-23", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-20", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-19", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-18", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-17", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-16", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-13", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-12", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-11", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-10", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-09", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-06", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-05", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-04", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-03", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-02", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-30", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-29", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-28", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-27", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-26", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-23", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-22", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-21", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-20", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-19", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-16", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-15", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-14", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-13", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-12", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-09", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-08", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-07", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-06", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-05", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-02", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-01", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-31", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-30", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-29", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-26", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-25", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-24", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-23", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-22", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-19", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-18", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-17", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-16", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-15", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-12", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-11", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-10", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-09", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-08", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-03", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-02", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-01", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-28", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-27", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-26", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-25", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-24", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-21", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-20", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-19", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-18", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-17", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-14", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-13", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-12", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-11", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-10", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-07", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-06", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-05", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-04", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-03", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-31", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-30", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-29", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-28", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-27", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-24", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-23", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-22", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-21", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-20", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-17", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-16", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-15", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-14", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-13", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-10", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-09", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-08", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-07", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-06", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-03", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-02", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-01", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-30", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-29", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-26", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-25", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-24", sampleSize: 1500, approve: 39, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-23", sampleSize: 1500, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-22", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-19", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-18", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-17", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-16", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-15", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-12", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-11", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-10", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-09", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-08", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-05", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-04", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-03", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-02", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-01", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-29", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-28", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-27", sampleSize: 1500, approve: 39, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-26", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-25", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-22", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-21", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-20", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-19", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-18", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-15", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-14", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-13", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-12", sampleSize: 1500, approve: 42, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-11", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-08", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-07", sampleSize: 1500, approve: 39, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-06", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-05", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-04", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-01", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-29", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-28", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-27", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-26", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-23", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-22", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-21", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-20", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-19", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-16", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-15", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-14", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-13", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-12", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-09", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-08", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-07", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-06", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-05", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-02", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-01", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-31", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-30", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-29", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-26", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-25", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-24", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-23", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-22", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-19", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-18", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-17", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-16", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-15", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-12", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-11", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-10", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-09", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-08", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-05", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-04", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-03", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-29", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-28", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-27", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-22", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-21", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-20", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-19", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-18", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-15", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-14", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-13", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-12", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-11", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-08", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-07", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-06", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-05", sampleSize: 1500, approve: 44, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-04", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-01", sampleSize: 1500, approve: 44, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-30", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-29", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-28", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-27", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-22", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-21", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-20", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-17", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-16", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-15", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-14", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-13", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-10", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-09", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-08", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-07", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-06", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-03", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-02", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-01", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-31", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-30", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-27", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-26", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-25", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-24", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-23", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-20", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-19", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-18", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-17", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-16", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-13", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-12", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-11", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-10", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-09", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-06", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-05", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-04", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-03", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-02", sampleSize: 1500, approve: 49, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-29", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-28", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-27", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-26", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-25", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-22", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-21", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-20", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-19", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-18", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-15", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-14", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-13", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-12", sampleSize: 1500, approve: 45, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-11", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-08", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-07", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-06", sampleSize: 1500, approve: 40, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-05", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-04", sampleSize: 1500, approve: 40, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-01", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-31", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-30", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-29", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-28", sampleSize: 1500, approve: 44, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-25", sampleSize: 1500, approve: 46, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-24", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-23", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-22", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-21", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-18", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-17", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-16", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-15", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-14", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-11", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-10", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-09", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-08", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-07", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-04", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-03", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-02", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-01", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-31", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-28", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-27", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-26", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-25", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-24", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-21", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-20", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-19", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-18", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-17", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-14", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-13", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-12", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-11", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-10", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-07", sampleSize: 1500, approve: 45, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-06", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-03", sampleSize: 1500, approve: 44, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-30", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-29", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-28", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-27", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-26", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-23", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-22", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-21", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-20", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-19", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-16", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-15", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-14", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-13", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-12", sampleSize: 1500, approve: 45, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-09", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-08", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-07", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-06", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-05", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-02", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-01", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-31", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-26", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-25", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-24", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-23", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-22", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-19", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-18", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-17", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-16", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-15", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-12", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-11", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-10", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-09", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-08", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-05", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-04", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-03", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-02", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-01", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-28", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-27", sampleSize: 1500, approve: 51, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-26", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-25", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-24", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-21", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-20", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-19", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-18", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-17", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-14", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-13", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-12", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-11", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-10", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-07", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-06", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-05", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-04", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-03", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-31", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-30", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-29", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-28", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-27", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-24", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-23", sampleSize: 1500, approve: 47, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-22", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-21", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-20", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-17", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-16", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-15", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-14", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-13", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-10", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-09", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-08", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-07", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-06", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-03", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-02", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-01", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-28", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-27", sampleSize: 1500, approve: 46, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-24", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-23", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-22", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-21", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-20", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-17", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-16", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-15", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-14", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-13", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-10", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-09", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-08", sampleSize: 1500, approve: 44, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-07", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-06", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-03", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-02", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-01", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-31", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-30", sampleSize: 1500, approve: 42, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-27", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-26", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-25", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-24", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-23", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-20", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-19", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-18", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-17", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-16", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-13", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-12", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-11", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-10", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-09", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-06", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-05", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-04", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-03", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-30", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-29", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-28", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-27", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-23", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-22", sampleSize: 1500, approve: 46, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-21", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-20", sampleSize: 1500, approve: 47, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-19", sampleSize: 1500, approve: 47, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-16", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-15", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-14", sampleSize: 1500, approve: 46, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-13", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-12", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-09", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-08", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-07", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-06", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-05", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-02", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-01", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-30", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-29", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-28", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-23", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-22", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-21", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-18", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-17", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-16", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-15", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-14", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-11", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-10", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-09", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-08", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-07", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-04", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-03", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-02", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-01", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-31", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-28", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-27", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-26", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-25", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-24", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-21", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-20", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-19", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-18", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-17", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-14", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-13", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-12", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-11", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-10", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-07", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-06", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-05", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-04", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-03", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-30", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-29", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-28", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-27", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-26", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-23", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-22", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-21", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-20", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-19", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-16", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-15", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-14", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-13", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-12", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-09", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-08", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-07", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-06", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-05", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-02", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-01", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-31", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-30", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-29", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-26", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-25", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-24", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-23", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-22", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-19", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-18", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-17", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-16", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-15", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-12", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-11", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-10", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-09", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-08", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-05", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-04", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-03", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-02", sampleSize: 1500, approve: 43, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-01", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-29", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-28", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-27", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-26", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-25", sampleSize: 1500, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-22", sampleSize: 1500, approve: 37, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-21", sampleSize: 1500, approve: 36, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-20", sampleSize: 1500, approve: 39, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-19", sampleSize: 1500, approve: 39, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-18", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-15", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-14", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-13", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-12", sampleSize: 1500, approve: 38, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-11", sampleSize: 1500, approve: 37, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-08", sampleSize: 1500, approve: 37, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-07", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-06", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-01", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-30", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-29", sampleSize: 1500, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-28", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-27", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-24", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-23", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-22", sampleSize: 1500, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-21", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-20", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-17", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-16", sampleSize: 1500, approve: 42, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-15", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-14", sampleSize: 1500, approve: 38, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-13", sampleSize: 1500, approve: 38, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-10", sampleSize: 1500, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-09", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-08", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-07", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-06", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-03", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-02", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-01", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-31", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-27", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-26", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-25", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-24", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-23", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-20", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-19", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-18", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-17", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-16", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-13", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-12", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-11", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-10", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-09", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-06", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-05", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-04", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-03", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-02", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-29", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-28", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-27", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-26", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-25", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-22", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-21", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-20", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-19", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-18", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-15", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-14", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-13", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-12", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-11", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-08", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-07", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-06", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-05", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-04", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-01", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-31", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-30", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-29", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-28", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-25", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-24", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-23", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-22", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-21", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-18", sampleSize: 1500, approve: 38, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-17", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-16", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-14", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-11", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-10", sampleSize: 1500, approve: 39, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-09", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-08", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-07", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-04", sampleSize: 1500, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-03", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-02", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-01", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-28", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-25", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-24", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-23", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-22", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-21", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-18", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-17", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-16", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-15", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-14", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-11", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-10", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-09", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-08", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-07", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-04", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-03", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-02", sampleSize: 1500, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-01", sampleSize: 1500, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-31", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-28", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-27", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-26", sampleSize: 1500, approve: 39, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-25", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-24", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-21", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-20", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-19", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-18", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-17", sampleSize: 1500, approve: 39, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-14", sampleSize: 1500, approve: 38, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-13", sampleSize: 1500, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-12", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-11", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-10", sampleSize: 1500, approve: 41, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-07", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-06", sampleSize: 1500, approve: 43, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-05", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-04", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-03", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-31", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-30", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-29", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-28", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-27", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-23", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-22", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-21", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-20", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-17", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-16", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-15", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-14", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-13", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-10", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-09", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-08", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-07", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-06", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-03", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-02", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-01", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-30", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-29", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-24", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-23", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-22", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-19", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-18", sampleSize: 1500, approve: 41, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-17", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-16", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-15", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-12", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-11", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-10", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-09", sampleSize: 1500, approve: 40, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-08", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-05", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-04", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-03", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-02", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-01", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-29", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-28", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-27", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-26", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-25", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-22", sampleSize: 1500, approve: 42, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-21", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-20", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-19", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-18", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-15", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-14", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-13", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-12", sampleSize: 1500, approve: 41, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-11", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-08", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-07", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-06", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-05", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-04", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-01", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-30", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-29", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-28", sampleSize: 1500, approve: 41, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-27", sampleSize: 1500, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-24", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-23", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-22", sampleSize: 1500, approve: 45, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-21", sampleSize: 1500, approve: 44, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-20", sampleSize: 1500, approve: 43, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-17", sampleSize: 1500, approve: 43, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-16", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-15", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-14", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-13", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-10", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-09", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-08", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-07", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-06", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-03", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-02", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-01", sampleSize: 1500, approve: 42, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-31", sampleSize: 1500, approve: 44, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-30", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-27", sampleSize: 1500, approve: 45, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-26", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-25", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-24", sampleSize: 1500, approve: 44, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-23", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-20", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-19", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-18", sampleSize: 1500, approve: 46, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-17", sampleSize: 1500, approve: 45, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-16", sampleSize: 1500, approve: 46, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-13", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-12", sampleSize: 1500, approve: 47, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-11", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-10", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-09", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-06", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-05", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-04", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-03", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-02", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-30", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-29", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-28", sampleSize: 1500, approve: 46, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-27", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-26", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-23", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-22", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-21", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-20", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-19", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-16", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-15", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-14", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-13", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-12", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-09", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-08", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-07", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-02", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-01", sampleSize: 1500, approve: 48, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-30", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-29", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-28", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-25", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-24", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-23", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-22", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-21", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-18", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-17", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-16", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-15", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-14", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-11", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-10", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-09", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-08", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-07", sampleSize: 1500, approve: 48, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-04", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-03", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-02", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-01", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-31", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-28", sampleSize: 1500, approve: 55, disapprove: 43, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-27", sampleSize: 1500, approve: 53, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-26", sampleSize: 1500, approve: 55, disapprove: 43, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-25", sampleSize: 1500, approve: 54, disapprove: 44, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-24", sampleSize: 1500, approve: 54, disapprove: 43, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-21", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-20", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-19", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-18", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-17", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-14", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-13", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-12", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-11", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-10", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-07", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-06", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-05", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-04", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-03", sampleSize: 1500, approve: 48, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-30", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-29", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-28", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-27", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-26", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-23", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-22", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-21", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-20", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-19", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-16", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-15", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-14", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-13", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-12", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-09", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-08", sampleSize: 1500, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-07", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-06", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-05", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-02", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-01", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-31", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-30", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-29", sampleSize: 1500, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-26", sampleSize: 1500, approve: 48, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-25", sampleSize: 1500, approve: 47, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-24", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-23", sampleSize: 1500, approve: 48, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-22", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-19", sampleSize: 1500, approve: 52, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-18", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-17", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-16", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-15", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-12", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-11", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-10", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-09", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-08", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-05", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-04", sampleSize: 1500, approve: 49, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-03", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-02", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-01", sampleSize: 1500, approve: 49, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-26", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-25", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-24", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-23", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-22", sampleSize: 1500, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-19", sampleSize: 1500, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-18", sampleSize: 1500, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-17", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-16", sampleSize: 1500, approve: 53, disapprove: 44, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-15", sampleSize: 1500, approve: 53, disapprove: 43, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-12", sampleSize: 1500, approve: 52, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-11", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-10", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-09", sampleSize: 1500, approve: 51, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-08", sampleSize: 1500, approve: 50, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-05", sampleSize: 1500, approve: 49, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-04", sampleSize: 1500, approve: 52, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-03", sampleSize: 1500, approve: 51, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-02", sampleSize: 1500, approve: 51, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-01", sampleSize: 1500, approve: 49, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-29", sampleSize: 1500, approve: 50, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-28", sampleSize: 1500, approve: 49, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-27", sampleSize: 1500, approve: 48, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-26", sampleSize: 1500, approve: 48, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-25", sampleSize: 1500, approve: 48, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-22", sampleSize: 1500, approve: 48, disapprove: 45, quality: "A+" },
  
  { pollster: "Atlas Intel", date: "2024-11-04", sampleSize: 2703, approve: 42, disapprove: 55, quality: "A+" },
  { pollster: "Atlas Intel", date: "2024-11-02", sampleSize: 2463, approve: 40, disapprove: 56, quality: "A+" },
  { pollster: "Atlas Intel", date: "2024-10-31", sampleSize: 3490, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Atlas Intel", date: "2024-10-29", sampleSize: 3032, approve: 41, disapprove: 54, quality: "A+" },
  { pollster: "Atlas Intel", date: "2024-10-17", sampleSize: 4180, approve: 41, disapprove: 54, quality: "A+" },
  { pollster: "Atlas Intel", date: "2024-09-12", sampleSize: 1775, approve: 38, disapprove: 56, quality: "A+" },
  

  { pollster: "Emerson", date: "2022-02-20", sampleSize: 1138, approve: 42, disapprove: 50, quality: "A+" },
  { pollster: "Emerson", date: "2022-03-20", sampleSize: 1023, approve: 43, disapprove: 49, quality: "A+" },
  { pollster: "Emerson", date: "2022-04-26", sampleSize: 1000, approve: 42, disapprove: 50, quality: "A+" },
  { pollster: "Emerson", date: "2022-05-25", sampleSize: 1148, approve: 38, disapprove: 52, quality: "A+" },
  { pollster: "Emerson", date: "2022-06-29", sampleSize: 1271, approve: 40, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2022-07-20", sampleSize: 1078, approve: 40, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2022-08-24", sampleSize: 1000, approve: 42, disapprove: 51, quality: "A+" },
  { pollster: "Emerson", date: "2022-09-21", sampleSize: 1368, approve: 45, disapprove: 49, quality: "A+" },
  { pollster: "Emerson", date: "2022-10-19", sampleSize: 1000, approve: 39, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2022-11-19", sampleSize: 1380, approve: 39, disapprove: 52, quality: "A+" },
  { pollster: "Emerson", date: "2023-01-21", sampleSize: 1015, approve: 44, disapprove: 48, quality: "A+" },
  { pollster: "Emerson", date: "2023-02-25", sampleSize: 1060, approve: 44, disapprove: 50, quality: "A+" },
  { pollster: "Emerson", date: "2023-04-25", sampleSize: 1000, approve: 41, disapprove: 49, quality: "A+" },
  { pollster: "Emerson", date: "2023-06-20", sampleSize: 1015, approve: 41, disapprove: 51, quality: "A+" },
  { pollster: "Emerson", date: "2023-08-17", sampleSize: 1000, approve: 42, disapprove: 47, quality: "A+" },
  { pollster: "Emerson", date: "2023-08-26", sampleSize: 1000, approve: 43, disapprove: 47, quality: "A+" },
  { pollster: "Emerson", date: "2023-09-18", sampleSize: 1125, approve: 41, disapprove: 47, quality: "A+" },
  { pollster: "Emerson", date: "2023-10-17", sampleSize: 1578, approve: 42, disapprove: 50, quality: "A+" },
  { pollster: "Emerson", date: "2023-11-20", sampleSize: 1475, approve: 38, disapprove: 50, quality: "A+" },
  { pollster: "Emerson", date: "2023-12-06", sampleSize: 1000, approve: 41, disapprove: 51, quality: "A+" },
  { pollster: "Emerson", date: "2024-01-29", sampleSize: 1260, approve: 42, disapprove: 46, quality: "A+" },
  { pollster: "Emerson", date: "2024-02-14", sampleSize: 1225, approve: 42, disapprove: 47, quality: "A+" },
  { pollster: "Emerson", date: "2024-03-06", sampleSize: 1350, approve: 41, disapprove: 48, quality: "A+" },
  { pollster: "Emerson", date: "2024-04-03", sampleSize: 1438, approve: 40, disapprove: 51, quality: "A+" },
  { pollster: "Emerson", date: "2024-04-17", sampleSize: 1308, approve: 39, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2024-05-23", sampleSize: 1000, approve: 37, disapprove: 52, quality: "A+" },
  { pollster: "Emerson", date: "2024-06-05", sampleSize: 1000, approve: 37, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2024-07-08", sampleSize: 1370, approve: 39, disapprove: 52, quality: "A+" },
  { pollster: "Emerson", date: "2024-08-14", sampleSize: 1000, approve: 39, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2024-09-04", sampleSize: 1000, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2024-10-01", sampleSize: 1000, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Emerson", date: "2024-10-16", sampleSize: 1000, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2024-10-24", sampleSize: 1000, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2024-11-02", sampleSize: 1000, approve: 40, disapprove: 53, quality: "A+" },
  { pollster: "Emerson", date: "2024-11-22", sampleSize: 1000, approve: 36, disapprove: 51, quality: "A+" },
  { pollster: "Emerson", date: "2024-12-13", sampleSize: 1000, approve: 36, disapprove: 54, quality: "A+" },
  { pollster: "Emerson", date: "2025-01-11", sampleSize: 1000, approve: 37, disapprove: 52, quality: "A+" },

  
  

  { pollster: "TIPP", date: "2024-08-30", sampleSize: 1582, approve: 37, disapprove: 53, quality: "A+" },
  { pollster: "TIPP", date: "2024-08-02", sampleSize: 1488, approve: 37, disapprove: 55, quality: "A+" },
  { pollster: "TIPP", date: "2024-06-28", sampleSize: 1389, approve: 37, disapprove: 52, quality: "A+" },
  { pollster: "TIPP", date: "2024-05-31", sampleSize: 1910, approve: 36, disapprove: 52, quality: "A+" },
  { pollster: "TIPP", date: "2024-05-03", sampleSize: 1435, approve: 35, disapprove: 54, quality: "A+" },
  { pollster: "TIPP", date: "2024-04-05", sampleSize: 1432, approve: 37, disapprove: 52, quality: "A+" },
  { pollster: "TIPP", date: "2024-03-01", sampleSize: 1419, approve: 37, disapprove: 53, quality: "A+" },
  { pollster: "TIPP", date: "2024-02-02", sampleSize: 1402, approve: 36, disapprove: 54, quality: "A+" },
  { pollster: "TIPP", date: "2024-01-05", sampleSize: 1401, approve: 36, disapprove: 54, quality: "A+" },
  { pollster: "TIPP", date: "2023-12-01", sampleSize: 1464, approve: 33, disapprove: 55, quality: "A+" },
  { pollster: "TIPP", date: "2023-11-03", sampleSize: 1400, approve: 39, disapprove: 52, quality: "A+" },
  

  { pollster: "Trafalgar Group", date: "2022-11-06", sampleSize: 1099, approve: 40, disapprove: 58, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-10-30", sampleSize: 1089, approve: 39, disapprove: 59, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-10-12", sampleSize: 1079, approve: 39, disapprove: 56, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-09-27", sampleSize: 1084, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-09-09", sampleSize: 1081, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-08-23", sampleSize: 1084, approve: 39, disapprove: 58, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-06-23", sampleSize: 1079, approve: 35, disapprove: 60, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-04-20", sampleSize: 1077, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-03-09", sampleSize: 1080, approve: 42, disapprove: 52, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-02-16", sampleSize: 1078, approve: 39, disapprove: 58, quality: "A+" },
  { pollster: "Trafalgar Group", date: "2022-01-15", sampleSize: 1083, approve: 39, disapprove: 59, quality: "A+" },
                ] 
            },
            { 
                id: 'direction', name: "America's Direction", shortName: 'US Direction', category: 'National', isRace: false, 
                candidates: ['Right Track', 'Wrong Track'], pollFields: ['approve', 'disapprove'], 
                colors: ['var(--approve-color)', 'var(--disapprove-color)'], directColors: ['#4ade80', '#ff3d71'], 
                colorGlow: ['var(--approve-color-glow)', 'var(--disapprove-color-glow)'], directGlowColors: ['rgba(74,222,128,0.4)', 'rgba(255,61,113,0.4)'],
                polls: [ { pollster: "Rasmussen Reports", date: "2025-07-10", sampleSize: 2178, approve: 45, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-07-02", sampleSize: 1484, approve: 44, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-26", sampleSize: 1961, approve: 45, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-19", sampleSize: 1855, approve: 47, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-12", sampleSize: 1772, approve: 48, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-06-05", sampleSize: 1752, approve: 44, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-29", sampleSize: 1832, approve: 48, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-22", sampleSize: 1810, approve: 48, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-15", sampleSize: 1716, approve: 47, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-08", sampleSize: 1762, approve: 47, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-01", sampleSize: 1823, approve: 45, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-24", sampleSize: 1767, approve: 42, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-17", sampleSize: 1755, approve: 46, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-10", sampleSize: 1811, approve: 43, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-04-03", sampleSize: 1746, approve: 45, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-27", sampleSize: 1777, approve: 45, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-20", sampleSize: 1965, approve: 45, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-13", sampleSize: 1860, approve: 45, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-03-06", sampleSize: 1883, approve: 43, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-27", sampleSize: 2033, approve: 45, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-20", sampleSize: 1991, approve: 48, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-13", sampleSize: 2004, approve: 46, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-02-06", sampleSize: 2078, approve: 45, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-30", sampleSize: 2096, approve: 46, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-23", sampleSize: 2070, approve: 39, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-16", sampleSize: 2118, approve: 31, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-09", sampleSize: 2094, approve: 29, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-01-02", sampleSize: 1256, approve: 30, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-26", sampleSize: 1454, approve: 31, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-19", sampleSize: 1903, approve: 31, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-12", sampleSize: 2050, approve: 30, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-12-05", sampleSize: 2121, approve: 31, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-26", sampleSize: 1297, approve: 30, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-14", sampleSize: 2015, approve: 31, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-11-07", sampleSize: 2821, approve: 33, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-31", sampleSize: 3049, approve: 34, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-24", sampleSize: 3928, approve: 35, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-17", sampleSize: 3163, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-10", sampleSize: 2418, approve: 35, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-03", sampleSize: 1748, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-26", sampleSize: 1776, approve: 36, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-22", sampleSize: 1571, approve: 35, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-12", sampleSize: 2515, approve: 35, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-05", sampleSize: 1806, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-29", sampleSize: 1844, approve: 36, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-22", sampleSize: 1909, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-15", sampleSize: 1881, approve: 35, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-08", sampleSize: 1802, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-01", sampleSize: 1794, approve: 33, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-28", sampleSize: 1500, approve: 35, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-18", sampleSize: 1908, approve: 29, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-11", sampleSize: 1847, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-02", sampleSize: 1117, approve: 30, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-27", sampleSize: 2196, approve: 32, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-20", sampleSize: 1805, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-13", sampleSize: 1803, approve: 33, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-06-06", sampleSize: 1788, approve: 33, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-30", sampleSize: 1852, approve: 32, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-23", sampleSize: 1852, approve: 32, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-16", sampleSize: 1779, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-12", sampleSize: 1831, approve: 28, disapprove: 67, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-05-02", sampleSize: 1936, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-25", sampleSize: 1851, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-18", sampleSize: 1851, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-11", sampleSize: 1856, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-04-04", sampleSize: 1825, approve: 32, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-28", sampleSize: 1821, approve: 32, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-21", sampleSize: 1840, approve: 31, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-14", sampleSize: 1889, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-03-10", sampleSize: 1500, approve: 29, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-29", sampleSize: 1596, approve: 28, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-22", sampleSize: 1585, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-15", sampleSize: 1446, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-08", sampleSize: 1390, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-02-01", sampleSize: 1505, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-28", sampleSize: 1610, approve: 34, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-18", sampleSize: 1620, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-11", sampleSize: 1702, approve: 32, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-01-04", sampleSize: 1044, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-28", sampleSize: 1007, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-21", sampleSize: 1784, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-17", sampleSize: 1500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-12-07", sampleSize: 1429, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-30", sampleSize: 1538, approve: 33, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-21", sampleSize: 1005, approve: 33, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-16", sampleSize: 1691, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-09", sampleSize: 1635, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-11-02", sampleSize: 1675, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-26", sampleSize: 1555, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-19", sampleSize: 1671, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-12", sampleSize: 1683, approve: 31, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-10-05", sampleSize: 1607, approve: 28, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-28", sampleSize: 1696, approve: 31, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-21", sampleSize: 1685, approve: 31, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-14", sampleSize: 1637, approve: 34, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-09-07", sampleSize: 1723, approve: 35, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-31", sampleSize: 1711, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-24", sampleSize: 1688, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-17", sampleSize: 1744, approve: 32, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-10", sampleSize: 1708, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-08-03", sampleSize: 1828, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-27", sampleSize: 1667, approve: 35, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-20", sampleSize: 1700, approve: 32, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-13", sampleSize: 1679, approve: 32, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-07-06", sampleSize: 1034, approve: 29, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-29", sampleSize: 1742, approve: 29, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-22", sampleSize: 1741, approve: 31, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-15", sampleSize: 1678, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-08", sampleSize: 1660, approve: 32, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-06-01", sampleSize: 1012, approve: 33, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-25", sampleSize: 2051, approve: 28, disapprove: 67, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-18", sampleSize: 1666, approve: 27, disapprove: 67, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-11", sampleSize: 1631, approve: 30, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-05-02", sampleSize: 1737, approve: 36, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-27", sampleSize: 1550, approve: 39, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-20", sampleSize: 1543, approve: 37, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-13", sampleSize: 1588, approve: 35, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-04-06", sampleSize: 1599, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-30", sampleSize: 1586, approve: 35, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-23", sampleSize: 1598, approve: 38, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-16", sampleSize: 1660, approve: 36, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-09", sampleSize: 1592, approve: 39, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-03-02", sampleSize: 1568, approve: 38, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-23", sampleSize: 1500, approve: 35, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-16", sampleSize: 1500, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-09", sampleSize: 1600, approve: 35, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-02-02", sampleSize: 1500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-26", sampleSize: 1500, approve: 28, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-19", sampleSize: 1500, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-12", sampleSize: 1500, approve: 32, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2023-01-05", sampleSize: 1500, approve: 34, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-29", sampleSize: 1900, approve: 36, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-22", sampleSize: 1500, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-15", sampleSize: 2200, approve: 33, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-08", sampleSize: 2500, approve: 35, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-12-01", sampleSize: 3000, approve: 30, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-22", sampleSize: 2500, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-17", sampleSize: 2500, approve: 31, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-10", sampleSize: 2500, approve: 28, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-11-03", sampleSize: 2500, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-27", sampleSize: 2500, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-20", sampleSize: 2100, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-13", sampleSize: 2500, approve: 27, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-10-06", sampleSize: 2500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-29", sampleSize: 2500, approve: 29, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-22", sampleSize: 2500, approve: 29, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-15", sampleSize: 2500, approve: 28, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-08", sampleSize: 2500, approve: 30, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-09-01", sampleSize: 2500, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-25", sampleSize: 2500, approve: 29, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-18", sampleSize: 2500, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-11", sampleSize: 2500, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-08-04", sampleSize: 2500, approve: 28, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-28", sampleSize: 2500, approve: 26, disapprove: 67, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-21", sampleSize: 2000, approve: 23, disapprove: 72, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-14", sampleSize: 2500, approve: 25, disapprove: 70, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-07-07", sampleSize: 2000, approve: 19, disapprove: 76, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-30", sampleSize: 2500, approve: 18, disapprove: 77, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-23", sampleSize: 2500, approve: 24, disapprove: 71, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-16", sampleSize: 2500, approve: 24, disapprove: 70, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-09", sampleSize: 2500, approve: 23, disapprove: 71, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-06-02", sampleSize: 2500, approve: 23, disapprove: 71, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-26", sampleSize: 2500, approve: 25, disapprove: 68, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-19", sampleSize: 2500, approve: 24, disapprove: 69, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-12", sampleSize: 2500, approve: 26, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-05-05", sampleSize: 2500, approve: 28, disapprove: 67, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-28", sampleSize: 2500, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-21", sampleSize: 2500, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-14", sampleSize: 2500, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-04-07", sampleSize: 2500, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-31", sampleSize: 2500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-24", sampleSize: 2500, approve: 32, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-17", sampleSize: 2500, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-10", sampleSize: 2500, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-03-03", sampleSize: 2500, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-24", sampleSize: 2500, approve: 31, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-17", sampleSize: 2500, approve: 29, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-10", sampleSize: 2500, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-02-03", sampleSize: 2500, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-27", sampleSize: 2500, approve: 29, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-20", sampleSize: 2500, approve: 28, disapprove: 67, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-13", sampleSize: 2500, approve: 26, disapprove: 68, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2022-01-06", sampleSize: 2500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-30", sampleSize: 2500, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-22", sampleSize: 2000, approve: 27, disapprove: 67, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-16", sampleSize: 2500, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-09", sampleSize: 2500, approve: 31, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-12-02", sampleSize: 2500, approve: 31, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-23", sampleSize: 1700, approve: 29, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-18", sampleSize: 2500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-11", sampleSize: 2500, approve: 33, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-11-04", sampleSize: 2500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-28", sampleSize: 2500, approve: 29, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-21", sampleSize: 2500, approve: 32, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-14", sampleSize: 2500, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-10-07", sampleSize: 2500, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-30", sampleSize: 2500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-23", sampleSize: 2500, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-16", sampleSize: 2500, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-09", sampleSize: 2500, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-09-02", sampleSize: 2500, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-26", sampleSize: 2500, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-19", sampleSize: 2500, approve: 33, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-12", sampleSize: 2500, approve: 34, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-08-05", sampleSize: 2500, approve: 35, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-29", sampleSize: 2500, approve: 32, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-22", sampleSize: 2500, approve: 37, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-15", sampleSize: 2500, approve: 39, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-08", sampleSize: 2000, approve: 39, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-07-01", sampleSize: 2300, approve: 39, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-24", sampleSize: 2175, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-17", sampleSize: 2500, approve: 39, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-10", sampleSize: 2300, approve: 38, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-06-03", sampleSize: 2250, approve: 37, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-27", sampleSize: 2500, approve: 42, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-20", sampleSize: 2500, approve: 39, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-13", sampleSize: 2250, approve: 38, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-05-06", sampleSize: 2175, approve: 42, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-29", sampleSize: 2500, approve: 39, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-22", sampleSize: 2500, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-08", sampleSize: 2500, approve: 39, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-04-01", sampleSize: 2500, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-25", sampleSize: 2500, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-18", sampleSize: 2500, approve: 41, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-11", sampleSize: 2500, approve: 41, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-03-04", sampleSize: 2500, approve: 37, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-25", sampleSize: 2500, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-18", sampleSize: 2500, approve: 34, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-11", sampleSize: 2500, approve: 38, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-02-04", sampleSize: 2500, approve: 35, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-28", sampleSize: 2500, approve: 35, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-21", sampleSize: 2300, approve: 24, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-14", sampleSize: 2000, approve: 21, disapprove: 72, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2021-01-07", sampleSize: 2000, approve: 23, disapprove: 67, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-30", sampleSize: 2000, approve: 26, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-22", sampleSize: 1500, approve: 29, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-17", sampleSize: 2500, approve: 31, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-10", sampleSize: 2500, approve: 28, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-12-03", sampleSize: 2500, approve: 31, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-24", sampleSize: 1500, approve: 32, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-19", sampleSize: 2500, approve: 32, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-12", sampleSize: 2500, approve: 35, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-11-06", sampleSize: 2500, approve: 36, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-29", sampleSize: 2500, approve: 41, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-22", sampleSize: 2500, approve: 38, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-15", sampleSize: 2500, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-08", sampleSize: 2500, approve: 32, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-10-01", sampleSize: 2500, approve: 31, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-24", sampleSize: 2500, approve: 29, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-17", sampleSize: 2500, approve: 31, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-10", sampleSize: 2500, approve: 30, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-09-03", sampleSize: 2500, approve: 31, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-27", sampleSize: 2500, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-20", sampleSize: 2500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-13", sampleSize: 2500, approve: 30, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-08-06", sampleSize: 3000, approve: 28, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-30", sampleSize: 2500, approve: 26, disapprove: 69, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-23", sampleSize: 2500, approve: 26, disapprove: 67, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-16", sampleSize: 2500, approve: 24, disapprove: 70, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-09", sampleSize: 2500, approve: 24, disapprove: 72, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-07-02", sampleSize: 2500, approve: 25, disapprove: 69, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-25", sampleSize: 2500, approve: 24, disapprove: 69, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-18", sampleSize: 2500, approve: 25, disapprove: 68, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-11", sampleSize: 2500, approve: 25, disapprove: 68, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-06-04", sampleSize: 2500, approve: 27, disapprove: 66, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-28", sampleSize: 2500, approve: 33, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-21", sampleSize: 2500, approve: 34, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-14", sampleSize: 2500, approve: 35, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-05-07", sampleSize: 2500, approve: 35, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-30", sampleSize: 2500, approve: 35, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-23", sampleSize: 2500, approve: 35, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-16", sampleSize: 2500, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-09", sampleSize: 2500, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-04-02", sampleSize: 2500, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-26", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-19", sampleSize: 2500, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-12", sampleSize: 2500, approve: 42, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-03-05", sampleSize: 2500, approve: 43, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-27", sampleSize: 2500, approve: 45, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-20", sampleSize: 2500, approve: 45, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-13", sampleSize: 2500, approve: 46, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-02-06", sampleSize: 2500, approve: 42, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-30", sampleSize: 2500, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-23", sampleSize: 2500, approve: 41, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-16", sampleSize: 2500, approve: 45, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-09", sampleSize: 2500, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2020-01-02", sampleSize: 1500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-26", sampleSize: 1500, approve: 38, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-19", sampleSize: 2500, approve: 39, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-12", sampleSize: 2500, approve: 38, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-12-05", sampleSize: 2500, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-25", sampleSize: 2500, approve: 37, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-21", sampleSize: 2500, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-14", sampleSize: 2500, approve: 39, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-11-07", sampleSize: 2500, approve: 39, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-31", sampleSize: 2500, approve: 36, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-24", sampleSize: 2500, approve: 35, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-17", sampleSize: 2500, approve: 38, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-10", sampleSize: 2500, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-10-04", sampleSize: 2500, approve: 36, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-26", sampleSize: 2500, approve: 39, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-19", sampleSize: 2500, approve: 43, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-12", sampleSize: 2500, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-09-05", sampleSize: 2500, approve: 39, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-29", sampleSize: 2500, approve: 37, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-22", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-15", sampleSize: 2500, approve: 37, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-08", sampleSize: 2500, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-08-01", sampleSize: 2500, approve: 41, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-25", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-18", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-11", sampleSize: 2500, approve: 40, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-07-02", sampleSize: 2500, approve: 42, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-27", sampleSize: 2500, approve: 42, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-20", sampleSize: 2500, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-13", sampleSize: 2500, approve: 41, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-06-06", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-30", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-23", sampleSize: 2500, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-16", sampleSize: 2500, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-09", sampleSize: 2500, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-05-02", sampleSize: 2500, approve: 42, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-25", sampleSize: 2500, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-18", sampleSize: 2500, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-11", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-04-04", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-28", sampleSize: 2500, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-21", sampleSize: 2500, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-14", sampleSize: 2500, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-03-07", sampleSize: 2500, approve: 37, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-28", sampleSize: 2500, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-21", sampleSize: 2500, approve: 41, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-14", sampleSize: 2500, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-02-07", sampleSize: 2500, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-31", sampleSize: 2500, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-24", sampleSize: 2500, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-17", sampleSize: 2500, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-10", sampleSize: 1000, approve: 36, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2019-01-03", sampleSize: 1000, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-27", sampleSize: 2500, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-20", sampleSize: 2500, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-13", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-12-06", sampleSize: 2500, approve: 43, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-29", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-21", sampleSize: 2500, approve: 44, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-15", sampleSize: 2500, approve: 41, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-08", sampleSize: 2500, approve: 43, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-11-01", sampleSize: 2500, approve: 43, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-25", sampleSize: 2500, approve: 43, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-18", sampleSize: 2500, approve: 43, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-11", sampleSize: 2500, approve: 43, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-10-04", sampleSize: 2500, approve: 43, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-27", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-20", sampleSize: 2500, approve: 42, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-09-06", sampleSize: 2500, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-30", sampleSize: 2500, approve: 43, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-23", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-16", sampleSize: 2500, approve: 43, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-09", sampleSize: 2500, approve: 43, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-08-02", sampleSize: 2500, approve: 44, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-26", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-19", sampleSize: 2500, approve: 41, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-12", sampleSize: 2500, approve: 42, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-07-05", sampleSize: 2500, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-28", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-21", sampleSize: 2500, approve: 42, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-14", sampleSize: 2500, approve: 43, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-06-07", sampleSize: 2500, approve: 43, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-31", sampleSize: 2500, approve: 39, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-25", sampleSize: 2500, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-17", sampleSize: 2500, approve: 42, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-10", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-05-03", sampleSize: 2500, approve: 42, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-26", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-19", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-12", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-04-05", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-29", sampleSize: 2500, approve: 38, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-22", sampleSize: 2500, approve: 39, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-15", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-08", sampleSize: 2500, approve: 37, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-03-01", sampleSize: 2500, approve: 40, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-22", sampleSize: 2500, approve: 37, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-15", sampleSize: 2500, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-08", sampleSize: 2500, approve: 43, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-02-01", sampleSize: 2500, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-25", sampleSize: 2500, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-18", sampleSize: 2500, approve: 39, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-11", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2018-01-04", sampleSize: 2500, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-28", sampleSize: 2500, approve: 40, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-21", sampleSize: 2500, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-14", sampleSize: 2500, approve: 35, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-12-07", sampleSize: 2500, approve: 34, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-30", sampleSize: 2500, approve: 35, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-21", sampleSize: 2500, approve: 35, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-16", sampleSize: 2500, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-09", sampleSize: 2500, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-11-02", sampleSize: 2500, approve: 34, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-26", sampleSize: 2500, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-19", sampleSize: 2500, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-12", sampleSize: 2500, approve: 31, disapprove: 63, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-10-05", sampleSize: 2500, approve: 32, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-28", sampleSize: 2500, approve: 29, disapprove: 65, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-21", sampleSize: 2500, approve: 33, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-14", sampleSize: 2500, approve: 31, disapprove: 62, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-09-07", sampleSize: 2500, approve: 34, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-31", sampleSize: 2500, approve: 32, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-24", sampleSize: 2500, approve: 29, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-17", sampleSize: 2500, approve: 30, disapprove: 64, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-10", sampleSize: 2500, approve: 36, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-08-03", sampleSize: 2500, approve: 32, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-27", sampleSize: 2500, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-20", sampleSize: 2500, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-13", sampleSize: 2500, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-07-06", sampleSize: 2500, approve: 36, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-29", sampleSize: 2500, approve: 36, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-22", sampleSize: 2500, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-15", sampleSize: 2500, approve: 35, disapprove: 58, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-08", sampleSize: 2500, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-06-01", sampleSize: 2500, approve: 33, disapprove: 61, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-25", sampleSize: 2500, approve: 37, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-18", sampleSize: 2500, approve: 34, disapprove: 60, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-11", sampleSize: 2500, approve: 37, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-05-04", sampleSize: 2500, approve: 39, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-27", sampleSize: 2500, approve: 38, disapprove: 55, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-20", sampleSize: 2500, approve: 42, disapprove: 52, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-13", sampleSize: 2500, approve: 41, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-04-06", sampleSize: 2500, approve: 36, disapprove: 57, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-30", sampleSize: 2500, approve: 35, disapprove: 59, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-23", sampleSize: 2500, approve: 38, disapprove: 56, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-16", sampleSize: 2500, approve: 40, disapprove: 54, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-09", sampleSize: 2500, approve: 42, disapprove: 53, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-03-02", sampleSize: 2500, approve: 45, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-23", sampleSize: 2500, approve: 45, disapprove: 51, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-16", sampleSize: 2500, approve: 46, disapprove: 48, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-09", sampleSize: 2500, approve: 45, disapprove: 50, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-02-02", sampleSize: 2500, approve: 46, disapprove: 49, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2017-01-26", sampleSize: 3000, approve: 47, disapprove: 47, quality: "A+" },
  
                   
                ] 
            },
            { 
                id: 'race2024', name: '2024 Presidential Race', baseId: 'race2024', category: '2024 Election', isRace: true, 
                candidates: ['Trump', 'Harris'], pollFields: ['approve', 'disapprove'], 
                colors: ['var(--trump-color)', 'var(--harris-color)'], directColors: ['#ef4444', '#3b82f6'], 
                colorGlow: ['var(--trump-color-glow)', 'var(--harris-color-glow)'], directGlowColors: ['rgba(239,68,68,0.4)', 'rgba(59,130,246,0.4)'],
                polls: [ 
                     /* ======================= RASMUSSEN REPORTS ======================= */
  { pollster: "Rasmussen Reports", date: "2024-10-29", sampleSize: 12546, approve: 49, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-09", sampleSize:  2244, approve: 48, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-10-02", sampleSize:  1762, approve: 49, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-25", sampleSize:  1820, approve: 48, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-18", sampleSize:  1855, approve: 49, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-11", sampleSize:  2390, approve: 49, disapprove: 47, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-09-04", sampleSize:  1838, approve: 47, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-28", sampleSize:  1893, approve: 48, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-21", sampleSize:  1893, approve: 49, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-14", sampleSize:  1885, approve: 49, disapprove: 45, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-08-07", sampleSize:  1794, approve: 49, disapprove: 44, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-31", sampleSize:  2163, approve: 49, disapprove: 44, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2024-07-24", sampleSize:  1074, approve: 50, disapprove: 43, quality: "A+" },


  /* ========================= ATLAS INTEL ========================== */
  { pollster: "AtlasIntel",        date: "2024-11-04", sampleSize: 2703, approve: 50, disapprove: 49, quality: "A+" },
  { pollster: "AtlasIntel",        date: "2024-11-02", sampleSize: 2463, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "AtlasIntel",        date: "2024-10-31", sampleSize: 3490, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "AtlasIntel",        date: "2024-10-29", sampleSize: 3032, approve: 50, disapprove: 48, quality: "A+" },
  { pollster: "AtlasIntel",        date: "2024-10-17", sampleSize: 4180, approve: 51, disapprove: 48, quality: "A+" },
  { pollster: "AtlasIntel",        date: "2024-09-12", sampleSize: 1775, approve: 51, disapprove: 48, quality: "A+" },

  /* ============================ TIPP ============================== */
  { pollster: "TIPP Insights",     date: "2024-11-04", sampleSize: 1863, approve: 48, disapprove: 48, quality: "A+" },
  { pollster: "TIPP Insights",     date: "2024-09-13", sampleSize: 1721, approve: 43, disapprove: 47, quality: "A+" },

  /* ========================= EMERSON COLLEGE ====================== */
  { pollster: "Emerson College",   date: "2024-11-02", sampleSize: 1000, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Emerson College",   date: "2024-10-24", sampleSize: 1000, approve: 49, disapprove: 49, quality: "A+" },
  { pollster: "Emerson College",   date: "2024-10-16", sampleSize: 1000, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Emerson College",   date: "2024-10-01", sampleSize: 1000, approve: 49, disapprove: 50, quality: "A+" },
  { pollster: "Emerson College",   date: "2024-09-04", sampleSize: 1000, approve: 47, disapprove: 49, quality: "A+" },
  { pollster: "Emerson College",   date: "2024-08-14", sampleSize: 1000, approve: 46, disapprove: 50, quality: "A+" },


  /* ========================= NYT / SIENA ========================== */
  { pollster: "NYT/Siena College", date: "2024-10-23", sampleSize: 2516, approve: 48, disapprove: 48, quality: "A+" },
  { pollster: "NYT/Siena College", date: "2024-10-06", sampleSize: 3385, approve: 46, disapprove: 49, quality: "A+" },
  { pollster: "NYT/Siena College", date: "2024-09-16", sampleSize: 2437, approve: 47, disapprove: 47, quality: "A+" },
  { pollster: "NYT/Siena College", date: "2024-09-06", sampleSize: 1695, approve: 48, disapprove: 47, quality: "A+" },
  { pollster: "NYT/Siena College", date: "2024-07-24", sampleSize: 1142, approve: 48, disapprove: 47, quality: "A+" },

  /* ========================= I&I / TIPP =========================== */
  { pollster: "I&I/TIPP",          date: "2024-10-04", sampleSize:  997, approve: 46, disapprove: 49, quality: "A+" },
  { pollster: "I&I/TIPP",          date: "2024-08-30", sampleSize: 1386, approve: 45, disapprove: 48, quality: "A+" },
  { pollster: "I&I/TIPP",          date: "2024-08-02", sampleSize: 1326, approve: 45, disapprove: 46, quality: "A+" }
                ]
            },
            { 
                id: 'generic_ballot', name: 'Generic Congressional Ballot', shortName: 'Generic Ballot', category: '2024 Election', isRace: true, 
                candidates: ['Republican', 'Democrat'], pollFields: ['approve', 'disapprove'], 
                colors: ['var(--trump-color)', 'var(--harris-color)'], directColors: ['#ef4444', '#3b82f6'], 
                colorGlow: ['var(--trump-color-glow)', 'var(--harris-color-glow)'], directGlowColors: ['rgba(239,68,68,0.4)', 'rgba(59,130,246,0.4)'],
                polls: [ 
                    
  /* ========== Quantus Insights (RV, n = 1 000) ========== */
  { pollster: "Quantus Insights", date: "2025-07-16", sampleSize: 1000, approve: 42, disapprove: 44, quality: "A+" },
  { pollster: "Quantus Insights", date: "2025-06-11", sampleSize: 1000, approve: 43, disapprove: 43, quality: "A+" },
  { pollster: "Quantus Insights", date: "2025-06-04", sampleSize: 1000, approve: 45, disapprove: 46, quality: "A+" },
  { pollster: "Quantus Insights", date: "2025-05-07", sampleSize: 1000, approve: 45, disapprove: 45, quality: "A+" },
  { pollster: "Quantus Insights", date: "2025-03-27", sampleSize: 1000, approve: 46, disapprove: 45, quality: "A+" },

  /* ========== Big Data Poll (RV) ========== */
  { pollster: "Big Data Poll",    date: "2025-07-14", sampleSize: 3022, approve: 41, disapprove: 42, quality: "A+" },
  { pollster: "Big Data Poll",    date: "2025-05-05", sampleSize: 3128, approve: 42, disapprove: 40, quality: "A+" },

  /* ========== Emerson College (RV) ========== */
  { pollster: "Emerson College",  date: "2025-06-25", sampleSize: 1000, approve: 40, disapprove: 43, quality: "A+" },
  { pollster: "Emerson College",  date: "2025-03-03", sampleSize: 1000, approve: 41, disapprove: 44, quality: "A+" },

  /* ========== AtlasIntel (Adults) ========== */
    { pollster: "AtlasIntel",       date: "2025-07-18", sampleSize: 3469, approve: 43, disapprove: 51, quality: "A+" },
    { pollster: "AtlasIntel",       date: "2025-05-27", sampleSize: 3469, approve: 42, disapprove: 51, quality: "A+" },

  /* ========== Rasmussen Reports (LV) ========== */
  { pollster: "Rasmussen Reports", date: "2025-07-21", sampleSize: 1012, approve: 42, disapprove: 46, quality: "A+" },
  { pollster: "Rasmussen Reports", date: "2025-05-15", sampleSize: 1012, approve: 44, disapprove: 45, quality: "A+" },

  /* ========== NYT / Siena College (RV) ========== */
  { pollster: "NYT/Siena College", date: "2025-04-24", sampleSize:  913, approve: 44, disapprove: 47, quality: "A+" },

  /* ========== Fabrizio &&nbsp;Anzalone (RV) ========== */
  { pollster: "Fabrizio & Anzalone", date: "2025-02-01", sampleSize: 3000, approve: 43, disapprove: 43, quality: "A+" }
                ] 
            }
        ];
        
        const swingStates = {
            'PA': 'Pennsylvania', 'MI': 'Michigan', 'AZ': 'Arizona',
            'GA': 'Georgia', 'NV': 'Nevada'
        };
        const swingStatePollData = { 
            'PA': [ /* — Michigan (A‑quality polls, Jul – Nov 2024) — */

/* —— AtlasIntel —— */
{ p:"AtlasIntel",        d:"2024-11-04", s:1840, a:50, b:49, q:"A+" },
{ p:"AtlasIntel",        d:"2024-11-02", s:2049, a:50, b:48, q:"A+" },
{ p:"AtlasIntel",        d:"2024-10-30", s:1738, a:49, b:48, q:"A+" },
{ p:"AtlasIntel",        d:"2024-10-29", s:1299, a:50, b:47, q:"A+" },
{ p:"AtlasIntel",        d:"2024-10-17", s:2048, a:50, b:47, q:"A+" },
{ p:"AtlasIntel",        d:"2024-09-25", s:1775, a:51, b:48, q:"A+" },

/* —— NYT/Siena —— */
{ p:"NYT/Siena",         d:"2024-11-02", s:1527, a:48, b:48, q:"A+" },
{ p:"NYT/Siena",         d:"2024-10-10", s: 857, a:47, b:50, q:"A+" },
{ p:"NYT/Siena",         d:"2024-09-16", s:1082, a:46, b:50, q:"A+" },
{ p:"NYT/Siena",         d:"2024-08-09", s: 693, a:46, b:50, q:"A+" },
{ p:"NYT/Siena",         d:"2024-11-03", s: 600, a:48, b:44, q:"A+" },

/* —— Trafalgar Group —— */
{ p:"Trafalgar Group",   d:"2024-11-03", s:1089, a:48, b:47, q:"A+" },
{ p:"Trafalgar Group",   d:"2024-10-19", s:1084, a:46, b:43, q:"A+" },
{ p:"Trafalgar Group",   d:"2024-09-29", s:1090, a:48, b:45, q:"A+" },
{ p:"Trafalgar Group",   d:"2024-08-30", s:1082, a:47, b:45, q:"A+" },
{ p:"Trafalgar Group",   d:"2024-08-08", s:1000, a:46, b:44, q:"A+" },

/* —— Echelon Insights —— */
{ p:"Echelon Insights",  d:"2024-10-30", s: 600, a:52, b:46, q:"A+" },

/* —— Rasmussen Reports —— */
{ p:"Rasmussen Reports", d:"2024-10-28", s: 849, a:49, b:47, q:"A+" },
{ p:"Rasmussen Reports", d:"2024-10-13", s:1072, a:50, b:47, q:"A+" },
{ p:"Rasmussen Reports", d:"2024-09-22", s:1202, a:48, b:48, q:"A+" },
{ p:"Rasmussen Reports", d:"2024-08-17", s:1312, a:47, b:46, q:"A+" },

/* —— Fabrizio/Anzalone —— */
{ p:"Fabrizio/Anzalone", d:"2024-09-24", s: 600, a:47, b:50, q:"A+" },

/* —— Emerson / The Hill‑Emerson —— */
{ p:"Emerson College",   d:"2024-11-02", s:1000, a:49, b:48, q:"A+" },
{ p:"Emerson College",   d:"2024-10-22", s: 860, a:49, b:48, q:"A+" },
{ p:"Emerson College",   d:"2024-10-08", s:1000, a:49, b:48, q:"A+" },
{ p:"Emerson College",   d:"2024-09-28", s:1000, a:48, b:48, q:"A+" },
{ p:"Emerson College",   d:"2024-09-18", s: 880, a:48, b:47, q:"A+" },
{ p:"Emerson College",   d:"2024-08-28", s: 950, a:48, b:48, q:"A+" },
{ p:"Emerson College",   d:"2024-08-14", s:1000, a:49, b:48, q:"A+" },
{ p:"Emerson College",   d:"2024-07-23", s: 850, a:48, b:46, q:"A+" },


 

],
            'MI': [

 
  
  /* ——— AtlasIntel ——— */
  {p:"AtlasIntel",        d:"2024-11-04", s:1114, a:50, b:48, m:+2, q:"A+"},
  {p:"AtlasIntel",        d:"2024-11-02", s:1198, a:50, b:48, m:+2, q:"A+"},
  {p:"AtlasIntel",        d:"2024-10-30", s:1136, a:49, b:49, m: 0, q:"A+"},
  {p:"AtlasIntel",        d:"2024-10-29", s: 983, a:49, b:48, m:+1, q:"A+"},
  {p:"AtlasIntel",        d:"2024-10-17", s:1529, a:50, b:47, m:+3, q:"A+"},
  {p:"AtlasIntel",        d:"2024-09-25", s: 918, a:51, b:47, m:+4, q:"A+"},

  /* ——— Trafalgar Group ——— */
  {p:"Trafalgar Group",   d:"2024-11-03", s:1079, a:48, b:47, m:+1, q:"A+"},
  {p:"Trafalgar Group",   d:"2024-10-20", s:1090, a:46, b:44, m:+2, q:"A+"},
  {p:"Trafalgar Group",   d:"2024-09-30", s:1086, a:47, b:45, m:+2, q:"A+"},
  {p:"Trafalgar Group",   d:"2024-08-30", s:1089, a:47, b:47, m: 0, q:"A+"},

  /* ——— Rasmussen Reports ——— */
  {p:"Rasmussen Reports", d:"2024-11-01", s: 908, a:48, b:49, m:-1, q:"A+"},
  {p:"Rasmussen Reports", d:"2024-10-14", s:1058, a:48, b:48, m: 0, q:"A+"},
  {p:"Rasmussen Reports", d:"2024-09-22", s:1086, a:48, b:48, m: 0, q:"A+"},
  {p:"Rasmussen Reports", d:"2024-08-17", s:1093, a:47, b:48, m:-1, q:"A+"},

  /* ——— Emerson / The Hill‑Emerson ——— */
  {p:"The Hill/Emerson",  d:"2024-11-02", s: 790, a:48, b:50, m:-2, q:"A+"},
  {p:"Emerson",           d:"2024-10-27", s:1000, a:49, b:48, m:+1, q:"A+"},
  {p:"The Hill/Emerson",  d:"2024-10-08", s: 950, a:49, b:49, m: 0, q:"A+"},
  {p:"Emerson",           d:"2024-10-08", s: 900, a:48, b:47, m:+1, q:"A+"},
  {p:"The Hill/Emerson",  d:"2024-09-18", s: 875, a:47, b:49, m:-2, q:"A+"},
  {p:"Emerson",           d:"2024-09-18", s: 895, a:48, b:48, m: 0, q:"A+"},
  {p:"The Hill/Emerson",  d:"2024-08-28", s: 800, a:47, b:50, m:-3, q:"A+"},
  {p:"Emerson",           d:"2024-07-23", s: 800, a:46, b:45, m:+1, q:"A+"},

  /* ——— NYT / Siena College ——— */
  {p:"NYT/Siena College", d:"2024-11-03", s: 616, a:46, b:48, m:-2, q:"A+"},
  {p:"NYT/Siena College", d:"2024-11-02", s: 998, a:47, b:47, m: 0, q:"A+"},
  {p:"NYT/Siena College", d:"2024-09-26", s: 688, a:47, b:48, m:-1, q:"A+"},
  {p:"NYT/Siena College", d:"2024-08-08", s: 619, a:46, b:50, m:-4, q:"A+"},

  /* ——— Echelon Insights ——— */
  {p:"Echelon Insights",  d:"2024-10-30", s: 600, a:48, b:48, m: 0, q:"A+"},

  /* ——— Fabrizio / Anzalone ——— */
  {p:"Fabrizio/Anzalone", d:"2024-10-08", s: 600, a:49, b:48, m:+1, q:"A+"},
  {p:"Fabrizio/Anzalone", d:"2024-08-11", s: 600, a:48, b:48, m: 0, q:"A+"}







],
            'WI': [
  /* ——— AtlasIntel ——— */

  /* ——— Wisconsin (all polls, latest → earliest) ——— */

 
  /* ——— Wisconsin (all polls, latest → earliest) ——— */

  /* AtlasIntel */
  { p:"AtlasIntel",         d:"2024-11-04", s:869,  a:49, b:50, q:"A+" },
  { p:"AtlasIntel",         d:"2024-11-02", s:728,  a:49, b:50, q:"A+" },
  { p:"AtlasIntel",         d:"2024-10-31", s:673,  a:49, b:49, q:"A+" },
  { p:"AtlasIntel",         d:"2024-10-29", s:1470, a:49, b:49, q:"A+" },
  { p:"AtlasIntel",         d:"2024-10-17", s:932,  a:49, b:48, q:"A+" },
  { p:"AtlasIntel",         d:"2024-09-25", s:1077, a:48, b:50, q:"A+" },

  /* Trafalgar Group */
  { p:"Trafalgar Group",    d:"2024-11-03", s:1086, a:48, b:47, q:"A-" },
  { p:"Trafalgar Group",    d:"2024-10-20", s:1083, a:47, b:47, q:"A-" },
  { p:"Trafalgar Group",    d:"2024-09-30", s:1079, a:46, b:47, q:"A-" },
  { p:"Trafalgar Group",    d:"2024-08-30", s:1083, a:46, b:47, q:"A-" },

  /* Echelon Insights */
  { p:"Echelon Insights",   d:"2024-10-30", s:600,  a:49, b:49, q:"B+" },

  /* Rasmussen Reports */
  { p:"Rasmussen Reports",  d:"2024-10-29", s:818,  a:47, b:50, q:"A+" },
  { p:"Rasmussen Reports",  d:"2024-10-14", s:1004, a:47, b:49, q:"A+" },
  { p:"Rasmussen Reports",  d:"2024-09-22", s:1071, a:49, b:49, q:"A+" },
  { p:"Rasmussen Reports",  d:"2024-08-19", s:1099, a:48, b:47, q:"A+" },

  /* Fabrizio / Anzalone */
  { p:"Fabrizio/Anzalone",  d:"2024-09-14", s:600,  a:49, b:48, q:"A-" },

  /* The Hill / Emerson College series */
  { p:"Emerson College",    d:"2024-11-02", s:800,  a:49, b:49, q:"A"  },
  { p:"Emerson College",    d:"2024-10-22", s:800,  a:48, b:49, q:"A"  },
  { p:"Emerson College",    d:"2024-10-08", s:1000, a:49, b:49, q:"A"  },
  { p:"Emerson College",    d:"2024-09-18", s:1000, a:48, b:49, q:"A"  },
  { p:"Emerson College",    d:"2024-08-28", s:850,  a:48, b:49, q:"A"  },
  { p:"Emerson College",    d:"2024-07-23", s:845,  a:47, b:47, q:"A"  },

  /* NYT / Siena College */
  { p:"NYT/Siena College",  d:"2024-11-03", s:603,  a:46, b:48, q:"A+" },
  { p:"NYT/Siena College",  d:"2024-11-02", s:1305, a:49, b:47, q:"A+" },
  { p:"NYT/Siena College",  d:"2024-09-26", s:680,  a:49, b:47, q:"A+" },
  { p:"NYT/Siena College",  d:"2024-08-08", s:661,  a:50, b:46, q:"A+" }



],
            'AZ': [  /* —— Arizona (selected pollsters, July – Nov 2024) —— */
{ p:"AtlasIntel",      d:"2024-11-04", s: 875,  a:52, b:47, q:"A+" },
{ p:"Trafalgar Group", d:"2024-11-03", s:1090, a:49, b:47, q:"A+" },
{ p:"AtlasIntel",      d:"2024-11-02", s: 967,  a:52, b:46, q:"A+" },
{ p:"Emerson College", d:"2024-11-02", s: 900,  a:51, b:48, q:"A+" },
{ p:"NYT/Siena",       d:"2024-11-02", s:1025, a:48, b:44, q:"A+" },  // RV
{ p:"NYT/Siena",       d:"2024-11-02", s:1025, a:49, b:45, q:"A+" },  // LV

/* Late Oct 2024 */
{ p:"SoCal Strategies",d:"2024-10-31", s: 750,  a:50, b:49, q:"A+" },
{ p:"AtlasIntel",      d:"2024-10-31", s:1005, a:51, b:47, q:"A+" },
{ p:"Rasmussen",       d:"2024-10-29", s: 803,  a:48, b:46, q:"A+" },
{ p:"AtlasIntel",      d:"2024-10-29", s:1458, a:51, b:47, q:"A+" },
{ p:"Trafalgar Group", d:"2024-10-26", s:1094, a:48, b:46, q:"A+" },
{ p:"Emerson College", d:"2024-10-23", s: 915,  a:51, b:48, q:"A+" },
{ p:"TIPP Insights",   d:"2024-10-16", s:1029, a:46, b:49, q:"A+" },  // RV
{ p:"TIPP Insights",   d:"2024-10-16", s: 813,  a:49, b:48, q:"A+" },  // LV
{ p:"NYT/Siena",       d:"2024-10-10", s: 808,  a:51, b:45, q:"A+" },  // RV
{ p:"NYT/Siena",       d:"2024-10-10", s: 808,  a:51, b:46, q:"A+" },  // LV
{ p:"Emerson College", d:"2024-10-08", s:1000, a:51, b:48, q:"A+" },
{ p:"SoCal Strategies",d:"2024-10-07", s: 735,  a:48, b:49, q:"A+" },
{ p:"AtlasIntel",      d:"2024-10-05", s:1440, a:49, b:49, q:"A+" },

/* September 2024 */
{ p:"Rasmussen",       d:"2024-09-22", s:1030, a:49, b:47, q:"A+" },
{ p:"AtlasIntel",      d:"2024-09-25", s: 946, a:50, b:49, q:"A+" },
{ p:"TIPP Insights",   d:"2024-09-05", s:1015, a:46, b:46, q:"A+" },  // RV
{ p:"TIPP Insights",   d:"2024-09-05", s: 949, a:47, b:47, q:"A+" },  // LV
{ p:"Emerson College", d:"2024-09-28", s: 920, a:52, b:48, q:"A+" },
{ p:"Emerson College", d:"2024-09-18", s: 868, a:50, b:49, q:"A+" },
{ p:"Trafalgar Group", d:"2024-09-12", s:1088, a:47, b:46, q:"A+" },

/* August 2024 */
{ p:"Rasmussen",       d:"2024-08-17", s:1187, a:47, b:45, q:"A+" },
{ p:"Emerson College", d:"2024-08-28", s: 720, a:51, b:48, q:"A+" },
{ p:"Trafalgar Group", d:"2024-08-08", s:1092, a:48, b:47, q:"A+" }
],
            'GA': [/* — Pennsylvania (selected A‑plus pollsters, Jul – Nov 2024) — */
/* ——— Georgia (latest → earliest, concise syntax) ——— */

  { p:"AtlasIntel",        d:"2024-11-04", s:1112, a:50, b:48, q:"A+" },
  { p:"AtlasIntel",        d:"2024-11-02", s:1174, a:50, b:48, q:"A+" },

  { p:"Emerson College",   d:"2024-11-02", s:800,  a:50, b:49, q:"A+" },
  { p:"NYT/Siena College", d:"2024-11-02", s:1004, a:47, b:48, q:"A+" },

  { p:"AtlasIntel",        d:"2024-10-31", s:1212, a:50, b:48, q:"A+" },
  { p:"AtlasIntel",        d:"2024-10-29", s:1429, a:51, b:48, q:"A+" },
  { p:"Rasmussen Reports", d:"2024-10-28", s:910,  a:51, b:46, q:"A+" },
  { p:"AtlasIntel",        d:"2024-10-17", s:1411, a:50, b:48, q:"A+" },
  { p:"TIPP Insights",     d:"2024-10-16", s:813,  a:49, b:48, q:"A+" },

  { p:"Emerson College",   d:"2024-10-08", s:1000, a:49, b:48, q:"A+" },

  { p:"AtlasIntel",        d:"2024-09-25", s:1200, a:50, b:49, q:"A+" },
  { p:"Rasmussen Reports", d:"2024-09-22", s:1152, a:50, b:47, q:"A+" },
  { p:"NYT/Siena College", d:"2024-09-21", s:682,  a:49, b:45, q:"A+" },
  { p:"TIPP Insights",     d:"2024-09-18", s:835,  a:48, b:48, q:"A+" },

  { p:"Emerson College",   d:"2024-08-28", s:800,  a:48, b:49, q:"A+" },
  { p:"NYT/Siena College", d:"2024-08-14", s:661,  a:50, b:46, q:"A+" },

  { p:"Emerson College",   d:"2024-07-23", s:800,  a:48, b:46, q:"A+" }

],
            'NV': [

  /* ——— Nevada compact list (latest → earliest) ——— */

  /* AtlasIntel */
  {p:"AtlasIntel", d:"2024-11-04", s:707,  a:50, b:47, q:"A+"},
  {p:"NYT/Siena College", d:"2024-11-03", s:611,  a:50, b:42, q:"A+"},   // Trump +8
  {p:"AtlasIntel", d:"2024-11-02", s:782,  a:52, b:46, q:"A+"},
  {p:"NYT/Siena College", d:"2024-11-02", s:1010, a:46, b:49, q:"A+"},   // Harris +3
  {p:"Emerson",  d:"2024-11-02", s:840,  a:48, b:48, q:"A+"},

  {p:"AtlasIntel", d:"2024-10-30", s:845,  a:51, b:47, q:"A+"},
  {p:"Rasmussen",  d:"2024-10-28", s:767,  a:49, b:47, q:"A+"},
  {p:"Trafalgar",  d:"2024-10-28", s:1082, a:48, b:48, q:"A+"},
  {p:"Emerson",    d:"2024-10-31", s:700,  a:47, b:48, q:"A+"},
  {p:"AtlasIntel", d:"2024-10-29", s:1083, a:49, b:48, q:"A+"},
  {p:"AtlasIntel", d:"2024-10-17", s:1171, a:48, b:48, q:"A+"},
  {p:"Fabrizio/Anzalone", d:"2024-10-15", s:600,  a:49, b:47, q:"A+"},
  {p:"Rasmussen",  d:"2024-10-14", s:748,  a:49, b:47, q:"A+"},
  {p:"Emerson",    d:"2024-10-08", s:900,  a:47, b:48, q:"A+"},

  {p:"AtlasIntel", d:"2024-09-25", s:858,  a:48, b:51, q:"A+"},
  {p:"Rasmussen",  d:"2024-09-22", s:738,  a:49, b:48, q:"A+"},
  {p:"Trafalgar",  d:"2024-09-13", s:1079, a:44, b:45, q:"A+"},
  {p:"Emerson",    d:"2024-09-18", s:895,  a:48, b:48, q:"A+"},

  {p:"The Hill/Emerson", d:"2024-08-28", s:1168, a:48, b:49, q:"A+"},
  {p:"NYT/Siena College", d:"2024-08-15", s:677,  a:48, b:47, q:"A+"},
  {p:"Trafalgar",  d:"2024-08-08", s:1000, a:48, b:45, q:"A+"},
  {p:"Rasmussen",  d:"2024-08-19", s:980,  a:48, b:46, q:"A+"},

  /* add earlier polls if needed … */


],
            'NC': [],
            'NH': [{p:"UNH",d:"2024-06-26",s:600,a:46,b:50,q:"A-"},{p:"St. Anselm",d:"2024-06-12",s:700,a:47,b:49,q:"B"},{p:"Emerson",d:"2024-05-30",s:800,a:48,b:49,q:"A-"}],
            'MN': [{ p:"AtlasIntel",                    d:"2024-11-04", s:2065, a:49, b:47, q:"A+" },
  { p:"Research Co.",                  d:"2024-11-03", s:450,  a:51, b:44, q:"B"  },
  { p:"ActiVote",                      d:"2024-11-01", s:400,  a:52, b:48, q:"B+" },
  { p:"SurveyUSA",                     d:"2024-10-28", s:728,  a:51, b:43, q:"B"  },
  { p:"Rasmussen Reports",             d:"2024-10-26", s:959,  a:50, b:47, q:"A+" },
  { p:"CES/YouGov",                    d:"2024-10-25", s:1275, a:53, b:43, q:"B+" },
  { p:"Embold Research/MinnPost",      d:"2024-10-22", s:1734, a:48, b:45, q:"B+" },
  { p:"ActiVote",                      d:"2024-10-09", s:400,  a:53, b:47, q:"B+" },
  { p:"SurveyUSA",                     d:"2024-09-26", s:646,  a:50, b:44, q:"B"  },
  { p:"Rasmussen Reports",             d:"2024-09-22", s:993,  a:49, b:46, q:"A+" },
  { p:"Mason‑Dixon",                   d:"2024-09-18", s:800,  a:48, b:43, q:"B"  },
  { p:"Morning Consult",               d:"2024-09-18", s:517,  a:50, b:43, q:"B"  },
  { p:"Embold Research/MinnPost",      d:"2024-09-08", s:1616, a:49, b:45, q:"B+" },
  { p:"Morning Consult",               d:"2024-09-08", s:501,  a:51, b:44, q:"B"  },
  { p:"SurveyUSA",                     d:"2024-08-29", s:635,  a:48, b:43, q:"B"  }]
        };

        Object.keys(swingStates).forEach(st => {
            const stateKey = st.toLowerCase();
            AGGREGATES.push({
                id: `race2024_${stateKey}`,
                baseId: 'race2024',
                state: stateKey,
                name: `${swingStates[st]}: Trump vs. Harris`,
                category: '2024 Election',
                isRace: true,
                candidates: ['Trump', 'Harris'],
                pollFields: ['approve', 'disapprove'],
                colors: ['var(--trump-color)', 'var(--harris-color)'], directColors: ['#ef4444', '#3b82f6'],
                colorGlow: ['var(--trump-color-glow)', 'var(--harris-color-glow)'], directGlowColors: ['rgba(239,68,68,0.4)', 'rgba(59,130,246,0.4)'],
                polls: swingStatePollData[st].map(poll => ({
                    pollster: poll.p, date: poll.d, sampleSize: poll.s, approve: poll.a, disapprove: poll.b, quality: poll.q
                }))
            });
        });

        // --- Application State ---
        let currentAggregateId = 'direction'; 
        let currentAggregate = AGGREGATES.find(a => a.id === currentAggregateId);
        let currentTerm = 'second'; 
        let currentLineWidth = 3;
        let currentLineDetail = 3; // 1-5 scale for line detail/sampling
        let animationFrameId = null;
        let wordCyclerInterval = null;
        let aggregatedData = { timestamps: [], values: [[], []], spreads: [], current: [null, null], pollPoints: [] };
        let pollPointGrid = {}; 
        let hoverDisplayState = { active: false, xChart: 0, date: null, points: [], spreadsInfo: [] };
        let chartDimensions = { margin: { top: 50, right: 30, bottom: 40, left: 30 }, width: 0, height: 0, yMin: DEFAULT_Y_MIN, yMax: DEFAULT_Y_MAX };
        let currentHoverIndex = null; 
        let hoveredPollPoint = null; 
        let highlightZoom = { isHighlighting: false, startX: null };
        let lastTouchTime = 0;
        let touchHoverActive = false;
        let currentZoomSelection = { isActive: false, startDate: null, endDate: null };
        let previousZoomStateBeforeCurrent = null; 
        let searchQuery = ''; 
        let selectedPollster = 'all'; 
        let filteredPolls = []; 
        let scrollerAnimationId = null;
        let isScrollerPaused = false;
        let currentTheme = 'dark';
        
        // Performance state
        let isProcessing = false;
        let renderQueue = [];
        let lastRenderTime = 0;
        let offscreenCanvas = null;
        let offscreenCtx = null;

        // --- DOM Element Cache ---
        const pageLoader = document.getElementById('pageLoader');
        const chartLoader = document.getElementById('chartLoader');
        const pollChart = document.getElementById('pollChart');
        const canvas = document.getElementById('chartCanvas');
        const ctx = canvas.getContext('2d');
        const fadeCanvas = document.getElementById('fadeCanvas');
        const fadeCtx = fadeCanvas.getContext('2d');
        const overlayCanvas = document.getElementById('overlayCanvas');
        const overlayCtx = overlayCanvas.getContext('2d');
        const pollList = document.getElementById('pollList');
        const noPolls = document.getElementById('noPolls');
        const pollListTable = document.getElementById('pollListTable');
        const currentDateEl = document.getElementById('current-date');
        const pollTooltip = document.getElementById('pollTooltip');
        const emptyState = document.getElementById('emptyState');
        const updateDateEl = document.getElementById('update-date');
        const miniAggregateContainer = document.getElementById('miniAggregateContainer');
        const miniAggregateScroller = document.getElementById('miniAggregateScroller');
        const hoverOverlayElements = document.getElementById('hoverOverlayElements');
        const hoverInfoTopContainer = document.querySelector('.hover-info-top-container');
        const hoverInfoDateEl = document.getElementById('hoverInfoDate');
        const hoverInfoSpreadEl = document.getElementById('hoverInfoSpread');
        const hoverValueItemElements = [];
        const glowEffectToggle = document.getElementById('glowEffectToggle');
        const lineThicknessSlider = document.getElementById('lineThicknessSlider');
        const lineDetailSlider = document.getElementById('lineDetailSlider');
        const pollDensitySlider = document.getElementById('pollDensitySlider');
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const resetZoomBtn = document.getElementById('resetZoomBtn');
        const fullRangeBtn = document.getElementById('fullRangeBtn');
        const yRangeDisplay = document.getElementById('yRangeDisplay');
        const dropdownSelected = document.getElementById('dropdownSelected');
        const dropdownOptions = document.getElementById('dropdownOptions');
        const selectedOptionText = document.getElementById('selectedOptionText');
        const stateDropdownContainer = document.getElementById('stateDropdownContainer');
        const stateDropdownSelected = document.getElementById('stateDropdownSelected');
        const stateDropdownOptions = document.getElementById('stateDropdownOptions');
        const selectedStateText = document.getElementById('selectedStateText');
        const comparativeChart = document.getElementById('comparativeChart');
        const comparativeOverlay = document.getElementById('comparativeOverlay');
        const comparativeBarsCanvas = document.getElementById('comparativeBarsCanvas'); 
        const comparativeBarsCtx = comparativeBarsCanvas.getContext('2d'); 
        const pollsterDropdownSelected = document.getElementById('pollsterDropdownSelected');
        const pollsterDropdownOptions = document.getElementById('pollsterDropdownOptions');
        const selectedPollsterText = document.getElementById('selectedPollsterText');
        const pollSearch = document.getElementById('pollSearch');
        const clearSearch = document.getElementById('clearSearch');
        const resetFiltersBtn = document.getElementById('resetFilters');
        const filteredModeIndicator = document.getElementById('filteredModeIndicator');
        const filterIndicatorText = document.getElementById('filterIndicatorText');
        const pollCountBadge = document.getElementById('pollCountBadge');
        const searchTags = document.querySelectorAll('.search-tag');
        const termSelector = document.getElementById('termSelector');
        const termOptions = document.querySelectorAll('.term-option');
        const themeToggle = document.getElementById('themeToggle');
        const darkModeIcon = document.getElementById('darkModeIcon');
        const lightModeIcon = document.getElementById('lightModeIcon');
        const minimalDarkIcon = document.getElementById('minimalDarkIcon');
        const cardGlow1 = document.getElementById('cardGlow1');
        const cardGlow2 = document.getElementById('cardGlow2');
        const highlightZoomRect = document.getElementById('highlightZoomRect');
        const mainTableValue1Header = document.getElementById('mainTableValue1Header');
        const mainTableValue2Header = document.getElementById('mainTableValue2Header');
        const mainTableMarginHeader = document.getElementById('mainTableMarginHeader');
        const downloadModal = document.getElementById('downloadModal');
        const downloadDataBtn = document.getElementById('downloadDataBtn');
        const downloadModalClose = document.getElementById('downloadModalClose');
        const downloadCancel = document.getElementById('downloadCancel');
        const downloadConfirm = document.getElementById('downloadConfirm');

        const idleCallback = window.requestIdleCallback
            ? (cb, opts) => window.requestIdleCallback(cb, opts)
            : (cb, opts) => setTimeout(cb, (opts && opts.timeout) || 0);

        // --- Sampling & Rendering Helpers ---
        
        function computeBasePollWeight(poll) {
            const qualityWeight = POLL_QUALITY_WEIGHTS[poll.quality] || 0.5;
            const sampleWeight = Math.sqrt(poll.sampleSize || 100) / 100;
            return qualityWeight * sampleWeight;
        }

        function preprocessPollData(){
            const processPollArray = arr => arr.map(p => {
                if(!(p.date instanceof Date)){
                    p.date = new Date(p.date + 'T12:00:00Z');
                }
                if(p.baseWeight === undefined){
                    p.baseWeight = computeBasePollWeight(p);
                }
                return p;
            });

            AGGREGATES.forEach(agg => {
                if(Array.isArray(agg.polls)){
                    agg.polls = processPollArray(agg.polls);
                }
                if(Array.isArray(agg.firstTermPolls)){
                    agg.firstTermPolls = processPollArray(agg.firstTermPolls);
                }
            });
        }

        function calculatePollWeightDirect(poll, referenceDate) {
            const pollDate = poll.date.getTime();
            const daysDiff = (referenceDate.getTime() - pollDate) / MS_PER_DAY;
            if (daysDiff < 0) return 0;
            const recencyWeight = Math.exp(-daysDiff / HALF_LIFE);
            const baseWeight = poll.baseWeight ?? computeBasePollWeight(poll);
            return baseWeight * recencyWeight;
        }
        
        function optimizedSampling(totalDays, lineDetail) {
            // lineDetail: 1 (very smooth) to 5 (very detailed)
            const baseInterval = Math.max(MIN_SAMPLING_INTERVAL, Math.min(MAX_SAMPLING_INTERVAL, Math.ceil(totalDays / 500)));
            const detailMultiplier = [4, 2.5, 1.5, 1, 0.7][lineDetail - 1] || 1;
            return Math.max(1, Math.ceil(baseInterval * detailMultiplier));
        }
        
        function adaptivePollPointDistribution(polls, maxPoints, timeRange) {
            if (polls.length <= maxPoints) return polls;
            
            // Group polls by time periods and ensure even distribution
            const periods = Math.min(20, Math.ceil(timeRange / (30 * MS_PER_DAY))); // ~monthly periods
            const pollsPerPeriod = Math.ceil(maxPoints / periods);
            
            const sortedPolls = [...polls].sort((a, b) => a.date.getTime() - b.date.getTime());
            const result = [];
            
            for (let i = 0; i < periods; i++) {
                const startTime = sortedPolls[0].date.getTime() + (timeRange * i / periods);
                const endTime = sortedPolls[0].date.getTime() + (timeRange * (i + 1) / periods);
                
                const periodPolls = sortedPolls.filter(p => 
                    p.date.getTime() >= startTime && p.date.getTime() < endTime
                );
                
                if (periodPolls.length > pollsPerPeriod) {
                    // Take evenly spaced polls from this period
                    const step = Math.ceil(periodPolls.length / pollsPerPeriod);
                    for (let j = 0; j < periodPolls.length; j += step) {
                        result.push(periodPolls[j]);
                    }
                } else {
                    result.push(...periodPolls);
                }
            }
            
            return result;
        }
        
        function progressiveRender(renderFunction, data, chunkSize = PROGRESSIVE_RENDER_CHUNK_SIZE) {
            return new Promise((resolve) => {
                let index = 0;
                
                function renderChunk() {
                    const start = index;
                    const end = Math.min(index + chunkSize, data.length);
                    
                    for (let i = start; i < end; i++) {
                        renderFunction(data[i], i);
                    }
                    
                    index = end;
                    
                    if (index < data.length) {
                        idleCallback(() => renderChunk(), { timeout: 16 });
                    } else {
                        resolve();
                    }
                }
                
                renderChunk();
            });
        }

        // --- Functions ---

        function getScreenSizeConfig() {
            const width = window.innerWidth;
            if (width < 768) {
                return { pollPointDensity: 15, miniChartPoints: 20, pollCircleSize: 6 };
            } else if (width < 1200) {
                return { pollPointDensity: 25, miniChartPoints: 30, pollCircleSize: 8 };
            } else {
                return { pollPointDensity: 35, miniChartPoints: 40, pollCircleSize: 8 };
            }
        }
        
        function getComputedColor(varString) {
            if (!varString || typeof varString !== 'string') return '#808080';
            if (varString.startsWith('#') || varString.startsWith('rgb')) return varString;
            
            let varName = varString.trim();
            if (varName.startsWith('var(')) varName = varName.substring(4, varName.length - 1).trim();
            if (!varName.startsWith('--')) varName = '--' + varName;
            
            try {
                const color = getComputedStyle(document.body).getPropertyValue(varName).trim();
                if (color) return color;
            } catch (e) { /* Fallback below */ }

            for (const agg of AGGREGATES) {
                const colorIndex = agg.colors ? agg.colors.indexOf(varString) : -1;
                if (colorIndex !== -1 && agg.directColors && agg.directColors[colorIndex]) return agg.directColors[colorIndex];
                
                const glowIndex = agg.colorGlow ? agg.colorGlow.indexOf(varString) : -1;
                if (glowIndex !== -1 && agg.directGlowColors && agg.directGlowColors[glowIndex]) return agg.directGlowColors[glowIndex];
            }
            return '#808080';
        }

        function convertToRgba(colorString, alpha) {
            if (!colorString) return `rgba(128,128,128,${alpha})`;
            if (colorString.startsWith('#')) { 
                let hex = colorString.slice(1); 
                if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; 
                if (hex.length !== 6) return `rgba(128,128,128,${alpha})`;
                const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16); 
                return `rgba(${r},${g},${b},${alpha})`;
            }
            if (colorString.startsWith('rgb')) { 
                const p = colorString.substring(colorString.indexOf('(')+1, colorString.lastIndexOf(')')).split(','); 
                return `rgba(${p[0].trim()},${p[1].trim()},${p[2].trim()},${alpha})`;
            }
            return colorString;
        }

        function initThemeToggle() { 
            const savedTheme = localStorage.getItem('theme') || 'dark';
            currentTheme = savedTheme;
            applyTheme(savedTheme);
            
            // Theme icon click handlers
            darkModeIcon.addEventListener('click', () => switchTheme('dark'));
            lightModeIcon.addEventListener('click', () => switchTheme('light'));
            minimalDarkIcon.addEventListener('click', () => switchTheme('minimal'));
            
            themeToggle.addEventListener('change', () => {
                if (themeToggle.checked) {
                    switchTheme('light');
                } else {
                    switchTheme('dark');
                }
            });
        }

        function switchTheme(theme) {
            currentTheme = theme;
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        }

        function applyTheme(theme) {
            document.body.classList.remove('dark-mode', 'light-mode', 'dark-mode-minimal');
            
            switch(theme) {
                case 'light':
                    document.body.classList.add('light-mode');
                    themeToggle.checked = true;
                    break;
                case 'minimal':
                    document.body.classList.add('dark-mode-minimal');
                    themeToggle.checked = false;
                    break;
                default:
                    document.body.classList.add('dark-mode');
                    themeToggle.checked = false;
            }
            
            if(aggregatedData.timestamps && aggregatedData.timestamps.length > 0){
                drawChart(false);
                drawComparativeChart();
                updateHoverState(currentHoverIndex);
            } else {
                generateGrid();
            }
            updateAllMiniAggregateCharts();
            updateTitle();
            updateDropdownMargins(); 
        }

        function formatDisplayDate(date) {
            if (!(date instanceof Date) || isNaN(date)) {
                return 'Invalid Date';
            }
            const months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
            return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`; 
        }

        function formatHoverDate(date) {
            if (!(date instanceof Date) || isNaN(date)) {
                return 'Invalid Date';
            }
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`; 
        }

        function formatDate(date) {
             if (!(date instanceof Date) || isNaN(date)) {
                return 'Invalid Date';
            }
            return date.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric', timeZone: 'UTC'});
        } 

        function formatQualityStars(quality){
            const rating = POLL_QUALITY_WEIGHTS[quality];
            if(typeof rating !== 'number') return 'N/A';
            const stars = Math.round(rating * 5);
            return '★'.repeat(stars) + '☆'.repeat(5 - stars);
        }

        function calculatePollWeight(poll, referenceDate){
            if (!(poll.date instanceof Date) || isNaN(poll.date)) return 0;
            return calculatePollWeightDirect(poll, referenceDate);
        }

        function getValuesAtDate(dateToFind) {
            if (!(dateToFind instanceof Date) || isNaN(dateToFind)) {
                return { values: [null, null], date: new Date(), index: -1 };
            }
            const timestamps = aggregatedData.timestamps;
            if (!timestamps || timestamps.length === 0) {
                return { values: [null, null], date: dateToFind, index: -1 };
            }

            const targetTime = dateToFind.getTime();
            let low = 0;
            let high = timestamps.length - 1;
            let closestIndex = 0;

            if (targetTime <= timestamps[0].getTime()) {
                closestIndex = 0;
            } else if (targetTime >= timestamps[high].getTime()) {
                closestIndex = high;
            } else {
                while (low <= high) {
                    const mid = Math.floor((low + high) / 2);
                    const midTime = timestamps[mid].getTime();

                    if (midTime < targetTime) {
                        low = mid + 1;
                    } else if (midTime > targetTime) {
                        high = mid - 1;
                    } else {
                        closestIndex = mid;
                        break;
                    }
                }
                if (low > high) {
                    if (high < 0) high = 0;
                    if (low >= timestamps.length) low = timestamps.length - 1;
                    
                    const diffHigh = Math.abs(timestamps[high].getTime() - targetTime);
                    const diffLow = Math.abs(timestamps[low].getTime() - targetTime);
                    closestIndex = diffLow < diffHigh ? low : high;
                }
            }

            const values = [];
            for (let i = 0; i < 2; i++) {
                values.push(aggregatedData.values[i] ? aggregatedData.values[i][closestIndex] : null);
            }
            return { values: values, date: timestamps[closestIndex], index: closestIndex };
        }
        
        function calculateAggregateFromPolls(pollList, refDate, field){
            let totalWeight = 0;
            let weightedSum = 0;
            if (!pollList || pollList.length === 0) return 0;
            pollList.forEach(poll => {
                if(poll.date.getTime() <= refDate.getTime()){
                    const daysDiff = (refDate.getTime() - poll.date.getTime()) / MS_PER_DAY;
                    const weight = (poll.baseWeight ?? computeBasePollWeight(poll)) * Math.exp(-daysDiff / HALF_LIFE);
                    totalWeight += weight;
                    weightedSum += poll[field] * weight;
                }
            });
            return totalWeight > 0 ? weightedSum / totalWeight : 0;
        }

       function calculateAllMargins() {
           return AGGREGATES.map(aggregateConfig => {
               let pollsUsed = getCurrentTermPolls(aggregateConfig, currentTerm);
               if (!pollsUsed || pollsUsed.length === 0) return { id: aggregateConfig.id, margin: 0 };
                
                const lastPollDate = new Date(Math.max(...pollsUsed.map(poll => poll.date.getTime())));
                
                let refDate = lastPollDate;
                if (aggregateConfig.isRace && lastPollDate.getTime() <= ELECTION_END_DATE_2024.getTime()) {
                    refDate = new Date(Math.min(lastPollDate.getTime(), ELECTION_END_DATE_2024.getTime()));
                } else if (aggregateConfig.id === 'trump' && currentTerm === 'first') {
                    refDate = new Date(Math.min(lastPollDate.getTime(), FIRST_TERM_END_DATE.getTime()));
                } else if (aggregateConfig.id === 'biden') {
                     refDate = new Date(Math.min(lastPollDate.getTime(), BIDEN_TERM_END_DATE.getTime()));
                }

                const sorted = [...pollsUsed].sort((a,b) => a.date.getTime() - b.date.getTime());
                const [vals1, vals2] = calculateSeriesValues(sorted, [refDate], aggregateConfig.pollFields[0], aggregateConfig.pollFields[1]);
                const aggVal1 = vals1[0];
                const aggVal2 = vals2[0];
                return { id: aggregateConfig.id, margin: (aggVal1 || 0) - (aggVal2 || 0) };
            });
        }
    
        function updateDropdownMargins() {
            const margins = calculateAllMargins();
            const options = document.querySelectorAll('#dropdownOptions .dropdown-option, #stateDropdownOptions .dropdown-option');
            options.forEach(option => {
                const aggregateId = option.dataset.aggregate;
                const aggregateConfig = AGGREGATES.find(agg => agg.id === aggregateId);
                const marginData = margins.find(m => m.id === aggregateId);
                const badge = option.querySelector('.option-badge');

                if (marginData && badge && aggregateConfig) {
                    const margin = marginData.margin;
                    let badgeText, badgeColor;
                    if (aggregateConfig.isRace) {
                        if (margin > 0) {
                            badgeText = `${aggregateConfig.candidates[0][0]} +${margin.toFixed(1)}`;
                            badgeColor = getComputedColor(aggregateConfig.colors[0]);
                        } else if (margin < 0) {
                            badgeText = `${aggregateConfig.candidates[1][0]} +${Math.abs(margin).toFixed(1)}`;
                            badgeColor = getComputedColor(aggregateConfig.colors[1]);
                        } else {
                            badgeText = 'Even';
                            badgeColor = getComputedColor('--text-muted');
                        }
                    } else {
                         badgeText = margin > 0 ? `+${margin.toFixed(1)}%` : `${margin.toFixed(1)}%`;
                         badgeColor = margin > 0 ? getComputedColor(aggregateConfig.colors[0]) : (margin < 0 ? getComputedColor(aggregateConfig.colors[1]) : getComputedColor('--text-muted'));
                    }
                    badge.textContent = badgeText;
                    badge.style.color = badgeColor;

                } else if (badge) {
                    badge.textContent = 'N/A';
                    badge.style.color = getComputedColor('--text-muted');
                }
            });
        }

        function getUniquePollsters(){
            const polls = getCurrentTermPolls(currentAggregate, currentTerm);
            if (!polls || polls.length === 0) return [];
            
            const pollsterCounts = polls.reduce((acc, poll) => {
                acc[poll.pollster] = (acc[poll.pollster] || 0) + 1;
                return acc;
            }, {});

            return Object.entries(pollsterCounts)
                         .sort(([nameA, countA], [nameB, countB]) => countB - countA)
                         .map(([name, count]) => ({ name, count }));
        }
    
        function getCurrentTermPolls(aggregateConfig, term = currentTerm) {
            if (!aggregateConfig) return [];
            if (aggregateConfig.id === 'trump' && term === 'first' && aggregateConfig.firstTermPolls) {
                return aggregateConfig.firstTermPolls;
            }
            return aggregateConfig.polls || [];
        }

        function updatePollsterDropdown(){
            pollsterDropdownOptions.innerHTML = '';
            const allOption = document.createElement('div');
            allOption.className = 'dropdown-option selected'; 
            allOption.dataset.pollster = 'all';
            allOption.innerHTML = `<i class="fas fa-globe option-icon"></i><span>All Pollsters</span>`;
            pollsterDropdownOptions.appendChild(allOption);
            
            const pollsters = getUniquePollsters(); 
            if (pollsters.length === 0) {
                selectedPollsterText.textContent = 'All Pollsters';
                return;
            }

            // Limit to top 5 pollsters
            const topPollsters = pollsters.slice(0, 5);

            const createOption = (pollster) => {
                 const option = document.createElement('div');
                option.className = 'dropdown-option'; 
                option.dataset.pollster = pollster.name;
                const initials = pollster.name.split(' ').map(word => word[0]).join('').substring(0,2).toUpperCase();
                option.innerHTML = `<div class="pollster-logo">${initials}</div><span>${pollster.name}</span><span class="option-badge">${pollster.count}</span>`;
                return option;
            }

            if (topPollsters.length > 0) {
                const header = document.createElement('div');
                header.className = 'dropdown-option-header';
                header.textContent = 'Top Pollsters';
                pollsterDropdownOptions.appendChild(header);
                topPollsters.forEach(p => pollsterDropdownOptions.appendChild(createOption(p)));
            }
            
            selectedPollster = 'all';
            selectedPollsterText.textContent = 'All Pollsters';
        }
    
        function _filterPollsForLineCalc(rawPolls, currentSelectedPollster, currentSearchQuery) {
            if (!rawPolls || rawPolls.length === 0) return [];
            let { fieldFilters, plainTextQuery } = parseSearchQuery(currentSearchQuery);
            let filtered = [...rawPolls];
            
            if (currentSelectedPollster !== 'all') {
                filtered = filtered.filter(poll => poll.pollster === currentSelectedPollster);
            }

            if (fieldFilters.length > 0) {
                filtered = filtered.filter(poll => fieldFilters.every(filter => checkPollAgainstFilter(poll, filter)));
            }

            if (plainTextQuery) {
                filtered = filtered.filter(poll => 
                    poll.pollster.toLowerCase().includes(plainTextQuery) || 
                    formatDate(poll.date).toLowerCase().includes(plainTextQuery)
                );
            }

            return filtered;
        }

        function parseSearchQuery(query) {
            const fieldRegex = /(pollster|date|sample|quality|margin):((?:>=|<=|>|<)?[\w\s+.-]+)/g;
            let fieldFilters = [];
            let match;
            while ((match = fieldRegex.exec(query)) !== null) {
                fieldFilters.push({ field: match[1], value: match[2].trim() });
            }
            const plainTextQuery = query.replace(fieldRegex, '').trim().toLowerCase();
            return { fieldFilters, plainTextQuery };
        }
        
        function checkPollAgainstFilter(poll, filter) {
            const pollValue1 = poll[currentAggregate.pollFields[0]];
            const pollValue2 = poll[currentAggregate.pollFields[1]];

            switch (filter.field) {
                case 'pollster':
                    return poll.pollster.toLowerCase().includes(filter.value);
                case 'date':
                    const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                    const shortMonthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
                    const pollDate = poll.date;
                    if (/^\d{4}$/.test(filter.value)) return pollDate.getFullYear().toString() === filter.value; 
                    const monthIndex = monthNames.findIndex(m => m.startsWith(filter.value)) !== -1 ? monthNames.findIndex(m => m.startsWith(filter.value)) : shortMonthNames.findIndex(m => m.startsWith(filter.value));
                    if (monthIndex !== -1) return pollDate.getMonth() === monthIndex; 
                    return formatDate(poll.date).toLowerCase().includes(filter.value);
                case 'quality':
                    return poll.quality.toLowerCase().includes(filter.value);
                case 'sample':
                case 'margin':
                    const opMatch = filter.value.match(/^(>=|<=|>|<)/);
                    const operator = opMatch ? opMatch[1] : null;
                    const numericValue = parseFloat(filter.value.replace(operator, ''));
                    if(isNaN(numericValue)) return false;
                    
                    const valueToTest = filter.field === 'sample' ? poll.sampleSize : (pollValue1 - pollValue2);

                    switch(operator) {
                        case '>=': return valueToTest >= numericValue;
                        case '<=': return valueToTest <= numericValue;
                        case '>': return valueToTest > numericValue;
                        case '<': return valueToTest < numericValue;
                        default: return valueToTest.toString().includes(filter.value);
                    }
                default:
                    return false;
            }
        }
        
        function applyFilters() { 
            let pollsToFilterFromForList = getCurrentTermPolls(currentAggregate, currentTerm);

            if (!pollsToFilterFromForList || pollsToFilterFromForList.length === 0) {
                filteredPolls = [];
                updateFilteredModeIndicator(); 
                return;
            }
    
            let filtered = [...pollsToFilterFromForList];
            if (selectedPollster !== 'all') {
                filtered = filtered.filter(poll => poll.pollster === selectedPollster);
            }
            
            const { fieldFilters, plainTextQuery } = parseSearchQuery(searchQuery);

            if (fieldFilters.length > 0) {
                filtered = filtered.filter(poll => fieldFilters.every(filter => checkPollAgainstFilter(poll, filter)));
            }
            
            if (plainTextQuery) {
                filtered = filtered.filter(poll => {
                    const margin = poll[currentAggregate.pollFields[0]] - poll[currentAggregate.pollFields[1]];
                    return (poll.pollster.toLowerCase().includes(plainTextQuery) ||
                            formatDate(poll.date).toLowerCase().includes(plainTextQuery) ||
                            poll.quality.toLowerCase().includes(plainTextQuery) ||
                            poll.sampleSize.toString().includes(plainTextQuery) ||
                            poll[currentAggregate.pollFields[0]].toString().includes(plainTextQuery) ||
                            poll[currentAggregate.pollFields[1]].toString().includes(plainTextQuery) ||
                            margin.toFixed(1).includes(plainTextQuery) || (margin > 0 && (`+${margin.toFixed(1)}`).includes(plainTextQuery))
                           );
                });
            }

            filteredPolls = filtered.map(poll => ({
                ...poll, 
                margin: poll[currentAggregate.pollFields[0]] - poll[currentAggregate.pollFields[1]] 
            }));
            filteredPolls.sort((a, b) => b.date.getTime() - a.date.getTime());
            updateFilteredModeIndicator();
        }

        function updateFilteredModeIndicator() {
            const isFiltered = selectedPollster !== 'all' || searchQuery.trim() !== '';
            filteredModeIndicator.classList.toggle('active', isFiltered);
            if (isFiltered) {
                if (selectedPollster !== 'all' && searchQuery.trim() !== '') {
                    filterIndicatorText.textContent = `Filtered: "${selectedPollster}" polls matching "${searchQuery}"`;
                } else if (selectedPollster !== 'all') {
                    filterIndicatorText.textContent = `Filtered: Showing ${selectedPollster} polls only`;
                } else if (searchQuery.trim() !== '') {
                    filterIndicatorText.textContent = `Filtered: Polls matching "${searchQuery}"`;
                }
            }
        }

        function setSelectedPollster(pollster){
            selectedPollster = pollster;
            selectedPollsterText.textContent = pollster === 'all' ? 'All Pollsters' : pollster;
            pollsterDropdownOptions.querySelectorAll('.dropdown-option').forEach(option => {
                option.classList.toggle('selected', option.dataset.pollster === pollster);
            });
            applyFilters();
            updateAggregation();
            renderPollList();
            if(aggregatedData.timestamps && aggregatedData.timestamps.length > 0){
                smartZoom();
                generateXAxisDates(true);
                drawChart();
                drawComparativeChart();
                updateHoverState(currentHoverIndex);
            } else {
                clearChart();
            }
        }

        function highlightSearchMatches(text, query){
            if(!query || !query.trim()) return String(text);
            const { plainTextQuery } = parseSearchQuery(query);
            if(!plainTextQuery) return String(text);

            const escapedQuery = plainTextQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedQuery})`,'gi');
            return String(text).replace(regex,'<span class="highlight-match">$1</span>');
        }

        function setSelectedTerm(term){
            currentTerm = term;
            termOptions.forEach(option => option.classList.toggle('selected', option.dataset.term === term));
            
            selectedPollster = 'all';
            selectedPollsterText.textContent = 'All Pollsters';
            pollSearch.value = '';
            searchQuery = '';
            clearSearch.style.display = 'none';
            undoLastZoomOrReset();
            updatePollsterDropdown();
            loadPolls();
            smartZoom();
            updateTitle();
            updateDropdownMargins();
            updateAllMiniAggregateCharts();
        }

        function loadPolls() {
            if (isProcessing) return; // Prevent concurrent loading
            
            chartLoader.classList.add('active');
            
            // Use idleCallback for non-critical UI updates
            idleCallback(() => {
                applyFilters(); 
                updateAggregation(); 
                
                // Progressive poll list rendering
                renderPollList().then(() => {
                    if (aggregatedData.timestamps && aggregatedData.timestamps.length > 0) {
                        emptyState.style.display = 'none';
                        generateXAxisDates(true); 
                        drawChart(true); // Enable animation for new data
                        drawComparativeChart();
                    } else {
                        clearChart(); 
                        emptyState.style.display = 'flex';
                    }
                    
                    termSelector.style.display = currentAggregate.id === 'trump' ? 'flex' : 'none';
                    updateHoverState(currentHoverIndex);
                    chartLoader.classList.remove('active');
                });
            }, { timeout: 150 });
        }

        function clearChart() { 
            const dpr = window.devicePixelRatio || 1;
            ctx.clearRect(0, 0, canvas.width/dpr, canvas.height/dpr); 
            fadeCtx.clearRect(0, 0, fadeCanvas.width/dpr, fadeCanvas.height/dpr);
            overlayCtx.clearRect(0, 0, overlayCanvas.width/dpr, overlayCanvas.height/dpr);
            drawComparativeChart(); 
            hoverDisplayState.active = false; 
            renderHoverOverlay();
            highlightZoomRect.style.display = 'none'; 
            generateGrid(); 
            document.querySelector('.legend').innerHTML = ''; 
            emptyState.style.display = 'flex';
        }

        function renderPollList(){ 
            pollList.innerHTML = '';
            if(filteredPolls.length === 0){
                noPolls.style.display = 'flex';
                pollListTable.style.display = 'none';
                return Promise.resolve();
            }
            noPolls.style.display = 'none';
            pollListTable.style.display = 'table';
            updatePollListHeaders(); 
            
            // Progressive rendering for large lists
            if (filteredPolls.length > 100) {
                return renderPollListProgressive();
            } else {
                renderPollListDirect();
                return Promise.resolve();
            }
        }
        
        function renderPollListDirect() {
            filteredPolls.forEach(poll => {
                pollList.appendChild(createPollTableRow(poll));
            });
        }
        
        async function renderPollListProgressive() {
            // Show loading indicator for large lists
            const loadingRow = document.createElement('tr');
            loadingRow.innerHTML = '<td colspan="8" style="text-align: center; padding: 20px; color: var(--text-secondary);">Loading polls...</td>';
            pollList.appendChild(loadingRow);
            
            // Render in chunks
            await progressiveRender(
                (poll, index) => {
                    if (index === 0) pollList.removeChild(loadingRow); // Remove loading indicator
                    pollList.appendChild(createPollTableRow(poll));
                }, 
                filteredPolls, 
                20 // Smaller chunks for UI responsiveness
            );
        }
        
        function createPollTableRow(poll) {
            const tableRow = document.createElement('tr');
            const weight = calculatePollWeight(poll, new Date());
            const marginValue = poll.margin; 
            const initials = poll.pollster.split(' ').map(word => word[0]).join('').substring(0,2).toUpperCase();
            const displayPollster = highlightSearchMatches(poll.pollster, searchQuery);
            const displayDate = highlightSearchMatches(formatDate(poll.date), searchQuery);
            const displaySampleSize = highlightSearchMatches(poll.sampleSize.toLocaleString(), searchQuery);
            const val1 = poll[currentAggregate.pollFields[0]];
            const val2 = poll[currentAggregate.pollFields[1]];
            const displayApprove = highlightSearchMatches(val1.toFixed(1), searchQuery);
            const displayDisapprove = highlightSearchMatches(val2.toFixed(1), searchQuery);
            let marginHtml;

            if (currentAggregate.isRace) {
                let leaderName, leaderColor, leadValueStr;
                if (marginValue > 0) {
                    leaderName = currentAggregate.candidates[0];
                    leaderColor = getComputedColor(currentAggregate.colors[0]);
                    leadValueStr = `${leaderName.split(' ').pop()} +${marginValue.toFixed(1)}`;
                } else if (marginValue < 0) {
                    leaderName = currentAggregate.candidates[1];
                    leaderColor = getComputedColor(currentAggregate.colors[1]);
                    leadValueStr = `${leaderName.split(' ').pop()} +${Math.abs(marginValue).toFixed(1)}`;
                } else {
                    leaderColor = getComputedColor('--text-muted');
                    leadValueStr = 'Even';
                }
                marginHtml = `<td class="poll-percentage" style="color: ${leaderColor}; font-weight: 600;">${highlightSearchMatches(leadValueStr, searchQuery)}</td>`;
            } else {
                const marginFormatted = marginValue > 0 ? `+${marginValue.toFixed(1)}` : marginValue.toFixed(1);
                const displayMargin = highlightSearchMatches(marginFormatted, searchQuery);
                const marginColorVar = marginValue > 0 ? currentAggregate.colors[0] : currentAggregate.colors[1];
                const finalMarginColor = getComputedColor(marginColorVar);
                marginHtml = `<td class="poll-percentage" style="color: ${finalMarginColor};">${displayMargin}</td>`;
            }

            let approveClass, disapproveClass;
            switch(currentAggregate.baseId || currentAggregate.id){
                case 'generic_ballot': approveClass = 'poll-percentage republican'; disapproveClass = 'poll-percentage democrat'; break;
                case 'race2024': approveClass = 'poll-percentage trump'; disapproveClass = 'poll-percentage harris'; break;
                default: approveClass = 'poll-percentage approve'; disapproveClass = 'poll-percentage disapprove';
            }
            
            tableRow.innerHTML = `<td><div class="pollster-name"><div class="pollster-logo">${initials}</div>${displayPollster}</div></td><td class="poll-date">${displayDate}</td><td class="poll-info">${displaySampleSize}</td><td><div class="poll-quality">${formatQualityStars(poll.quality)}</div></td><td class="${approveClass}">${displayApprove}</td><td class="${disapproveClass}">${displayDisapprove}</td>${marginHtml}<td class="poll-info">${weight.toFixed(3)}</td>`;
            return tableRow;
        }

        function calculateSeriesValues(sortedPolls, timestamps, field1, field2) {
            const values1 = [], values2 = [];
            let pollIdx = 0;
            let active = [];

            for (let i = 0; i < timestamps.length; i++) {
                const currentDate = timestamps[i];

                while (pollIdx < sortedPolls.length && sortedPolls[pollIdx].date.getTime() <= currentDate.getTime()) {
                    const p = sortedPolls[pollIdx];
                    active.push({
                        date: p.date,
                        baseWeight: p.baseWeight ?? computeBasePollWeight(p),
                        val1: p[field1],
                        val2: p[field2]
                    });
                    pollIdx++;
                }

                let weightedSum1 = 0, weightedSum2 = 0, totalWeight = 0;
                const newActive = [];
                for (let k = 0; k < active.length; k++) {
                    const ap = active[k];
                    const daysDiff = (currentDate.getTime() - ap.date.getTime()) / MS_PER_DAY;
                    const weight = ap.baseWeight * Math.exp(-daysDiff / HALF_LIFE);
                    if (weight > 0.001) {
                        weightedSum1 += ap.val1 * weight;
                        weightedSum2 += ap.val2 * weight;
                        totalWeight += weight;
                        newActive.push(ap);
                    }
                }
                active = newActive;

                values1[i] = totalWeight > 0 ? weightedSum1 / totalWeight : null;
                values2[i] = totalWeight > 0 ? weightedSum2 / totalWeight : null;
            }

            return [values1, values2];
        }
        
        function updateAggregation() {
            if (isProcessing) return; // Prevent concurrent processing
            isProcessing = true;
            let primaryPollsForLine = _filterPollsForLineCalc(getCurrentTermPolls(currentAggregate, currentTerm), selectedPollster, searchQuery);
            
            let countForBadge = primaryPollsForLine.length; 
            pollCountBadge.textContent = `${countForBadge} poll${countForBadge !== 1 ? 's' : ''}`;

            function setEmptyAggData() {
                aggregatedData = { timestamps: [], values: [[], []], spreads: [], current: [null, null], pollPoints: [] };
                updateDisplay();
                isProcessing = false;
            }

            if (primaryPollsForLine.length === 0) { 
                setEmptyAggData(); 
                return; 
            }

            idleCallback(() => {
                try {
                    computeAggregationData(primaryPollsForLine);
                } catch (error) {
                    console.error('Aggregation computation failed:', error);
                    setEmptyAggData();
                }
            }, { timeout: 100 });
        }
        
        function computeAggregationData(primaryPollsForLine) {
            const sortedPolls = primaryPollsForLine.sort((a,b) => a.date.getTime() - b.date.getTime());
            const earliestPollDateOverall = sortedPolls[0].date;
            let latestPollDateOverall = sortedPolls[sortedPolls.length - 1].date;
            
            let referenceDate = new Date();
            if (currentAggregate.isRace && latestPollDateOverall.getTime() <= ELECTION_END_DATE_2024.getTime()) {
                 referenceDate = new Date(Math.min(latestPollDateOverall.getTime(), ELECTION_END_DATE_2024.getTime()));
            } else if (currentAggregate.id === 'trump' && currentTerm === 'first') { 
                referenceDate = new Date(Math.min(latestPollDateOverall.getTime(), FIRST_TERM_END_DATE.getTime()));
            } else if (currentAggregate.id === 'biden') { 
                referenceDate = new Date(Math.min(latestPollDateOverall.getTime(), BIDEN_TERM_END_DATE.getTime()));
            } else {
                referenceDate = latestPollDateOverall.getTime() < new Date().getTime() ? latestPollDateOverall : new Date();
            }
            latestPollDateOverall = new Date(Math.min(latestPollDateOverall.getTime(), referenceDate.getTime()));

            if (earliestPollDateOverall.getTime() > latestPollDateOverall.getTime()) { 
                aggregatedData = { timestamps: [], values: [[], []], spreads: [], current: [null, null], pollPoints: [] };
                updateDisplay();
                isProcessing = false;
                return;
            }

            let startDateForAggregation = earliestPollDateOverall;
            let endDateForAggregation = latestPollDateOverall;

            if (currentZoomSelection.isActive && currentZoomSelection.startDate && currentZoomSelection.endDate) {
                startDateForAggregation = new Date(Math.max(startDateForAggregation.getTime(), currentZoomSelection.startDate.getTime()));
                endDateForAggregation = new Date(Math.min(endDateForAggregation.getTime(), currentZoomSelection.endDate.getTime()));
            }
            
            if (startDateForAggregation.getTime() > endDateForAggregation.getTime()) { 
                aggregatedData = { timestamps: [], values: [[], []], spreads: [], current: [null, null], pollPoints: [] };
                updateDisplay();
                isProcessing = false;
                return; 
            }
            
            const totalDays = Math.max(0, Math.ceil((endDateForAggregation.getTime() - startDateForAggregation.getTime()) / MS_PER_DAY)) + 1;
            const samplingRate = optimizedSampling(totalDays, currentLineDetail);
            
            let timestamps = [];
            if (totalDays > 0) {
                for (let i = 0; i < totalDays; i += samplingRate) {
                    const date = new Date(startDateForAggregation.getTime() + i * MS_PER_DAY);
                    if (date.getTime() <= endDateForAggregation.getTime()) timestamps.push(date);
                }
                if (timestamps.length > 0 && samplingRate > 1 && timestamps[timestamps.length - 1].getTime() < endDateForAggregation.getTime()) {
                    timestamps.push(endDateForAggregation);
                }
                if (timestamps.length === 0 && startDateForAggregation.getTime() === endDateForAggregation.getTime()) {
                    timestamps.push(startDateForAggregation);
                }
            }
            
            if (timestamps.length === 0) { 
                aggregatedData = { timestamps: [], values: [[], []], spreads: [], current: [null, null], pollPoints: [] };
                updateDisplay();
                isProcessing = false;
                return;
            }

            aggregatedData.timestamps = timestamps;
            const field1 = currentAggregate.pollFields[0];
            const field2 = currentAggregate.pollFields[1];
            aggregatedData.values = [[], []];

            const [vals1, vals2] = calculateSeriesValues(sortedPolls, timestamps, field1, field2);
            aggregatedData.values[0] = vals1;
            aggregatedData.values[1] = vals2;

            aggregatedData.current = [ aggregatedData.values[0].at(-1), aggregatedData.values[1].at(-1) ];
            aggregatedData.spreads = aggregatedData.timestamps.map((_, i) => 
                (aggregatedData.values[0][i] === null || aggregatedData.values[1][i] === null) 
                    ? null 
                    : aggregatedData.values[0][i] - aggregatedData.values[1][i]
            );
            
            const screenConfig = getScreenSizeConfig();
            const maxPoints = parseInt(pollDensitySlider.value) || screenConfig.pollPointDensity;
            
            let visiblePolls = sortedPolls.filter(p => 
                p.date.getTime() >= startDateForAggregation.getTime() && 
                p.date.getTime() <= endDateForAggregation.getTime()
            );
            
            const timeRange = endDateForAggregation.getTime() - startDateForAggregation.getTime();
            visiblePolls = adaptivePollPointDistribution(visiblePolls, maxPoints, timeRange);
            
            aggregatedData.pollPoints = [];
            visiblePolls.forEach(poll => {
                aggregatedData.pollPoints.push(
                    { 
                        date: poll.date, value: poll[field1], lineIndex: 0, 
                        pollster: poll.pollster, sampleSize: poll.sampleSize, quality: poll.quality, 
                        originalValue1: poll[field1], originalValue2: poll[field2], 
                        pointType: currentAggregate.candidates[0], circleSize: screenConfig.pollCircleSize 
                    },
                    { 
                        date: poll.date, value: poll[field2], lineIndex: 1, 
                        pollster: poll.pollster, sampleSize: poll.sampleSize, quality: poll.quality, 
                        originalValue1: poll[field1], originalValue2: poll[field2], 
                        pointType: currentAggregate.candidates[1], circleSize: screenConfig.pollCircleSize 
                    }
                );
            });
            
            updateDisplay();
            isProcessing = false;
        }

        function updateDisplay() {
            let displayDate;
            if (!aggregatedData.timestamps || aggregatedData.timestamps.length === 0) {
                displayDate = new Date();
            } else {
                displayDate = aggregatedData.timestamps[aggregatedData.timestamps.length - 1];
            }
            currentDateEl.textContent = formatDisplayDate(displayDate);
        }

        function updateTitle(){
            const titleElement = document.getElementById('poll-title');
            const titleTextEl = titleElement.querySelector('.title-text');
            const wordCyclerEl = titleElement.querySelector('.word-cycler');
            
            if (wordCyclerInterval) clearInterval(wordCyclerInterval);

            const { candidates, isRace } = currentAggregate;
            let name = currentAggregate.name;
            const termDisplay = currentTerm.charAt(0).toUpperCase() + currentTerm.slice(1);
            if (currentAggregate.id === 'trump') {
                name = `${name.replace('Trump', `Trump ${termDisplay} Term`)}`;
            }

            let titlePrefix = name;
            let cyclingWordsData = [];
            
            let animClass1, animClass2;
            switch(currentAggregate.baseId || currentAggregate.id) {
                case 'race2024': animClass1 = 'trump'; animClass2 = 'harris'; break;
                case 'generic_ballot': animClass1 = 'republican'; animClass2 = 'democrat'; break;
                default: animClass1 = 'approve'; animClass2 = 'disapprove'; break;
            }
            const animClasses = [animClass1, animClass2];
            
            if (isRace) {
                titlePrefix += `: ${candidates[0]} vs`;
                cyclingWordsData = [{ word: candidates[1], class: animClasses[1], animationType: 'fade-in' }];
            } else {
                titlePrefix += `:`;
                cyclingWordsData = [
                    { word: candidates[0], class: animClasses[0], animationType: 'pop-in' },
                    { word: candidates[1], class: animClasses[1], animationType: 'pop-in' }
                ];
            }

            titleTextEl.textContent = titlePrefix;
            
            wordCyclerEl.innerHTML = '';
            cyclingWordsData.forEach(data => {
                const span = document.createElement('span');
                span.className = `animate-word ${data.class} ${data.animationType}`;
                span.textContent = data.word;
                wordCyclerEl.appendChild(span);
            });

            const words = wordCyclerEl.querySelectorAll('.animate-word');
            if (words.length > 1) {
                let currentIndex = 0;
                words[currentIndex].classList.add('visible');
                
                wordCyclerInterval = setInterval(() => {
                    words[currentIndex].classList.remove('visible');
                    currentIndex = (currentIndex + 1) % words.length;
                    words[currentIndex].classList.add('visible');
                }, 3000);
            } else if (words.length === 1) {
                 words[0].classList.add('visible');
            }

            cardGlow1.style.backgroundColor = getComputedColor(currentAggregate.colors[0]);
            cardGlow2.style.backgroundColor = getComputedColor(currentAggregate.colors[1]);
        }

        function updateLegend(){
            const legendElement = document.querySelector('.legend');
            legendElement.innerHTML = '';
            if(!currentAggregate || !currentAggregate.candidates) return;
            
            currentAggregate.candidates.forEach((candidateName, i) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'legend-item';
                const color = getComputedColor(currentAggregate.colors[i]);
                itemElement.innerHTML = `<div class="legend-color" style="background-color:${color}; --glow-color: ${getComputedColor(currentAggregate.colorGlow[i])};"></div><span>${candidateName}</span>`;
                legendElement.appendChild(itemElement);
            });
        }

        function updatePollListHeaders(){ 
            if(!currentAggregate || !currentAggregate.candidates) return;
            mainTableValue1Header.textContent = currentAggregate.candidates[0];
            mainTableValue2Header.textContent = currentAggregate.candidates[1];
            mainTableMarginHeader.textContent = currentAggregate.isRace ? "Lead" : "Net";
        }

        function updateChartDimensions(){
            const rect = pollChart.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            chartDimensions.width = rect.width;
            chartDimensions.height = rect.height;

            [canvas, fadeCanvas, overlayCanvas].forEach(c => {
                c.width = rect.width * dpr;
                c.height = rect.height * dpr;
                c.style.width = `${rect.width}px`;
                c.style.height = `${rect.height}px`;
                c.getContext('2d').scale(dpr, dpr);
            });
        }
        
        function generateGrid(){
            if (!ctx) return;
            const dpr = window.devicePixelRatio || 1;
            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
            const { margin, width, height, yMin, yMax } = chartDimensions;

            const yScale = value => height - margin.bottom - ((value - yMin) / (yMax - yMin)) * (height - margin.top - margin.bottom);

            for(let i = Math.ceil(yMin/5)*5; i <= yMax; i += 5){
                const isMajorLine = i % 10 === 0;
                ctx.beginPath();
                ctx.moveTo(margin.left, yScale(i));
                ctx.lineTo(width - margin.right, yScale(i));
                ctx.strokeStyle = getComputedColor('--chart-grid');
                ctx.lineWidth = isMajorLine ? 1 : 0.5;
                ctx.stroke();
                if(isMajorLine){
                    ctx.fillStyle = getComputedColor('--text-muted');
                    ctx.font = '11px Inter, sans-serif';
                    ctx.textAlign = 'right';
                    ctx.fillText(`${i}`, margin.left - 8, yScale(i) + 4);
                }
            }
        }
        
        function generateXAxisDates(){
            const oldXAxisLabels = document.getElementById('xAxisLabels');
            if(oldXAxisLabels) oldXAxisLabels.remove();
            
            const xAxisLabels = document.createElement('div');
            xAxisLabels.id = 'xAxisLabels';
            Object.assign(xAxisLabels.style, {
                position: 'absolute', bottom: '5px', left: `${chartDimensions.margin.left}px`,
                width: `${chartDimensions.width - chartDimensions.margin.left - chartDimensions.margin.right}px`, color: getComputedColor('--text-muted'),
                fontSize: '0.85rem', pointerEvents: 'none'
            });
            pollChart.appendChild(xAxisLabels);
            if(!aggregatedData.timestamps || aggregatedData.timestamps.length === 0) return;
            
            const firstDate = aggregatedData.timestamps[0];
            const lastDate = aggregatedData.timestamps.at(-1);
            const timeRangeMs = lastDate.getTime() - firstDate.getTime();
            const totalDays = timeRangeMs / MS_PER_DAY;
            const chartWidth = chartDimensions.width - chartDimensions.margin.left - chartDimensions.margin.right;
            let tickDates = [];
            
            if (totalDays <= 35) {
                let currentDate = new Date(firstDate);
                currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
                while(currentDate <= lastDate) { tickDates.push(new Date(currentDate)); currentDate.setDate(currentDate.getDate() + 7); }
            } else if (totalDays <= 366 * 2) { 
                let currentDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
                while(currentDate <= lastDate) { tickDates.push(new Date(currentDate)); currentDate.setMonth(currentDate.getMonth() + 1); }
            } else { 
                let currentYear = firstDate.getFullYear() + 1;
                while(currentYear <= lastDate.getFullYear()) { tickDates.push(new Date(currentYear, 0, 1)); currentYear++; }
            }
            
            tickDates.unshift(firstDate); tickDates.push(lastDate);
            let uniqueDates = [...new Map(tickDates.map(date => [date.toLocaleDateString(), date])).values()].sort((a,b) => a.getTime() - b.getTime());
            let finalLabels = [];
            if (uniqueDates.length > 0) {
                let lastLabelEnd = -Infinity;
                uniqueDates.forEach(date => {
                    const percent = timeRangeMs > 0 ? (date.getTime() - firstDate.getTime()) / timeRangeMs : 0.5;
                    const xPos = percent * chartWidth;
                    if (xPos > lastLabelEnd + 50) { // Increased spacing
                        finalLabels.push({ date, percent });
                        lastLabelEnd = xPos;
                    }
                });
            }
            
            xAxisLabels.innerHTML = '';
            finalLabels.forEach(point => {
                const label = document.createElement('div');
                label.className = 'x-axis-label';
                label.textContent = formatHoverDate(point.date);
                Object.assign(label.style, {
                    position: 'absolute', left: `${point.percent * 100}%`,
                    transform: 'translateX(-50%)', whiteSpace: 'nowrap'
                });
                xAxisLabels.appendChild(label);
            });
        }
    
        function drawChart(withAnimation = true) { 
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            
            const dpr = window.devicePixelRatio || 1;
            const clear = (context) => context.clearRect(0, 0, context.canvas.width / dpr, context.canvas.height / dpr);
            clear(ctx);
            clear(fadeCtx);

            if (!aggregatedData.timestamps || aggregatedData.timestamps.length === 0) { 
                emptyState.style.display = 'flex'; 
                updateChartDimensions();
                generateGrid();
                return; 
            }
            emptyState.style.display = 'none';
            updateChartDimensions(); 
            generateGrid();

            const { margin, width, height, yMin, yMax } = chartDimensions;
            const chartAreaWidth = width - margin.left - margin.right;
            const chartAreaHeight = height - margin.top - margin.bottom;

            const firstTimestamp = aggregatedData.timestamps[0].getTime();
            const timeRange = (aggregatedData.timestamps.length > 1) ? (aggregatedData.timestamps.at(-1).getTime() - firstTimestamp) : 1;

            const xScale = date => margin.left + (timeRange === 0 ? chartAreaWidth / 2 : ((date.getTime() - firstTimestamp) / timeRange) * chartAreaWidth);
            const yScale = value => height - margin.bottom - ((value - yMin) / (yMax - yMin)) * chartAreaHeight;

            let linePaths = [];

            for (let lineIdx = 0; lineIdx < 2; lineIdx++) {
                if (!aggregatedData.values[lineIdx] || aggregatedData.values[lineIdx].every(v => v === null)) {
                    linePaths.push(null); continue;
                }
                let pathData = ''; let firstPoint = true;
                aggregatedData.timestamps.forEach((date, i) => {
                    if (aggregatedData.values[lineIdx]?.[i] !== null) {
                        const x = xScale(date); const y = yScale(aggregatedData.values[lineIdx][i]);
                        if (firstPoint) { pathData += `M ${x} ${y}`; firstPoint = false; } 
                        else { pathData += ` L ${x} ${y}`; }
                    } else { firstPoint = true; }
                });
                const path2d = new Path2D(pathData);
                const tempPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                tempPathEl.setAttribute('d', pathData);
                linePaths.push({ path: path2d, length: tempPathEl.getTotalLength() });
            }
            
            const drawFullChart = (progress = 1) => {
                clear(ctx);
                generateGrid();

                linePaths.forEach((lineData, lineIdx) => {
                    if (!lineData) return;
                    ctx.save();
                    ctx.strokeStyle = getComputedColor(currentAggregate.colors[lineIdx]);
                    ctx.lineWidth = currentLineWidth;
                    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
                    if (glowEffectToggle.checked) {
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = getComputedColor(currentAggregate.colorGlow[lineIdx]);
                    }
                    if (progress < 1) {
                         ctx.setLineDash([lineData.length]);
                         ctx.lineDashOffset = lineData.length * (1 - progress);
                    }
                    ctx.stroke(lineData.path);
                    ctx.restore();
                });
                drawPollPoints(ctx, xScale, yScale, progress);
            };

            if (withAnimation) {
                const animationDuration = 1200; let startTime = null;
                function animate(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / animationDuration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    drawFullChart(easeProgress);
                    if (progress < 1) animationFrameId = requestAnimationFrame(animate);
                    else animationFrameId = null;
                }
                animationFrameId = requestAnimationFrame(animate);
            } else {
                drawFullChart();
            }
            updateLegend();
        }

        function drawPollPoints(context, xScale, yScale, animationProgress = 1) {
            pollPointGrid = {};
            const screenConfig = getScreenSizeConfig();

            aggregatedData.pollPoints.forEach((poll, index) => {
                if (poll.value === null || isNaN(poll.value)) return;
                const x = xScale(poll.date);
                const y = yScale(poll.value);
                if (isNaN(x) || isNaN(y)) return;

                // Animation delay for poll points
                const pointDelay = (index / aggregatedData.pollPoints.length) * 0.3;
                const pointProgress = Math.max(0, Math.min(1, (animationProgress - pointDelay) / 0.7));
                
                if (pointProgress <= 0) return;

                const circleRadius = screenConfig.pollCircleSize / 2;
                const pointColorVar = currentAggregate.colors[poll.lineIndex];
                const alpha = pointProgress * (poll.isFaint ? 0.25 : 0.6);
                
                context.save();
                context.beginPath();
                context.arc(x, y, circleRadius * pointProgress, 0, 2 * Math.PI);
                context.fillStyle = convertToRgba(getComputedColor(pointColorVar), alpha);
                context.fill();
                context.strokeStyle = `rgba(255, 255, 255, ${pointProgress * 0.2})`;
                context.lineWidth = 1;
                context.stroke();
                context.restore();

                if (pointProgress === 1) {
                    const pointData = { x, y, radius: circleRadius + 2, data: poll };
                    const gridKey = `${Math.floor(x / SPATIAL_GRID_SIZE)}_${Math.floor(y / SPATIAL_GRID_SIZE)}`;
                    if (!pollPointGrid[gridKey]) pollPointGrid[gridKey] = [];
                    pollPointGrid[gridKey].push(pointData);
                }
            });
        }

        function drawFadedChart() {
            const dpr = window.devicePixelRatio || 1;
            const { width, height, margin } = chartDimensions;
            fadeCtx.clearRect(0, 0, width, height);

            if (!hoverDisplayState.active || !hoverDisplayState.xChart) return;
            
            fadeCtx.save();
            
            // Create gradient that fades out elements to the right of hover position
            const gradient = fadeCtx.createLinearGradient(hoverDisplayState.xChart, 0, width, 0);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
            
            fadeCtx.globalCompositeOperation = 'destination-out';
            fadeCtx.fillStyle = gradient;
            fadeCtx.fillRect(hoverDisplayState.xChart, 0, width - hoverDisplayState.xChart, height);
            fadeCtx.restore();
        }

        function renderHoverOverlay() {
            hoverValueItemElements.forEach(item => { 
                item.circle.style.display = 'none';
                item.label.style.display = 'none';
            });

            if (!hoverDisplayState.active || hoverDisplayState.date === null || !aggregatedData.timestamps || aggregatedData.timestamps.length === 0) {
                hoverOverlayElements.classList.remove('active');
                return;
            }

            hoverOverlayElements.classList.add('active');
            
            hoverInfoDateEl.textContent = formatHoverDate(hoverDisplayState.date);
            const mainSpread = hoverDisplayState.spreadsInfo[0];
            if (mainSpread) {
                hoverInfoSpreadEl.innerHTML = `<span class="spread-label-text">${mainSpread.label}</span>
                                            <span class="spread-value" style="background:${getComputedColor(mainSpread.colorVar)};">${mainSpread.value}</span>`;
                hoverInfoSpreadEl.style.display = 'flex';
            } else {
                 hoverInfoSpreadEl.style.display = 'none';
            }
            
            const { margin, width, height } = chartDimensions;

            const topContainerWidth = hoverInfoTopContainer.offsetWidth;
            let topContainerLeft = hoverDisplayState.xChart - (topContainerWidth / 2);
            topContainerLeft = Math.max(margin.left + 5, topContainerLeft);
            topContainerLeft = Math.min(width - margin.right - topContainerWidth - 5, topContainerLeft);
            const topOffset = margin.top - hoverInfoTopContainer.offsetHeight - 8;
            hoverInfoTopContainer.style.transform = `translate(${topContainerLeft}px, ${Math.max(2, topOffset)}px)`;

            const labelHorizontalOffset = 12; 
            const labelVerticalGap = 3; 
            let placedLabelRects = [];
            const sortedPoints = [...hoverDisplayState.points].sort((a, b) => a.yChart - b.yChart);
            const screenConfig = getScreenSizeConfig();
            
            sortedPoints.forEach((pointData, index) => {
                if (pointData.value === null || isNaN(pointData.value) || index >= hoverValueItemElements.length) return;

                const item = hoverValueItemElements[index];
                const hoverCircleSize = screenConfig.pollCircleSize + (window.innerWidth < 768 ? 1 : 4);
                
                item.circle.style.left = `${hoverDisplayState.xChart - (hoverCircleSize/2)}px`;
                item.circle.style.top = `${pointData.yChart - (hoverCircleSize/2)}px`;
                item.circle.style.backgroundColor = getComputedColor(pointData.colorVar);
                item.circle.style.color = getComputedColor(pointData.colorVar);
                item.circle.style.width = `${hoverCircleSize}px`;
                item.circle.style.height = `${hoverCircleSize}px`;
                item.circle.style.display = 'block';

                item.label.textContent = `${pointData.label} ${pointData.value.toFixed(1)}%`;
                item.label.style.color = getComputedColor(pointData.colorVar);
                item.label.style.display = 'block';

                const labelWidth = item.label.offsetWidth; 
                const labelHeight = item.label.offsetHeight;

                let labelX = hoverDisplayState.xChart + labelHorizontalOffset + hoverCircleSize;
                const chartAreaWidth = width - margin.left - margin.right;
                if (labelX + labelWidth > margin.left + chartAreaWidth - 5) { 
                    labelX = hoverDisplayState.xChart - labelHorizontalOffset - labelWidth - hoverCircleSize;
                }
                
                let labelY = pointData.yChart - (labelHeight / 2); 
                for (const rect of placedLabelRects) {
                    if (labelY < rect.bottom + labelVerticalGap && labelY + labelHeight > rect.top - labelVerticalGap && labelX < rect.right && labelX + labelWidth > rect.left) {
                        labelY = rect.bottom + labelVerticalGap; 
                    }
                }
                
                labelY = Math.max(margin.top + 2, labelY);
                labelY = Math.min(margin.top + (height - margin.top - margin.bottom) - labelHeight - 2, labelY);

                item.label.style.left = `${labelX}px`;
                item.label.style.top = `${labelY}px`;

                placedLabelRects.push({ 
                    top: labelY, bottom: labelY + labelHeight, left: labelX, right: labelX + labelWidth 
                });
            });
        }

        function drawVerticalIndicator(x){
            if (!overlayCtx) return;
            const { margin, width, height } = chartDimensions;
            overlayCtx.clearRect(0, 0, width, height);
            
            overlayCtx.beginPath();
            overlayCtx.strokeStyle = getComputedColor('--primary-gradient');
            overlayCtx.lineWidth = 1.5;
            overlayCtx.setLineDash([6,4]);
            overlayCtx.moveTo(x, margin.top);
            overlayCtx.lineTo(x, height - margin.bottom);
            overlayCtx.stroke();
            overlayCtx.setLineDash([]);
        }
    
        function drawComparativeChart(highlightIndex = null){ 
            if (!comparativeBarsCanvas) return;
            
            const rect = comparativeChart.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const dpr = window.devicePixelRatio || 1;
            comparativeBarsCanvas.width = rect.width * dpr;
            comparativeBarsCanvas.height = rect.height * dpr;
            comparativeBarsCanvas.style.width = `${rect.width}px`;
            comparativeBarsCanvas.style.height = `${rect.height}px`;
            comparativeBarsCtx.scale(dpr, dpr);
            
            comparativeBarsCtx.clearRect(0, 0, rect.width, rect.height);

            const currentSpreads = aggregatedData.spreads;
            if(!aggregatedData.timestamps || aggregatedData.timestamps.length === 0 || !currentSpreads || currentSpreads.every(s => s === null)){
                return;
            }
            
            const chartHeight = rect.height;
            const validSpreads = currentSpreads.filter(s => s !== null && !isNaN(s));
            const maxAbsSpread = validSpreads.length > 0 ? Math.max(...validSpreads.map(s => Math.abs(s))) : 10;
            
            // Dynamic scaling based on data range
            let verticalMaxScale;
            if (maxAbsSpread <= 15) {
                verticalMaxScale = 20;
            } else if (maxAbsSpread <= 35) {
                verticalMaxScale = 40;
            } else if (maxAbsSpread <= 55) {
                verticalMaxScale = 60;
            } else {
                verticalMaxScale = Math.ceil(maxAbsSpread / 10) * 10 + 10;
            }
            
            const scaleFactor = chartHeight * 0.4 / verticalMaxScale;
            
            const totalPoints = aggregatedData.timestamps.length;
            const barWidth = totalPoints > 0 ? rect.width / totalPoints : 1;

            let barColorPositive = getComputedColor(currentAggregate.colors[0]); 
            let barColorNegative = getComputedColor(currentAggregate.colors[1]);
            
            for(let i = 0; i < totalPoints; i++){
                const netApproval = currentSpreads[i];
                if(netApproval === null || isNaN(netApproval)) continue;

                const barHeight = Math.max(1, Math.min(chartHeight * 0.4, Math.abs(netApproval) * scaleFactor));
                const x = i * barWidth;
                let y;

                comparativeBarsCtx.fillStyle = netApproval >= 0 ? barColorPositive : barColorNegative;
                
                if (i === highlightIndex) {
                    comparativeBarsCtx.globalAlpha = 1.0;
                    comparativeBarsCtx.filter = 'brightness(1.3)';
                } else {
                    comparativeBarsCtx.globalAlpha = 0.7;
                    comparativeBarsCtx.filter = 'none';
                }

                if(netApproval >= 0){
                    y = chartHeight / 2 - barHeight;
                    comparativeBarsCtx.fillRect(x, y, barWidth, barHeight);
                } else {
                    y = chartHeight / 2;
                    comparativeBarsCtx.fillRect(x, y, barWidth, barHeight);
                }
            }
            comparativeBarsCtx.globalAlpha = 1.0;
            comparativeBarsCtx.filter = 'none';

            const topScale = document.querySelector('.comparative-scale.top');
            const bottomScale = document.querySelector('.comparative-scale.bottom');
            if(topScale && bottomScale){
                topScale.textContent = `+${verticalMaxScale}%`;
                bottomScale.textContent = `-${verticalMaxScale}%`;
            }
        }

        function handleComparativeHover(e){
            if(!aggregatedData.timestamps || aggregatedData.timestamps.length === 0 || !comparativeChart) return;
            const rect = comparativeChart.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            const newIndex = Math.min(aggregatedData.timestamps.length - 1, Math.max(0, Math.floor(percent * aggregatedData.timestamps.length)));
            
            if(newIndex === currentHoverIndex) return;
            
            updateHoverState(newIndex, null);
        }

        function handleComparativeLeave(){
            updateHoverState(null);
        }

        function highlightComparativeBars(index){
            if (!comparativeBarsCanvas || !aggregatedData.timestamps) return;
            
            drawComparativeChart(index);

            if(index !== null && aggregatedData.timestamps[index]){
                comparativeOverlay.style.display = 'block';
                const chartRect = comparativeChart.getBoundingClientRect();
                const barWidth = aggregatedData.timestamps.length > 0 ? chartRect.width / aggregatedData.timestamps.length : 0;
                comparativeOverlay.style.left = `${(index * barWidth) + (barWidth / 2)}px`;
            } else {
                comparativeOverlay.style.display = 'none';
            }
        }

        function initHighlightZoom() {
            pollChart.addEventListener('mousedown', startZoomHighlight);
            document.addEventListener('mousemove', updateZoomHighlight);
            document.addEventListener('mouseup', endZoomHighlight);
            pollChart.addEventListener('touchstart', handleTouchStart, { passive: false });
            pollChart.addEventListener('touchmove', handleTouchMoveWrapper, { passive: false });
            pollChart.addEventListener('touchend', handleTouchEnd);
            pollChart.addEventListener('touchcancel', handleTouchEnd);
        }

        function startZoomHighlight(event) {
            const isTouch = event.touches && event.touches.length > 0;
            const button = isTouch ? 0 : event.button;
            const clientX = isTouch ? event.touches[0].clientX : event.clientX;
            if (button !== 0) return;
            if (!aggregatedData.timestamps || aggregatedData.timestamps.length === 0) return;
            const rect = pollChart.getBoundingClientRect();
            const { margin, width, height } = chartDimensions;
            const x = clientX - rect.left;
            if (x < margin.left || x > width - margin.right) return;
            previousZoomStateBeforeCurrent = {
                yMin: chartDimensions.yMin,
                yMax: chartDimensions.yMax,
                startDate: currentZoomSelection.isActive ? currentZoomSelection.startDate : aggregatedData.timestamps[0],
                endDate: currentZoomSelection.isActive ? currentZoomSelection.endDate : aggregatedData.timestamps.at(-1)
            };
            highlightZoom.isHighlighting = true;
            highlightZoom.startX = x;
            highlightZoomRect.style.left = `${x}px`;
            highlightZoomRect.style.top = `${margin.top}px`;
            highlightZoomRect.style.width = '0';
            highlightZoomRect.style.height = `${height - margin.top - margin.bottom}px`;
            highlightZoomRect.style.display = 'block';
            if(isTouch) event.preventDefault();
        }

        function updateZoomHighlight(event) {
            if (!highlightZoom.isHighlighting) return;
            const isTouch = event.touches && event.touches.length > 0;
            const clientX = isTouch ? event.touches[0].clientX : event.clientX;
            const rect = pollChart.getBoundingClientRect();
            const { margin, width } = chartDimensions;
            const currentX = Math.min(Math.max(margin.left, clientX - rect.left), width - margin.right);
            const left = Math.min(highlightZoom.startX, currentX);
            const w = Math.abs(currentX - highlightZoom.startX);
            highlightZoomRect.style.left = `${left}px`;
            highlightZoomRect.style.width = `${w}px`;
            highlightZoomRect.style.display = w < 3 ? 'none' : 'block';
            if(isTouch) event.preventDefault();
        }

        function endZoomHighlight(event) {
            if (!highlightZoom.isHighlighting) return;
            const isTouch = event.changedTouches && event.changedTouches.length > 0;
            const clientX = isTouch ? event.changedTouches[0].clientX : event.clientX;
            highlightZoom.isHighlighting = false;
            highlightZoomRect.style.display = 'none';
            const rect = pollChart.getBoundingClientRect();
            const { margin, width } = chartDimensions;
            const endX = Math.min(Math.max(margin.left, clientX - rect.left), width - margin.right);
            const w = Math.abs(endX - highlightZoom.startX);
            if (w < 10 || aggregatedData.timestamps.length <= 1) return;
            const startDate = xToDate(Math.min(highlightZoom.startX, endX));
            const endDate = xToDate(Math.max(highlightZoom.startX, endX));
            applyZoomToRange(startDate, endDate);
            if(isTouch) event.preventDefault();
        }

        function applyZoomToRange(startDate, endDate) { 
            currentZoomSelection.startDate = startDate; 
            currentZoomSelection.endDate = endDate; 
            currentZoomSelection.isActive = true; 
            loadPolls();
        }

        function undoLastZoomOrReset() { 
            if (highlightZoom.isHighlighting) { 
                highlightZoom.isHighlighting = false; 
                highlightZoomRect.style.display = 'none'; 
                previousZoomStateBeforeCurrent = null; 
                return; 
            } 
             if (previousZoomStateBeforeCurrent) {
                if (previousZoomStateBeforeCurrent.startDate instanceof Date && previousZoomStateBeforeCurrent.endDate instanceof Date) {
                    currentZoomSelection.startDate = previousZoomStateBeforeCurrent.startDate;
                    currentZoomSelection.endDate = previousZoomStateBeforeCurrent.endDate;
                    
                    const polls = getCurrentTermPolls(currentAggregate, currentTerm);
                    if (polls.length > 0) {
                        const earliestPollDateOverall = polls[0].date;
                        const latestPollDateOverall = polls[polls.length - 1].date;
                        if (previousZoomStateBeforeCurrent.startDate.getTime() <= earliestPollDateOverall.getTime() &&
                            previousZoomStateBeforeCurrent.endDate.getTime() >= latestPollDateOverall.getTime() - MS_PER_DAY) {
                            currentZoomSelection.isActive = false;
                        } else {
                            currentZoomSelection.isActive = true;
                        }
                    } else {
                        currentZoomSelection.isActive = false;
                    }

                    const yMinToRestore = previousZoomStateBeforeCurrent.yMin; 
                    const yMaxToRestore = previousZoomStateBeforeCurrent.yMax; 
                    previousZoomStateBeforeCurrent = null; 
                    loadPolls();
                    animateZoom(chartDimensions.yMin, chartDimensions.yMax, yMinToRestore, yMaxToRestore, 300);
                }
            } else if (currentZoomSelection.isActive) { 
                currentZoomSelection.isActive = false; 
                loadPolls();
                smartZoom();
            } else if (chartDimensions.yMin !== DEFAULT_Y_MIN || chartDimensions.yMax !== DEFAULT_Y_MAX) { 
                smartZoom(); 
            } 
        }
    
        function updateYAxisLabels(){
            if (!yRangeDisplay) return;
            const minValue = Math.round(chartDimensions.yMin);
            const maxValue = Math.round(chartDimensions.yMax);
            yRangeDisplay.textContent = `${minValue}% - ${maxValue}%`;
        }
    
        function animateZoom(startMin, startMax, endMin, endMax, duration = 300){
            const startTime = Date.now();
            function step(){
                if (!aggregatedData.timestamps || aggregatedData.timestamps.length === 0) return;
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                chartDimensions.yMin = startMin + (endMin - startMin) * easeProgress;
                chartDimensions.yMax = startMax + (endMax - startMax) * easeProgress;
                updateYAxisLabels();
                drawChart(false);
                if (hoverDisplayState.active) {
                    updateHoverState(currentHoverIndex);
                }
                if(progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }
    
        function zoomIn(){
            const range = chartDimensions.yMax - chartDimensions.yMin;
            if(range <= 10){
                zoomInBtn.classList.add('max-zoom');
                setTimeout(() => zoomInBtn.classList.remove('max-zoom'), 300);
                return;
            }
            const zoomFactor = Math.max(1, range * 0.1);
            animateZoom(chartDimensions.yMin, chartDimensions.yMax, Math.max(0, chartDimensions.yMin + zoomFactor), Math.min(100, chartDimensions.yMax - zoomFactor));
        }
    
        function zoomOut(){
            const range = chartDimensions.yMax - chartDimensions.yMin;
            if(range >= 100){
                zoomOutBtn.classList.add('max-zoom');
                setTimeout(() => zoomOutBtn.classList.remove('max-zoom'), 300);
                return;
            }
            const zoomFactor = Math.max(1, range * 0.1);
            animateZoom(chartDimensions.yMin, chartDimensions.yMax, Math.max(0, chartDimensions.yMin - zoomFactor), Math.min(100, chartDimensions.yMax + zoomFactor));
        }
    
        function smartZoom() { 
            if (!aggregatedData.values || aggregatedData.values.flat().every(v => v === null)) { 
                animateZoom(chartDimensions.yMin, chartDimensions.yMax, DEFAULT_Y_MIN, DEFAULT_Y_MAX, 500); 
                return; 
            }
            let allVisibleValues = aggregatedData.values.flat().filter(v => v !== null);
    
            if (allVisibleValues.length === 0) { 
                animateZoom(chartDimensions.yMin, chartDimensions.yMax, DEFAULT_Y_MIN, DEFAULT_Y_MAX, 500); 
                return; 
            }
    
            const dataMin = Math.min(...allVisibleValues); 
            const dataMax = Math.max(...allVisibleValues);
            
            const padding = Math.max(3, (dataMax - dataMin) * 0.15);
    
            let newMin = Math.floor(Math.max(0, dataMin - padding)); 
            let newMax = Math.ceil(Math.min(100, dataMax + padding));
    
            if (newMax - newMin < 20) { 
                const middle = (newMin + newMax) / 2; 
                newMin = Math.floor(Math.max(0, middle - 10)); 
                newMax = Math.ceil(Math.min(100, middle + 10)); 
            }
            if (newMin >= newMax || isNaN(newMin) || isNaN(newMax)) { 
                newMin = DEFAULT_Y_MIN; 
                newMax = DEFAULT_Y_MAX; 
            }
            animateZoom(chartDimensions.yMin, chartDimensions.yMax, newMin, newMax, 500);
        }
    
        function initMainDropdown(){
            dropdownOptions.innerHTML = '';
            const groupedAggregates = AGGREGATES.reduce((acc, agg) => {
                if (agg.state) return acc;
                const category = agg.category || 'General';
                if (!acc[category]) acc[category] = [];
                acc[category].push(agg);
                return acc;
            }, {});
    
            Object.keys(groupedAggregates).forEach(categoryName => {
                const header = document.createElement('div');
                header.className = 'dropdown-option-header';
                header.textContent = categoryName;
                dropdownOptions.appendChild(header);
    
                groupedAggregates[categoryName].forEach(aggregateConfig => {
                    const option = document.createElement('div');
                    option.className = 'dropdown-option';
                    option.dataset.aggregate = aggregateConfig.id;
                    
                    let iconClass = "fa-chart-line";
                    if(aggregateConfig.isRace) iconClass = "fa-flag-checkered";
                    else if(aggregateConfig.id.includes('approval')) iconClass = "fa-user-tie";
                    else if(aggregateConfig.id === 'direction') iconClass = "fa-compass";
    
                    option.innerHTML = `<i class="fas ${iconClass} option-icon"></i><span>${aggregateConfig.name}</span><span class="option-badge"></span>`;
                    dropdownOptions.appendChild(option);
                });
            });
    
            dropdownSelected.addEventListener('click', () => {
                dropdownSelected.classList.toggle('active');
                dropdownOptions.classList.toggle('active');
            });
            dropdownOptions.addEventListener('click', (e) => {
                const option = e.target.closest('.dropdown-option');
                if(option && option.dataset.aggregate) {
                    selectAggregate(option.dataset.aggregate);
                }
            });
        }
        
        function initRaceStateDropdown() {
            stateDropdownOptions.innerHTML = '';
            
            const nationalOption = document.createElement('div');
            nationalOption.className = 'dropdown-option selected';
            nationalOption.dataset.aggregate = 'race2024';
            nationalOption.innerHTML = `<i class="fas fa-globe-americas option-icon"></i><span>National</span><span class="option-badge"></span>`;
            stateDropdownOptions.appendChild(nationalOption);
    
            const divider = document.createElement('div');
            divider.className = 'dropdown-option-header';
            divider.textContent = 'Swing States';
            stateDropdownOptions.appendChild(divider);
    
            const stateAggs = AGGREGATES.filter(a => a.baseId === 'race2024' && a.state);
            stateAggs.forEach(stateAgg => {
                const stateOption = document.createElement('div');
                stateOption.className = 'dropdown-option';
                stateOption.dataset.aggregate = stateAgg.id;
                stateOption.innerHTML = `<i class="fas fa-map-marker-alt option-icon"></i><span>${swingStates[stateAgg.state.toUpperCase()]}</span><span class="option-badge"></span>`;
                stateDropdownOptions.appendChild(stateOption);
            });
            
            stateDropdownSelected.addEventListener('click', () => {
                stateDropdownSelected.classList.toggle('active');
                stateDropdownOptions.classList.toggle('active');
            });
            stateDropdownOptions.addEventListener('click', (e) => {
                const option = e.target.closest('.dropdown-option');
                if (option && option.dataset.aggregate) {
                    selectAggregate(option.dataset.aggregate);
                }
            });
        }
    
        function selectAggregate(aggregateId, force = false){ 
            const newAggregate = AGGREGATES.find(agg => agg.id === aggregateId);
            if (!force && (!newAggregate || newAggregate.id === currentAggregateId)) {
                dropdownSelected.classList.remove('active');
                dropdownOptions.classList.remove('active');
                stateDropdownSelected.classList.remove('active');
                stateDropdownOptions.classList.remove('active');
                return;
            }
            
            currentAggregateId = newAggregate.id;
            currentAggregate = newAggregate;
            
            document.querySelectorAll('#dropdownOptions .dropdown-option').forEach(option => {
                const optId = option.dataset.aggregate;
                option.classList.toggle('selected', optId === (currentAggregate.baseId || currentAggregate.id));
            });
    
            if (currentAggregate.baseId === 'race2024') {
                stateDropdownContainer.style.display = 'block';
                const baseRace = AGGREGATES.find(a => a.id === currentAggregate.baseId);
                selectedOptionText.textContent = baseRace.name;
                selectedStateText.textContent = currentAggregate.state ? swingStates[currentAggregate.state.toUpperCase()] : 'National';
                
                document.querySelectorAll('#stateDropdownOptions .dropdown-option').forEach(option => {
                    option.classList.toggle('selected', option.dataset.aggregate === currentAggregate.id);
                });
            } else {
                stateDropdownContainer.style.display = 'none';
                selectedOptionText.textContent = currentAggregate.name;
            }
            
            const targetId = currentAggregate.baseId || currentAggregate.id;
            document.querySelectorAll('.mini-aggregate-display').forEach(d => {
                d.classList.toggle('selected', d.dataset.aggregateId === targetId);
            });
            
            dropdownSelected.classList.remove('active');
            dropdownOptions.classList.remove('active');
            stateDropdownSelected.classList.remove('active');
            stateDropdownOptions.classList.remove('active');
            
            animateMiniScrollerTo(targetId);
            resetUIForNewAggregate();
        }
    
        function resetUIForNewAggregate(){ 

            
            updateYAxisLabels(); 
            updateHoverState(null); 
            comparativeOverlay.style.display = 'none'; 
            drawComparativeChart();
            
            undoLastZoomOrReset();
    
            selectedPollster = 'all';
            pollSearch.value = '';
            searchQuery = '';
            clearSearch.style.display = 'none';
            filteredModeIndicator.classList.remove('active'); 
            
            termSelector.style.display = currentAggregate.id === 'trump' ? 'flex' : 'none';
    
            updatePollsterDropdown(); 
            loadPolls(); 
            smartZoom();
            updateTitle(); 
            updatePollListHeaders(); 
            updateDropdownMargins();
            updateAllMiniAggregateCharts();
        }
    
        function initHoverOverlayElements() {
            for (let i = 0; i < 2; i++) { 
                const circle = document.createElement('div');
                circle.className = 'hover-value-circle';
                hoverOverlayElements.appendChild(circle);
    
                const label = document.createElement('div');
                label.className = 'hover-value-label';
                hoverOverlayElements.appendChild(label);
                hoverValueItemElements.push({ circle, label });
            }
        }
        
        function createMiniAggregateDisplays() { 
            miniAggregateScroller.innerHTML = '';
            const nationalAggregates = AGGREGATES.filter(agg => !agg.state);
    
            const createDisplay = (aggConfig) => {
                const displayElement = document.createElement('div'); 
                displayElement.className = 'mini-aggregate-display'; 
                displayElement.dataset.aggregateId = aggConfig.id; 
                displayElement.id = `miniDisplay-${aggConfig.id}`; 
                
                displayElement.innerHTML = `
                    <div>
                        <div class="mini-aggregate-header">
                            <div class="mini-aggregate-title">${aggConfig.shortName || aggConfig.name}</div>
                        </div>
                        <div class="mini-aggregate-chart">
                            <svg id="miniChart-${aggConfig.id}" viewBox="0 0 300 80" preserveAspectRatio="none">
                                <line x1="0" y1="40" x2="300" y2="40" class="grid-line"></line>
                                <path d="" class="trend-line" id="miniLine1-${aggConfig.id}"></path>
                                <path d="" class="trend-line" id="miniLine2-${aggConfig.id}"></path>
                            </svg>
                        </div>
                    </div>
                     <div class="mini-aggregate-values">
                        <span id="miniVal1-${aggConfig.id}">--.-%</span>
                        <div class="separator"></div>
                        <span id="miniVal2-${aggConfig.id}">--.-%</span>
                    </div>`; 
                displayElement.addEventListener('click', () => selectAggregate(aggConfig.id)); 
                return displayElement;
            }

            const items = nationalAggregates.map(createDisplay);
            items.forEach(item => miniAggregateScroller.appendChild(item));

            const clones = nationalAggregates.map(createDisplay);
            clones.forEach(clone => {
                 clone.id = `${clone.id}-clone`;
                 clone.querySelectorAll('[id]').forEach(el => el.id += '-clone');
                 miniAggregateScroller.appendChild(clone);
            });
            
            updateAllMiniAggregateCharts();
        }
    
        function updateAllMiniAggregateCharts() { 
             const nationalAggregates = AGGREGATES.filter(agg => !agg.state);
             const screenConfig = getScreenSizeConfig();

            nationalAggregates.forEach(aggConfig => { 
                const suffixes = ['', '-clone']; 
                suffixes.forEach(suffix => { 
                    const val1Indicator = document.getElementById(`miniVal1-${aggConfig.id}${suffix}`); 
                    const val2Indicator = document.getElementById(`miniVal2-${aggConfig.id}${suffix}`); 
                    const line1 = document.getElementById(`miniLine1-${aggConfig.id}${suffix}`); 
                    const line2 = document.getElementById(`miniLine2-${aggConfig.id}${suffix}`); 
                    if (!val1Indicator || !val2Indicator || !line1 || !line2) return; 
    
                    val1Indicator.style.color = getComputedColor(aggConfig.colors[0]); 
                    val2Indicator.style.color = getComputedColor(aggConfig.colors[1]); 
                    line1.setAttribute('stroke', getComputedColor(aggConfig.colors[0])); 
                    line2.setAttribute('stroke', getComputedColor(aggConfig.colors[1])); 
                    line1.setAttribute('class','trend-line'); 
                    line2.setAttribute('class','trend-line'); 
                    if (glowEffectToggle.checked && aggConfig.lineClasses) { 
                        line1.classList.add(aggConfig.lineClasses[0]); 
                        line2.classList.add(aggConfig.lineClasses[1]); 
                    }
                    
                    let pollsForMini = getCurrentTermPolls(aggConfig, currentTerm); 
                    if (!pollsForMini || pollsForMini.length === 0) { 
                        val1Indicator.textContent = 'N/A'; 
                        val2Indicator.textContent = ''; 
                        line1.setAttribute('d', ''); 
                        line2.setAttribute('d', ''); 
                        return; 
                    } 
                    const sortedPolls = [...pollsForMini].sort((a, b) => a.date.getTime() - b.date.getTime()); 
                    if (sortedPolls.length === 0) return;
    
                    const earliestPollDateForMini = sortedPolls[0].date; 
                    let latestPollDateForMini = sortedPolls.at(-1).date; 
    
                    if (aggConfig.isRace && latestPollDateForMini.getTime() > ELECTION_END_DATE_2024.getTime()) {
                        latestPollDateForMini = latestPollDateForMini;
                    } else if (aggConfig.isRace) {
                        latestPollDateForMini = new Date(Math.min(latestPollDateForMini.getTime(), ELECTION_END_DATE_2024.getTime()));
                    } else if (aggConfig.id === 'trump' && currentTerm === 'first') {
                        latestPollDateForMini = new Date(Math.min(latestPollDateForMini.getTime(), FIRST_TERM_END_DATE.getTime())); 
                    } else if (aggConfig.id === 'biden') {
                        latestPollDateForMini = new Date(Math.min(latestPollDateForMini.getTime(), BIDEN_TERM_END_DATE.getTime())); 
                    }
    
                    const [tmpVals1, tmpVals2] = calculateSeriesValues(sortedPolls, [latestPollDateForMini], aggConfig.pollFields[0], aggConfig.pollFields[1]);
                    const val1Latest = tmpVals1[0];
                    const val2Latest = tmpVals2[0];
                    val1Indicator.textContent = val1Latest !== null && !isNaN(val1Latest) ? val1Latest.toFixed(1) + '%' : '--.-%'; 
                    val2Indicator.textContent = val2Latest !== null && !isNaN(val2Latest) ? val2Latest.toFixed(1) + '%' : '--.-%'; 
    
                    const miniYScale = val => { 
                        if (val === null || isNaN(val)) return null; 
                        const clampedVal = Math.max(0, Math.min(100, val)); 
                        const yDomain = MINI_CHART_Y_MAX - MINI_CHART_Y_MIN;
                        const chartHeight = 60;
                        return chartHeight - ((clampedVal - MINI_CHART_Y_MIN) / yDomain * chartHeight); 
                    }; 
                    const timeDiff = latestPollDateForMini.getTime() - earliestPollDateForMini.getTime(); 
                    let path1Data = "", path2Data = ""; 
                    if (pollsForMini.length <= 1 || timeDiff <= 0 ) { 
                        const y1 = miniYScale(val1Latest); 
                        const y2 = miniYScale(val2Latest); 
                        if (y1 !== null) path1Data = `M0,${y1.toFixed(2)} L300,${y1.toFixed(2)}`; 
                        if (y2 !== null) path2Data = `M0,${y2.toFixed(2)} L300,${y2.toFixed(2)}`; 
                    } else { 
                        const numMiniPoints = screenConfig.miniChartPoints; 
                        const miniTimestamps = Array.from({length: numMiniPoints}, (_, i) => new Date(earliestPollDateForMini.getTime() + (timeDiff * i) / (numMiniPoints - 1)));
                        
                        if (miniTimestamps.length > 0 && miniTimestamps.at(-1).getTime() < latestPollDateForMini.getTime()) { 
                            miniTimestamps.push(latestPollDateForMini); 
                        } 
                        
                        const [miniValues1, miniValues2] = calculateSeriesValues(sortedPolls, miniTimestamps, aggConfig.pollFields[0], aggConfig.pollFields[1]);
                        
                        path1Data = miniValues1.map((val, i) => ({ val, x: (i / Math.max(1, numMiniPoints - 1)) * 300 }))
                                            .filter(p => p.val !== null && !isNaN(p.val))
                                            .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${miniYScale(p.val).toFixed(2)}`).join(' ');
                        path2Data = miniValues2.map((val, i) => ({ val, x: (i / Math.max(1, numMiniPoints - 1)) * 300 }))
                                            .filter(p => p.val !== null && !isNaN(p.val))
                                            .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${miniYScale(p.val).toFixed(2)}`).join(' ');
                    } 
                    line1.setAttribute('d', path1Data); 
                    line2.setAttribute('d', path2Data); 
                }); 
            }); 
        }

        function animateMiniScrollerTo(aggregateId) {
            if (isScrollerPaused) return;
            
            const targetElement = document.getElementById(`miniDisplay-${aggregateId}`);
            if (!targetElement) return;

            const scrollerRect = miniAggregateContainer.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            
            const targetLeft = scrollerRect.width / 2 - targetRect.width / 2;
            const scrollDistance = targetRect.left - scrollerRect.left - targetLeft;
            
            const currentTransform = new DOMMatrix(getComputedStyle(miniAggregateScroller).transform);
            const currentX = currentTransform.m41;
            
            const newX = currentX - scrollDistance;
            miniAggregateScroller.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            miniAggregateScroller.style.transform = `translateX(${newX}px)`;
            
            setTimeout(() => {
                if (!isScrollerPaused) {
                    miniAggregateScroller.style.transition = 'none';
                }
            }, 600);
        }
    
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        function initMiniScrollerAnimation() {
            let position = 0;
            const scrollSpeed = 0.3;
            
            function scroll() {
                if (isScrollerPaused) {
                    scrollerAnimationId = requestAnimationFrame(scroll);
                    return;
                }
                
                position -= scrollSpeed;
                const firstHalfWidth = miniAggregateScroller.scrollWidth / 2;
                
                if (position <= -firstHalfWidth) {
                    position += firstHalfWidth;
                }
                
                miniAggregateScroller.style.transform = `translateX(${position}px)`;
                scrollerAnimationId = requestAnimationFrame(scroll);
            }
            
            scroll();

            miniAggregateContainer.addEventListener('mouseenter', () => {
                isScrollerPaused = true;
            });
            
            miniAggregateContainer.addEventListener('mouseleave', () => {
                isScrollerPaused = false;
                miniAggregateScroller.style.transition = 'none';
            });
        }

        function initDownloadModal() {
            const downloadOptions = document.querySelectorAll('.download-option');
            let selectedType = null;

            downloadDataBtn.addEventListener('click', () => {
                downloadModal.classList.add('active');
            });

            downloadModalClose.addEventListener('click', () => {
                downloadModal.classList.remove('active');
            });

            downloadCancel.addEventListener('click', () => {
                downloadModal.classList.remove('active');
            });

            downloadOptions.forEach(option => {
                option.addEventListener('click', () => {
                    downloadOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    selectedType = option.dataset.type;
                    downloadConfirm.disabled = false;
                });
            });

            downloadConfirm.addEventListener('click', () => {
                if (selectedType) {
                    generateDownload(selectedType);
                    downloadModal.classList.remove('active');
                }
            });

            downloadModal.addEventListener('click', (e) => {
                if (e.target === downloadModal) {
                    downloadModal.classList.remove('active');
                }
            });
        }

        function generateDownload(type) {
            let data, filename;
            const aggName = currentAggregate.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const date = new Date().toISOString().split('T')[0];

            switch(type) {
                case 'polls':
                    data = generatePollsCSV();
                    filename = `onpoint_polls_${aggName}_${date}.csv`;
                    break;
                case 'aggregated':
                    data = generateAggregatedCSV();
                    filename = `onpoint_aggregated_${aggName}_${date}.csv`;
                    break;
                case 'margins':
                    data = generateMarginsCSV();
                    filename = `onpoint_margins_${aggName}_${date}.csv`;
                    break;
                case 'methodology':
                    data = generateMethodologyReport();
                    filename = `onpoint_methodology_${date}.txt`;
                    break;
            }

            downloadFile(data, filename);
        }

        function generatePollsCSV() {
            const polls = getCurrentTermPolls(currentAggregate, currentTerm);
            if (!polls || polls.length === 0) return 'No poll data available';

            const headers = ['Pollster', 'Date', 'Sample Size', 'Quality', currentAggregate.candidates[0], currentAggregate.candidates[1], 'Margin', 'Weight'];
            let csv = headers.join(',') + '\n';

            polls.forEach(poll => {
                const margin = poll[currentAggregate.pollFields[0]] - poll[currentAggregate.pollFields[1]];
                const weight = calculatePollWeight(poll, new Date());
                const row = [
                    `"${poll.pollster}"`,
                    poll.date.toISOString().split('T')[0],
                    poll.sampleSize,
                    poll.quality,
                    poll[currentAggregate.pollFields[0]],
                    poll[currentAggregate.pollFields[1]],
                    margin.toFixed(2),
                    weight.toFixed(4)
                ];
                csv += row.join(',') + '\n';
            });

            return csv;
        }

        function generateAggregatedCSV() {
            if (!aggregatedData.timestamps || aggregatedData.timestamps.length === 0) return 'No aggregated data available';

            const headers = ['Date', currentAggregate.candidates[0], currentAggregate.candidates[1], 'Spread'];
            let csv = headers.join(',') + '\n';

            aggregatedData.timestamps.forEach((date, i) => {
                const val1 = aggregatedData.values[0][i];
                const val2 = aggregatedData.values[1][i];
                const spread = aggregatedData.spreads[i];
                const row = [
                    date.toISOString().split('T')[0],
                    val1 !== null ? val1.toFixed(2) : '',
                    val2 !== null ? val2.toFixed(2) : '',
                    spread !== null ? spread.toFixed(2) : ''
                ];
                csv += row.join(',') + '\n';
            });

            return csv;
        }

        function generateMarginsCSV() {
            const margins = calculateAllMargins();
            const headers = ['Aggregate', 'Margin', 'Leading Candidate'];
            let csv = headers.join(',') + '\n';

            margins.forEach(margin => {
                const agg = AGGREGATES.find(a => a.id === margin.id);
                if (!agg) return;
                
                let leader = '';
                if (margin.margin > 0) leader = agg.candidates[0];
                else if (margin.margin < 0) leader = agg.candidates[1];
                else leader = 'Even';

                const row = [
                    `"${agg.name}"`,
                    margin.margin.toFixed(2),
                    `"${leader}"`
                ];
                csv += row.join(',') + '\n';
            });

            return csv;
        }

        function generateMethodologyReport() {
            return `On Point Aggregate 3.0 - Methodology Report
Generated: ${new Date().toISOString()}
Aggregate: ${currentAggregate.name}

OVERVIEW
========
On Point Aggregate uses a sophisticated weighted averaging system that combines poll quality ratings, sample size adjustments, and time-decay functions to produce accurate polling aggregates.

WEIGHTING METHODOLOGY
====================
Each poll receives a composite weight based on three factors:

1. QUALITY WEIGHT (based on pollster track record):
   A+: 1.00    A: 0.95    A-: 0.90
   B+: 0.85    B: 0.80    B-: 0.75
   C+: 0.70    C: 0.65    C-: 0.60
   D+: 0.55    D: 0.50    D-: 0.45
   F:  0.40

2. SAMPLE SIZE WEIGHT:
   Calculated as sqrt(sample_size) / 100
   Larger samples receive higher weight

3. RECENCY WEIGHT:
   Exponential decay with 15-day half-life
   Weight = exp(-days_since_poll / 15)

FINAL WEIGHT CALCULATION
========================
Final Weight = Quality Weight × Sample Weight × Recency Weight

AGGREGATION PROCESS
==================
1. For each date, calculate weighted average across all applicable polls
2. Use only polls conducted on or before that date
3. Apply minimum weight threshold to exclude very old/low-quality polls
4. Calculate spreads as difference between first and second values

POLL SELECTION CRITERIA
======================
- Only includes pollsters with proven track records
- Minimum sample size requirements enforced
- Transparent methodology required from pollster
- No partisan or advocacy polling included

DATA SOURCES
============
All polling data is manually curated and verified from:
- Primary pollster releases
- FEC filings where applicable
- Academic polling databases
- Verified news reports

MARGIN OF ERROR
===============
Aggregate margins of error are calculated using bootstrap resampling methods and account for both polling uncertainty and model uncertainty.

For questions about methodology, contact: info@onpointaggregate.com`;
        }

        function downloadFile(data, filename) {
            const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        function closeAllDropdowns() {
            document.querySelectorAll('.dropdown-selected.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            document.querySelectorAll('.dropdown-options.active').forEach(options => {
                options.classList.remove('active');
            });
        }
        
        function initApp() {
            const today = new Date(); 
            updateDateEl.textContent = formatDisplayDate(today);
            
            currentAggregate = AGGREGATES.find(a => a.id === currentAggregateId);
            currentTerm = document.querySelector('.term-option.selected')?.dataset.term || 'second'; 
    
            initHoverOverlayElements();
            initThemeToggle(); 
            initMainDropdown();
            initRaceStateDropdown();
            initTermSelector();
            initHighlightZoom();
            createMiniAggregateDisplays();
            initMiniScrollerAnimation();
            initDownloadModal();
            
            selectAggregate(currentAggregateId, true);
            
            pollsterDropdownSelected.addEventListener('click', () => {
                pollsterDropdownSelected.classList.toggle('active');
                pollsterDropdownOptions.classList.toggle('active');
            });
    
            pollsterDropdownOptions.addEventListener('click', (e) => {
                const option = e.target.closest('.dropdown-option');
                if(option && option.dataset.pollster){
                    setSelectedPollster(option.dataset.pollster);
                    pollsterDropdownSelected.classList.remove('active');
                    pollsterDropdownOptions.classList.remove('active');
                }
            });
            
            initSearch();
            resetFiltersBtn.addEventListener('click', () => { 
                previousZoomStateBeforeCurrent = null;
                currentZoomSelection.isActive = false;
                
                setSelectedPollster('all');
                pollSearch.value = '';
                pollSearch.dispatchEvent(new Event('input'));
            });
            
            pollChart.addEventListener('mousemove', handleMouseMove);
            pollChart.addEventListener('mouseleave', () => { 
                if (!highlightZoom.isHighlighting) {
                    updateHoverState(null);
                    hoveredPollPoint = null;
                    pollTooltip.style.display = 'none';
                }
            });
            pollChart.addEventListener('wheel', (e) => {
                if(!aggregatedData.timestamps || aggregatedData.timestamps.length === 0) return;
                e.preventDefault();
                if(e.deltaY < 0) zoomIn();
                else zoomOut();
            }, {passive: false});
            
            document.addEventListener('keydown', (e) => { 
                const activeElement = document.activeElement; 
                const allowKeypress = (activeElement === document.body || pollChart.contains(activeElement) || comparativeChart.contains(activeElement)) && !['INPUT','TEXTAREA','SELECT'].includes(activeElement.tagName); 
                if (allowKeypress) { 
                    if (aggregatedData.timestamps && aggregatedData.timestamps.length > 0) { 
                        if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); } 
                        else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomOut(); } 
                        else if (e.key === '0') { e.preventDefault(); resetZoomBtn.click(); } 
                    } 
                    if (e.key === 'Escape') { e.preventDefault(); undoLastZoomOrReset(); } 
                } 
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown-container')) {
                    closeAllDropdowns();
                }
            });
            
            glowEffectToggle.addEventListener('change', () => {
                if(aggregatedData.timestamps && aggregatedData.timestamps.length > 0){
                    drawChart(false);
                    drawComparativeChart(currentHoverIndex);
                    updateHoverState(currentHoverIndex);
                }
                updateAllMiniAggregateCharts();
            });
            
            lineThicknessSlider.addEventListener('input', (e) => {
                currentLineWidth = parseFloat(e.target.value);
                if(aggregatedData.timestamps && aggregatedData.timestamps.length > 0) {
                    drawChart(false);
                }
            });
            
            lineDetailSlider.addEventListener('input', (e) => {
                currentLineDetail = parseInt(e.target.value);
                if(aggregatedData.timestamps && aggregatedData.timestamps.length > 0) {
                    loadPolls();
                }
            });
    
            pollDensitySlider.addEventListener('input', (e) => {
                if(aggregatedData.timestamps && aggregatedData.timestamps.length > 0){
                    updateAggregation();
                    drawChart(false);
                }
            });
            
            const createZoomAction = (actionFn) => () => {
                if (!aggregatedData.timestamps || aggregatedData.timestamps.length === 0) return;
                previousZoomStateBeforeCurrent = { 
                    yMin: chartDimensions.yMin, yMax: chartDimensions.yMax, 
                    startDate: currentZoomSelection.isActive ? currentZoomSelection.startDate : (aggregatedData.timestamps.length > 0 ? aggregatedData.timestamps[0] : new Date()), 
                    endDate: currentZoomSelection.isActive ? currentZoomSelection.endDate : (aggregatedData.timestamps.length > 0 ? aggregatedData.timestamps.at(-1) : new Date())
                };
                actionFn();
            };
    
            zoomInBtn.addEventListener('click', createZoomAction(zoomIn));
            zoomOutBtn.addEventListener('click', createZoomAction(zoomOut));
            resetZoomBtn.addEventListener('click', createZoomAction(() => { 
                currentZoomSelection.isActive = false; 
                loadPolls();
                smartZoom(); 
            }));
            fullRangeBtn.addEventListener('click', createZoomAction(() => {
                currentZoomSelection.isActive = false; 
                loadPolls();
                animateZoom(chartDimensions.yMin, chartDimensions.yMax, 0, 100, 500); 
            }));
            
            comparativeChart.addEventListener('mousemove', handleComparativeHover);
            comparativeChart.addEventListener('mouseleave', handleComparativeLeave);
            
            window.addEventListener('resize', debounce(() => { 
                pollDensitySlider.value = getScreenSizeConfig().pollPointDensity;
                if (aggregatedData.timestamps && aggregatedData.timestamps.length > 0) { 
                    drawChart(false); 
                    drawComparativeChart(currentHoverIndex); 
                    generateXAxisDates(true); 
                    updateHoverState(currentHoverIndex);
                } else { 
                    updateChartDimensions(); 
                    generateGrid(); 
                } 
            }, 100));

            setTimeout(() => {
                pageLoader.classList.add('hidden');
            }, 1500);
        }
        
        function initTermSelector(){
            termOptions.forEach(option => {
                option.addEventListener('click', () => setSelectedTerm(option.dataset.term));
            });
        }
    
        function initSearch(){
            const debouncedSearch = debounce((e) => {
                searchQuery = e.target.value;
                clearSearch.style.display = searchQuery.trim() !== '' ? 'block' : 'none';
                applyFilters();
                updateAggregation();
                renderPollList();
                 if(aggregatedData.timestamps && aggregatedData.timestamps.length > 0){
                    smartZoom();
                }
            }, 300);
    
            pollSearch.addEventListener('input', debouncedSearch);
    
            clearSearch.addEventListener('click', () => {
                pollSearch.value = '';
                pollSearch.dispatchEvent(new Event('input'));
                pollSearch.focus();
            });
            searchTags.forEach(tag => {
                tag.addEventListener('click', () => {
                    pollSearch.value = tag.dataset.example;
                    pollSearch.dispatchEvent(new Event('input'));
                    pollSearch.focus();
                });
            });
        }
    
        function updateHoverState(dataIndex, xOnCanvas = null) {
            const { margin, width, height, yMin, yMax } = chartDimensions;

            if (!aggregatedData.timestamps || aggregatedData.timestamps.length === 0 || !aggregatedData.timestamps.every(t => t instanceof Date && !isNaN(t))) {
                 hoverDisplayState.active = false;
                 renderHoverOverlay();
                 const dpr = window.devicePixelRatio || 1;
                 overlayCtx.clearRect(0, 0, overlayCanvas.width/dpr, overlayCanvas.height/dpr);
                 fadeCtx.clearRect(0, 0, fadeCanvas.width/dpr, fadeCanvas.height/dpr);
                 return;
            }
    
            currentHoverIndex = dataIndex;
    
            if (dataIndex === null) {
                hoverDisplayState.active = false;
            } else {
                 const timeRange = (aggregatedData.timestamps.length > 1) ? (aggregatedData.timestamps.at(-1).getTime() - aggregatedData.timestamps[0].getTime()) : 1;
                 const interpolatedDate = aggregatedData.timestamps[dataIndex];
                 
                 if (xOnCanvas === null) {
                    const firstTimestamp = aggregatedData.timestamps[0].getTime();
                    const chartAreaWidth = width - margin.left - margin.right;
                    const xScale = date => margin.left + (timeRange === 0 ? chartAreaWidth / 2 : ((date.getTime() - firstTimestamp) / timeRange) * chartAreaWidth);
                    xOnCanvas = xScale(interpolatedDate);
                 }
                
                hoverDisplayState.active = true;
                hoverDisplayState.xChart = xOnCanvas;
                hoverDisplayState.date = interpolatedDate;
                
                const points = [];
                const chartAreaHeight = height - margin.top - margin.bottom;
                const yScale = val => height - margin.bottom - ((val - yMin) / (yMax - yMin)) * chartAreaHeight;
    
                const valuesInfo = getValuesAtDate(interpolatedDate);
    
                if (valuesInfo.values[0] !== null) {
                    points.push({ label: currentAggregate.candidates[0], value: valuesInfo.values[0], yChart: yScale(valuesInfo.values[0]), colorVar: currentAggregate.colors[0], colorGlowVar: currentAggregate.colorGlow[0] });
                }
                if (valuesInfo.values[1] !== null) {
                    points.push({ label: currentAggregate.candidates[1], value: valuesInfo.values[1], yChart: yScale(valuesInfo.values[1]), colorVar: currentAggregate.colors[1], colorGlowVar: currentAggregate.colorGlow[1] });
                }
                hoverDisplayState.points = points;
    
                const spreadsInfo = [];
                const mainSpreadVal = aggregatedData.spreads[dataIndex];
                if (mainSpreadVal !== null && !isNaN(mainSpreadVal)) {
                    if (currentAggregate.isRace) {
                        let leaderName, leaderColor;
                        if (mainSpreadVal >= 0) {
                            leaderName = currentAggregate.candidates[0];
                            leaderColor = currentAggregate.colors[0];
                        } else {
                            leaderName = currentAggregate.candidates[1];
                            leaderColor = currentAggregate.colors[1];
                        }
                        spreadsInfo.push({ label: `${leaderName} `, value: `+${Math.abs(mainSpreadVal).toFixed(1)}`, colorVar: leaderColor });
                    } else {
                        spreadsInfo.push({ label: 'Net:', value: `${mainSpreadVal >= 0 ? '+' : ''}${mainSpreadVal.toFixed(1)}%`, colorVar: mainSpreadVal >= 0 ? currentAggregate.colors[0] : currentAggregate.colors[1] });
                    }
                }
                hoverDisplayState.spreadsInfo = spreadsInfo;
            }
            
            renderHoverOverlay();
            const dpr = window.devicePixelRatio || 1;
            if (hoverDisplayState.active) {
                drawVerticalIndicator(hoverDisplayState.xChart);
                drawFadedChart();
            } else {
                overlayCtx.clearRect(0, 0, overlayCanvas.width/dpr, overlayCanvas.height/dpr);
                fadeCtx.clearRect(0, 0, fadeCanvas.width/dpr, fadeCanvas.height/dpr);
            }
            highlightComparativeBars(dataIndex);
        }
    
        function handleMouseMove(event) {
            if (highlightZoom.isHighlighting) return;
            const isTouch = event.touches && event.touches.length > 0;
            const clientX = isTouch ? event.touches[0].clientX : event.clientX;
            const clientY = isTouch ? event.touches[0].clientY : event.clientY;
            if(isTouch) event.preventDefault();

            const rect = pollChart.getBoundingClientRect();
            const xOnCanvas = clientX - rect.left;
            const yOnCanvas = clientY - rect.top;
            
            let foundHoveredPoint = null;
            const gridX = Math.floor(xOnCanvas / SPATIAL_GRID_SIZE);
            const gridY = Math.floor(yOnCanvas / SPATIAL_GRID_SIZE);
    
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const key = `${gridX + i}_${gridY + j}`;
                    if (pollPointGrid[key]) {
                        for (const point of pollPointGrid[key]) {
                            const dx = xOnCanvas - point.x;
                            const dy = yOnCanvas - point.y;
                            if (dx * dx + dy * dy < point.radius * point.radius) {
                                foundHoveredPoint = point;
                                break;
                            }
                        }
                    }
                    if (foundHoveredPoint) break;
                }
                if (foundHoveredPoint) break;
            }
            
            if (foundHoveredPoint) {
                if (foundHoveredPoint !== hoveredPollPoint) {
                    hoveredPollPoint = foundHoveredPoint;
                    pollChart.style.cursor = 'pointer';
                    showCanvasPollTooltip(foundHoveredPoint);
                }
            } else {
                if (hoveredPollPoint) {
                    hoveredPollPoint = null;
                    pollChart.style.cursor = 'crosshair';
                    pollTooltip.style.display = 'none';
                }
                
                if (!aggregatedData.timestamps || aggregatedData.timestamps.length === 0) return;
                
                if (xOnCanvas < chartDimensions.margin.left || xOnCanvas > chartDimensions.width - chartDimensions.margin.right) {
                    if (hoverDisplayState.active) updateHoverState(null);
                    return;
                }
                
                const valuesInfo = getValuesAtDate(xToDate(xOnCanvas)); 
                const newIndex = valuesInfo.index;
    
                if (newIndex !== currentHoverIndex || !hoverDisplayState.active) {
                    updateHoverState(newIndex, xOnCanvas);
                } else if (hoverDisplayState.active) {
                    hoverDisplayState.xChart = xOnCanvas;
                    renderHoverOverlay();
                    drawVerticalIndicator(xOnCanvas);
                    drawFadedChart();
                }
            }
        }

        function handleTouchStart(e){
            if(e.touches.length !== 1) return;
            const now = Date.now();
            if(now - lastTouchTime < 300){
                startZoomHighlight(e);
                touchHoverActive = false;
            } else {
                touchHoverActive = true;
                handleMouseMove(e);
            }
            lastTouchTime = now;
        }

        function handleTouchMoveWrapper(e){
            if(highlightZoom.isHighlighting){
                updateZoomHighlight(e);
            } else if(touchHoverActive){
                handleMouseMove(e);
            }
        }

        function handleTouchEnd(e){
            if(highlightZoom.isHighlighting){
                endZoomHighlight(e);
            }
            if(touchHoverActive){
                updateHoverState(null);
                hoveredPollPoint = null;
                pollTooltip.style.display = 'none';
                touchHoverActive = false;
            }
        }
        
        function xToDate(xPos) {
            if (!aggregatedData.timestamps || aggregatedData.timestamps.length === 0 || !aggregatedData.timestamps[0]) return new Date();
            const { margin, width } = chartDimensions;
            const chartAreaWidth = width - margin.left - margin.right;
            const firstTimestamp = aggregatedData.timestamps[0].getTime();
            const timeRange = (aggregatedData.timestamps.length > 1) ? (aggregatedData.timestamps.at(-1).getTime() - firstTimestamp) : 1;
            return new Date(firstTimestamp + ((xPos - margin.left) / chartAreaWidth) * timeRange);
        }
        
        function showCanvasPollTooltip(point) {
            const pollData = point.data;
            const pollsterName = pollData.pollster;
            const date = pollData.date;
            const quality = pollData.quality;
            const sampleSize = parseInt(pollData.sampleSize);
            const originalVal1 = parseFloat(pollData.originalValue1); 
            const originalVal2 = parseFloat(pollData.originalValue2);
            const margin = originalVal1 - originalVal2;
    
            let htmlContent = `<div style="font-weight:600;font-size:1.1rem;margin-bottom:5px;">${pollsterName}</div>
                               <div style="color:${getComputedColor('--text-secondary')};margin-bottom:8px;">${formatDate(date)}</div>`;
            
            let candidate1Name = currentAggregate.candidates[0];
            let candidate2Name = currentAggregate.candidates[1];
            let color1 = getComputedColor(currentAggregate.colors[0]);
            let color2 = getComputedColor(currentAggregate.colors[1]);
            
            htmlContent += `<div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                                <span>${candidate1Name}:</span>
                                <span style="font-weight:600;color:${color1};">${originalVal1.toFixed(1)}%</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                                <span>${candidate2Name}:</span>
                                <span style="font-weight:600;color:${color2};">${originalVal2.toFixed(1)}%</span>
                            </div>
                            <div style="border-top:1px solid ${getComputedColor('--border-light')};padding-top:8px;margin-top:3px;">
                                <div style="display:flex;justify-content:space-between;margin-bottom:3px;">`;
            if (currentAggregate.isRace) {
                 if (margin > 0) {
                     htmlContent += `<span>Lead:</span><span style="font-weight:700; color:${color1};">${candidate1Name.split(' ').pop()} +${margin.toFixed(1)}</span>`;
                 } else if (margin < 0) {
                     htmlContent += `<span>Lead:</span><span style="font-weight:700; color:${color2};">${candidate2Name.split(' ').pop()} +${Math.abs(margin.toFixed(1))}</span>`;
                 } else {
                     htmlContent += `<span>Lead:</span><span style="font-weight:700;">Even</span>`;
                 }
            } else {
                 htmlContent += `<span>Margin:</span><span style="font-weight:700;">${margin > 0 ? '+' : ''}${margin.toFixed(1)}%</span>`;
            }
            htmlContent += `</div><div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                                <span>Sample:</span><span>${sampleSize.toLocaleString()}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;">
                                <span>Rating:</span><span style="color:#fbbf24;">${quality} (${formatQualityStars(quality)})</span>
                            </div></div>`;
    
            pollTooltip.innerHTML = htmlContent;
            pollTooltip.style.display = 'block';
            
            const chartRect = pollChart.getBoundingClientRect();
            const tooltipWidth = pollTooltip.offsetWidth;
            const tooltipHeight = pollTooltip.offsetHeight;
            let leftPos = point.x + 15;
            let topPos = point.y - (tooltipHeight/2);
            
            if(leftPos + tooltipWidth > chartRect.width - 10){
                leftPos = point.x - tooltipWidth - 15;
            }
            if(topPos < 10) topPos = 10;
            if(topPos + tooltipHeight > chartRect.height - 10){
                topPos = chartRect.height - tooltipHeight - 10;
            }
            pollTooltip.style.left = `${leftPos}px`;
            pollTooltip.style.top = `${topPos}px`;
        }
    
        document.addEventListener('DOMContentLoaded', () => {
             pageLoader.classList.add('active');
             setTimeout(() => {
                 preprocessPollData();
                 initApp();
             }, 500);
        });
