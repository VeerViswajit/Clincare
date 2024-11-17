import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Link } from 'react-router-dom';

interface UserInfo {
  fullName: string;
}

interface NavBarProps {
  userInfo: UserInfo | null;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ userInfo, onLogout }) => {
  // Function to get initials from full name
  const getInitials = (fullName: string | undefined) => {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  const initials = getInitials(userInfo?.fullName);
  const fullName = userInfo?.fullName || '';

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow relative'>
      
      <h2 className='text-xl font-medium text-black py-2'>ClinCare</h2>
      <div className='absolute right-3'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="" alt={fullName} />
              <AvatarFallback className='bg-slate-800'>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="56">
            <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
            <DropdownMenuItem>Activity Bar</DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NavBar;
