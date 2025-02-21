import React from 'react';

function LogInButton(props) {
    return (
      <button onClick={props.onClick}>
        Log in
      </button>
    );
}

export default LogInButton;