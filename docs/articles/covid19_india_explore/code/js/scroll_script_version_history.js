(function() {
	// using d3 for convenience
	var main = d3.select('main')
	var scrolly = main.select('#scrolly');
	var figure = scrolly.select('figure');
	var article = scrolly.select('article');
	var step = article.selectAll('.step');
	// initialize the scrollama
	var scroller = scrollama();
	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		//var stepH = Math.floor(window.innerHeight * 0.75);
		var stepH = Math.floor(window.innerHeight * 1.0);
		step.style('height', stepH + 'px')
			.style('right', '10px');
		var figureHeight = window.innerHeight; // / 2
		var figureMarginTop = (window.innerHeight - figureHeight) / 2  
		figure
			.style('height', figureHeight + 'px')
			.style('top', figureMarginTop + 'px');
			//.style('top', '0px')
			//.style('bottom', '0px');
		// 3. tell scrollama to update new element dimensions
		scroller.resize();
		// Set migration map height
		//var mmap = document.getElementById("migration-map");
		var mmap = main.select("#migration-map");
		mmap.style('height', figureHeight + 'px');
	}
	// scrollama event handlers
	function handleStepEnter(response) {
		// response = { element, direction, index }
		// add color to current step only
		step.classed('is-active', function (d, i) {
			return i === response.index;
		})
		// update graphic based on step
		//figure.select('p').text(response.index + 1);
        var el = d3.select(response.element);
        var val = el.attr('data-step');
	    handleStepTransition(val);
	}
	function setupStickyfill() {
		d3.selectAll('.sticky').each(function () {
			Stickyfill.add(this);
		});
	}
	function handleStepProgress(response) {
		console.log(response.progress);
		current_year.text(response.progress);
	}
	function handleStepTransition(data_step_id) {

	    if (data_step_id==1) {
	        
	    } else if (data_step_id==2) {
	    } else if (data_step_id==3) {
		    
	    } else if (data_step_id==4) {
	    	
	    }

			
	}
	function init() {
		setupStickyfill();
		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();
		// 2. setup the scroller passing options
		// 		this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			step: '#scrolly article .step',
			offset: 0.66,
			progress: true,
			debug: false,
		})
		.onStepEnter(handleStepEnter)
		.onStepProgress(handleStepProgress)
		// setup resize event
		window.addEventListener('resize', handleResize);
	}
	// kick things off
	init();
})();

function pageScroll() {
    window.scrollBy(0,1);
    scrolldelay = setTimeout(pageScroll,10);
}
//pageScroll();