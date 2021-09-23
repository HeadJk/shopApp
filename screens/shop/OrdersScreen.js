import React, { useEffect, useState, useCallback } from 'react';
import { 
  FlatList, 
  Text, 
  Platform, 
  View, 
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as orderActions from '../../store/actions/orders'
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  const loadOrders = useCallback( async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await dispatch(orderActions.fetchOrders())
    } catch (err) {
      setError(err)
    }
    setIsRefreshing(false);
  }, [dispatch, setError, setIsRefreshing])

  useEffect(() => {
    setIsLoading(true);
    loadOrders().then(() => {
      setIsLoading(false);
    })
  }, [dispatch, loadOrders, setIsLoading]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button 
          title="Try again" 
          onPress={loadOrders}
          color={Colors.primary}
        />
      </View>
    )
  }

  if(isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if(!isLoading && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No orders found. Any orders placed will be logged here!</Text>
      </View>
    )
  }



  return (
    <FlatList
      onRefresh={loadOrders}
      refreshing={isRefreshing}
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default OrdersScreen;
