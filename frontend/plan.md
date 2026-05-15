# AI-Community Insights - Development Plan

## 1. Project Context for LLM
You are an expert Full-Stack AI Developer. We are building "AI-Community Insights", a data-driven mobile application for social media managers and content creators. The goal is to analyze past interaction data using Machine Learning to predict the best times to post and which content types perform best, delivering these insights directly on a mobile device.

## 2. Tech Stack
- **Frontend:** React Native (Expo), TypeScript, Expo Router, Context API (Global State)
- **Native Features:** Expo Haptics (Tactile feedback), Expo Notifications, React Native Share API
- **Backend:** Python (FastAPI)
- **Data/AI:** Pandas, Scikit-learn (DecisionTreeRegressor, LabelEncoder)

## 3. Development Phases

### Phase 1: Initial Setup & Architecture (COMPLETED)
- [x] Initialize separate `frontend` (Expo) and `backend` (FastAPI) directories.
- [x] Set up tab-based routing and floating UI design in Mobile App.
- [x] Set up basic API server and CORS configuration in Backend.

### Phase 2: Data Management & Backend API (COMPLETED)
- [x] Create an API endpoint (`/upload`) to accept CSV/Excel files.
- [x] Write a parser to clean and structure the incoming social media data (timestamps, likes, post types).
- [x] Create an endpoint (`/analyze`) that triggers the ML model and returns processed JSON insights.

### Phase 3: AI & Machine Learning Logic (COMPLETED)
- [x] Develop a predictive model (Decision Tree) to find "Golden Hours" (times with highest engagement).
- [x] Calculate success rates grouped by content type (e.g., Short Video vs. Photo).
- [x] Generate dynamic AI-driven content recommendations based on model scores.

### Phase 4: Mobile UI & Hardware Integration (CURRENT)
- [x] Implement Home Screen for fetching data from the `/analyze` endpoint.
- [x] Integrate Global State (Context API) to pass analysis data seamlessly between screens.
- [x] Add Native Haptic feedback and scheduled local Notifications for Golden Hours.
- [x] Build Explore/Share Screen utilizing native OS sharing capabilities (WhatsApp, Email, etc.).
- [ ] Connect the physical device to the local Python server via LAN/Hotspot for live data testing.

### Phase 5: Polish & Error Handling
- [ ] Add loading indicators and error boundaries in React Native.
- [ ] Implement robust `try-catch` blocks for failed network requests.
- [ ] Finalize UI/UX color schemes and floating tab bar designs.