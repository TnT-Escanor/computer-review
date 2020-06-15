import React, { Component } from 'react';
import axios from 'axios';
import {Table} from 'react-bootstrap';


class CompareScreen2 extends Component {
    constructor(props){
        super(props)
        this.state ={
            id1: '',
            name1:'',
            rating1:'',
            price1:'',
            description1:'',
            id2: '',
            name2:'',
            rating2:'',
            price2:'',
            description2:'',

        };
        this.id1 = props.match.params.id1;
        this.id2 = props.match.params.id2;
    }

    componentDidMount() {
        const productId1 = this.props.match.params.id1;
        const productId2 = this.props.match.params.id2;
        axios.get(`http://localhost:5000/compare/${productId1}`, null)
            .then(res => {
                this.setState({
                    name1: res.data[0].name,
                    rating1: res.data[0].rating,
                    price1: res.data[0].price,
                    description1: res.data[0].description
                })
            })
            .catch(err => console.log(err))
        axios.get(`http://localhost:5000/compare/${productId2}`, null)
            .then(res => {
                this.setState({
                    name2: res.data[0].name,
                    rating2: res.data[0].rating,
                    price2: res.data[0].price,
                    description2: res.data[0].description
                })
            })
            .catch(err => console.log(err))

        }

render() {
        console.log(this.state)
    console.log(this.state.name2)
    return(
        <Table striped bordered hover style={{marginTop : '5rem'}}>
            <thead>
            <tr>
                <th>So sánh</th>
                <th>{this.state.name1}</th>
                <th>{this.state.name2}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Rating</td>
                <td>{this.state.rating1}</td>
                <td>{this.state.rating2}</td>
            </tr>
            <tr>
                <td>Description</td>
                <td>{this.state.description1}</td>
                <td>{this.state.description2}</td>
            </tr>
            <tr>
                <td>Price</td>
                <td> {this.state.price1}</td>
                <td> {this.state.price2}</td>
            </tr>
            </tbody>
        </Table>
    )
}
}

export  default CompareScreen2;
