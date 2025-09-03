import React from "react";
import { Form, Input, Button, Card } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,64}$/;

  const onFinish = (values: any) => {
    const normalizedEmail = values.email.toLowerCase();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.some(
      (user: any) => user.email === normalizedEmail
    );
    if (userExists) {
      toast.error("This email is already registered.");
      return;
    }

    users.push({ email: normalizedEmail, password: values.password });

    localStorage.setItem("users", JSON.stringify(users));

    console.log("Received values of form: ", values);
    toast.success("Registration successful! Please sign in.");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <Card
        title={
          <div className="text-center text-teal-400 text-2xl font-bold">
            Create an Account
          </div>
        }
        bordered={false}
        className="w-full max-w-sm rounded-lg shadow-2xl p-6"
      >
        <Form
          name="register"
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
            rules={[
              { required: true, message: "Please input your Password!" },
              {
                pattern: passwordRegex,
                message: "Password does not meet the criteria.",
              },
            ]}
            className="mb-4"
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <p className="text-gray-400 text-xs px-1 mb-4">
            At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special
            character.
          </p>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 bg-teal-500 hover:bg-teal-600 border-none"
            >
              Register
            </Button>
          </Form.Item>
          <div className="text-center mt-4">
            <span className="text-gray-400">Already have an account? </span>
            <Link
              to="/login"
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
