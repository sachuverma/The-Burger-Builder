import React from 'react';

import classes from './Order.css';

const order = (props) => {
  const ingredients = [];
  for(let ingredientName in props.ingredients){
    ingredients.push({
      name: ingredientName,
      amount: props.ingredients[ingredientName]
    });
  }

  const ingredientList = ingredients.map(ig => {
    return <span 
      style={{
        textTransform: 'capitalize',
        display: 'inline-block',
        margin: '5px 8px',
        border: '2px solid #bbb',
        padding: '5px',
      }}
      key={ig.name}>
        {ig.name} ({ig.amount}) 
      </span>;
  })

  return (
    <div className={classes.Order}>
      <p>Ingredients: <br /> {ingredientList} </p>
      <p>Price: <strong>$ {Number.parseFloat(props.price.toFixed(2))}</strong></p>
    </div>
  );
};

export default order;