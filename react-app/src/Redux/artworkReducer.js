
const initialState = {
    artworks: []
};

const artworkReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_ARTWORK':
            return {
                ...state,
                artworks: [...state.artworks, action.payload]
            };
        case 'SET_ARTWORKS':
            return {
                ...state,
                artworks: action.payload
            };
        case 'DELETE_ARTWORK':
            return {
                ...state,
                artworks: state.artworks.filter(artwork => artwork.id !== action.payload)
            };
        default:
            return state;
    }
};

export default artworkReducer;
