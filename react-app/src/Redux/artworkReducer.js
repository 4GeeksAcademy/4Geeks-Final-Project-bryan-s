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


/**
 * This is a Redux reducer that handles artwork information.
 * It helps with adding, replacing, or deleting artworks as needed.
 * The reducer uses an initial state and responds to specific actions
 * to keep the list of artworks organized.
 * 
 * Supported Actions:
 * - 'ADD_ARTWORK': To add a new artwork to the list.
 * - 'SET_ARTWORKS': To replace the entire artworks list.
 * - 'DELETE_ARTWORK': To remove an artwork using its ID.
 * 
 * Keeping actions clear helps in making the app predictable.
 */