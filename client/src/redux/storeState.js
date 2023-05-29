const initalState = {
    user: null,
    cart: []
}
  
const reducer = (state = initalState, action) => {
    let newCart;
    switch(action.type) {
        case "ADD_TO_CART":
            newCart = state.cart
            newCart.push(action.id)
            return {
                ...state,
                cart: newCart
            }
        case "REMOVE_FROM_CART":
            newCart = state.cart
            return {
                ...state,
                cart: newCart
            }
        case "SIGN_IN":
            return {
                ...state,
                user: action.user
            }
        case "LOG_OUT":
            return {
                ...state,
                user: null
            }
        case "RELOAD":
            return {
                user: action.user,
                cart: action.cart
            }
        default:
            return state
    }
}

export { reducer }