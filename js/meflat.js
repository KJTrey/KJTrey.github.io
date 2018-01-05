
var canvas;
var context;
var screenH;
var screenW;
var stars = [];
var fps = 50;
var numStars = 2000;

/**
 * Animate the canvas
 */
function animate() {
	context.clearRect(0, 0, screenW, screenH);
	$.each(stars, function() {
		this.draw(context);
	})
}

/**
 * Star
 * 
 * @param int x
 * @param int y
 * @param int length
 * @param opacity
 */
function Star(x, y, length, opacity) {
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.length = parseInt(length);
	this.opacity = opacity;
	this.factor = 1;
	this.increment = Math.random() * .03;
}

/**
 * Draw a star
 * 
 * This function draws a start.
 * You need to give the contaxt as a parameter 
 * 
 * @param context
 */
Star.prototype.draw = function() {
	context.rotate((Math.PI * 1 / 10));
	
	// Save the context
	context.save();
	
	// move into the middle of the canvas, just to make room
	context.translate(this.x, this.y);
	
	// Change the opacity
	if(this.opacity > 1) {
		this.factor = -1;
	}
	else if(this.opacity <= 0) {
		this.factor = 1;
		
		this.x = Math.round(Math.random() * screenW);
		this.y = Math.round(Math.random() * screenH);
	}
		
	this.opacity += this.increment * this.factor;
	
	context.beginPath()
	for (var i = 5; i--;) {
		context.lineTo(0, this.length);
		context.translate(0, this.length);
		context.rotate((Math.PI * 2 / 10));
		context.lineTo(0, - this.length);
		context.translate(0, - this.length);
		context.rotate(-(Math.PI * 6 / 10));
	}
	context.lineTo(0, this.length);
	context.closePath();
	context.fillStyle = "rgba(255, 255, 200, " + this.opacity + ")";
	context.shadowBlur = 5;
	context.shadowColor = '#ffff33';
	context.fill();
	
	context.restore();
}

$(document).ready(function() {

	/*============================================
	Stars Functions
	==============================================*/

	// Calculate the screen size
	screenH = $(window).height()/1.5;
	screenW = $(window).width();
	
	// Get the canvas
	canvas = $('#space');
	
	// Fill out the canvas
	canvas.attr('height', screenH);
	canvas.attr('width', screenW);
	context = canvas[0].getContext('2d');
	
	// Create all the stars
	for(var i = 0; i < numStars; i++) {
		var x = Math.round(Math.random() * screenW);
		var y = Math.round(Math.random() * screenH);
		var length = 1 + Math.random() * 2;
		var opacity = Math.random();
		
		// Create a new star and draw
		var star = new Star(x, y, length, opacity);
		
		// Add the the stars array
		stars.push(star);
	}
	
	setInterval(animate, 1000 / fps);

	/*============================================
	Wave Functions
	==============================================*/
	var ocean = document.getElementById("ocean"),
	waveWidth = 10,
	waveCount = Math.floor(window.innerWidth/waveWidth),
	docFrag = document.createDocumentFragment();

	for(var i = 0; i <= waveCount; i++){
	var wave = document.createElement("div");
	wave.className += " wave";
	docFrag.appendChild(wave);
	wave.style.left = i * waveWidth + "px";
	wave.style.webkitAnimationDelay = (i/100) + "s";
	}

	ocean.appendChild(docFrag);

	/*============================================
	Parralax Functions
	==============================================*/
	$.fn.moveIt = function(){
		var $window = $(window);
		var instances = [];
		
		$(this).each(function(){
		  instances.push(new moveItItem($(this)));
		});
		
		window.addEventListener('scroll', function(){
		  var scrollTop = $window.scrollTop();
		  instances.forEach(function(inst){
			inst.update(scrollTop);
		  });
		}, {passive: true});
	  }
	  
	  var moveItItem = function(el){
		this.el = $(el);
		this.speed = parseInt(this.el.attr('data-scroll-speed'));
	  };
	  
	  moveItItem.prototype.update = function(scrollTop){
		this.el.css('transform', 'translateY(' + -(scrollTop / this.speed) + 'px)');
	  };
	  
	  // Initialization
	  $(function(){
		$('[data-scroll-speed]').moveIt();
	  });

	/*============================================
	Navigation Functions
	==============================================*/
	if ($(window).scrollTop()===0){
		$('#main-nav').removeClass('scrolled');
	}
	else{
		$('#main-nav').addClass('scrolled');    
	}

	$(window).scroll(function(){
		if ($(window).scrollTop()===0){
			$('#main-nav').removeClass('scrolled');
		}
		else{
			$('#main-nav').addClass('scrolled');    
		}
	});
	
	/*============================================
	Header Functions
	==============================================*/
	$('.imac-screen').flexslider({
		prevText: '<i class="fa fa-angle-left"></i>',
		nextText: '<i class="fa fa-angle-right"></i>',
		animation: 'slide',
		slideshowSpeed: 3000,
		useCSS: true,
		controlNav: false,
		directionNav: false,
		pauseOnAction: false, 
		pauseOnHover: false,
		smoothHeight: false
	});
	
	$("#home .text-col h1").fitText(0.9, { minFontSize: '38px', maxFontSize: '63px' });
	$("#home .text-col p").fitText(1.2, { minFontSize: '18px', maxFontSize: '32px' });
	
	if($('#home .imac-screen').length){
		$('.imac-screen img').load(function(){
			$('#home .text-col h1, #home .text-col p, #home .imac-frame').addClass('in');
		});
	}else{
		$('#home .text-col h1, #home .text-col p').addClass('in');
	}
	/*============================================
	Skills Functions
	==============================================*/
	var color = $('#home').css('backgroundColor');

	$('.skills').waypoint(function(){
		$('.chart').each(function(){
		$(this).easyPieChart({
				size:140,
				animate: 2000,
				lineCap:'butt',
				scaleColor: false,
				barColor: color,
				trackColor: 'transparent',
				lineWidth: 10
			});
		});
	},{offset:'80%'});
	
	/*============================================
	Project thumbs - Masonry
	==============================================*/
	$(window).load(function(){

		$('#projects-container').css({visibility:'visible'});

		$('#projects-container').masonry({
			itemSelector: '.project-item:not(.filtered)',
			columnWidth:320,
			isFitWidth: true,
			isResizable: true,
			isAnimated: !Modernizr.csstransitions,
			gutterWidth: 25
		});

		scrollSpyRefresh();
		waypointsRefresh();
	});

	/*============================================
	Filter Projects
	==============================================*/
	$('#filter-works a').click(function(e){
		e.preventDefault();

		$('#filter-works li').removeClass('active');
		$(this).parent('li').addClass('active');

		var category = $(this).attr('data-filter');

		$('.project-item').each(function(){
			if($(this).is(category)){
				$(this).removeClass('filtered');
			}
			else{
				$(this).addClass('filtered');
			}

			$('#projects-container').masonry('reload');
		});

		scrollSpyRefresh();
		waypointsRefresh();
	});

	/*============================================
	Project Preview
	==============================================*/
	$('.project-item').click(function(e){
		e.preventDefault();

		var elem = $(this),
			title = elem.find('.project-title').text(),
			descr = elem.find('.project-description').html(),
			slidesHtml = '<ul class="slides">',
			elemDataCont = elem.find('.project-description');

			slides = elem.find('.project-description').data('images').split(',');

		for (var i = 0; i < slides.length; ++i) {
			slidesHtml = slidesHtml + '<li><img src='+slides[i]+' alt=""></li>';
		}
		
		slidesHtml = slidesHtml + '</ul>';
		

		$('#project-modal').on('show.bs.modal', function () {
			$(this).find('#hdr-title').text(title);
			$(this).find('#sdbr-title').text(title);
			$(this).find('#project-content').html(descr);
			$(this).find('.screen').addClass('flexslider').html(slidesHtml);
			
			if(elemDataCont.data('category')){
				$(this).find('#sdbr-category').show().text(elemDataCont.data('category'))
			}else{$(this).find('#sdbr-category').hide();}
			
			if(elemDataCont.data('date')){
				$(this).find('#sdbr-date').show().text(elemDataCont.data('date'))
			}else{$(this).find('#sdbr-date').hide();}
			
			if(elemDataCont.data('client')){
				$(this).find('#sdbr-client').show().text(elemDataCont.data('client'))
			}else{$(this).find('#sdbr-client').hide();}
			
			if(elemDataCont.data('link')){
				var extLink = elemDataCont.data('link').split(',');
				$(this).find('#sdbr-link').show().find('a').text(extLink[0]).attr('href',extLink[1]);
			}else{$(this).find('#sdbr-link').hide();}
			
			if(elemDataCont.data('descr')){
				$(this).find('#sdbr-descr').show().text(elemDataCont.data('descr'))
			}else{$(this).find('#sdbr-descr').hide();}
			
			setTimeout(function(){
				$('.screen.flexslider').flexslider({
					prevText: '<i class="fa fa-angle-left"></i>',
					nextText: '<i class="fa fa-angle-right"></i>',
					slideshowSpeed: 3000,
					animation: 'slide',
					controlNav: false,
					pauseOnAction: false, 
					pauseOnHover: true,
					start: function(){
						$('#project-modal .screen')
						.addClass('done')
						.prev('.loader').fadeOut();
					}
				});
			},1000);
		}).modal({backdrop:false});
		
	});

	$('#project-modal').on('hidden.bs.modal', function () {
		$(this).find('.loader').show();
		$(this).find('.screen')
			.removeClass('flexslider')
			.removeClass('done')
			.html('')
			.flexslider('destroy');
	});
	
	
	/*============================================
	ScrollTo Links
	==============================================*/
	$('a.scrollto').click(function(e){
		$('html,body').scrollTo(this.hash, this.hash, {gap:{y:-50},animation:  {easing: 'easeInOutCubic', duration: 1600}});
		e.preventDefault();

		if ($('.navbar-collapse').hasClass('in')){
			$('.navbar-collapse').removeClass('in').addClass('collapse');
		}
	});

	/*============================================
	Contact Form
	==============================================*/
	
	$(".label_better").label_better({
	  easing: "bounce",
	  offset:5
	});

	/*============================================
	Tooltips
	==============================================*/
	$("[data-toggle='tooltip']").tooltip();
	
	/*============================================
	Placeholder Detection
	==============================================*/
	if (!Modernizr.input.placeholder) {
		$('#contact-form').addClass('no-placeholder');
	}

	/*============================================
	Scrolling Animations
	==============================================*/
	$('.scrollimation').waypoint(function(){
		$(this).addClass('in');
	},{offset:function(){
			var h = $(window).height();
			var elemh = $(this).outerHeight();
			if ( elemh > h*0.3){
				return h*0.7;
			}else{
				return h - elemh;
			}
		}
	});

	/*============================================
	Resize Functions
	==============================================*/
	$(window).resize(function(){
		scrollSpyRefresh();
		waypointsRefresh();
	});
	/*============================================
	Refresh scrollSpy function
	==============================================*/
	function scrollSpyRefresh(){
		setTimeout(function(){
			$('body').scrollspy('refresh');
		},1000);
	}

	/*============================================
	Refresh waypoints function
	==============================================*/
	function waypointsRefresh(){
		setTimeout(function(){
			$.waypoints('refresh');
		},1000);
	}

});	