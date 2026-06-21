import React, { createContext, useReducer } from 'react';

// Create global context for storing and sharing state across the app
export const store = createContext();

// Initial state for the store
const initialState = {
    // tikrina info ar vartotojas prisijunges ar ne
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
    cart: {
        // tikrina ar kaskas krepseli
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
    },
};


function reducer(state, action) {
    switch (action.type) {
        // tikrina ar preke jau yra krepselyje jei yra atnaujina kieki jei ne prideda nauja preke
        case 'CART_ADD_ITEM': {
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find((x) => x._id === newItem._id);
            const cartItems = existItem
                ? state.cart.cartItems.map((item) =>
                      item._id === existItem._id ? newItem : item
                  )
                : [...state.cart.cartItems, newItem];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }

        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };
        case 'USER_SIGNOUT':
            return {
                ...state,
                userInfo: null,
                cart: { cartItems: [] },
            };
        default:
            return state;
    }
}


export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return (
        <store.Provider value={value}>
            {props.children}
        </store.Provider>
    );
}
