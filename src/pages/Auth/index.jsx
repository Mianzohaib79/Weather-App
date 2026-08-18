import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const Auth = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      {/* <Route path="*" element={<Navigate to="login" replace />} /> */}
    </Routes>
  );
};

export default Auth;
// export { Login, Register };
