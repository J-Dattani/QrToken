import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], 
  resId: null,
  tableId: null,
  coupon: null,
  instructions: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
    reducers: {
        setRestaurantContext(state, action){
            state.resId = action.payload.resId;
            state.tableId = action.payload.tableId;
        },
        addItem(state, action){
         const existingItem = state.items.find((item) => item._id === action.payload._id);

            if(existingItem){
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        increaseItemQuantity(state, action){
            const existingItem = state.items.find(
                (item) => item._id === action.payload
            )
            if(existingItem){
                existingItem.quantity += 1;
            }

        },
      decreaseItemQuantity(state, action) {
    console.log("Payload:", action.payload);

    const existingItem = state.items.find(
        (item) => item._id === action.payload
    );

    console.log("Existing Item:", existingItem);

    if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
    } else {
        state.items = state.items.filter(
            (item) => item._id !== action.payload
        );
    }

    console.log("Cart:", state.items);
},
        removeItem(state, action){
            state.items = state.items.filter((item) => item._id !== action.payload);
        },
        clearCart(state){
            state.items = [];
            state.coupon = null;
            state.instructions = "";

        }
    },
});

export const { setRestaurantContext, addItem, increaseItemQuantity, decreaseItemQuantity, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;