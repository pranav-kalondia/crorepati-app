// ============================================================
// App — Root component with routing
// ============================================================

import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from './screens/Landing/LandingPage';
import { DashboardPage } from './screens/Dashboard/DashboardPage';
import { PortfolioPage } from './screens/Portfolio/PortfolioPage';
import { TimelinePage } from './screens/Timeline/TimelinePage';
import { LearnPage } from './screens/Learn/LearnPage';
import { VictoryPage } from './screens/Victory/VictoryPage';
import { GameOverPage } from './screens/GameOver/GameOverPage';
import { GameLayout } from './components/layout/GameLayout';

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GameLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="learn" element={<LearnPage />} />
        </Route>
        <Route path="/victory" element={<VictoryPage />} />
        <Route path="/gameover" element={<GameOverPage />} />
      </Routes>
    </AnimatePresence>
  );
}
