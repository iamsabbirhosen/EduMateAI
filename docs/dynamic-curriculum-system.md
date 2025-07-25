# Dynamic Curriculum System

## Overview

The EduMate AI application now includes a dynamic curriculum system that automatically syncs with the folder structure in the `public/materials` directory. This means that when you add or remove folders from the materials directory, the system will automatically detect these changes and update the curriculum accordingly.

## Folder Structure

The system follows this exact hierarchy:

```
public/materials/
├── 8/                          # Class (numeric folder names)
│   └── science/                # Subject (kebab-case folder names)
│       └── light/              # Chapter (kebab-case folder names)
│           └── reflection/     # Topic (kebab-case folder names)
│               └── material.pdf # PDF file (must be named "material.pdf")
├── 9/
│   └── english/
│       └── grammar/
│           └── tenses/
│               └── material.pdf
├── 10/
│   └── bangla/
│       └── literature/
│           └── kazi-nazrul-islam/
│               └── material.pdf
├── 11/
│   └── chemistry/
│       └── periodic-table/
│           └── periodic-trends/
│               └── material.pdf
└── 12/
    ├── math/
    │   └── calculus/
    │       └── differentiation/
    │           └── material.pdf
    └── physics/
        ├── newtonian-mechanics/
        │   ├── newtons-1st-law/
        │   │   └── material.pdf
        │   └── newtons-2nd-law/
        │       └── material.pdf
        └── thermodynamics/
            └── zeroth-law/
                └── material.pdf
```

## Key Features

### 1. Automatic Detection
- The system scans the `public/materials` directory structure
- Converts kebab-case folder names to readable titles (e.g., `newtonian-mechanics` → `Newtonian Mechanics`)
- Automatically generates Bengali translations for common subjects and topics
- Only includes topics that have a `material.pdf` file

### 2. Caching System
- Curriculum data is cached for 30 seconds to improve performance
- Automatic refresh every 5 minutes to detect new changes
- Manual refresh option available through the dashboard

### 3. Fallback System
- If the API fails, the system falls back to hardcoded curriculum data
- Ensures the application continues to work even if there are file system issues

## How to Add New Content

To add new classes, subjects, chapters, or topics:

1. **Add a new class**: Create a numeric folder (e.g., `13` for Class 13)
2. **Add a new subject**: Create a kebab-case folder under a class (e.g., `biology`)
3. **Add a new chapter**: Create a kebab-case folder under a subject (e.g., `cell-biology`)
4. **Add a new topic**: Create a kebab-case folder under a chapter (e.g., `mitosis`)
5. **Add the material**: Place a PDF file named `material.pdf` in the topic folder

### Example: Adding a new Biology topic for Class 12

```bash
# Create the folder structure
mkdir -p public/materials/12/biology/cell-biology/mitosis
# Add the PDF file
cp your-mitosis-material.pdf public/materials/12/biology/cell-biology/mitosis/material.pdf
```

The system will automatically:
- Detect the new folder structure
- Convert `biology` to `Biology`
- Convert `cell-biology` to `Cell Biology`
- Convert `mitosis` to `Mitosis`
- Generate PDF URL: `/materials/12/biology/cell-biology/mitosis/material.pdf`

## How to Remove Content

Simply delete the folder from the materials directory. The system will automatically remove it from the curriculum on the next refresh.

## Manual Refresh

If you want to immediately see changes without waiting for the automatic refresh:

1. Go to the Dashboard
2. Find the "System Management" section
3. Click the "Refresh Curriculum" button

## API Endpoints

- `GET /api/curriculum` - Returns the current curriculum data
- `POST /api/curriculum/refresh` - Manually triggers a curriculum refresh

## Technical Implementation

### Components
- `src/lib/curriculum.ts` - Main curriculum functions with caching
- `src/app/api/curriculum/route.ts` - API endpoint for dynamic curriculum generation
- `src/context/CurriculumContext.tsx` - React context for global curriculum state
- `src/hooks/use-topic.ts` - React hook for loading topic data
- `src/components/admin/curriculum-refresh-card.tsx` - Admin component for manual refresh

### Key Functions
- `getCurriculumData()` - Async function to get curriculum with caching
- `getTopicBySlug()` - Async function to get topic data by URL slug
- `refreshCurriculumData()` - Function to force refresh curriculum cache

## Translation Support

The system includes basic Bengali translations for common terms. To add more translations, update the `titleToBengali()` function in `src/app/api/curriculum/route.ts`.

## Performance Considerations

- Curriculum data is cached to reduce file system operations
- The system only scans directories when the cache expires
- Background refresh every 5 minutes prevents stale data
- Fallback system ensures reliability

## Troubleshooting

### Curriculum not updating
1. Check if the folder structure follows the exact pattern
2. Ensure each topic folder contains a `material.pdf` file
3. Try manual refresh from the dashboard
4. Check browser console for error messages

### PDF not loading
1. Verify the PDF file is named exactly `material.pdf`
2. Check file permissions
3. Ensure the PDF is not corrupted

### Performance issues
1. Reduce the number of folders if possible
2. Consider increasing cache duration in `src/lib/curriculum.ts`
3. Monitor server resources during peak usage
