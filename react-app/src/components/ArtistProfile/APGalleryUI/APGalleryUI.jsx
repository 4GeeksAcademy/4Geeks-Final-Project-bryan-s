import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setArtworks } from '../../../Redux/artworkActions';
import { Card, SimpleGrid, CardHeader, Heading, Modal, ModalOverlay, ModalContent, Image, useDisclosure } from '@chakra-ui/react';
import { storage } from '../../../index';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';

const APGalleryUI = ({ artworks, setArtworks, userProfile }) => {

    const { onOpen, onClose } = useDisclosure();
    const [selectedArtwork, setSelectedArtwork] = useState(null);

    useEffect(() => {
        const fetchArtworks = async () => {
            const storageRef = ref(storage, `user-galleries/${userProfile.uid}`);
            const artworksRes = await listAll(storageRef);

            const fetchedArtworks = await Promise.all(artworksRes.items.map(async item => {
                const url = await getDownloadURL(item);
                const metadata = await getMetadata(item);
                
                if (!metadata.customMetadata || !metadata.customMetadata.id) {
                    console.warn(`Missing ID in metadata for artwork: ${metadata.name}`);
                    return null;
                }

                return {
                    id: metadata.customMetadata.id,
                    url: url,
                    title: metadata.name,
                    description: ''
                };
            }));

            setArtworks(fetchedArtworks.filter(artwork => artwork !== null))
        };

        fetchArtworks();
    }, [setArtworks, userProfile.uid]);

    const handleArtworkClick = (url) => {
        setSelectedArtwork(url);
        onOpen();
    };

    return (
        <>
            <Modal isOpen={selectedArtwork !== null} onClose={() => { setSelectedArtwork(null); onClose(); }} size="xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <Image src={selectedArtwork} alt="Selected Artwork" fit="cover" maxW="100%" maxH="100vh" />
                </ModalContent>
            </Modal>

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
                    >

                        <CardHeader
                            style={{ visibility: "hidden" }}
                        >
                            <Heading color="white" size='md'>{artwork.title}</Heading>
                        </CardHeader>

                    </Card>
                ))}
            </SimpleGrid>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        artworks: state.artworks
    };
}

const mapDispatchToProps = {
    setArtworks
};

export default connect(mapStateToProps, mapDispatchToProps)(APGalleryUI);





