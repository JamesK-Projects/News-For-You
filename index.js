'use strict'

const key = "97f3043488msh08675756fa0ead2p141a60jsnc8fb76a82881";
const searchUrl = "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI";



function displayResults(responseJson, pageSize){
    console.log(responseJson);
    console.log(pageSize);
    $('.js-news-results').empty();
    for (var i = 0; i < pageSize; i++){
        if ((responseJson.value[i].image.url) !== null && (responseJson.value[i].image.url) !==""){
            $('.js-news-results').append(`
                <div class="results">
                    <a href="${responseJson.value[i].url}" target="_blank">
                        <h2 class="article-title">${responseJson.value[i].title}</h2>
                    </a>
                    <h4>source: ${responseJson.value[i].provider.name}</h4>
                    <a href="${responseJson.value[i].url}" target="_blank">
                        <img src="${responseJson.value[i].image.url}" width="300px">
                    </a>
                </div>
            `)
        }
    }
    
}



function formatQueryParams(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function getNews(query, safeSearch, fromPublishedDate, toPublishedDate, itemNumber, pageSize){
    
    var params = {
        "autoCorrect": "false",
	    "pageNumber": itemNumber,
	    "pageSize": pageSize,
	    "q": query,
        "safeSearch": safeSearch,
        "fromPublishedDate": fromPublishedDate,
        "toPublishedDate": toPublishedDate
    }
    
    

    const options = {
        headers: new Headers({
            "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
            "x-rapidapi-key": key
        })
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;
    console.log(url);

    fetch(url, options)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, pageSize))
        .catch (err => {
            console.log(`${err.message}`);
        });
}

function watchForm(){
    
    $('form').submit(event => {
        event.preventDefault();
        var itemNumber = 1;
        var pageSize = 20;
        const searchTerm = $('.js-search-bar').val();
        const safeSearch = $('.js-safe-search').prop("checked");
        const fromPublishedDate = $('#date-from').val();
        const toPublishedDate = $('#date-to').val();
        console.log("form was submitted");
        getNews(searchTerm, safeSearch, fromPublishedDate, toPublishedDate, itemNumber, pageSize);
    })
}

// $(window).scroll(function infiniteScroll() {
//     var itemNumber = 1;
//     var pageSize = 20;
//         if ($(document).height() - $(this).height() == $(this).scrollTop()) {
//             alert('Scrolled to Bottom');
//             itemNumber += 20;
//             pageSize += 20;
//             console.log(itemNumber)
//             // params = {
//             //     "autoCorrect": "false",
//             //     "pageNumber": itemNumber,
//             //     "pageSize": pageSize,
//             //     "q": query,
//             //     "safeSearch": safeSearch,
//             //     "fromPublishedDate": fromPublishedDate,
//             //     "toPublishedDate": toPublishedDate
//             // }
            
//         }getNews(itemNumber, pageSize);
    
//     });

$(watchForm);