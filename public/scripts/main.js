$(document).ready(function () {
	$(".navbar-toggle").on("click", function () {
		$(this).toggleClass("active");
	});
	$(".menu-item").on({
	    mouseenter: function () {
	        $(this).toggleClass("active");
	    },
	    mouseleave: function () {
	        $(this).toggleClass("active");
	    }
	});
})