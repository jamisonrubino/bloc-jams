 var animatePoints = function() {
     var points = document.getElementsByClassName('point');
	 var revealpoints = function(item) { 
		 	item.style.opacity = 1;
         item.style.transform = "scaleX(1) translateY(0)";
         item.style.msTransform = "scaleX(1) translateY(0)";
         item.style.WebkitTransform = "scaleX(1) translateY(0)";
		 	item.style.filter = "blur(0px)";
	 };
	 for (var i = 0; i < points.length; i++) {
	      revealpoints(points[i]);
	  }
 };
animatePoints();