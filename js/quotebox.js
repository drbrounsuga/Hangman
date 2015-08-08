var quotebox = (function($){

  "use strict";

  var $quote,
      quoteTemplate,
      quoteData,
      quoteObject,
      ajaxCall,
      mashapeKey = 'o7miaRMGj4msh8Q05jptlzUGFfo8p1UhntbjsnLFEHmBbG60gC',
      mashapeEndPoint = 'https://andruxnet-random-famous-quotes.p.mashape.com/cat=movies',
      cacheDOM = function(){
        $quote = $('#quote');
        quoteTemplate = $('#quoteTemplate').html();
      },
      getNewQuote = function(){
        ajaxCall = $.ajax({
          url: mashapeEndPoint,
          type: 'GET',
          data: {},
          dataType: 'json',
          success: setQuoteData,
          error: handleAjaxError,
          beforeSend: setAjaxHeader
        });
      },
      setAjaxHeader = function(xhr){
        xhr.setRequestHeader("X-Mashape-Authorization", mashapeKey);
      },
      handleAjaxError = function(err){
        alert(err);
      },
      setQuoteData = function(data){
        //quoteData = {"quote":"You talking to me?","author":"Taxi Driver","category":"Movies"};
        quoteData = data;
        processQuoteData();
        render();
      },
      processQuoteData = function(){
        var quote = quoteData.quote || '',
            author = quoteData.author || '',
            category = quoteData.category || '';

        quoteObject = {
          words: [],
          quote: quote,
          category: category,
          solved: false
        };

        quoteObject.words = createWordTiles(author);
      },
      createWordTiles = function(inputString){
        var wordsArray = [],
            stringParts = inputString.trim().split(' '),
            word;

        for(var i = 0, len = stringParts.length; i < len; i++){
          word = createLetterTiles(stringParts[i]);
          wordsArray.push(word);
        }

        return wordsArray;
      },
      createLetterTiles = function(word){
        var letters = word.trim().split(''),
            lettersArray = [],
            letterObj,
            charStatus;

        for(var i = 0, len = letters.length; i < len; i++){
          charStatus = isAlphaChar(letters[i]);
          letterObj = {
            id: i,
            value: letters[i].toUpperCase(),
            guessed: !charStatus,
            isSpecialChar: !charStatus
          };

          lettersArray.push(letterObj);
        }

        return lettersArray;
      },
      isAlphaChar = function(str){
        return str.length === 1 && str.match(/[a-z]/i);
      },
      render = function(){
        var template =  Handlebars.compile(quoteTemplate),
            html = template(quoteObject);
        $quote.html(html);
      },
      destroy = function(){
        $quote.empyt();
        quoteObject = {};
      },
      reset = function(){
        destroy();
        init();
      },
      init = function(){
        cacheDOM();
        getNewQuote();
      };

      init();

      return {
        destroy: destroy,
        reset: reset
      };

})(jQuery);
