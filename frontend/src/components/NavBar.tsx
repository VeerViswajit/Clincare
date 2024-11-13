import React from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
 
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'

type Checked = DropdownMenuCheckboxItemProps["checked"]

const NavBar = () => {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow relative'>
        <h2 className='text-xl font-medium text-black py-2'>ClinCare</h2>
        <div className='absolute right-3'>
        
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          
        >
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          
        >
          Activity Bar
        </DropdownMenuItem>
        <Link to="/"><DropdownMenuItem
        >
          Logout
        </DropdownMenuItem></Link>
      </DropdownMenuContent>
    </DropdownMenu>
        </div>
    </div>
  )
}

export default NavBar