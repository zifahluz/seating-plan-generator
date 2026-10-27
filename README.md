# Classroom Seating Planner

A static classroom seating planner. Student names, constraints and plans are processed in your browser; the app makes no network requests and uses no analytics, external libraries, APIs, backend or database. Sample students are fictional.

## Preview

Open `index.html` in a modern browser. Alternatively, run `python3 -m http.server 8000` in this folder and visit `http://localhost:8000`. No installation or build step is required.

## Use

1. Enter a class name and add one student per line, or import a CSV. The CSV may have one name per row, or a `Name` / `Student Name` header in a multi-column file. Quoted fields are supported. Duplicate names are skipped; distinguish students with the same name using an initial.
2. Set rows and columns (1–12 each). The front of the classroom is at the top.
3. Optionally add pairs who should not sit adjacent. Adjacent means immediately left, right, in front or behind; diagonals are allowed.
4. Select **Generate seating**. Select **Lock** on occupied seats to retain them during regeneration. Choose two unlocked seats to swap or move a student. A swap violating a rule is rejected.
5. Use **Save JSON** to download a plan and **Open JSON** to restore it. No automatic storage is used: save before leaving or refreshing. Keep these files in an approved, secure location as they contain student names.
6. Use **Print / PDF** and select your printer or your browser's Save as PDF option. Load sample class supplies fictional names; Reset clears the current session after confirmation.

Adding students or changing dimensions clears the arrangement and locks. Removing a student removes their associated rules and seat. To add a pair already adjacent in the displayed plan, first swap them apart or change the layout to clear the plan. A failed generation leaves the existing plan unchanged.

The solver searches possible assignments until it finds a solution, proves none exists, or reaches a time/complexity limit. A limit is reported as inconclusive, not impossible. Large or heavily constrained classrooms may need fewer rules or another attempt.

## Tests

With Node.js installed, run `node tests/solver.test.js`. Tests cover locks, separation, impossible layouts, invalid input, swaps and the search limit. Node is only needed to run tests, not to use the app.

## Publish with GitHub Pages

1. Create a GitHub repository and upload all files in this folder to the **root** of the repository, including `index.html`, `style.css`, `solver.js`, `app.js`, `README.md`, and the `tests` folder. Do not upload real student JSON or CSV files.
2. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select your default branch and `/ (root)`, then save.
3. Wait for deployment to finish and open the URL shown in Settings → Pages. The app uses relative paths and needs no build process.

A public repository exposes its source files, but names entered into the app remain local. Do not commit real student data. Follow your school's policies before using identifiable student information, and protect saved or printed plans.
