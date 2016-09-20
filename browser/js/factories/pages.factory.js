app.factory('PagesFactory', function() {
  return function() {
    let divs = document.getElementsByClassName('section');
    let currentDiv = 0;
    let nextDiv = 1;


    let moveDown = function(startDiv) {
      startDiv.className = 'slideUpOut section visible';
      setTimeout(function() {
        startDiv.style.display = 'none';
        currentDiv = nextDiv;
      }, 1000)
      divs[nextDiv].className = 'slideUpIn section'
      divs[nextDiv].style.display = 'block'
    }

    let moveUp = function(startDiv) {
      startDiv.className = 'slideDownOut section visible'
      setTimeout(function() {
        startDiv.style.display = 'none';
        currentDiv = nextDiv;
      }, 1000);
      divs[nextDiv].className = 'slideDownIn section'
      divs[nextDiv].style.display = 'block'
    }

    angular.element(document).bind('mousewheel', function(e) {
      console.log(e)
      if (currentDiv === -1) return;
      if (e.deltaY > 0 && currentDiv !== divs.length - 1) {
        let startDiv = divs[currentDiv];
        nextDiv = currentDiv + 1;
        currentDiv = -1;
        moveDown(startDiv);
      } else if (e.deltaY < 0 && currentDiv !== 0) {
        let startDiv = divs[currentDiv];
        nextDiv = currentDiv - 1;
        currentDiv = -1;
        moveUp(startDiv)
      }
    });

    // angular.element(document).keydown(function(e) {
    //   if (currentDiv === -1) return;
    //   if (e.which === 40 && currentDiv !== divs.length - 1) {
    //     let startDiv = divs[currentDiv];
    //     nextDiv = currentDiv + 1;
    //     currentDiv = -1;
    //     moveDown(startDiv);

    //   } else if (e.which === 38 && currentDiv !== 0) {
    //     let startDiv = divs[currentDiv];
    //     nextDiv = currentDiv - 1;
    //     currentDiv = -1;
    //     moveUp(startDiv)
    //   }
    // })
  }
})
