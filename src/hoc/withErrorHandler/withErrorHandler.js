import React, { Component } from 'react'

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component{
    state = {
      error: null
    };

    constructor(props) {
      super(props);
      axios.interceptors.request.use(req => {
        this.setState({error: null});
        return req;
      });

      axios.interceptors.response.use(res => res, error => {
        this.setState({error: error});
      });
    };

    errorConfirmedHandler = () => {
      this.setState({error: null}); 
    }

    render() {
      let face = ": (";
      return (
        <Aux>
          <Modal 
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler}
          >
            {this.state.error ? this.state.error.message: null}   
            {this.state.error ? face: null}
          </Modal>
          <WrappedComponent {...this.props}/>
        </Aux>
      );
    }
  } 
};

export default withErrorHandler;