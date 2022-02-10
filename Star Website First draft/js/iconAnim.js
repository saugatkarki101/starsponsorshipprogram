const icon = document.getElementById('iconAnimation1')
const icon2 = document.getElementById('iconAnimation2')
const icon3 = document.getElementById('iconAnimation3')
const logo = document.getElementById('logoAnimation')


// OnScroll event handler
const onScroll = () => {

// Get scroll value
const scroll = document.documentElement.scrollTop

  // If scroll value is more than 0 - add class
	if (scroll > 0)
	{
		icon.classList.add("animate__bounceInUp");
		icon2.classList.add("animate__bounceInUp");
		icon3.classList.add("animate__bounceInUp");
		logo.classList.add("animate__zoomIn");
	}
	else
	{
		icon.classList.remove("animate__bounceInUp");
		icon2.classList.remove("animate__bounceInUp");
		icon3.classList.remove("animate__bounceInUp");
		logo.classList.remove("animate__zoomIn");
	}
}

// Use the function
window.addEventListener('scroll', onScroll)


//This is currently using the animate.css to trigger.
