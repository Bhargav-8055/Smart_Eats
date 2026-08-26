import { createSlice, current } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    totalAmount: localStorage.getItem("totalAmount") ? JSON.parse(localStorage.getItem("totalAmount")) : 0,
    coupon: localStorage.getItem("coupon") ? JSON.parse(localStorage.getItem("coupon")) : null,
    discount: localStorage.getItem("discount") ? JSON.parse(localStorage.getItem("discount")) : 0,
    myOrders: [],
    searchItems: null,
    socket: null,
    ratingModal: { show: false, orderId: null, shopOrderId: null }
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload
    },
    setShopsInMyCity: (state, action) => {
      state.shopInMyCity = action.payload
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload
    },
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    addToCart: (state, action) => {
      const cartItem = action.payload
      const existingItem = state.cartItems.find(i => i.id == cartItem.id)
      if (existingItem) {
        existingItem.quantity += cartItem.quantity
      } else {
        state.cartItems.push(cartItem)
      }

      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount))
    },

    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount))
    }

    ,

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.cartItems.find(i => i.id == id)
      if (item) {
        item.quantity = quantity
      }
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount))
    },

    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload)
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount))
    },

    clearCart: (state) => {
      state.cartItems = []
      state.totalAmount = 0
      state.coupon = null
      state.discount = 0
      
      localStorage.removeItem("cartItems")
      localStorage.removeItem("totalAmount")
      localStorage.removeItem("coupon")
      localStorage.removeItem("discount")
    },

    setMyOrders: (state, action) => {
      state.myOrders = action.payload
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders]
    }

    ,
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload
      const order = state.myOrders.find(o => o._id == orderId)
      if (order) {
        if (order.shopOrders && order.shopOrders.shop._id == shopId) {
          order.shopOrders.status = status
        }
      }
    },

    updateRealtimeOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload
      console.log("Redux updateRealtimeOrderStatus:", { orderId, shopId, status });
      const order = state.myOrders.find(o => o._id == orderId)
      if (order) {
        if (Array.isArray(order.shopOrders)) {
            const shopOrder = order.shopOrders.find(so => {
                const currentShopId = so.shop?._id || so.shop
                console.log("Checking shop:", { currentShopId, targetShopId: shopId });
                return String(currentShopId) == String(shopId)
            })
            if (shopOrder) {
              console.log("Updating status to:", status);
              shopOrder.status = status
            } else {
                console.log("Shop order not found for shopId:", shopId);
            }
        } else if (order.shopOrders) {
            // For owners, shopOrders is a single object
            const currentShopId = order.shopOrders.shop?._id || order.shopOrders.shop
            if (String(currentShopId) == String(shopId)) {
                order.shopOrders.status = status
            }
        }
      } else {
          console.log("Order not found:", orderId);
      }
    },

    setSearchItems: (state, action) => {
      state.searchItems = action.payload
    },

    setCoupon: (state, action) => {
      if (action.payload) {
        state.coupon = action.payload
        state.discount = action.payload.discount
        localStorage.setItem("coupon", JSON.stringify(state.coupon))
        localStorage.setItem("discount", JSON.stringify(state.discount))
      } else {
        state.coupon = null
        state.discount = 0
        localStorage.removeItem("coupon")
        localStorage.removeItem("discount")
      }
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) - state.discount
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount))
    },

    showRatingModal: (state, action) => {
      state.ratingModal = { show: true, ...action.payload }
    },

    hideRatingModal: (state) => {
      state.ratingModal = { show: false, orderId: null, shopOrderId: null }
    },

    updateDeliveryBoyAssignment: (state, action) => {
      const { orderId, shopOrderId, deliveryBoy } = action.payload
      const order = state.myOrders.find(o => o._id == orderId)
      if (order) {
        // Handle both array of shopOrders and single shopOrder object (if structure varies)
        if (Array.isArray(order.shopOrders)) {
            const shopOrder = order.shopOrders.find(so => String(so._id) == String(shopOrderId))
            if (shopOrder) {
                shopOrder.assignedDeliveryBoy = deliveryBoy
            }
        } else if (order.shopOrders && String(order.shopOrders._id) == String(shopOrderId)) {
             order.shopOrders.assignedDeliveryBoy = deliveryBoy
        }
      }
    }
  }
})

export const { setUserData, setCurrentAddress, setCurrentCity, setCurrentState, setShopsInMyCity, setItemsInMyCity, addToCart, updateQuantity, removeCartItem, clearCart, setMyOrders, addMyOrder, updateOrderStatus, setSearchItems, setTotalAmount, setSocket ,updateRealtimeOrderStatus, setCoupon, showRatingModal, hideRatingModal, updateDeliveryBoyAssignment} = userSlice.actions
export default userSlice.reducer
