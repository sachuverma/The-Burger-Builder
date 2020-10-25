import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-order';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 1.4,
  meat: 3.5,
  bacon: 2.2,
}


class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    axios.get('ingredients.json').then(res => {
      console.log('fetched response', res);
      this.setState({ ingredients: res.data});
    }).catch(err => {
      this.setState({ error: true});
    })
  }


  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey];
    }).reduce((sum, el) => {
      return sum + el;
    } ,0);

    this.setState({purchasable: sum>0});
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    
    this.setState({
      ingredients: updatedIngredients,
      totalPrice: newPrice
    });
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0) return;

    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    
    this.setState({
      ingredients: updatedIngredients,
      totalPrice: newPrice
    });
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    // this.setState({loading: true});
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: 'Sachu',
    //     address: {
    //       street: 'Bhootowali Gali', 
    //       locality: 'Shaitan ka Moholla',
    //       zipcode: '69'
    //     },
    //     email: 'freeuser@nomail.com'
    //   },
    //   deliveryMethod: 'fastest' 
    // };

    // axios.post('/orders.json', order)
    //   .then(res => {
    //     console.log(res);
    //     this.setState({loading: true, purchasing: false});
    //     alert('Order Completed :)');
    //     this.setState({ ingredients:{
    //       salad: 0,
    //       cheese: 0,
    //       meat: 0,
    //       bacon: 0,
    //     }});    
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     this.setState({loading: true, purchasing: false});
    //   });
    const queryParams = [];
    for(let i in this.state.ingredients){
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = queryParams.join('&');

    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString,
    });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for(let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;
    let burger = this.state.error ? <div style={{padding: "50px 20px"}}>
      <h1 style={{textAlign: "center", color: "#683712"}}>ERROR LOADING BURGER</h1>
      </div> : <div style={{padding: "50px 20px"}}>
      <h1 style={{textAlign: "center", color: "#683712"}}>LOADING BURGER</h1>
      <Spinner />
    </div>;

    if(this.state.ingredients){
      burger = <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls 
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
        />
      </Aux>;
      
      orderSummary = <OrderSummary 
        ingredients={this.state.ingredients} 
        purchaseCancel={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler}
      />;
    }

    if(this.state.loading) orderSummary = <Spinner />;

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
};

export default withErrorHandler(BurgerBuilder, axios);
