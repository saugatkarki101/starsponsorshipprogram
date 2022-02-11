const logo = document.getElementById('logoAnimation')


// OnScroll event handler
const onScroll = () => {

// Get scroll value
const scroll = document.documentElement.scrollTop

  // If scroll value is more than 0 - add class
	if (scroll > 20) 
	{
		logo.classList.add("animate__zoomIn");
		
	} 
	else 
	{
		logo.classList.remove("animate__zoomIn");
	
	}
}

// Use the function
window.addEventListener('scroll', onScroll)


//This is currently using the animate.css to trigger. 
