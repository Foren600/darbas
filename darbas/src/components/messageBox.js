import React from 'react';

export default function MessageBox(props) {
  return (
    <div className={`alert ${props.variant ? `alert-${props.variant}` : 'alert-info'}`} role="alert">
      {props.children}
    </div>
  );
}
