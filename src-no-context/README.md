# No-Context Version

This folder contains the **original implementation** without Context API - using prop drilling instead.

## 📁 Structure

```
src-no-context/
├── App.js              (useReducer directly, passes props)
└── component/
    ├── StartScreen.js  (receives numQuestions, dispatch)
    ├── Questions.js    (receives question, dispatch, answer, index)
    ├── Options.js      (receives question, dispatch, answer)
    ├── NextButton.js   (receives dispatch, answer, index, numQuestions)
    ├── Progress.js     (receives index, numQuestions, points, totalPoints)
    ├── ProgressBar.js  (receives index, numQuestions)
    ├── Timer.js        (receives secondsRemaining)
    └── FinishScreen.js (receives points, totalPoints, highscore, dispatch)
```

## 🔄 Comparison

### With Context API (src/)
- ✅ No prop drilling
- ✅ Components use `useQuiz()` hook
- ✅ Centralized state management
- ✅ Easier to add new components

### Without Context API (src-no-context/)
- ⚠️ Prop drilling through components
- ⚠️ Props passed to components that don't need them
- ⚠️ Must update parent when adding new components
- ✅ Simpler for small apps
- ✅ No Context setup needed

## 📊 Data Flow

**No-Context Version:**
```
App.js (useReducer)
  ↓ props
StartScreen (receives numQuestions, dispatch)
  ↓ props
Questions (receives question, dispatch, answer, index)
  ↓ props
Options (receives question, dispatch, answer)
```

**Context Version:**
```
QuizProvider (useReducer)
  ↓ context
Any component can use useQuiz() directly
```

## 🎯 When to Use Each

### Use No-Context when:
- Small app with few components
- Simple state management
- Props only go 1-2 levels deep

### Use Context when:
- Large app with many components
- Complex state management
- Props would go through many levels
- Multiple components need same state

## 📝 Key Differences

| Feature | No-Context | With Context |
|---------|-----------|--------------|
| State Location | App.js | QuizContext.js |
| Component Access | Via props | Via useQuiz() hook |
| Prop Drilling | Yes | No |
| Setup Complexity | Simple | Moderate |
| Scalability | Limited | Better |
