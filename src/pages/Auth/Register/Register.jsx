import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const initialState = { fullName: "", phoneNumber: "", email: "", address: "", password: "", confirmPassword: "" };

const Register = () => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setState(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleRegister = () => {
    let { fullName, phoneNumber, email, address, password, confirmPassword } = state;

    if (!fullName || fullName.length < 3) return window.toastify("Full name must be at least 3 characters", "error");
    if (!phoneNumber) return window.toastify("Phone number is required", "error");
    if (!email || !window.isValidEmail(email)) return window.toastify("Invalid email", "error");
    if (!address) return window.toastify("Address is required", "error");
    if (!password || password.length < 6) return window.toastify("Password must be at least 6 characters", "error");
    if (password !== confirmPassword) return window.toastify("Passwords do not match", "error");

    const formData = { fullName, phoneNumber, email, address, password };

    setIsLoading(true);

    // Dynamic clean URL generator (prevents duplicate /api issues)
    const rawBaseUrl = window.API || window.api || "http://localhost:8000";
    const cleanBaseUrl = rawBaseUrl.replace(/\/api\/?$/, "");
    const endpoint = `${cleanBaseUrl}/api/auth/register`;

    axios.post(endpoint, formData)
      .then((res) => {
        const { status, data } = res;
        if (status === 201) {
          window.toastify(data.message || "User created successfully", "success");
          navigate("/auth/login");
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>

      {/* Centered Register Form Card */}
      <div className="w-full max-w-[600px] bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-6 sm:p-8 lg:p-10 relative z-10 border border-slate-700/50">

        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 mx-auto">
            <span className="text-white font-bold text-xl">🌤️</span>
          </div>
          <Title level={2} className="!text-white !font-bold !mb-1 text-2xl">Create an Account</Title>
          <Text className="text-blue-400! text-sm">Join us for live weather tracking and instant updates.</Text>
        </div>

        <Form name="register" layout="vertical" scrollToFirstError className="space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="fullName"
              label={<span className="font-semibold text-slate-300 text-sm">Full Name</span>}
              rules={[{ required: true, message: 'Required!' }]}
              className="mb-4"
            >
              <Input
                prefix={<UserOutlined className="text-slate-500 mr-2" />}
                placeholder="Enter Your Full Name"
                name="fullName"
                onChange={handleChange}
                className="h-11 rounded-xl bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label={<span className="font-semibold text-slate-300 text-sm">Phone Number</span>}
              rules={[{ required: true, message: 'Required!' }]}
              className="mb-4"
            >
              <Input
                prefix={<PhoneOutlined className="text-slate-500 mr-2" />}
                placeholder="Enter Phone Number"
                name="phoneNumber"
                onChange={handleChange}
                className="h-11 rounded-xl bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label={<span className="font-semibold text-slate-300 text-sm">Email Address</span>}
            rules={[{ required: true, message: 'Required!' }, { type: 'email', message: 'Invalid email!' }]}
            className="mb-4"
          >
            <Input
              prefix={<MailOutlined className="text-slate-500 mr-2" />}
              placeholder="Enter Email Address"
              name="email"
              onChange={handleChange}
              className="h-11 rounded-xl bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 hover:border-blue-500 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label={<span className="font-semibold text-slate-300 text-sm">Address / Location</span>}
            rules={[{ required: true, message: 'Required!' }]}
            className="mb-4"
          >
            <Input
              prefix={<HomeOutlined className="text-slate-500 mr-2" />}
              placeholder="Enter Your Address"
              name="address"
              onChange={handleChange}
              className="h-11 rounded-xl bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 hover:border-blue-500 focus:border-blue-500"
            />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="password"
              label={<span className="font-semibold text-slate-300 text-sm">Password</span>}
              rules={[{ required: true, message: 'Required!' }, { min: 6, message: 'Min 6 characters!' }]}
              className="mb-4"
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-500 mr-2" />}
                placeholder="••••••••"
                name="password"
                onChange={handleChange}
                className="h-11 rounded-xl bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="font-semibold text-slate-300 text-sm">Confirm Password</span>}
              className="mb-4"
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-500 mr-2" />}
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                className="h-11 rounded-xl bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>
          </div>

          <Form.Item className="pt-2 mb-4">
            <Button
              type="primary"
              loading={isLoading}
              onClick={handleRegister}
              className="w-full h-12! rounded-xl bg-blue-600 hover:bg-blue-500 border-none font-bold text-base shadow-lg shadow-blue-600/30"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm">
          <Text className="text-slate-400!">Already have an account? </Text>
          <Link to="/auth/login" className="text-blue-400 font-semibold hover:text-blue-300 ml-1">
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;