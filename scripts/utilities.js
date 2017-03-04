var animatePoints = function() {
	var revealPoint = function() {
   // #7
		$(this).css({
			opacity: 1,
			transform: 'scaleX(1) translateY(0)',
			filter: "blur(0)"
		});
	};
	$.each($('.point'), revealPoint);
};