import Link from 'next/link'
import { Menu, MenuButton, MenuList, MenuGroup, MenuItem, MenuDivider } from '@chakra-ui/menu'
import { Box } from '@chakra-ui/layout'
import { Button } from "@chakra-ui/button"
import { useMoralis } from 'react-moralis'

const NavBar = () => {
    const { authenticate, isAuthenticated, logout } = useMoralis()

    const handleLogout = () => {
        logout()
        window.location.reload()
    }
    
    return (
        <nav className="border-b p-6">
            <div className="flex justify-between">
                <p className="text-3xl font-bold">ChainGun</p>
                <div className="relative flex mt-4">
                <Link href="/">
                    <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                    Play
                    </a>
                </Link>
                <Link href="/marketplace">
                    <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                    Collect
                    </a>
                </Link>
                <Link href="/create-item">
                    <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                    Create
                    </a>
                </Link>
                </div>
                <Box>
                    { isAuthenticated 
                        ? (
                        <Menu>
                            <MenuButton as={Button} colorScheme="pink">
                            Profile
                            </MenuButton>
                            <MenuList>
                                <Link href="/profile">
                                    <MenuItem>Profile</MenuItem>
                                </Link>
                                <Link href="/creator-dashboard">
                                    <MenuItem>My Projects</MenuItem>
                                </Link>
                                <Link href="/my-assets">
                                    <MenuItem>Arcade</MenuItem>
                                </Link>
                                <MenuItem>Dashboard</MenuItem>
                                <MenuItem>Following</MenuItem>
                                <MenuItem>Settings</MenuItem>
                            <MenuDivider />
                                <Button onClick={() => handleLogout()} colorScheme="red" ml={2}>Sign Out</Button>
                            </MenuList>
                        </Menu> 
                        ) : (
                        <Button onClick={() => authenticate()} colorScheme="blue">
                            Connect Wallet
                        </Button>
                        )
                    }
                </Box>
            </div>
        </nav>
    )
}

export default NavBar