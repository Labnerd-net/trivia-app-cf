# Code Review - Errors and Areas of Improvement

## Critical Errors

### 1. Token Prop Type Mismatch (RUNTIME ERROR)
**Location**: `src/App.jsx:20` and `src/pages/Quiz.jsx:18`

**Issue**:
- In `App.jsx` line 20: `setToken(response.data.token)` stores the token as a string
- In `Quiz.jsx` line 18: Accesses it as `token.token` (treating it as an object)

**Impact**: This will cause a runtime error - cannot read property 'token' of undefined/string

**Fix**: Change `App.jsx` line 20 to:
```javascript
setToken(response.data);
```
OR change `Quiz.jsx` line 18 to:
```javascript
const url = createTriviaApiUrl(numberOfQuestions, categoryID, difficulty, type, token);
```

### 2. React Router Import (NOT AN ISSUE)
**Location**: `src/App.jsx:4`, `src/pages/Quiz.jsx:2`, `src/pages/Menu.jsx:4`

**Note**: Initially flagged as incorrect, but React Router v7 uses unified `react-router` package
**Status**: No fix needed - imports are correct for v7

## Major Issues

### 3. BrowserRouter Placement
**Location**: `src/App.jsx:41`

**Issue**: BrowserRouter should wrap the entire app in `main.jsx`, not be nested inside `App.jsx`

**Impact**: Can cause issues with routing context and is against React Router best practices

**Fix**: Move BrowserRouter to `main.jsx` to wrap `<App />`

### 4. useEffect Dependency Array Issues
**Location**: `src/pages/Quiz.jsx:35-37`

**Issue**: The `url` constant is computed inline and used as a dependency, causing the effect to run on every render. Additionally, `retreiveQuestions` function is not stable.

**Impact**: Unnecessary API calls and potential infinite loops

**Fix**: Either:
- Use individual dependencies (categoryID, difficulty, type, token)
- OR memoize the url with `useMemo`
- Wrap `retreiveQuestions` in `useCallback`

### 5. XSS Vulnerability
**Location**: `src/components/Question.jsx:23` and `:34`

**Issue**: Using `dangerouslySetInnerHTML` without sanitization for user-generated content

**Impact**: Potential XSS attacks if OpenTDB API is compromised or returns malicious content

**Mitigation**: Consider using a library like `DOMPurify` to sanitize HTML, or decode HTML entities manually

### 6. Missing AbortController
**Location**: All axios requests in `App.jsx`, `Quiz.jsx`, `Menu.jsx`

**Issue**: API requests are not cancelled when component unmounts

**Impact**: Memory leaks, setting state on unmounted components, unnecessary network usage

**Fix**: Implement AbortController in useEffect cleanup functions

## Code Quality Issues

### 7. Outdated Variable Declarations
**Location**: `src/requests.js:22`, `:30`, `:31`

**Issue**: Using `var` instead of `const`/`let`

**Fix**: Replace with `const` or `let` as appropriate

### 8. Consistent Typo: "retreive"
**Location**: Multiple files
- `src/App.jsx:16` - `retreiveToken`
- `src/pages/Quiz.jsx:20` - `retreiveQuestions`
- `src/pages/Menu.jsx:23` - `retreiveCategories`

**Issue**: Misspelling of "retrieve" (should have 'ie' not 'ei')

**Fix**: Rename all instances to use correct spelling: `retrieveToken`, `retrieveQuestions`, `retrieveCategories`

### 9. Array Index as Key
**Location**:
- `src/pages/Quiz.jsx:72`
- `src/pages/Menu.jsx:78`, `:89`, `:100`
- `src/components/Question.jsx:29`

**Issue**: Using array index as React key prop

**Impact**: Potential rendering bugs when list order changes

**Fix**: Use stable unique identifiers (question IDs, category IDs, etc.)

### 10. Inconsistent Import Ordering
**Location**: `src/components/Question.jsx:1-2`

**Issue**: React imports split across multiple lines instead of combined

**Fix**: Combine into single import:
```javascript
import { useState, useEffect } from 'react'
```

### 11. Unused Export
**Location**: `src/requests.js:72-94`

**Issue**: `getCategoryCount` function is exported but never used

**Fix**: Remove if not needed, or implement feature to show question counts

### 12. No Error Recovery
**Location**: `src/App.jsx:36`

**Issue**: If token retrieval fails, app shows error with no way to retry

**Fix**: Add a "Retry" button or automatic retry logic

### 13. Missing Loading States
**Location**: `src/pages/Quiz.jsx`

**Issue**: When fetching new questions via "Next Questions", no loading indicator is shown

**Fix**: Show loading state during re-fetch

### 14. Accessibility Issues
**Location**: `src/components/Question.jsx:31`

**Issue**: List items have `disabled` class but are not actually disabled buttons, causing confusion for screen readers

**Fix**: Remove `disabled` class or convert to proper interactive elements with ARIA labels

### 15. No Request Deduplication
**Location**: `src/pages/Quiz.jsx:20-33`

**Issue**: Multiple rapid calls to `nextQuestions` could trigger duplicate API requests

**Fix**: Disable button during loading or implement request deduplication

## Performance Optimizations

### 16. Unnecessary Re-shuffling
**Location**: `src/components/Question.jsx:10-14`

**Issue**: Answers are reshuffled every time question prop changes

**Impact**: Minor performance issue, but shuffling should only happen once per question

**Recommendation**: This is actually correct behavior when questions change, but consider if shuffling is needed on every render

### 17. Missing Memoization
**Location**: `src/pages/Quiz.jsx`

**Issue**: `difficulties.find()` and `types.find()` called on every render

**Fix**: Memoize these values with `useMemo`

## Best Practice Improvements

### 18. Magic Numbers
**Location**: `src/pages/Quiz.jsx:16`

**Issue**: Hard-coded `numberOfQuestions = 10`

**Fix**: Move to a constant or make configurable

### 19. Console.log Statements
**Location**: Throughout the codebase

**Issue**: Multiple `console.log` statements left in production code

**Fix**: Remove or replace with proper logging solution

### 20. No TypeScript
**Issue**: JavaScript without type safety

**Recommendation**: Consider migrating to TypeScript for better type safety and developer experience

### 21. Missing PropTypes
**Issue**: No runtime prop validation

**Fix**: Add PropTypes or migrate to TypeScript

### 22. Worker Endpoint Not Implemented
**Location**: `worker/index.js:5-9`

**Issue**: Placeholder API endpoint returns dummy data

**Recommendation**: Either implement the API endpoint or remove the stub code

## Summary

**Critical**: 2 issues (token mismatch will cause runtime error)
**Major**: 6 issues (routing, dependencies, security, memory leaks)
**Code Quality**: 17 issues (typos, unused code, accessibility, performance)

**Priority**: Fix critical errors first, especially the token prop mismatch.
