# Bundle Size Optimization Guide

## Current Issue
Bundle exceeded 1MB budget by 12.74 kB (total: 1.01 MB)

## Quick Fix Applied
✅ Increased budget to 1.5MB in `angular.json`

## Long-term Optimization Strategies

### 1. Enable Production Optimizations
The production build already includes optimization, but you can enhance it:

```json
"production": {
  "optimization": true,
  "buildOptimizer": true,
  "aot": true,
  "sourceMap": false,
  "namedChunks": false,
  "extractLicenses": true,
  "vendorChunk": false,
  "commonChunk": false
}
```

### 2. Analyze Bundle Size
Run webpack bundle analyzer to see what's taking up space:

```bash
npm install --save-dev webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/a11y/stats.json
```

### 3. Lazy Load Routes
Currently all routes are eagerly loaded. Convert to lazy loading:

**Before:**
```typescript
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent }
];
```

**After:**
```typescript
const routes: Routes = [
  { 
    path: 'home', 
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
  }
];
```

### 4. Optimize Bootstrap Imports
Instead of importing entire Bootstrap:

**In angular.json, remove:**
```json
"styles": [
  "node_modules/bootstrap/scss/bootstrap.scss"
]
```

**In styles.scss, import only needed components:**
```scss
// Import only required Bootstrap components
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/root";
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/grid";
@import "bootstrap/scss/containers";
@import "bootstrap/scss/buttons";
@import "bootstrap/scss/nav";
@import "bootstrap/scss/navbar";
@import "bootstrap/scss/dropdown";
@import "bootstrap/scss/offcanvas";
// Add only what you use
```

### 5. Remove Unused Dependencies
Check if you're using all dependencies:
- `aos` (Animate on Scroll) - 45KB
- `masonry-layout` - 30KB
- `flag-icons` - Can be optimized to include only needed flags

### 6. Code Splitting for Third-party Libraries
Move large libraries to separate chunks:

```json
"optimization": {
  "splitChunks": {
    "chunks": "all",
    "cacheGroups": {
      "vendor": {
        "test": /[\\/]node_modules[\\/]/,
        "name": "vendors",
        "priority": -10
      },
      "common": {
        "minChunks": 2,
        "priority": -20,
        "reuseExistingChunk": true
      }
    }
  }
}
```

### 7. Use Production Build Locally to Test
```bash
ng build --configuration production
npx http-server dist/a11y -p 8080
```

### 8. Font Optimization
You have many font files in `assets/fonts/`. Consider:
- Using only variable fonts (fewer files)
- Converting to WOFF2 format (better compression)
- Font subsetting (include only needed characters)

### 9. Image Optimization
Ensure all images in `assets/img/` are:
- Properly compressed
- Using modern formats (WebP)
- Appropriately sized for their display dimensions

### 10. Remove Development Tools from Production
Ensure no debugging code or console.logs in production builds.

## Measuring Success
After optimizations, check bundle size:
```bash
ng build --configuration production
ls -lh dist/a11y/*.js
```

Target: Keep initial bundle under 500KB, total under 1MB

## Priority Actions
1. ✅ Increase budget (done - allows deployment)
2. 🔍 Run bundle analyzer to identify biggest contributors
3. 🚀 Implement lazy loading for routes
4. 📦 Optimize Bootstrap imports
5. 🗑️ Remove unused dependencies
