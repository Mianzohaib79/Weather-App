import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import SavedLocations from './SavedLocations';

const Dashboard = () => {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="saved-locations" element={<SavedLocations />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default Dashboard;
// export { Home, SavedLocations };
