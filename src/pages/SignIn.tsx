import React from "react";
import { Form, Input, Button, Card } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values: any) => {
    const normalizedEmail = values.email.toLowerCase();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (user: any) =>
        user.email === normalizedEmail && user.password === values.password
    );
    if (foundUser) {
      dispatch(login({ email: foundUser.email }));
      toast.success("Sign In successful!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <Card
        title={
          <div className="text-center text-teal-400 text-2xl font-bold">
            Sign In
          </div>
        }
        bordered={false}
        className="w-full max-w-sm rounded-lg shadow-2xl p-6"
      >
        <Form
          name="signin"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
                type: "email",
              },
            ]}
            className="mb-6"
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
            className="mb-8"
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 bg-teal-500 hover:bg-teal-600 border-none"
            >
              Sign In
            </Button>
          </Form.Item>
          <div className="text-center mt-4">
            <span className="text-gray-400">Don't have an account? </span>
            <Link
              to="/register"
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              Register now
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
