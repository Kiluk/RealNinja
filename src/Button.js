import React from 'react';

function Button(props) {
    return (
      <button onClick={props.onClick}>
        Log in
      </button>
    );
}

export default Button;