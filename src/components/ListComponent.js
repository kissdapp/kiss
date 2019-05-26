import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { str2ab } from '../utils';
import CONST from '../constants'


class CardItem extends Component {
    state = {
        key: '',
        result: ''
    }

    setInputData = (e) => {
        this.setState({
            key: e.target.value
        })
    }

    handleDecrypt = () => {
        console.log(new Uint8Array(str2ab(this.state.key)).slice(0, 16))
        const keyBuffer = new Uint8Array(str2ab(this.state.key)).slice(0, 16)
        const aesCtr2 = new window.aesjs.ModeOfOperation.ctr(keyBuffer, new window.aesjs.Counter(5));
        const decryptedBytes = aesCtr2.decrypt(window.aesjs.utils.hex.toBytes(this.props.encryptedData));
        const decryptedText = window.aesjs.utils.utf8.fromBytes(decryptedBytes);
        this.setState({
            result: `ID: ${decryptedText.split(' ')[0]} | PW: ${decryptedText.split(' ')[1]}`
        })
    }

    render() {
        const { label, encryptedData } = this.props 
        const { key, result } = this.state
        return (
            <Card style={{width: 800, marginBottom: 20}}>
                <CardActionArea>
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {CONST.SERVICE[Number(label)].label}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {encryptedData}
                    </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions style={{padding: 14}}>
                    {
                        result ? (
                            <TextField
                                id="decrypt"
                                label="Result"
                                value={result}
                                style={{
                                    width: 680
                                }}
                                margin="none"
                            />
                        ) : (
                            <>
                                <TextField
                                    id="decrypt"
                                    label="Key"
                                    value={key}
                                    style={{
                                        width: 680
                                    }}
                                    onChange={this.setInputData}
                                    margin="none"
                                />
                                <Button onClick={this.handleDecrypt} size="small" color="primary">Decrypt</Button>
                            </>
                        )
                    }
                    
                </CardActions>
            </Card>
        )
    }
}


export default class ListComponent extends Component {
    render() {
    const { myKissList } = this.props
    return (
        <section className="list fade-in">
        {
            myKissList.map((item, i) => (
                <CardItem key={i} label={item[0]} encryptedData={item[1]}  />
            ))
        }
        </section>
    )
    }
}
