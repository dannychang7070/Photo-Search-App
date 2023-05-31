import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'
import { API_GET_CURATED_DATA, API_KEY } from "../../global/constants";
import './index.css'

export default class List extends Component {

    state = {
        photos: [],
        isFirst: true,
        isLoading: false,
        err: '',
        next_page: '',
        prev_page: '',
    }

    componentDidMount() {
        this.token = PubSub.subscribe("searchResult", (_, stateObj) => {
            this.setState(stateObj)
        })
        axios.get(API_GET_CURATED_DATA, { headers: { Authorization: API_KEY } })
            .then(response => {
                PubSub.publish('searchResult', { photos: response.data.photos, next_page: response.data.next_page ? response.data.next_page : '', prev_page: response.data.prev_page ? response.data.prev_page : '' });
            })
            .catch((error) => {
                PubSub.publish('searchResult', { err: error.message });
            });
    }

    nextPage = () => {
        const { next_page } = this.state;
        axios.get(`${next_page}`, {
            headers: {
                Authorization: API_KEY } })
            .then(response => {
                    PubSub.publish('searchResult', { photos: response.data.photos, next_page: response.data.next_page ? response.data.next_page : '', prev_page: response.data.prev_page ? response.data.prev_page : '' });
                })
                        .catch((error) => {
                            PubSub.publish('searchResult', { err: error.message });
                        });
            }

    prevPage = () => {
                const { prev_page } = this.state;
                axios.get(`${prev_page}`, { headers: { Authorization: API_KEY } })
                    .then(response => {
                        PubSub.publish('searchResult', { photos: response.data.photos, next_page: response.data.next_page ? response.data.next_page : '', prev_page: response.data.prev_page ? response.data.prev_page : '' });
                    })
                    .catch((error) => {
                        PubSub.publish('searchResult', { err: error.message });
                    });
            }

    componentWillUnmount() {
                PubSub.unsubscribe(this.token)
            }

    render() {
                const { photos, isFirst, isLoading, err, next_page, prev_page } = this.state
                return (
                    <div className="row">
                        {
                            isFirst ?
                                photos.map((photoObj) => {
                                    return (
                                        <div key={photoObj.id} className="card" style={{ height: '194px' }}>
                                            <a rel="noreferrer" href={photoObj.url} target="_blank">
                                                <img alt="head-protait" src={photoObj.src.original} style={{ width: '100px' }} />
                                            </a>
                                            <p className="card-text">{photoObj.photographer}</p>
                                        </div>
                                    )
                                }) :
                                isLoading ? <h2>Loading...</h2> :
                                    err ? <h2 style={{ color: 'red' }}>{err}</h2> :
                                        photos.map((photoObj) => {
                                            return (
                                                <div key={photoObj.id} className="card" style={{ height: '194px' }}>
                                                    <a rel="noreferrer" href={photoObj.url} target="_blank">
                                                        <img alt="head-protait" src={photoObj.src.original} style={{ width: '100px' }} />
                                                    </a>
                                                    <p className="card-text">{photoObj.photographer}</p>
                                                </div>
                                            )
                                        })
                        }
                        {
                            prev_page !== '' ? <button onClick={this.prevPage}>Prev</button> : null
                        }
                        {
                            next_page !== '' ? <button onClick={this.nextPage}>Next</button> : null
                        }
                    </div>
                )
            }
        }
