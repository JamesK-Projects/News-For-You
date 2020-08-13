'use strict'

const key = "97f3043488msh08675756fa0ead2p141a60jsnc8fb76a82881";
const searchUrl = "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI";

const keyYoutube = "AIzaSyC-cVs3KOmd1ejpSBxCRDiPRSCaT5jtsYg";
const youtubeUrl = "https://www.googleapis.com/youtube/v3/search"

var itemNumber = 1;
var pageSize = 20;

function displayNewsResults(responseJson, pageSize){
    console.log(responseJson);
    console.log(pageSize);
    $('.js-news-results').append('<div class="section-title"><h2>Read all about it:</h2></div>')
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
                    <p class="description">${responseJson.value[i].description}</p>
                    <hr>
                </div>
            `)
        }
    }
}

function displayYoutubeResults(responseJson){
    console.log(responseJson);
    $('.js-youtube-results').append('<div class="section-title"><h2>Watch related videos:</h2></div>')
    for (var i = 0; i < 20; i++){
        $('.js-youtube-results').append(`
            <div class="results">
                <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank">
                    <h2 class="video-title">${responseJson.items[i].snippet.title}</h2>
                </a>
                <h4>source: ${responseJson.items[i].snippet.channelTitle}</h4>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <p class="description">${responseJson.items[i].snippet.description}</p>
                <hr>
            </div>
                
        `)
    }
}

function formatQueryParams(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function getNews(query, fromPublishedDate, toPublishedDate){
    $('.loader').removeClass('hidden');
    var params = {
        "autoCorrect": "false",
	    "pageNumber": itemNumber,
	    "pageSize": pageSize,
	    "q": query,
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
            $('.loader').addClass('hidden');
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayNewsResults(responseJson, pageSize))
        .catch (err => {
            console.log(`${err.message}`);
        });
}

function getVideos(query, fromPublishedDate, toPublishedDate){
    var today = new Date();
    if (fromPublishedDate === ''){
        fromPublishedDate = "2019-01-01";
    }

    if (toPublishedDate === ''){
        toPublishedDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
    }

    console.log("from" + fromPublishedDate + "to" + toPublishedDate);
    var params = {
        "q": query,
        "key": keyYoutube,
        "part": "snippet",
        "type": "video",
        "videoCategoryId": 25,
        "maxResults": 20,
        "publishedAfter": fromPublishedDate + 'T00:00:00Z',
        "publishedBefore": toPublishedDate + 'T23:59:59Z'
    }
    const queryString = formatQueryParams(params);
    const url = youtubeUrl + '?' + queryString;

    fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayYoutubeResults(responseJson))
        .catch (err => {
            console.log(`${err.message}`)
        })
}

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        $('.js-youtube-results').empty();
        $('.js-news-results').empty();
        const searchTerm = $('.js-search-bar').val();
        const fromPublishedDate = $('#date-from').val();
        const toPublishedDate = $('#date-to').val();
        console.log("form was submitted");
        console.log($('#date-from').val());
        getNews(searchTerm, fromPublishedDate, toPublishedDate);
        getVideos(searchTerm, fromPublishedDate, toPublishedDate);
    })
}

// Infinite scroll function. TBD if will use

// $(window).scroll(function infiniteScroll() {
//         if ($(document).height() - $(this).height() == $(this).scrollTop()) {
//             //alert('scrolled to bottom')
//             itemNumber += 20;
//             pageSize += 20;
//             console.log(itemNumber)
//             const searchTerm = $('.js-search-bar').val();
//             const safeSearch = $('.js-safe-search').prop("checked");
//             const fromPublishedDate = $('#date-from').val();
//             const toPublishedDate = $('#date-to').val();
//             getNews(searchTerm, safeSearch, fromPublishedDate, toPublishedDate);
//         }
//  });

$(watchForm);