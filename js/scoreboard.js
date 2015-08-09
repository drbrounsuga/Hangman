var scoreboard = (function($){

  "use strict";

  var $document,
      $hangman,
      $err0,
      $err1,
      $err2,
      $err3,
      $err4,
      $err5,
      $err6,
      errArray,
      streak = 0,
      maxWrong = 7,
      currentWrongCount,
      cacheDOM = function(){
        $document = $(document);
        $hangman = $document.find('.hangman');
        $err0 = $hangman.find('.layer-0');
        $err1 = $hangman.find('.layer-1');
        $err2 = $hangman.find('.layer-2');
        $err3 = $hangman.find('.layer-3');
        $err4 = $hangman.find('.layer-4');
        $err5 = $hangman.find('.layer-5');
        $err6 = $hangman.find('.layer-6');
        errArray = [$err0, $err1, $err2, $err3, $err4, $err5, $err6];
      },
      update = function(){
        showLayer(currentWrongCount);
        currentWrongCount++;
        if(currentWrongCount === maxWrong){
          streak = 0;
          alert('GAME OVER');
          $document.trigger('reset');
        }
      },
      congratulate = function(){
        streak++;
        alert('YOU WIN! (streak: '+ streak + ')');
        $document.trigger('reset');
      },
      showLayer = function(index){
        var $el = errArray[index];
        $el.removeClass('hidden');
      },
      destroy = function(){
        $err0.addClass('hidden');
        $err1.addClass('hidden');
        $err2.addClass('hidden');
        $err3.addClass('hidden');
        $err4.addClass('hidden');
        $err5.addClass('hidden');
        $err6.addClass('hidden');
        $document.off('badguess', update);
        $document.off('gamewon', congratulate);
        $document.off('reset', reset);
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
        $document.on('reset', reset);
      };

      init();

})(jQuery);
