# Translation Fix: "Accessible Healthcare" Spanish Translation

## Problem
"Accessible Healthcare" was not being displayed in Spanish when users selected Spanish as their language.

## Root Cause
There was a typo inconsistency in the translation key:
- **Code used**: `'submenu.healthcare'` and `'app-content-links.healthcare'` (with 't')
- **Spanish translation file had**: `"healcare"` (missing 't')

This mismatch caused the translation lookup to fail, displaying the English text as a fallback.

## Files Fixed

### Translation Files
1. **`src/assets/i18n/es.json`**
   - Changed `"healcare"` → `"healthcare"` in `submenu` object (line 24)
   - Changed `"healcare"` → `"healthcare"` in `app-content-links` object (line 82)
   - Spanish translation: "Sanidad accesible"

2. **`src/assets/i18n/en.json`**
   - Changed `"healcare"` → `"healthcare"` in `app-content-links` object (line 84)
   - English translation: "Accessible healthcare"

### Component Files
Updated all component HTML files to use the correct key `'app-content-links.healthcare'`:

1. **`src/app/components/accessibility-Info/accessibility/accessibility.component.html`**
2. **`src/app/components/accessibility-Info/phisical-accessibility/phisical-accessibility.component.html`**
3. **`src/app/components/accessibility-Info/inclusivity/inclusivity.component.html`**
4. **`src/app/components/accessibility-Info/accessible-healthcare/accessible-healthcare.component.html`**

## Result
✅ "Accessible Healthcare" now correctly displays as "Sanidad accesible" in Spanish
✅ All navigation links and menus use consistent translation keys
✅ No compilation errors

## Testing
To verify the fix works:
1. Run the application: `ng serve`
2. Navigate to the healthcare menu item
3. Switch language to Spanish
4. Confirm "Accessible Healthcare" displays as "Sanidad accesible"
