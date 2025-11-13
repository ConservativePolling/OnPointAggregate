# Testing Guide for New Features

## 🧪 Quick Test Checklist

### 1. Test Comparison Mode ("Look at the Shift")

**Steps:**
1. Navigate to the NJ gubernatorial election (should load by default)
2. Look for the "Look at the shift" button next to 2025/2021 toggles
3. Click the button

**Expected Results:**
- ✅ Button background changes to blue-to-red gradient
- ✅ Directional arrows appear on counties
- ✅ Blue arrows point LEFT at angle (Democratic shift)
- ✅ Red arrows point RIGHT at angle (Republican shift)
- ✅ Larger arrows on counties with bigger shifts
- ✅ Small shifts (<0.5%) don't show arrows

**To Verify:**
```
Look for counties that shifted:
- Burlington: Should show shift arrow
- Ocean: Should show shift arrow
- Hudson: Should show shift arrow
```

4. Click button again to deactivate

**Expected Results:**
- ✅ Button returns to normal style
- ✅ All arrows disappear from map
- ✅ Standard map shading returns

### 2. Test County Hover Fade Effect

**Steps:**
1. Hover mouse over any county on the map (e.g., Ocean County)

**Expected Results:**
- ✅ Hovered county stays at full brightness
- ✅ All other counties fade to 20% opacity
- ✅ Other counties appear grayed out (50% grayscale)
- ✅ Clear visual focus on hovered county
- ✅ Smooth transition animation

2. Move mouse away from county

**Expected Results:**
- ✅ All counties return to normal brightness
- ✅ Grayscale filter removed
- ✅ Smooth fade-in animation

### 3. Test New Tooltip Bar Visualization

**Steps:**
1. Hover over any county with vote data (e.g., Ocean County)

**Expected Results:**
- ✅ Tooltip appears with white background
- ✅ County name at top (e.g., "Ocean, NJ")
- ✅ Each candidate shows:
  - Photo or party initial circle
  - Name and party: "Ciattarelli (R)"
  - Percentage on right: "68.2%"
  - **Horizontal colored bar** showing vote share
  - Vote count below: "12,345 votes"
- ✅ Bars are colored by party (blue for Dem, red for Rep)
- ✅ Bar length matches vote percentage
- ✅ Background gray track visible behind bars
- ✅ Margin section at bottom
- ✅ "Source: Civic API | Last Updated: [timestamp]" at bottom

**Visual Check:**
```
If candidate has 68% of votes:
→ Bar should fill ~68% of available space
→ Remaining 32% should be gray background

If candidate has 32% of votes:
→ Bar should fill ~32% of available space
→ Remaining 68% should be gray background
```

### 4. Test Desktop Button Positioning

**Steps:**
1. Load page in desktop view (>1024px width)
2. Look at top-right corner

**Expected Results:**
- ✅ Theme toggle visible at top (20px from top)
- ✅ Vote circles toggle below it (60px from top)
- ✅ No overlap with page content
- ✅ Buttons don't cover historical viewer controls
- ✅ All buttons clickable and accessible

**Screen Sizes to Test:**
- 1920x1080 (Full HD)
- 1366x768 (Common laptop)
- 1024x768 (Tablet landscape)

### 5. Test Combined Features

**Steps:**
1. Enable comparison mode ("Look at the shift")
2. Hover over a county with a shift arrow

**Expected Results:**
- ✅ Arrow remains visible
- ✅ Hovered county highlighted
- ✅ Other counties fade out
- ✅ Tooltip shows bar visualization
- ✅ Bars accurately reflect vote percentages
- ✅ All animations smooth

3. While hovering, move to different county

**Expected Results:**
- ✅ Previous county fades
- ✅ New county highlights
- ✅ Tooltip updates instantly
- ✅ Bars update to show new county data
- ✅ No flickering or glitches

### 6. Test Theme Compatibility

**Dark Mode Test:**
1. Click theme toggle to switch to dark mode

**Expected Results:**
- ✅ Tooltip background remains white (intentional)
- ✅ Arrow colors remain vivid (blue/red)
- ✅ Faded counties still visible in dark mode
- ✅ Comparison button gradient visible
- ✅ All text readable

**Light Mode Test:**
2. Click theme toggle to return to light mode

**Expected Results:**
- ✅ All features work identically
- ✅ No visual artifacts
- ✅ Smooth theme transition

### 7. Test Data Accuracy

**Verify Shift Calculation:**
1. Enable comparison mode
2. Pick a county (e.g., Ocean County)
3. Note arrow direction and size
4. Switch to 2021 view (click "2021" button)
5. Hover over same county, note margin
6. Switch to 2025 view (click "2025" button)
7. Hover over same county, note margin
8. Calculate: 2025 margin - 2021 margin

**Expected Results:**
- ✅ If result is positive (shift to Dem): Blue arrow points LEFT
- ✅ If result is negative (shift to Rep): Red arrow points RIGHT
- ✅ Larger magnitude = Larger arrow

**Arrow Size Rules:**
- Small arrow: 0.5% - 5% shift
- Medium arrow: 5% - 10% shift
- Large arrow: >10% shift

### 8. Test Edge Cases

**No Data County:**
1. Hover over a county with no results yet

**Expected Results:**
- ✅ Tooltip shows "No results yet"
- ✅ No bars displayed
- ✅ No crash or error

**Comparison with Missing Data:**
1. Enable comparison on a county with 2025 data but no 2021 data

**Expected Results:**
- ✅ No arrow displayed for that county
- ✅ Other counties with both years still show arrows
- ✅ No JavaScript errors in console

**Multiple Rapid Toggles:**
1. Click comparison button multiple times rapidly (on/off/on/off)

**Expected Results:**
- ✅ Button state toggles correctly each time
- ✅ Arrows appear/disappear correctly
- ✅ No duplicate arrows
- ✅ No memory leaks

## 🐛 Known Behaviors (Not Bugs)

1. **Comparison only for NJ**: Button only appears for NJ gubernatorial race
2. **Requires 2021 data**: If historical JSON not found, comparison won't work
3. **Small shifts hidden**: Shifts under 0.5% don't show arrows (by design)
4. **Tooltip stays white**: Even in dark mode (matches screenshot design)
5. **Arrows on zoom**: Arrows maintain position during map zoom

## 📊 Success Criteria

All features pass if:
- ✅ No JavaScript errors in console
- ✅ All animations smooth (60 fps)
- ✅ Tooltips position correctly (don't overflow viewport)
- ✅ Arrows render at correct positions
- ✅ Bars accurately reflect vote percentages
- ✅ Hover effects work consistently
- ✅ Theme switching doesn't break features
- ✅ Mobile layout remains functional

## 🚀 Performance Benchmarks

**Good Performance:**
- Comparison mode activation: <200ms
- Arrow rendering: <100ms per county
- Hover fade effect: <50ms
- Tooltip update: <30ms

**Memory:**
- No memory leaks on repeated toggles
- Arrows properly cleaned up when disabled
- Event listeners properly removed

## 📝 Testing Notes

**Browser Testing:**
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS)

**Device Testing:**
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (1024x768)
- Mobile (375x667)

**Accessibility:**
- All buttons keyboard accessible
- Tooltips follow cursor
- High contrast maintained
- No motion sickness triggers

---

## ✅ Final Verification

After running all tests, verify:
1. All 8 test sections pass
2. No console errors
3. Smooth user experience
4. Professional appearance
5. Data accuracy confirmed

**If all pass: PRODUCTION READY! 🎉**
