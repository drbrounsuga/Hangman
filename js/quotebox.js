var quotebox = (function($){

  "use strict";

  var $quote,
      $document,
      quoteTemplate,
      quoteData,
      quoteObject,
      ajaxCall,
      correctCount = 0,
      letterCount = 0,
      mashapeKey = 'o7miaRMGj4msh8Q05jptlzUGFfo8p1UhntbjsnLFEHmBbG60gC',
      mashapeEndPoint = 'https://andruxnet-random-famous-quotes.p.mashape.com/cat=movies',
      cacheDOM = function(){
        $document = $(document);
        $quote = $document.find('#quote');
        quoteTemplate = $document.find('#quoteTemplate').html();
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

          if(!charStatus){
            correctCount++;
          }

          letterCount++;

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
      update = function(event, value){
        var currentWord,
            currentLetter,
            correctThisGuess = 0;

        //cycle through words array
        for(var i = 0, len = quoteObject.words.length; i < len; i++){
          currentWord = quoteObject.words[i];

          //cycle through letter objects in words array
          for(var n = 0, len2 = currentWord.length; n < len2; n++){
            currentLetter = currentWord[n].value;

            if(currentLetter === value){
              quoteObject.words[i][n].guessed = true;
              correctCount++;
              correctThisGuess++;
            }
          }
        }

        if(correctThisGuess === 0){
          $document.trigger('badguess');
        }

        render();
      },
      hasWon = function(html){
        if(correctCount === letterCount){
          $document.trigger('gamewon');
        }
      },
      render = function(){
        var template =  Handlebars.compile(quoteTemplate),
            html = template(quoteObject);
            hasWon();
        $quote.html('').html(html);
      },
      destroy = function(){
        $quote.empty();
        quoteObject = {};
        $document.off('letterSelected', update);
        $document.off('reset', reset);
      },
      reset = function(){
        destroy();
        init();
      },
      init = function(){
        cacheDOM();
        getNewQuote();
        $document.on('letterSelected', update);
        $document.on('reset', reset);
      };

      init();

      return {
        destroy: destroy,
        reset: reset
      };

})(jQuery);
