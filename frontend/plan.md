# AI-Community Insights - Development Plan

## 1. Project Context for LLM
You are an expert Full-Stack AI Developer. We are building "AI-Community Insights", a data-driven dashboard for social media managers. The goal is to analyze past interaction data (CSV uploads) using Machine Learning to predict the best times to post and which content types perform best.

## 2. Tech Stack
- **Frontend:** React.js (Vite), TailwindCSS, Recharts (for data visualization)
- **Backend:** Python (FastAPI) or Node.js (Express)
- **Data/AI:** Pandas, Scikit-learn (for simple regression/prediction models)

## 3. Development Phases

### Phase 1: Initial Setup & Architecture (CURRENT)
- [x] Initialize separate `frontend` and `backend` directories.
- [ ] Set up basic routing in Frontend.
- [ ] Set up basic API server and CORS configuration in Backend.

### Phase 2: Data Management & Backend API
- [ ] Create an API endpoint (`/upload`) to accept CSV/Excel files.
- [ ] Write a parser to clean and structure the incoming social media data (timestamps, likes, post types).
- [ ] Create an endpoint (`/analyze`) that triggers the ML model and returns processed insights.

### Phase 3: AI & Machine Learning Logic
- [ ] Develop a simple predictive model to find "Golden Hours" (times with highest engagement).
- [ ] Calculate success rates grouped by content type (e.g., Video vs. Photo).
- [ ] Format the output as a JSON response ready for the frontend dashboard.

### Phase 4: Frontend UI & Integration
- [ ] Build a drag-and-drop file upload component.
- [ ] Fetch data from the `/analyze` endpoint.
- [ ] Implement a Dashboard using Recharts (Bar charts for content types, Line charts for engagement times).

### Phase 5: Polish & Error Handling
- [ ] Add loading states and error boundaries in React.
- [ ] Validate file types and sizes on the backend.