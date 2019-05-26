import React from 'react';
import Button from '@material-ui/core/Button';
import CONST from '../constants'

function ButtonComponent({ type, buttonClick }) {
  let label = '', style = {}
  switch(type) {
    case 'LOG_IN': 
      label = 'Connect to ICONex'
      style = {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 30,
        color: 'white',
        height: 48, 
        padding: '8px 145px',
        textTransform: 'none',
        width: 440
      }
      break
    case 'SENDTX':
      label = 'Save Data'
      style = {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 30,
        color: 'white',
        height: 48, 
        padding: '8px 65px',
        textTransform: 'none',
        width: 292
      }
      break
    default:
      break;
  }
  return (
    <Button 
      onClick={buttonClick}
      style={style}>
      {label}
    </Button>
  )
}

export default ButtonComponent;
