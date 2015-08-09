var scoreboard = (function($){

  "use strict";

  var $document,
      $hangman,
      $modal,
      modalTemplate,
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
        $modal = $document.find('#modal');
        $err0 = $hangman.find('.layer-0');
        $err1 = $hangman.find('.layer-1');
        $err2 = $hangman.find('.layer-2');
        $err3 = $hangman.find('.layer-3');
        $err4 = $hangman.find('.layer-4');
        $err5 = $hangman.find('.layer-5');
        $err6 = $hangman.find('.layer-6');
        errArray = [$err0, $err1, $err2, $err3, $err4, $err5, $err6];
        modalTemplate = $document.find('#modalTemplate').html();
      },
      update = function(){
        showLayer(currentWrongCount);
        currentWrongCount++;
        if(currentWrongCount === maxWrong){
          streak = 0;
          render({
            title:'TRY AGAIN',
            message: 'Game over, man! Game over! You killed Kenny.'
          });
        }
      },
      congratulate = function(){
        streak++;
        render({
          title:'AWESOME!',
          message: 'Congrats! You solved the quote and saved Kenny.<br>Your current winning streak is ' + streak + ' game(s)'
        });
      },
      hideMessage = function(){
        $document.trigger('reset');
        $modal.addClass('hidden');
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
        $document.off('click', '.confirm', hideMessage);
      },
      reset = function(){
        destroy();
        init();
      },
      render = function(message){
        var template =  Handlebars.compile(modalTemplate),
            html = template(message);
        $modal.html(html).removeClass('hidden');
      },
      init = function(){
        cacheDOM();
        currentWrongCount = 0;
        $document.on('badguess', update);
        $document.on('gamewon', congratulate);
        $document.on('reset', reset);
        $document.on('click', '.confirm', hideMessage);
      };

      init();


})(jQuery);
