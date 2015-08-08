var letterbox = (function($){

  "use strict";

  var $letters,
      lettersTemplate,
      lettersArray = [],
      lettersBank = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
        'P','Q','R','S','T','U','V','W','X','Y','Z'],
      cacheDOM = function(){
        $letters = $('#letters');
        lettersTemplate = $('#lettersTemplate').html();
      },
      createNewTile = function(index, value){
        return {
          id: index,
          value: value,
          activated: false
        };
      },
      prepareTiles = function(){
        var letter;
        for(var i = 0, len = lettersBank.length; i < len; i++){
          letter = createNewTile(i, lettersBank[i]);
          lettersArray.push(letter);
        }
      },
      useLetter = function(e){
        e.preventDefault();
        var $selectedLetter = $(this),
            selectedLetterID = $selectedLetter.data('id');

        lettersArray[selectedLetterID].activated = true;
        $selectedLetter.addClass('selected').removeClass('choice');

        $(document).trigger('letterSelected', $selectedLetter.html());
      },
      render = function(){
        var template =  Handlebars.compile(lettersTemplate),
            html = template(lettersArray);
        $letters.html(html);
      },
      destroy = function(){
        $letters.empty();
        lettersArray = [];
        $letters.off('click', '.choice', useLetter);
      },
      reset = function(){
        destroy();
        init();
      },
      init = function(){
        cacheDOM();
        prepareTiles();
        render();
        $letters.on('click', '.choice', useLetter);
      };

      init();

      return {
        destroy: destroy,
        reset: reset
      };

})(jQuery);
