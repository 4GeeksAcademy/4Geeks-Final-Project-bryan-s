export const addArtwork = (artwork) => {
    return {
        type: 'ADD_ARTWORK',
        payload: artwork
    }
}


export const setArtworks = (artworks) => ({
    type: 'SET_ARTWORKS',
    payload: artworks
});


export const deleteArtwork = (artworkId) => {
    return {
        type: 'DELETE_ARTWORK',
        payload: artworkId
    }
}

/**
 * Redux action creators for managing artworks.
 * 
 * Provides functions to create actions related to artworks,
 * such as adding, setting, and deleting them.
 */