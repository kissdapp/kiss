import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/styles';
import CONST from '../constants'

const MyTextField = styled(TextField)({
  marginLeft: 8,
  marginRight: 8,
  width: 135,
});

export default class InputComponent extends Component {
  render() {
    const { inputData, setInputData, handleEncrypt } = this.props

    return (
      <>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: '-8px 30px 11px'
          }}>
          <MyTextField
            select
            label="Service"
            value={inputData.label}
            onChange={setInputData('label')}
            SelectProps={{
              native: true,
              MenuProps: {
                style: {
                  width: 200
                },
              },
            }}
            margin="normal">
            {CONST.SERVICE.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </MyTextField>
          <MyTextField
            label="ID"
            value={inputData.id}
            onChange={setInputData('id')}
            margin="normal"
          />
          <MyTextField
            label="PW"
            value={inputData.pw}
            onChange={setInputData('pw')}
            margin="normal"
          />
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: '-20px 30px 11px'
        }}>
          <MyTextField
            label="Key"
            value={inputData.key}
            onChange={setInputData('key')}
            margin="normal"
          />
          <Button 
            style={{
              border: '1px white solid',
              borderRadius: 30,
              color: 'white',
              height: 48,
              padding: '8px 145px',
              textTransform: 'none',
              width: 240,
              marginTop: 16,
              marginLeft: 6
            }}
            onClick={handleEncrypt}
            variant='outlined'
            >Encrypt</Button>
        </div>
      </>
    )
  }
}