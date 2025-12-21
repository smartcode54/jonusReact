# Step-by-Step Learning Guide: Context API + useReducer

## 📚 Table of Contents
1. [Understanding the Problem](#understanding-the-problem)
2. [What is Context API?](#what-is-context-api)
3. [What is useReducer?](#what-is-usereducer)
4. [Why Combine Them?](#why-combine-them)
5. [Implementation Walkthrough](#implementation-walkthrough)
6. [Key Concepts Explained](#key-concepts-explained)
7. [Best Practices](#best-practices)

---

## Understanding the Problem

### Before: Prop Drilling
In the original code, state was managed in `App.js` and passed down through multiple components:

```
App.js (has state)
  └── StartScreen (receives numQuestions, dispatch)
  └── Questions (receives question, dispatch, answer, index)
      └── Options (receives question, dispatch, answer)
  └── NextButton (receives dispatch, answer, index, numQuestions)
  └── Progress (receives index, numQuestions, points, totalPoints)
  └── ProgressBar (receives index, numQuestions)
  └── Timer (receives secondsRemaining)
  └── FinishScreen (receives points, totalPoints, highscore, dispatch)
```

**Problems:**
- ❌ Props passed through components that don't need them
- ❌ Hard to add new components (must update parent)
- ❌ Tight coupling between components
- ❌ Difficult to maintain

### After: Context API
With Context API, any component can access state directly:

```
QuizProvider (manages state)
  └── App
      └── StartScreen (uses useQuiz hook)
      └── Questions (uses useQuiz hook)
          └── Options (uses useQuiz hook)
      └── NextButton (uses useQuiz hook)
      └── Progress (uses useQuiz hook)
      └── ProgressBar (uses useQuiz hook)
      └── Timer (uses useQuiz hook)
      └── FinishScreen (uses useQuiz hook)
```

**Benefits:**
- ✅ No prop drilling
- ✅ Easy to add new components
- ✅ Loose coupling
- ✅ Centralized state management

---

## What is Context API?

### Concept
Context API is React's built-in solution for sharing data across components without prop drilling.

### Key Components

#### 1. `createContext()`
Creates a new context object.

```javascript
const QuizContext = createContext();
```

**What it does:**
- Creates a "container" for shared data
- Returns an object with `Provider` and `Consumer` components

#### 2. `Context.Provider`
Makes data available to child components.

```javascript
<QuizContext.Provider value={sharedData}>
  {children}
</QuizContext.Provider>
```

**What it does:**
- Wraps components that need access to the data
- Provides data via the `value` prop
- All children can access this data

#### 3. `useContext()`
Hook to access context data in components.

```javascript
const context = useContext(QuizContext);
```

**What it does:**
- Reads the current context value
- Re-renders when context value changes
- Must be used inside a Provider

### Example Flow

```javascript
// 1. Create Context
const QuizContext = createContext();

// 2. Provide Data
function App() {
  const data = { name: "React Quiz" };
  return (
    <QuizContext.Provider value={data}>
      <ChildComponent />
    </QuizContext.Provider>
  );
}

// 3. Consume Data
function ChildComponent() {
  const { name } = useContext(QuizContext);
  return <h1>{name}</h1>; // "React Quiz"
}
```

---

## What is useReducer?

### Concept
`useReducer` is a React hook for managing complex state logic. It's an alternative to `useState` when you have:
- Complex state updates
- Multiple related state values
- State updates that depend on previous state

### Comparison: useState vs useReducer

#### useState (Simple State)
```javascript
const [count, setCount] = useState(0);

// Update
setCount(count + 1);
```

#### useReducer (Complex State)
```javascript
const [state, dispatch] = useReducer(reducer, initialState);

// Update
dispatch({ type: 'increment' });
```

### Key Components

#### 1. Initial State
The starting state of your application.

```javascript
const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
```

#### 2. Reducer Function
A pure function that takes current state and an action, returns new state.

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        status: 'active',
        index: 0,
        answer: null,
        points: 0,
      };
    case 'newAnswer':
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption 
          ? state.points + question.points 
          : state.points,
      };
    default:
      return state;
  }
}
```

**Reducer Rules:**
- ✅ Must be a pure function (no side effects)
- ✅ Must return new state (don't mutate)
- ✅ Should handle all action types

#### 3. Actions
Objects that describe what happened.

```javascript
// Action format
{ type: 'actionName', payload: data }

// Examples
dispatch({ type: 'start' });
dispatch({ type: 'newAnswer', payload: 1 });
dispatch({ type: 'nextQuestion' });
```

#### 4. Dispatch
Function to send actions to the reducer.

```javascript
const [state, dispatch] = useReducer(reducer, initialState);

// Dispatch an action
dispatch({ type: 'start' });
```

### Example Flow

```javascript
// 1. Define initial state
const initialState = { count: 0 };

// 2. Create reducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 3. Use in component
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

---

## Why Combine Them?

### The Perfect Match

**Context API** solves: "How do I share data?"
**useReducer** solves: "How do I manage complex state?"

**Together they solve:**
- ✅ Share complex state across components
- ✅ Centralize state management
- ✅ Avoid prop drilling
- ✅ Make state updates predictable

### Architecture

```
QuizContext.js
├── Context (createContext)
├── Initial State
├── Reducer Function
├── Provider Component
│   ├── useReducer hook
│   ├── Side effects (useEffect)
│   └── Provides state + dispatch
└── Custom Hook (useQuiz)
    └── useContext wrapper
```

---

## Implementation Walkthrough

### Step 1: Create Context File Structure

**File:** `src/context/QuizContext.js`

```javascript
import { createContext, useContext, useReducer, useEffect } from 'react';

// 1. Create the context
const QuizContext = createContext();
```

**Explanation:**
- Import necessary hooks
- Create empty context (will be populated by Provider)

---

### Step 2: Define Constants and Initial State

```javascript
const SECONDS_PER_QUESTION = 30;

const initialState = {
  questions: [],           // Array of quiz questions
  status: 'loading',       // 'loading' | 'error' | 'ready' | 'active' | 'finished'
  index: 0,                // Current question index
  answer: null,            // Selected answer index
  points: 0,              // Current score
  highscore: 0,           // Best score
  secondsRemaining: null, // Timer countdown
};
```

**Explanation:**
- `SECONDS_PER_QUESTION`: Configuration constant
- `initialState`: All state values in one object
- Each property represents a piece of application state

---

### Step 3: Create Reducer Function

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    
    case 'start':
      return {
        ...state,
        status: 'active',
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
    
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption
          ? state.points + question.points
          : state.points,
      };
    
    // ... more cases
    
    default:
      throw new Error('Action unknown');
  }
}
```

**Explanation:**
- Pure function: same input = same output
- Never mutates state (uses spread operator)
- Each case handles one action type
- Returns new state object

**Action Types Explained:**

| Action | Purpose | Payload |
|--------|---------|---------|
| `dataReceived` | Questions loaded from API | `questions` array |
| `dataFailed` | API request failed | none |
| `start` | Begin quiz | none |
| `tick` | Timer countdown | none |
| `newAnswer` | User selected answer | answer index |
| `nextQuestion` | Move to next question | none |
| `restart` | Reset quiz | none |

---

### Step 4: Create Provider Component

```javascript
function QuizProvider({ children }) {
  // 1. Use reducer to manage state
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // 2. Destructure state for easier access
  const { 
    questions, 
    status, 
    index, 
    answer, 
    points, 
    highscore, 
    secondsRemaining 
  } = state;
  
  // 3. Calculate derived values
  const numQuestions = questions.length;
  const totalPoints = questions.reduce(
    (acc, question) => acc + question.points, 
    0
  );
  
  // 4. Side effect: Fetch questions
  useEffect(function fetchQuestions() {
    // Create async function inside useEffect
    async function getQuestions() {
      try {
        const res = await fetch('http://localhost:9000/questions');
        const data = await res.json();
        dispatch({ type: 'dataReceived', payload: data });
      } catch (err) {
        dispatch({ type: 'dataFailed' });
      }
    }
    
    // Call the async function
    getQuestions();
  }, []);
  
  // 5. Side effect: Timer
  useEffect(function () {
    if (status !== 'active' || secondsRemaining === null) return;
    
    const interval = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [status, secondsRemaining]);
  
  // 6. Provide context value
  return (
    <QuizContext.Provider value={{
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      numQuestions,
      totalPoints,
      dispatch
    }}>
      {children}
    </QuizContext.Provider>
  );
}
```

**Explanation:**
- `useReducer` manages all state
- Derived values calculated from state
- Side effects in `useEffect` hooks
- Provider makes everything available to children

---

### Step 5: Create Custom Hook

```javascript
function useQuiz() {
  const context = useContext(QuizContext);
  
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  
  return context;
}
```

**Explanation:**
- Wrapper around `useContext`
- Provides helpful error message
- Makes API cleaner for consumers

---

### Step 6: Update App.js

**Before:**
```javascript
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // ... lots of state management code
  
  return (
    <div>
      <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
      {/* ... more prop drilling */}
    </div>
  );
}
```

**After:**
```javascript
import { QuizProvider, useQuiz } from './context/QuizContext';

function AppContent() {
  const { status } = useQuiz();
  
  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'ready' && <StartScreen />}
        {/* No props needed! */}
      </Main>
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}
```

**Explanation:**
- App wraps everything in `QuizProvider`
- `AppContent` uses context
- No prop passing needed

---

### Step 7: Update Components

**Before (StartScreen.js):**
```javascript
export default function StartScreen({ numQuestions, dispatch }) {
  return (
    <button onClick={() => dispatch({ type: 'start' })}>
      Start {numQuestions} questions
    </button>
  );
}
```

**After:**
```javascript
import { useQuiz } from '../context/QuizContext';

export default function StartScreen() {
  const { numQuestions, dispatch } = useQuiz();
  
  return (
    <button onClick={() => dispatch({ type: 'start' })}>
      Start {numQuestions} questions
    </button>
  );
}
```

**Key Changes:**
1. Import `useQuiz` hook
2. Remove props from function parameters
3. Get data from `useQuiz()` instead
4. Rest of component stays the same

---

## Key Concepts Explained

### 1. Context Value Object

The value provided to context should be stable. In our case:

```javascript
<QuizContext.Provider value={{
  questions,        // From state
  status,           // From state
  dispatch,         // From useReducer
  numQuestions,     // Calculated
  totalPoints,      // Calculated
  // ... etc
}}>
```

**Why this works:**
- Object is recreated on each render (but that's okay)
- Individual values change, triggering re-renders
- React optimizes this automatically

### 2. Reducer Pattern

**Action → Reducer → New State**

```
User clicks answer
  ↓
dispatch({ type: 'newAnswer', payload: 1 })
  ↓
Reducer processes action
  ↓
Returns new state
  ↓
Component re-renders with new state
```

### 3. Side Effects in Provider

Side effects (API calls, timers) belong in the Provider:

```javascript
useEffect(() => {
  // Create async function inside useEffect
  async function fetchQuestions() {
    try {
      const res = await fetch('/questions');
      const data = await res.json();
      dispatch({ type: 'dataReceived', payload: data });
    } catch (err) {
      dispatch({ type: 'dataFailed' });
    }
  }
  
  // Call the async function
  fetchQuestions();
}, []); // Run once on mount
```

**Why in Provider:**
- Centralized logic
- Access to dispatch
- Runs when component mounts

### 4. Custom Hook Pattern

```javascript
function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
```

**Benefits:**
- Better error messages
- Cleaner API
- Can add validation/logic later

---

## Best Practices

### ✅ Do's

1. **Keep reducers pure**
   ```javascript
   // ✅ Good
   return { ...state, points: state.points + 10 };
   
   // ❌ Bad
   state.points += 10;
   return state;
   ```

2. **Use descriptive action types**
   ```javascript
   // ✅ Good
   dispatch({ type: 'newAnswer', payload: 1 });
   
   // ❌ Bad
   dispatch({ type: 'answer', payload: 1 });
   ```

3. **Calculate derived values in Provider**
   ```javascript
   // ✅ Good - calculated once
   const totalPoints = questions.reduce(...);
   
   // ❌ Bad - calculated in every component
   const totalPoints = questions.reduce(...); // In each component
   ```

4. **Handle all action types**
   ```javascript
   // ✅ Good
   default:
     throw new Error('Action unknown');
   ```

5. **Use custom hook for context**
   ```javascript
   // ✅ Good
   const { status } = useQuiz();
   
   // ❌ Bad
   const { status } = useContext(QuizContext);
   ```

### ❌ Don'ts

1. **Don't mutate state in reducer**
   ```javascript
   // ❌ Bad
   state.points += 10;
   return state;
   ```

2. **Don't put side effects in reducer**
   ```javascript
   // ❌ Bad
   function reducer(state, action) {
     fetch('/api'); // Side effect!
     return state;
   }
   ```

3. **Don't create context value inline if it changes**
   ```javascript
   // ⚠️ Can cause unnecessary re-renders
   <Provider value={{ count, setCount }}>
   ```

4. **Don't use context for all state**
   ```javascript
   // ❌ Bad - local state doesn't need context
   const [isOpen, setIsOpen] = useState(false);
   ```

---

## Common Patterns

### Pattern 1: Action Creators

```javascript
// Create helper functions
function startQuiz() {
  return { type: 'start' };
}

function selectAnswer(index) {
  return { type: 'newAnswer', payload: index };
}

// Use in components
dispatch(startQuiz());
dispatch(selectAnswer(1));
```

### Pattern 2: Async Actions

```javascript
// In Provider
useEffect(() => {
  async function fetchQuestions() {
    try {
      const res = await fetch('/questions');
      const data = await res.json();
      dispatch({ type: 'dataReceived', payload: data });
    } catch (err) {
      dispatch({ type: 'dataFailed' });
    }
  }
  fetchQuestions();
}, []);
```

### Pattern 3: Multiple Reducers

```javascript
// For very large apps, split reducers
function quizReducer(state, action) { /* ... */ }
function userReducer(state, action) { /* ... */ }

// Combine in Provider
const [quizState, quizDispatch] = useReducer(quizReducer, quizInitialState);
const [userState, userDispatch] = useReducer(userReducer, userInitialState);
```

---

## Testing Your Understanding

### Quiz Questions

1. **What is the purpose of `createContext()`?**
   - Creates a context object for sharing data

2. **Why use `useReducer` instead of `useState`?**
   - Better for complex state with multiple related values

3. **What makes a reducer function "pure"?**
   - No side effects, same input = same output

4. **Where should side effects (API calls) go?**
   - In `useEffect` hooks, typically in the Provider

5. **Why create a custom `useQuiz` hook?**
   - Better error messages and cleaner API

### Practice Exercises

1. **Add a new action type:**
   - Create `pause` action that stops the timer
   - Update reducer to handle it
   - Add button to pause quiz

2. **Add new state:**
   - Track number of incorrect answers
   - Display in FinishScreen

3. **Optimize context value:**
   - Use `useMemo` to memoize context value
   - Prevent unnecessary re-renders

---

## Summary

### What You Learned

✅ **Context API**: Share data without prop drilling
✅ **useReducer**: Manage complex state with actions
✅ **Combining them**: Centralized state management
✅ **Best practices**: How to structure code properly

### Key Takeaways

1. Context API solves prop drilling
2. useReducer handles complex state
3. Together they create scalable architecture
4. Provider manages state, components consume it
5. Custom hooks make API cleaner

### Next Steps

- Practice with your own projects
- Explore Redux (similar pattern, more features)
- Learn about context optimization
- Study other state management solutions

---

## Resources

- [React Context API Docs](https://react.dev/reference/react/useContext)
- [React useReducer Docs](https://react.dev/reference/react/useReducer)
- [React Patterns](https://reactpatterns.com/)

---

**Happy Learning! 🚀**
