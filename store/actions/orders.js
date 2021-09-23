import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDER = 'SET_ORDER';

export const fetchOrders = () => {
  return async dispatch => {
    try {
      // Any async code you want
      const response = await fetch(
        'https://rn-complete-guide-25b5d-default-rtdb.firebaseio.com/orders/u1.json'
      )
  
      if(!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();

      const loadedOrders = [];
      for(const key in resData) {
        loadedOrders.push(new Order(
          key,
          resData[key].cartItems,
          resData[key].totalAmount,
          new Date(resData[key].date)
          ))
      }
      dispatch({ type: SET_ORDER, orders: loadedOrders })

    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const addOrder = (cartItems, totalAmount) => {
  return async dispatch => {
    // Any async code you want
    const date = new Date();
    const response = await fetch(
      'https://rn-complete-guide-25b5d-default-rtdb.firebaseio.com/orders/u1.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cartItems,
        totalAmount,
        date: date.toISOString()

      })
    })

    if(!response.ok) {
      throw new Error('Something went wrong!')
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: { 
        id: resData.name, 
        items: cartItems, 
        amount: totalAmount, 
        date: date 
      }
    });
  }
};
