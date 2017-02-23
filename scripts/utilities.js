	  var forEach = function(array, functionName) {
			for (var i = 0; i < array.length; i++) {
				functionName(array[i]);
	 		}
	  };
	  var restyle = function(arrItem) {
		  arrItem.style.opacity = 1;
		  arrItem.style.transform = "scaleX(1) translateY(0)";
		  arrItem.style.msTransform = "scaleX(1) translateY(0)";
		  arrItem.style.WebkitTransform = "scaleX(1) translateY(0)";
		  arrItem.style.filter = blur(0);
	  };