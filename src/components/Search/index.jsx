import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'
import { API_GET_SEARCH_DATA, API_KEY } from "../../global/constants";

export default class Search extends Component {

  search = () => {
    const { keyWordElement: { value: keyword } } = this;
    if (keyword === '') {
      alert("Input could not be empty.")
      return
    }
    PubSub.publish('searchResult', { isFirst: false, isLoading: true });
    axios.get(API_GET_SEARCH_DATA.concat(keyword), { headers: { Authorization: API_KEY } })
      .then(response => {
        PubSub.publish('searchResult', { isLoading: false, photos: response.data.photos, next_page: response.data.next_page ? response.data.next_page : '', prev_page: response.data.prev_page ? response.data.prev_page : '' });
      })
      .catch((error) => {
        PubSub.publish('searchResult', { isLoading: false, err: error.message });
      });
  }
  render() {
    return (
      <section className="jumbotron">
        <h3 className="jumbotron-heading">Search Photo</h3>
        <div>
          <input ref={c => this.keyWordElement = c} type="text" placeholder="Enter the keyword..." />&nbsp;
          <button onClick={this.search}>Search</button>
        </div>
      </section>
    )
  }
}
