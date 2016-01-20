///
/// Banner slides
///

/** defines the class for the individual sub slides
 *  constructor
 *  \param domElement the dom element of this sub slide
 *  \param bannerSlide the banner slide this subslide belongs to
 */
function BannerSubSlide(domElement, bannerSlide){
    var self = this;

    self.element = $(domElement);
    self.bannerSlide = bannerSlide;
}

BannerSubSlide.prototype.prepareToHide = function () {
    var self = this;

    self.element.css("z-index", "0");
}

BannerSubSlide.prototype._show = function () {
    var self = this;
    self.element.css("z-index", "100");
    self.element.fadeIn(500);
}

BannerSubSlide.prototype.beforeHide = function () {

}

BannerSubSlide.prototype._hide = function() {
    var self = this;

    self.element.hide();
}

BannerSubSlide.prototype.show = function() {
    var self = this;

    self._show();
}

BannerSubSlide.prototype.hide = function () {
    var self = this;
    
    self.beforeHide();
    self._hide();
}

///
/// Banner slide object
///

function BannerSlide(domElem) {
    var self = this;

    self.domElem = $(domElem);
    
    self.subSlides = [];

    self.domElem.children("li.subslide").each(function(i){
        var subslide = new BannerSubSlide(this, self);
        self.subSlides.push(subslide);
    });
}

BannerSlide.prototype.show = function(callback, i){
    var self = this;

    if( i === undefined)
        i = 0;
    var j = self.subSlides[i];
    j.show();
    i++;
    if(i < self.subSlides.length) {
        setTimeout(function() {
            self.show(callback, i);
        }, 500);
    }
    else{
        setTimeout(function() {
            callback();
        }, 500);
    }
}

BannerSlide.prototype.prepareToHide = function() {
    var self = this;

    for(var i in self.subSlides){
        var j = self.subSlides[i];
        j.prepareToHide();
    }
}

BannerSlide.prototype.hide = function(){
    var self = this;

    for(var i in self.subSlides){
        var j = self.subSlides[i];
        j.hide();
    }
}

///
/// Banner images
///

function Banner (domElem) {
    var self = this;

    self.slides = [];
    self.current = null;
    self.index = 0;

    self.elem = $(domElem);

    self.elem.children("ul").each(function(i) {
        var slide = new BannerSlide(this);
        self.slides.push(slide);
        if( self.current == null ){
            self.current = slide;
        }

    });
    self.current.show();
    self.timer = setInterval(function() { self.transition(); }, 7000);
}

Banner.prototype.transition = function(){
    var self = this;

    var calc = self.index + 1;
    self.index =  calc % self.slides.length;

    self._transition(self.index);
}

Banner.prototype.transitionDown = function() {
    var self = this;

    var calc = self.index - 1;
    self.index =  calc % self.slides.length;
    self._transition(self.index);
}

Banner.prototype._transition = function(index) {
    var self = this;

    self.current.prepareToHide();
    var last = self.current;
    
    self.index = index;
    var next = self.slides[self.index];

    next.show(function() {
        window.canClick = true;
    });
    setTimeout(function() {
        for (var i = self.slides.length - 1; i >= 0; i--) {
            if (i != self.index)
                self.slides[i].hide();
        };
        //last.hide();
    }, 3000);
    self.current = next;

}

Banner.prototype.restartTimer = function() {
    clearTimeout(self.timer);
    setTimeout(function() {
        self.timer = setInterval(function() { self.transition(); }, 7000);
    }, 7000);
}

Banner.prototype.init = function() {
    var self = this;

}


///
/// Jquery banner
///


(function ( $ ) {

    $.fn.banner = function() {
        var self = this;
        window.canClick = true;
        self.banner = new Banner(self);
        $("#left").on("click", function() {
            if( !window.canClick ) return;
            window.canClick = false;
            clearTimeout(self.timer);
            self.banner.transitionDown();
            self.banner.restartTimer();
        });
        $("#right").on("click", function() {
            if( !window.canClick ) return;
            window.canClick = false;
            clearTimeout(self.timer);
            self.banner.transition();
            self.banner.restartTimer();
        });
    };

} ( jQuery ));

