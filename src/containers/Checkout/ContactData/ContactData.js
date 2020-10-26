import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.css';
import axios from '../../../axios-order'

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: ''
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: ''
      }, 
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: ''
      },
      zipcode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: ''
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Email Address'
        },
        value: ''
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
          ]
        },
        value: 'fastest'
      },
    },
    loading: false
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const formData = {};
    for(let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
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

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({orderForm: updatedOrderForm});
    // console.log(event.target.value);
    // console.log(this.state.orderForm);
  }

  render() {
    const formElementsArray = [];
    for(let key in this.state.orderForm){
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(elem => (
          <Input 
            key={elem.id} 
            elementType={elem.config.elementType} 
            elementConfig={elem.config.elementConfig} 
            value={elem.config.value}  
            changed={(event) => this.inputChangedHandler(event, elem.id)}
          />
        ))}
        <Button btnType="Success">ORDER</Button>
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