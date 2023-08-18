import React, { useEffect, useRef, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { addArtwork, deleteArtwork, setArtworks } from '../../../Redux/artworkActions';
import {
    Card,
    CardHeader,
    CardBody,
    Box,
    Heading,
    Text,
    SimpleGrid,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    Image,
    useDisclosure
} from '@chakra-ui/react';
import { storage } from '../../../index';
import { Context } from '../../../Context';
import { ref, listAll, getDownloadURL, getMetadata, uploadBytes, deleteObject } from 'firebase/storage';

const GalleryUi = ({ artworks, addArtwork, deleteArtwork, setArtworks }) => {
    const { user } = useContext(Context);
    const fileInputRef = useRef(null);
    const { onOpen, onClose } = useDisclosure();

    const [selectedArtwork, setSelectedArtwork] = useState(null);

    useEffect(() => {
        const fetchArtworks = async () => {
            const storageRef = ref(storage, `user-galleries/${user.uid}`);
            const artworksRes = await listAll(storageRef);
            
            const fetchedArtworks = await Promise.all(artworksRes.items.map(async item => {
                const url = await getDownloadURL(item);
                const metadata = await getMetadata(item);
                return {
                    id: metadata.customMetadata.id,
                    url: url,
                    title: metadata.name,
                    description: metadata.customMetadata.description || ''
                };
            }));

            setArtworks(fetchedArtworks);
        };

        fetchArtworks();
    }, [setArtworks, user.uid]);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const artwork = {
            id: new Date().getTime().toString(),
            title: file.name,
            description: ''
        };
        
        const fileRef = ref(storage, `user-galleries/${user.uid}/${artwork.id}_${file.name}`);
        
        await uploadBytes(fileRef, file, {
            customMetadata: {
                id: artwork.id,
                description: artwork.description
            }
        });
        
        const fileUrl = await getDownloadURL(fileRef);
        
        addArtwork({
            ...artwork,
            url: fileUrl
        });
    };

    const handleDelete = async (artworkId, fileName) => {
        const fileRef = ref(storage, `user-galleries/${user.uid}/${fileName}`);
        await deleteObject(fileRef);
        deleteArtwork(artworkId);
    };

    const handleArtworkClick = (url) => {
        setSelectedArtwork(url);
        onOpen();
    }

    return (
        <div>
            <Modal isOpen={selectedArtwork !== null} onClose={() => {setSelectedArtwork(null); onClose();}} size="xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <Image src={selectedArtwork} alt="Selected Artwork" fit="cover" maxW="100%" maxH="100vh" />
                </ModalContent>
            </Modal>

            <Button onClick={() => fileInputRef.current.click()} colorScheme="teal" mb={4}>Upload Artwork</Button>
            <input type="file" ref={fileInputRef} onChange={handleUpload} style={{ display: 'none' }} />
    
            <SimpleGrid spacing={2} templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(5, 1fr)", lg: "repeat(7, 1fr)" }}>
                {artworks.map(artwork => (
                    <Card 
                        key={artwork.id}
                        onClick={() => handleArtworkClick(artwork.url)}
                        style={{ backgroundImage: `url(${artwork.url})` }}
                        bgSize="cover"
                        bgRepeat="no-repeat"
                        position="relative"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        height="calc((100vw - (7 * 2px) - (7 * 2rem)) / 7)"
                        width="100%"
                        _hover={{ ".card-content": { opacity: 1, transform: "scale(1)" } }}
                    >
                        <Box position="absolute" top="2" right="2" zIndex="1">
                            <Button size="sm" colorScheme="red" onClick={(e) => { e.stopPropagation(); handleDelete(artwork.id, artwork.title); }}>X</Button>
                        </Box>
                        <CardHeader>
                            <Heading color="white" size='md'>{artwork.title}</Heading>
                        </CardHeader>
                    
                        <Box flex="1" />
                    
                        <CardBody
                            className="card-content"
                            position="absolute"
                            bottom="0"
                            left="0"
                            right="0"
                            p={4}
                            opacity={0}
                            transform="scale(0.95)"
                            transition="all 0.3s"
                            bg="rgba(0,0,0,0.6)"
                        >
                            <Text color="white">{artwork.description}</Text>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );    
};

const mapStateToProps = (state) => ({
    artworks: state.artworks
});

const mapDispatchToProps = {
    addArtwork,
    deleteArtwork,
    setArtworks
};

export default connect(mapStateToProps, mapDispatchToProps)(GalleryUi);











