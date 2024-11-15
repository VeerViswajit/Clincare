import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui';
import { NavBar } from '@/components';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
const LoginPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [error, setError] = useState('');

  const toggleShowPassword = () => setIsShowPassword(!isShowPassword);
  
  const navigate = useNavigate();

  // Regex for validating email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate inputs on form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    } if (!password) {
      setPassError("Enter Password");
      return;
    }
    setEmailError('');
    setPassError("");

    try {
      const response = await axiosInstance.post("/login", {
          email: email,
          password: password,
      });

      // Handle successful login response
      if (response.data && response.data.accessToken) {
          // Store the token in localStorage
          localStorage.setItem("token", response.data.accessToken);
          // Navigate to the dashboard
          navigate("/home");
      }
  } catch (error: any) {
      // Enhanced error handling
      if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message); // Backend error message
      } else if (error.message) {
          setError(error.message); // Network or unexpected error message
      } else {
          setError("An unexpected error occurred. Please try again.");
      }
  }

   
  };

  return (
    <div>
      {/* <NavBar /> */}
      <div className='flex justify-center items-center h-screen'>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Mail ID</Label>
                  <Input 
                    id="email" 
                    placeholder="Email-ID" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      placeholder="Password" 
                      type={isShowPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div 
                      className='absolute right-3 top-2 cursor-pointer'
                      onClick={toggleShowPassword}
                    >
                      {isShowPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                    </div>
                  </div>
                  {passError && <p className="text-red-500 text-sm">{passError}</p>}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
              
              <CardFooter className="flex justify-between mt-4">
                <div className='flex flex-col items-center gap-2'>
                  <Label htmlFor="login">Not yet Registered?</Label>
                  <Link to="/signup"><Button variant="outline">Signup</Button></Link>
                </div>
                <Button type="submit" className='mt-5'>Login</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
};

export default LoginPage;
