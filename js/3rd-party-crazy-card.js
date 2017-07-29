function overload(element) {
	var color = element.style.backgroundColor;
	element.style.backgroundColor = "red";
	var stop = false; 
		
	setTimeout ( function() {
		(function(element, color) {
			for (i=0; i<3000000000; i++);
			element.style.backgroundColor = color;
		})(element,color);
		
		},0);

}
