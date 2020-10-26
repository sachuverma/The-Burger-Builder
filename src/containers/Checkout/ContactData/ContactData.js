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
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        errorMessage: 'Enter Valid Alphabets'
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        errorMessage: 'Enter Valid Alphabets'
      }, 
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        errorMessage: 'Enter Valid Alphabets'
      },
      zipcode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6, 
          maxLength: 6
        },
        valid: false,
        touched: false,
        errorMessage: 'MinLength: 6 MaxLength: 6'
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Email Address'
        },
        value: '',
        validation: {
          required: true,
          mail: true
        },
        valid: false,
        touched: false,
        errorMessage: 'Enter Valid Email Address'
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
          ]
        },
        value: 'fastest',
        validation: {
          required: false
        },
        valid: true
      },
    },
    formIsValid: false,
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

  checkValidity(value, rules){
    let isValid = true;

    if(rules.required) isValid = value.trim() !== '' && isValid;
    if(rules.mail) isValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) && isValid;
    if(rules.minLength) isValid = value.length >= rules.minLength && isValid;
    if(rules.maxLength) isValid = value.length <= rules.maxLength && isValid;
    
    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    
    let formIsValid = true;
    for(let inputIdentifier in updatedOrderForm){
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    
    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
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
            invalid={!elem.config.valid}
            touched={elem.config.touched}
            errMessage={elem.config.errorMessage}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
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