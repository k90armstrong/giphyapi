$(document).ready(function () {
    console.log('hello world');

    //global variables
    var buttonTitles = ['the office', 'arrested development', 'cats', 'dogs', 'epic fail', 'halloween', 'trampoline', 'blah']
    var $buttonConainter = $('.button-container');

    // functions
    function createButton(title) {
        var $a = $('<a>').addClass('gif-button button is-link is-outlined');
        $a.text(title);
        $a.attr('data-clicks', '0');
        return $a;
    }

    function buttonClickHandler(event) {
        $('.gif-button').addClass('is-outlined');
        $(this).removeClass('is-outlined')
        var title = $(this).text();
        var clicks = parseInt($(this).attr('data-clicks'));
        // use ajax to get the gifs from giphy
        var apiKey = "ajr8bxOsbIB09O6mzx88S9u88o18f7et";
        var queryURL = "https://api.giphy.com/v1/gifs/search";
        queryURL += '?' + $.param({
            api_key: apiKey,
            q: title,
            limit: 20,
            offset: clicks * 20
        });
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function (response) {
            var gifs = response.data;
            if (gifs.length > 0) {
                console.log(gifs);
                renderPageGifs(gifs);
            }
        });
        clicks++;
        $(this).attr('data-clicks', clicks);

    }

    function renderPageGifs(arrayOfGifs) {
        var $gifContainer = $('.gif-container');
        $gifContainer.empty();
        for (var i = 0; i < arrayOfGifs.length; i++) {
            if (arrayOfGifs[i].rating.toLowerCase() !== 'r' && arrayOfGifs[i].rating.toLowerCase() !== 'pg-13') {
                var $gif = makeGifElement(arrayOfGifs[i]);
                $gifContainer.append($gif);
            }
        }
    }

    function gifClickHandler() {
        var state = $(this).attr('data-state');
        if (state == 'paused') {
            $(this).attr('src', $(this).attr('data-animatedURL'));
            $(this).attr('data-state', 'animated');
        } else {
            $(this).attr('src', $(this).attr('data-pausedURL'));
            $(this).attr('data-state', 'paused');
        }
    }

    function makeGifElement(gif) {
        console.log(gif);
        var $g = $('<div>');
        $g.addClass('gif');
        $h4 = $('<h4>');
        $h4.text('Rating: ' + gif.rating);
        $g.append($h4);
        var $img = $('<img>');
        $img.attr('data-state', 'paused');
        $img.attr('data-animatedURL', gif.images.fixed_height.url);
        $img.attr('data-pausedURL', gif.images.fixed_height_still.url);
        $img.attr('src', gif.images.fixed_height_still.url);
        $g.append($img);
        return $g;
    }


    function addButtonClickHandler(event) {
        event.preventDefault();
        var newButtonText = $('input').val();
        $('input').val('');
        var $btn = createButton(newButtonText);
        $buttonConainter.append($btn);
    }


    // event listeners
    $(document).on('click', '.gif-button', buttonClickHandler);
    $(document).on('click', 'img', gifClickHandler);
    $('.add-button').on('click', addButtonClickHandler);


    // main process, 
    // initialize buttons
    buttonTitles.forEach(function (title) {
        var $button = createButton(title);
        $buttonConainter.append($button);
    });



});