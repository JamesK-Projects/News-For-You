'use strict'

const key = "3a46a2bc81bf428da0fe89b85f7c8029";
const searchUrl = "https://newsapi.org/v2/everything";





function formatQueryParams(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function getNews(query){
    const params = {
        q: query,
        apiKey: key,
        language: "en"
        
    }

    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;
    console.log(url);

    fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => console.log(responseJson))
        .catch (err => {
            console.log(`${err}`);
        });
}

function watchForm(){
    
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('.js-search-bar').val();
        console.log("form was submitted");
        getNews(searchTerm);
    })
}

$(watchForm);