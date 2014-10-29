var slideViewer = angular.module('SlideViewer', ['ngAnimate', 'ngTouch']);

slideViewer.animation('.slide-animation', function () {
   return {
       beforeAddClass: function (element, className, done) {
           var scope = element.scope();
           if (className == 'ng-hide') {
               var finishPoint = element.parent()[0].offsetWidth;
               if (scope.direction !== 'right') { finishPoint = -finishPoint; }

               if (scope.transition == "fade") {
                 TweenMax.to(element, 0.45, { autoAlpha: 0, onComplete: done });
               } else {
                 TweenMax.to(element, 0.35, { left: finishPoint, onComplete: done });
               }
           } else {
               done();
           }
       },
       beforeRemoveClass: function (element, className, done) {
           var scope = element.scope();
           if (className == 'ng-hide') {
               element.removeClass('ng-hide');

               var startPoint = element.parent()[0].offsetWidth;
               if (scope.direction === 'right') { startPoint = -startPoint; }

               if (scope.transition == "fade") {
                 TweenMax.to(element, 0.45, { autoAlpha: 1, onComplete: done, startAt: { autoAlpha: 0 } });
               } else {
                 TweenMax.to(element, 0.35, { left: 0, onComplete: done, startAt: { left: startPoint } });
               }
           } else {
               done();
           }
       }
   };
});

/* DIRECTIVES */
slideViewer.directive('slideSource', ['$compile', '$timeout', '$swipe', '$interval', '$timeout', '$rootScope', function ($compile, $timeout, $swipe, $interval, $timeout, $rootScope) {
   return {
       transclude: true,
       restrict: 'A',
       compile: function (element, attrs, transclude) {
           return function ($scope, $element, $attr) {
               var match = attrs.slideSource.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
               $scope.displayVariable = match[1];
               $scope.dataMember = match[2];
               $scope.parent = $element;
               $scope.elements = [];

               // a unique id for tagging children
               $scope.uniqueId = 'a' + Date.now();

               // function to assist in parsing data
               $scope.isNumber = function(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

               $scope.initializeViewer = function () {
                 // initialize defaults
                 $scope.direction = 'left';
                 $scope.transition = "slide";
                 $scope.useKeyboard = false;
                 $scope._currentSelectedItem = null;
                 $scope.indexVariable = "currentIndex"
                 $scope.backgroundSource = null;
                 $scope.useClipping = false;
                 $scope.clipWidth = 50;
                 $scope.automaticNavigation = false;

                 // copy over the transition & set direction default
                 $scope.transition = (attrs.slideTransition ? attrs.slideTransition : $scope.transition);
                 $scope.useKeyboard = (attrs.useKeyboard ? attrs.useKeyboard : $scope.useKeyboard);
                 $scope.indexVariable = (attrs.indexVariable ? attrs.indexVariable : $scope.indexVariable);
                 $scope._index = "_" + $scope.indexVariable;
                 $scope.backgroundSource = (attrs.backgroundSource ? attrs.backgroundSource : $scope.backgroundSource);

                 // start @ the slide provided by the client
                 if (typeof $scope[$scope.indexVariable] == "undefined") {
                     $scope[$scope._index] = 0;
                     $scope[$scope.indexVariable] = 0;
                 } else {
                     $scope[$scope._index] = $scope[$scope.indexVariable];
                 }

                 // setup keyboard events events
                 if ($scope.useKeyboard) {
                   if (document.addEventListener) document.addEventListener("keydown", $scope.processKey);
                   else if (document.attachEvent) document.attachEvent("onkeydown", $scope.processKey);
                 }

                 // load a number of classes
                 $scope.previousClass = (typeof attrs.previousArrowClass == "undefined" ? "" : attrs.previousArrowClass);
                 $scope.nextClass = (typeof attrs.nextArrowClass == "undefined" ? "" : attrs.nextArrowClass);
                 $scope.controlButtonClass = (typeof attrs.controlButtonClass == "undefined" ? "" : attrs.controlButtonClass);
                 $scope.controlPinClass = (typeof attrs.controlPinClass == "undefined" ? "" : attrs.controlPinClass);
                 $scope.pinContainerClass = (typeof attrs.pinContainerClass == "undefined" ? "" : attrs.pinContainerClass);

                 // load clipping
                 if (attrs.hasOwnProperty('clipContents') && attrs.clipContents === 'true') {
                   $scope.useClipping = true;
                   if (attrs.clipWidth) $scope.clipWidth = attrs.clipWidth;
                 }

                 // add a watch on various variables in the parent scope that can change
                 $scope.$watchCollection($scope.dataMember, $scope.processCollectionChange);
                 $scope.$watch($scope._index, $scope.processInternalIndexChange);
                 $scope.$watch($scope.indexVariable, $scope.processExternalIndexChange);

                 // stop auto navigate when location changes
                 $rootScope.$on('$locationChangeStart', function (event, next, current) { $scope._pauseNavigate(); });

                 // initialize the auto timer
                 $scope.autoTimer = attrs.autoAdvance;
                 $timeout($scope._togglePause, 200);

                 // create the actual slide viewer
                 $scope.createViewer();
               };

               $scope.getId = function(idType) {
                 return $scope.uniqueId + '-' + idType;
               };

               $scope.createViewer = function () {
                 /* Setup the slide viewer - arrows and a viewer area that clips the contents */
                 var htmlText = '<div class="' + $scope.previousClass + '" ng-click="_navPrev();" style="cursor: pointer;"></div>' +
                                '<div class="' + $scope.nextClass + '" ng-click="_navNext();" style="cursor: pointer;"></div>';

                 if ($scope.autoAvailable()) {
                   htmlText += '<div id="' + $scope.getId("playpause") + '" class="' + $scope.controlButtonClass + ' play" ng-click="_togglePause();" style="cursor: pointer;" title="pause"></div>';
                 }

                 // create the pin container
                 htmlText += '<div id="' + $scope.getId("pin-container") + '" class="' + $scope.pinContainerClass + '"></div>';
                 
                 if ($scope.useClipping) {
                     htmlText += '<div id="' + $scope.getId("clip") + '" class="slide-view-clip" style="position: absolute; left: ' + $scope.clipWidth + 'px; right: ' + $scope.clipWidth + 'px; overflow: hidden; height: 100%;"></div>';
                 } else {
                     $scope.parent.css('position', 'relative');
                     $scope.parent.css('overflow', 'hidden');
                 }

                 // create the viewer
                 $scope.parent.append($compile(htmlText)($scope));

                 // now create the slide show pins
                 $scope.createPinElements();
               };

               $scope._navNext = function () {
                   $scope.direction = 'left';
                   var dataArray = $scope.getDataArray();
                   if (dataArray === null) return;

                   // callback
                   var newIndex = ($scope[$scope._index] + 1) % dataArray.length;
                   if (typeof $scope[$attr.nextSlide] === 'function') {
                       var result = $scope[$attr.nextSlide](newIndex);
                       if (result === false) return;
                   }
                   
                   $scope[$scope._index] = newIndex;
                   $scope[$scope.indexVariable] = $scope[$scope._index];
               };

               $scope._navPrev = function () {
                   $scope.direction = 'right';
                   var dataArray = $scope.getDataArray();
                   if (dataArray === null) return;

                   // allow calling scope to respond
                   var newIndex = $scope[$scope._index] <= 0 ? dataArray.length - 1 : $scope[$scope._index] - 1;
                   if (typeof $scope[$attr.previousSlide] === 'function') {
                       var result = $scope[$attr.previousSlide](newIndex);
                       if (result === false) return;
                   }

                   $scope[$scope._index] = newIndex;
                   $scope[$scope.indexVariable] = $scope[$scope._index];
               };

               $scope.getDataArray = function () {
                   // validate
                   var dataMember = $scope.dataMember;
                   if (!$scope.hasOwnProperty(dataMember) || typeof $scope[dataMember] == 'undefined') return null;
                   if ($scope[dataMember].length <= $scope[$scope._index]) return null;
                   return $scope[dataMember];
               };

               $scope.getBackgroundUrl = function () {
                 if($scope.backgroundSource === null) return;
                 var dataArray = $scope.getDataArray();
                 if (dataArray === null) return null;
                 return dataArray[$scope[$scope._index]][$scope.backgroundSource];
               };

               $scope.processIndexChange = function (data) {
                   // if this change isn't automatic, then pause the auto slider
                   if (!$scope.automaticNavigation) $scope._pauseNavigate();
                   $scope.automaticNavigation = false;

                   // remove old elements
                   var elementsClone = $scope.elements.slice(0);
                   $timeout(function () {
                       if (elementsClone.length > 0) {
                           for (i = 0; i < elementsClone.length; i++) {
                               elementsClone[i].el.remove();
                               elementsClone[i].scope.$destroy();
                           };
                       }
                   }, 500);

                   // clear elements
                   $scope.elements = [];

                   // update the selected item
                   var dataArray = $scope.getDataArray();
                   if (dataArray === null) return;
                   $scope._currentSelectedItem = dataArray[$scope[$scope._index]];
                   
                   // create a new scope for every element in the collection.
                   var childScope = $scope.$new();
                   childScope[$scope.displayVariable] = $scope._currentSelectedItem;
                   childScope['$index'] = $scope[$scope._index];
                   transclude(childScope, function (clone) {
                       var slideStyle = "position: absolute;width: 100%; height: 100%;";
                       var backgroundImage = $scope.getBackgroundUrl();
                       if (typeof backgroundImage != "undefined" && backgroundImage !== null) {
                         slideStyle += "background: url('" + backgroundImage + "') center center no-repeat; background-size: cover;";
                       }

                       var newElement = $compile('<div ng-hide="' + $scope._index + ' != ' + $scope[$scope._index] + '" class="slide-animation ng-hide" ' +
                           'style="' + slideStyle + '"></div>')(childScope);
                        // left: -1000px;
                       newElement.append(clone);

                       // find the clip element (when applicable)
                       var addElement = $scope.parent;
                       for (var idx = 0; idx < addElement[0].childNodes.length; idx++) {
                         if (addElement[0].childNodes[idx].className.indexOf("slide-view-clip") > -1) {
                           addElement = angular.element(addElement[0].childNodes[idx]);
                           break;
                         }
                       }

                       addElement.append(newElement);

                       var block = {};
                       block.el = newElement;
                       block.scope = childScope;
                       $scope.elements.push(block);
                   });

                   // FFF: Could be improved, but recreate the pins for now
                   $scope.updateActivePin();
               };

               $scope.processKey = function (e) {
                   var keyCode = e.keyCode ? e.keyCode : e.which;
                   switch (keyCode) {
                       case 37: // left arrow
                           $scope.$apply(function () { $scope._navPrev(); });
                           break;
                       case 39: // right arrow
                           $scope.$apply(function () { $scope._navNext(); });
                           break;
                   }
               };

               $scope.processCollectionChange = function (collection) {
                   var dataArray = $scope.getDataArray();
                   if (dataArray === null || dataArray.length <= $scope[$scope._index]) {
                       $scope[$scope._index] = 0;
                   }
                   
                   // update the selected index, slide and notify IF the item has changed
                   if (dataArray === null || dataArray.length <= 0 || $scope._currentSelectedItem != dataArray[$scope[$scope._index]]) {
                       // notify of the change
                       if (typeof $scope[$attr.nextSlide] === 'function') {
                           var result = $scope[$attr.nextSlide]($scope[$scope._index]);
                           if (result === false) return;
                       }
                       
                       // process the index change
                       $scope.processIndexChange(null);
                   } else {
                     // FFF: Could be improved, but recreate the pins for now
                     $scope.createPinElements();
                   }
               };

               $scope.processInternalIndexChange = function (data) {
                 if ($scope[$scope.indexVariable] != $scope[$scope._index]) {
                     $scope[$scope.indexVariable] = $scope[$scope._index];
                 }

                 $scope.processIndexChange(data);
               };

               $scope.processExternalIndexChange = function (data) {
                   var newIdx = $scope[$scope.indexVariable];
                   var currIdx = $scope[$scope._index];
                   if (newIdx < 0) newIdx = 0;

                   // check if the item at the index changed
                   var dataArray = $scope.getDataArray();
                   if (dataArray === null || dataArray.length <= 0) return;
                   if (dataArray.length < newIdx) newIdx = newIdx % dataArray.length;
                   
                   // update the selected index, slide and notify IF the item has changed
                   if ($scope._currentSelectedItem === dataArray[newIdx]) return;

                   var maxIdx = dataArray.length - 1;
                   var loopDistance = (newIdx > currIdx ? (maxIdx - newIdx) + currIdx : (maxIdx - currIdx) + newIdx);
                   var distance = Math.abs(newIdx - currIdx);

                   // determine direction
                   if (newIdx > currIdx) {
                       if (loopDistance > distance) $scope.direction = 'left';
                       else $scope.direction = 'right';
                   }
                   else {

                       if (loopDistance > distance) $scope.direction = 'right';
                       else $scope.direction = 'left';
                   }

                   // notify of the change
                   var newIndex = $scope[$scope.indexVariable];
                   if (typeof $scope[$attr.nextSlide] === 'function') {
                       var result = $scope[$attr.nextSlide](newIndex);
                       if (result === false) return;
                   }
                   
                   $scope[$scope._index] = newIndex;
               };

               $scope._togglePause = function () {
                 if (!$scope.autoAvailable()) return;

                 if (!$scope.autoInterval) {
                  $scope._playNavigate();
                 } else {
                  $scope._pauseNavigate();
                 }
               };

               $scope.autoAvailable = function () {
                 return $scope.autoTimer && $scope.isNumber($scope.autoTimer);
               }

               $scope._playNavigate = function () {
                   if ($scope.autoInterval) return;

                   $scope.autoInterval = $interval(function () {
                     $scope.automaticNavigation = true;
                     if (!$scope.isNumber($scope[$scope.indexVariable])){
                       $scope[$scope.indexVariable] = 0;
                     }
                     else {
                       var dataArray = $scope.getDataArray();
                       var maxIndex = (dataArray === null ? 0 : dataArray.length);
                       $scope[$scope.indexVariable] = ($scope[$scope.indexVariable] + 1) % maxIndex;
                     }
                   }, $scope.autoTimer);

                   // find the toggle button, remove play, add pause
                   var toggleButton = document.getElementById($scope.getId("playpause"));
                   toggleButton.className = $scope.getNewClass(toggleButton, "pause");
                   toggleButton.setAttribute("title", "pause");
               };

               $scope._pauseNavigate = function () {
                 if ($scope.autoInterval) {
                   $interval.cancel($scope.autoInterval);
                   $scope.autoInterval = undefined;

                   // find the toggle button, remove pause, add play
                   var toggleButton = document.getElementById($scope.getId("playpause"));
                   toggleButton.className = $scope.getNewClass(toggleButton, "play");
                   toggleButton.setAttribute("title", "play");
                 }
               };

               $scope.getNewClass = function (el, newClass) {
                   var removePlay = new RegExp("(?:^|\\s)play(?!\\S)", "g");
                   var removePause = new RegExp("(?:^|\\s)pause(?!\\S)", "g");

                   var classParse = el.className.replace(removePlay, '');
                   classParse = classParse.replace(removePause, '');
                   return classParse + " " + newClass;
               };

               $scope._openSlide = function (newIndex) {
                 $scope[$scope.indexVariable] = newIndex;
               };

               $scope.createPinElements = function () {
                 var pinContainer = document.getElementById($scope.getId("pin-container"));
                 if (!pinContainer) return;

                 // clear the container
                 while (pinContainer.hasChildNodes()) {
                   pinContainer.removeChild(pinContainer.lastChild);
                 }

                 // add new nodes for each item in the data array
                 var dataArray = $scope.getDataArray();
                 if (dataArray === null) return;

                 var htmlText = '';
                 for (var idx = 0; idx < dataArray.length; idx++) {
                    var currentClass = $scope.controlPinClass;
                    if (idx === $scope[$scope._index]) currentClass += " active";

                    htmlText += '<div id="' + $scope.getId("-slide" + idx) + '" class="' + currentClass + '" ng-click="_openSlide(' + idx + ')"></div>';
                 }

                 // write to the pin container
                 angular.element(pinContainer).append($compile(htmlText)($scope));
               };

               $scope.updateActivePin = function () {
                 var dataArray = $scope.getDataArray();
                 if (dataArray === null) return;

                 for (var idx = 0; idx < dataArray.length; idx++) {
                    var element = document.getElementById($scope.getId("-slide" + idx));
                    if (!element) continue;

                    if (idx === $scope[$scope._index]) $scope.AddClass(element, "active");
                    else $scope.RemoveClass(element, "active");
                 }
               };

               $scope.AddClass = function (elm, newClass) {
                   elm.className = elm.className + " " + newClass;
               };

               $scope.RemoveClass = function (elm, rmvClass) {
                   var removeClass = new RegExp("(?:^|\\s)" + rmvClass + "(?!\\S)", "g");
                   elm.className = elm.className.replace(removeClass, '');
               };

               // run the initialize!
               $scope.initializeViewer();               
           };
       }
   };
}]);