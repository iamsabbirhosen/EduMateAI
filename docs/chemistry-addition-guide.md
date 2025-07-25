# Dynamic Curriculum - Adding Chemistry to Class 12

## Issue Resolution

**Problem**: You created a chemistry subject folder under Class 12, but it wasn't showing up on the dashboard for Class 12 students.

**Root Cause**: The dynamic curriculum system only includes subjects that have complete folder structures with at least one topic containing a `material.pdf` file.

## Solution Steps

### 1. Folder Structure Requirements

For a subject to appear in the curriculum, it must follow this complete hierarchy:

```
public/materials/12/chemistry/
├── [chapter-name]/
│   └── [topic-name]/
│       └── material.pdf
```

### 2. What Was Missing

Initially, you had:
```
public/materials/12/chemistry/
(empty folder)
```

The system requires at least this structure:
```
public/materials/12/chemistry/
└── organic-chemistry/
    └── hydrocarbons/
        └── material.pdf
```

### 3. Current Chemistry Structure

After adding the complete structure, Class 12 Chemistry now includes:

```
Chemistry/
├── Inorganic Chemistry/
│   └── Acids And Bases/
│       └── material.pdf
└── Organic Chemistry/
    ├── Alcohols/
    │   └── material.pdf
    └── Hydrocarbons/
        └── material.pdf
```

## How to Add More Chemistry Topics

### Example 1: Adding Physical Chemistry

```bash
# Create folder structure
mkdir -p "public/materials/12/chemistry/physical-chemistry/chemical-kinetics"

# Add PDF file (replace with your actual PDF)
copy your-kinetics-material.pdf "public/materials/12/chemistry/physical-chemistry/chemical-kinetics/material.pdf"
```

### Example 2: Adding More Organic Chemistry Topics

```bash
# Add alkenes topic
mkdir -p "public/materials/12/chemistry/organic-chemistry/alkenes"
copy your-alkenes-material.pdf "public/materials/12/chemistry/organic-chemistry/alkenes/material.pdf"

# Add aldehydes and ketones topic
mkdir -p "public/materials/12/chemistry/organic-chemistry/aldehydes-and-ketones"
copy your-aldehydes-material.pdf "public/materials/12/chemistry/organic-chemistry/aldehydes-and-ketones/material.pdf"
```

## Verification Steps

1. **Check API Response**:
   ```powershell
   $response = Invoke-RestMethod -Uri "http://localhost:9002/api/curriculum"
   $class12 = $response.data | Where-Object { $_.id -eq 12 }
   $class12.subjects | ForEach-Object { $_.name }
   ```

2. **Manual Refresh** (if needed):
   - Go to Dashboard → System Management section
   - Click "Refresh Curriculum" button

3. **View in Application**:
   - Visit `/subjects` page
   - Chemistry should now appear alongside Math and Physics for Class 12

## Important Notes

- **PDF Requirement**: Each topic folder MUST contain a file named exactly `material.pdf`
- **Auto-Update**: The system refreshes every 5 minutes automatically
- **Caching**: Changes may take up to 30 seconds to appear due to caching
- **Case Sensitivity**: Folder names are converted to proper case automatically (e.g., `organic-chemistry` → `Organic Chemistry`)

## Testing Your Changes

1. Create your folder structure with `material.pdf` files
2. Wait 30 seconds or click the refresh button in the dashboard
3. Check the `/subjects` page
4. The new subject/chapters/topics should appear immediately

The Chemistry subject is now fully functional and will appear for all Class 12 students!
