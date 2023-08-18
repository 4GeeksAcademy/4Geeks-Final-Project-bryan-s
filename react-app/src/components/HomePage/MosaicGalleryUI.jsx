import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, Image, SimpleGrid } from '@chakra-ui/react';

const MosaicGalleryUI = () => {
    const [artworks, setArtworks] = useState([]);
    const [selectedArtwork, setSelectedArtwork] = useState(null);

    useEffect(() => {
        // Generate a list of filenames from r1.png to r15.png
        const generateFileNames = () => {
            return Array.from({ length: 15 }, (_, i) => `r${i + 1}.png`);
        };

        // Shuffle the list of filenames for randomness
        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        const fileNames = generateFileNames();
        shuffle(fileNames);

        // Prefix with the path and set to the state
        const filePaths = fileNames.map(name => `/images/random/${name}`);
        setArtworks(filePaths);

    }, []);

    const handleArtworkClick = (artwork) => {
        setSelectedArtwork(artwork);
    };

    return (
        <div>
            <Modal isOpen={selectedArtwork !== null} onClose={() => setSelectedArtwork(null)} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <Image src={selectedArtwork} alt="Artwork" />
                </ModalContent>
            </Modal>

            <SimpleGrid spacing={2} templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" }}>
                {artworks.map(artwork => (
                    <div 
                        key={artwork}
                        onClick={() => handleArtworkClick(artwork)}
                        style={{ 
                            backgroundImage: `url(${artwork})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            height: '200px',
                            cursor: 'pointer'
                        }}
                    ></div>
                ))}
            </SimpleGrid>
        </div>
    );
};

export default MosaicGalleryUI;





