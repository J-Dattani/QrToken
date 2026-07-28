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
         const existingItem = state.items.find((item) => item.id === action.payload.id);

            if(existingItem){
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        increaseItemQuantity(state, action){
            const existingItem = state.items.find(
                (item) => item.id === action.payload
            )
            if(existingItem){
                existingItem.quantity += 1;
            }

        },
        decreaseItemQuantity(state, action){
            const existingItem = state.items.find(
                (item) => item.id === action.payload
            )
            if(existingItem && existingItem.quantity > 1){
                existingItem.quantity -= 1;
            }
            else{
                state.items = state.items.filter(
  (item) => item.id !== action.payload
);
            }

        },
        removeItem(state, action){
            state.items = state.items.filter((item) => item.id !== action.payload);
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