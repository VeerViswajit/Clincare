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
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowRePassword, setIsShowRePassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const toggleShowPassword = () => setIsShowPassword(!isShowPassword);
  const toggleShowRePassword = () => setIsShowRePassword(!isShowRePassword);

  // Regex for validating email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate inputs on form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError('');
    }

    // Validate password match
    if (password !== rePassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError('');
    }
    if(name==""){
        setNameError("Enter a valid Username")
    }
    else{
        setNameError('')
    }
  };

  return (
    <div>
      {/* <NavBar /> */}
      <div className='flex justify-center items-center h-screen'>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>Enter your credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)}/>
                  {nameError && <p className='text-red-500 text-sm'>{nameError}</p>}
                </div>

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
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="repassword">Re-enter Password</Label>
                  <div className="relative">
                    <Input 
                      id="repassword" 
                      placeholder="Re-enter Password" 
                      type={isShowRePassword ? "text" : "password"} 
                      value={rePassword}
                      onChange={(e) => setRePassword(e.target.value)}
                    />
                    <div 
                      className='absolute right-3 top-2 cursor-pointer'
                      onClick={toggleShowRePassword}
                    >
                      {isShowRePassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                    </div>
                  </div>
                  {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                </div>
              </div>
              <CardFooter className="flex justify-between mt-4">
                <div className='flex flex-col items-center gap-2'>
                  <Label htmlFor="login">Already a Member?</Label>
                  <Link to="/"><Button variant="outline">Login</Button></Link>
                </div>
                <Button type="submit" className='mt-5'>Signup</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
