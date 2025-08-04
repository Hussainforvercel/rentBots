import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MegasoftSuccess extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired
  };

  render() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '500px',
          padding: '30px',
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          color: '#333',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '15px'
          }}>
            Payment Successful
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#27ae60',
            marginBottom: '30px'
          }}>
            Megasoft payment completed successfully.
          </p>
          <button
            style={{
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onClick={() => window.location.href="/"}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
}

export default MegasoftSuccess;
