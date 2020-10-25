import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-order'

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Sachu',
        address: {
          street: 'Bhootowali Gali', 
          locality: 'Shaitan ka Moholla',
          zipcode: '69'
        },
        email: 'freeuser@nomail.com'
      },
      deliveryMethod: 'fastest' 
    };

    axios.post('/orders.json', order)
      .then(res => {
        console.log(res);
        this.setState({loading: false});
        alert('Order Completed :)');
        this.props.history.replace('/');
      })
      .catch(err => {
        console.log(err);
        this.setState({loading: false});
        alert('Error placing order try again :(');
      });
  }

  render() {
    let form = (
      <form>
        <input className={classes.Input} type="text" name="name" placeholder="your name" />
        <input className={classes.Input} type="email" name="email" placeholder="your email" />
        <input className={classes.Input} type="text" name="street" placeholder="your street" />
        <input className={classes.Input} type="text" name="postal code" placeholder="your postal code" />
        <Button clicked={this.orderHandler} btnType="Success">ORDER</Button>
      </form>
    );
    if(this.state.loading) form = <Spinner />;

    return(
      <div className={classes.ContactData}>
        <h3>Enter Your Contact Data</h3>
        {form}
      </div>
    )
  }
}

export default ContactData;