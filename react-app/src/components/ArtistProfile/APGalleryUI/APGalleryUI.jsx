import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setArtworks } from '../../../Redux/artworkActions';
import { Card, CardHeader, CardBody, Box, SimpleGrid } from '@chakra-ui/react';
import { storage } from '../../../index';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';

const VisitorGalleryUi = ({ userId, artworks, setArtworks }) => {

    useEffect(() => {
        const fetchArtworks = async () => {
            const storageRef = ref(storage, `user-galleries/${userId}`);
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
    }, [setArtworks, userId]);

    return (
        <SimpleGrid spacing={2} templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(5, 1fr)", lg: "repeat(7, 1fr)" }}>
            {artworks.map(artwork => (
                <Card 
                    key={artwork.id}
                    style={{ backgroundImage: `url(${artwork.url})` }}
                    bgSize="cover"
                    bgRepeat="no-repeat"
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="calc((100vw - (7 * 2px) - (7 * 2rem)) / 7)"  // Ensures the height is the same as the width in large screens
                    width="100%"  // Use 100% so that it fills the width of the grid
                >
                    <CardHeader pt={2} px={2} fontSize="xs" color="white">
                        <Box bgColor="rgba(0, 0, 0, 0.5)" p={1} borderRadius="lg">{artwork.title}</Box>
                    </CardHeader>
                    <CardBody pb={2} px={2} mt="auto" fontSize="xs" color="white">
                        <Box bgColor="rgba(0, 0, 0, 0.5)" p={1} borderRadius="lg">{artwork.description}</Box>
                    </CardBody>
                </Card>
            ))}
        </SimpleGrid>
    );
};

const mapStateToProps = state => {
    return {
        artworks: state.artworks.artworks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setArtworks: artworks => dispatch(setArtworks(artworks))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VisitorGalleryUi);
