import React, { Component } from 'react'
import SDK from '../apis/SDK';
import { withSnackbar } from 'notistack';
import IconexConnect from '../apis/IconexConnect';
import ButtonComponent from './ButtonComponent';
import InputComponent from './InputComponent';
import ListComponent from './ListComponent';
import TextField from '@material-ui/core/TextField';
import CONST from '../constants';
import config from '../config';
import { str2ab } from '../utils';

const INITIAL_INPUT = {
    id: 'ID',
    pw: 'PW',
    label: '00',
    key: '',
    encryptedData: ''
  }

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: CONST.MODE['LOG_OUT'],
      myAddress: '',
      inputData: INITIAL_INPUT,
      myKissList: []
    }
  }

  setInputData = name => event => {
    this.setState({
      inputData: {
        ...this.state.inputData,
        [name]: event.target.value
      }
    })
  };

  handleEncrypt = () => {
    const { id, pw, key } = this.state.inputData
    const text = `${id} ${pw}`
    const textBytes = window.aesjs.utils.utf8.toBytes(text);
    const keyBuffer = new Uint8Array(str2ab(key)).slice(0, 16)
    const aesCtr = new window.aesjs.ModeOfOperation.ctr(keyBuffer, new window.aesjs.Counter(5));
    const encryptedBytes = aesCtr.encrypt(textBytes);
    const encryptedData = window.aesjs.utils.hex.fromBytes(encryptedBytes);
    this.setState({
      inputData: {
        ...this.state.inputData,
        encryptedData
      }
    })
  }

  buttonClick = () => {
    const { mode } = this.state
    switch(mode) {
      case CONST.MODE['LOG_OUT']: 
        this.getAddress()
        break
      case CONST.MODE['LOG_IN']:
        this.sendTransaction()
        break
      default:
        break;
    }
  }

  getAddress = async () => {
    const myAddress = await IconexConnect.getAddress()
    this.setState({
      mode: CONST.MODE['LOG_IN'],
      myAddress,
    }, () => {
      this.getKissList()
    })
  }

  sendTransaction = async () => {
    const { sendTxBuild } = SDK
    const { inputData, myAddress } = this.state
    const { label, encryptedData } = inputData

    const txObj = sendTxBuild({
      from: myAddress,
      to: window.CONTRACT_ADDRESS,
      methodName: 'setKissInfo',
      params: {
        label,
        encrypted_password: encryptedData
      },
    })
    const tx = await IconexConnect.sendTransaction(txObj)
    this.setState({
      inputData: INITIAL_INPUT
    }, () => {
      setTimeout(() => {
        this.getKissList()
      }, 3000)
    })
  }

  getKissList = async () => {
    const { iconService, callBuild } = SDK
    const { myAddress } = this.state
    const myKissList = await iconService.call(
      callBuild({
        from: myAddress,
        methodName: 'getAllKissInfos',
        params: {},
        to: window.CONTRACT_ADDRESS,
      })
    ).execute()

    this.setState({
      myKissList: Object.entries(JSON.parse(myKissList))
    })
  }

  render() {
    const { mode, inputData, myKissList } = this.state
    console.log(myKissList)
    const isLogOut = mode === CONST.MODE['LOG_OUT']
    const isEncrypted = !!inputData.encryptedData
    return (
      <div className="App">
        <section className="main">
          <div className="wrapper">
            <p className="logo anton-400">KISS</p>
            <div style={{textAlign: 'center'}}>
              {isLogOut
                ? (<>
                    <p className="desc roboto-slab">Key Is Set on blockchain Safely</p>
                    <ButtonComponent {...this.state} type="LOG_IN" buttonClick={this.buttonClick} />
                  </>)
                : (<InputComponent {...this.state} setInputData={this.setInputData} handleEncrypt={this.handleEncrypt} /> )}
            </div>
          </div>
          {isEncrypted && (
            <div className="encrypt">
              <TextField
                disabled
                label="Encrypted string"
                value={inputData.encryptedData}
                style={{
                  width: 370,
                  margin: '-4px 30px 0 0',
                }}
                margin="none"
                variant="outlined"
              />
              <ButtonComponent {...this.state} type="SENDTX" buttonClick={this.buttonClick} />
            </div>
          )}

        </section>
        { myKissList.length > 0 && (
          <ListComponent { ...this.state } />
        )}
      </div>
    )
  }
}

export default withSnackbar(App)