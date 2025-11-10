# Trump Approval Rating Aggregate

A professional, interactive polling aggregate tracking President Trump's approval ratings, inspired by FiveThirtyEight's design.

## Features

- **Interactive Chart**: Time-weighted visualization showing approval/disapproval trends with individual poll results displayed as circles
- **Trendlines**: 14-day moving averages for both approval and disapproval ratings
- **Sortable Table**: Click any column header to sort polls
- **Filtering**: Filter polls by respondent type (RV, LV, A)
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Clean UI**: Professional design with smooth animations and hover effects

## Technologies Used

- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with flexbox/grid, gradients, and animations
- **JavaScript (ES6+)**: Vanilla JS for interactivity
- **Chart.js 4.4**: Interactive data visualization library
- **Chart.js Date Adapter**: For time-series data handling

## File Structure

```
trumpap/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── data.js            # Poll data (230+ polls from Jan-Oct 2025)
├── chart.js           # Chart initialization and trend calculations
└── table.js           # Table rendering, sorting, and filtering
```

## Methodology

This aggregate implements a **14-day half-life time-weighted average**, exactly as described:

1. **Pollster-based weighting**: Every pollster (not every poll) is weighted according to its most recently conducted poll
2. **Exponential decay**: Uses formula `weight = 0.5^(days_ago / 14)` for 14-day half-life
3. **Daily calculations**: Computes weighted average for every single day in the date range
4. **Pollster averaging**: Within each pollster, multiple polls are time-weighted; e.g., polls at 14, 28, and 42 days ago contribute in a 4:2:1 ratio
5. **Population hierarchy**: If a pollster has multiple populations, LV > RV > A

This creates the detailed, jagged trendlines you see - not smoothed averages, but actual daily weighted calculations reflecting every poll's decay over time.

## Key Design Elements

### Color Scheme
- **Approve**: Emerald green (#059669 for lines, soft green circles)
- **Disapprove**: Pink (#ec4899 for lines, soft pink circles)
- **Clean background**: Pure white with minimal grid lines

### Chart Features
- No grid lines (except 50% dashed reference line)
- Filled circle markers (not hollow)
- Interactive crosshair with date tracking
- Dynamic labels with white text glow (no boxes)
- Labels auto-separate when trendlines converge

### Typography
- Font: System font stack (-apple-system, BlinkMacSystemFont, etc.)
- Y-axis: 12px, weight 400
- Clean, minimal styling matching FiveThirtyEight

## How to Use

1. **Open** `index.html` in any modern web browser
2. **View** the interactive chart showing all polls and trend lines
3. **Hover** over data points to see poll details
4. **Filter** polls using the checkboxes (RV, LV, A)
5. **Sort** the table by clicking column headers
6. **Explore** trends over time

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Fully responsive

## Future Enhancements

- Date range selector
- Poll quality weighting
- Historical comparison view
- Export data functionality
- Search/filter by pollster

## Data Source

Poll data compiled from various high-quality polling organizations including:
- YouGov
- Gallup
- Pew Research Center
- Quinnipiac University
- And many more reputable pollsters

---

Created with Chart.js and modern web technologies.
