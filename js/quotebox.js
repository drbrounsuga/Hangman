var quotebox = (function($){

  "use strict";

  var $quote,
      $document,
      quoteTemplate,
      quoteData,
      quoteObject,
      ajaxCall,
      correctCount,
      letterCount,
      //my API key from https://www.mashape.com/andruxnet/random-famous-quotes
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
          author: author,
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
          //is it a letter A-Z?
          charStatus = isAlphaChar(letters[i]);

          //if not we will mark it as guessed since the
          //user will only guess characters A-Z
          if(!charStatus){
            correctCount++;
          }

          //keep track of how many letters in this quote
          letterCount++;

          letterObj = {
            id: i,
            value: letters[i].toUpperCase(),
            guessed: !charStatus,
            isSpecialChar: !charStatus,
            selected: false
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
              quoteObject.words[i][n].selected = true;
              correctCount++;
              correctThisGuess++;
            }else{
              quoteObject.words[i][n].selected = false;
            }
          }
        }

        if(correctThisGuess === 0){
          $document.trigger('badguess');
        }

        render();
      },
      hasWon = function(html){
        if(correctCount === letterCount && correctCount !== 0){
          $document.trigger('gamewon', quoteObject.author);
        }
      },
      render = function(){
        var template =  Handlebars.compile(quoteTemplate),
            html = template(quoteObject);

        $quote.html('').html(html);
        hasWon();
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
        correctCount = 0;
        letterCount = 0;
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
