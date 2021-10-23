import { useState, useRef, useEffect } from 'react'
import { useDisclosure, Center, Box, Divider, Text, Textarea, Input, FormControl, FormLabel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, ModalBody, Image } from '@chakra-ui/react'
import { Button } from "@chakra-ui/button"
import { useMoralis, useMoralisFile } from 'react-moralis'

const profile = () => {
    const { user, isAuthenticated, setUserData } = useMoralis()
    const [ username, setUsername ] = useState()
    const [ email, setEmail ] = useState()
    const [ bio, setBio ] = useState()
    const { saveFile, moralisFile } = useMoralisFile()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = useRef()
    const finalRef = useRef()


    const handleSave = () => {
        setUserData({
            username,
            email,
            bio,
        })
        onSubmitPhoto()
        onClose()
    }

    const [photoFile, setPhotoFile] = useState();
    const [photoFileName, setPhotoFileName] = useState();
    const [profilePic, setProfilePic] = useState();
  
    useEffect(() => {
      if (user) {
        setProfilePic(user.attributes?.profilePic?._url);
      }
    }, [user]);
  
    const onChangePhoto = (e) => {
      setPhotoFile(e.target.files[0]);
      setPhotoFileName(e.target.files[0].name);
    };
  
    const onSubmitPhoto = async (e) => {
      const file = photoFile;
      const name = photoFileName;
      let fileIpfs = await saveFile(name, file, { saveIPFS: true });
      user.set("profilePic", fileIpfs);
      await user.save();
      setProfilePic(user.attributes.profilePic._url);
    };



    if (!isAuthenticated) {
        return (
            <h1>Please connect wallet</h1>
        )
    } else {
        return (
            <Center>
                <Box borderWidth="1px" borderRadius="lg" w="40%">
                    <Text>Username: {user.attributes.username} </Text>
                    <Text>Email: {user.attributes.email} </Text>
                    <Text>Bio: {user.attributes.bio} </Text>
                    <Box boxSize="sm">
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={profilePic}
                            alt="Profile Pic"
                        />
                    </Box>
                    <Divider />
                
                    {/* Edit Profile */}
                    <Button onClick={onOpen}>Edit Profile</Button>
                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                    <ModalOverlay />
                        <ModalContent>
                        <ModalHeader>Edit Profile Info</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>bio</FormLabel>
                            <Textarea placeholder="Tell us about yourself" value={bio} onChange={(e) => setBio(e.currentTarget.value)} />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Profile Pic</FormLabel>
                            <Input
                                type="file"
                                placeholder="change avatar"
                                accept="image/*"
                                multiple={false}
                                id="profilePhoto"
                                onChange={onChangePhoto} 
                            />
                            {/* <Button value="Upload" onClick={onSubmitPhoto}>Upload</Button> */}
                            </FormControl>
                            { profilePic ?
                            <FormControl mt={4}>
                                <Box boxSize="sm">
                                    <Image
                                        borderRadius="full"
                                        boxSize="150px"
                                        src={profilePic}
                                        alt="Profile Pic"
                                    />
                                </Box>
                            </FormControl>
                            : <></> }

                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleSave}>
                            Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
            </Center>
        )
    }
}

export default profile
