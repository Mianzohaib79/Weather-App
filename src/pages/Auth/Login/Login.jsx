import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../../../context/AuthContext';

const { Title, Text } = Typography;

const initialState = { email: "", password: "" };

const Login = () => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { readProfile } = useAuth();

  const handleChange = (e) => {
    setState(s => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleLogin = () => {
    const { email, password } = state;

    if (!email || !password) return window.toastify("All fields are required", "error");
    if (!window.isValidEmail(email)) return window.toastify("Invalid email address", "error");

    const formData = { email, password };
    setIsLoading(true);

    // Direct central API instance hit hoga (/auth/login endpoint par)
    api.post('/auth/login', formData)
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          window.toastify(data.message || "Login successful", "success");

          // Token key sync kar di
          localStorage.setItem("token", data.token);
          if (readProfile) readProfile(data.token);

          setState(initialState);
          navigate("/");
        } else {
          window.toastify(data.message || "Something went wrong", "error");
        }
      })
      .catch((err) => {
        console.error(err);
        window.toastify(err?.response?.data?.message || "Something went wrong", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      {/* Centered Form Card */}
      <div className="w-full max-w-[480px] bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-6 sm:p-8 md:p-10 relative z-10 border border-slate-700/50">

        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 mx-auto">
            <span className="text-white font-bold text-xl">☁️</span>
          </div>
          <Title level={2} className="!text-white !font-bold !mb-1 text-2xl">Welcome Back</Title>
          <Text className="text-slate-400! text-sm">Please enter your credentials to access your account.</Text>
        </div>

        <Form name="login" layout="vertical" className="space-y-2">
          <Form.Item
            name="email"
            label={<span className="font-semibold text-slate-300 text-sm">Email Address</span>}
          >
            <Input
              prefix={<UserOutlined className="text-slate-500 mr-2" />}
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
              className="h-12 rounded-xl bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 hover:border-blue-500 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="font-semibold text-slate-300 text-sm">Password</span>}
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-500 mr-2" />}
              placeholder="••••••••"
              name="password"
              onChange={handleChange}
              className="h-12 rounded-xl bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 hover:border-blue-500 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item className="pt-2">
            <Button
              type="primary"
              loading={isLoading}
              onClick={handleLogin}
              className="w-full h-12! rounded-xl bg-blue-600 hover:bg-blue-500 border-none font-bold text-base shadow-lg shadow-blue-600/30"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm mt-4">
          <Text className="text-slate-400!">Don't have an account? </Text>
          <Link to="/auth/register" className="text-blue-400 font-semibold hover:text-blue-300 ml-1">
            Register now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;