import React from 'react';
import './Alert.module.css';

function Alert ({ title, message, onClose }) {
  return (
    <div className="alert">
        <div className="alert-content">
            <h3>{title}</h3>
            <p>{message}</p>
            <button onClick={onClose}>OK</button>
        </div>
    </div>
  )
}

export default Alert;

