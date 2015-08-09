var scoreboard = (function($){

  "use strict";

  var $document,
      $hangman,
      $err1,
      $err2,
      $err3,
      $err4,
      $err5,
      $err6,
      errArray,
      maxWrong = 6,
      currentWrongCount,
      cacheDOM = function(){
        $document = $(document);
        $hangman = $document.find('.hangman');
        $err1 = $hangman.find('.layer-1');
        $err2 = $hangman.find('.layer-2');
        $err3 = $hangman.find('.layer-3');
        $err4 = $hangman.find('.layer-4');
        $err5 = $hangman.find('.layer-5');
        $err6 = $hangman.find('.layer-6');
        errArray = [$err1, $err2, $err3, $err4, $err5, $err6];
      },
      update = function(){
        currentWrongCount++;
        showLayer(currentWrongCount);
        if(currentWrongCount == maxWrong){
          alert('GAME OVER');
        }
      },
      congratulate = function(){
        alert('YOU WIN');
      },
      showLayer = function(n){
        var $el = errArray[n-1];
        $el.removeClass('hidden');
      },
      destroy = function(){
        $err1.addClass('hidden');
        $err2.addClass('hidden');
        $err3.addClass('hidden');
        $err4.addClass('hidden');
        $err5.addClass('hidden');
        $err6.addClass('hidden');
        $document.off('badguess', update);
        $document.off('gamewon', congratulate);
      },
      reset = function(){
        destroy();
        init();
      },
      init = function(){
        cacheDOM();
        currentWrongCount = 0;
        $document.on('badguess', update);
        $document.on('gamewon', congratulate);
      };

      init();

})(jQuery);
