

function showPreviousForm($currentForm) {
	var currentFormStep = parseInt($currentForm.attr('data-step')) || false;
	var $nextForm = $('.js-form-step[data-step="' + (currentFormStep - 1) + '"]');

	//console.log('Current step is ' + currentFormStep);
	//console.log('The next form is # ' + $nextForm.attr('data-step'));

	$body.addClass('freeze');

	// Ensure top of form is in view
	//$('html, body').animate({
	//scrollTop : $progressBar.offset().top
	//}, 'fast');

	// Hide current form fields
	$currentForm.addClass('leaving');
	setTimeout(function () {
		$currentForm.addClass('hidden');
	}, 500);

	// Animate container to height of form
	$animContainer.css({
		'paddingBottom': $nextForm.height() + 'px'
	});

	// Show next form fields
	$nextForm.removeClass('hidden')
		.addClass('coming')
		.one(transitionEnd, function () {
			$nextForm.removeClass('coming waiting');
		});

	// Increment value (based on 4 steps 0 - 100)
	value += 33;

	// Reset if we've reached the end
	if (value >= 100) {
		// if it gets to the last
	} else {
		$('.form-progress')
			.find('.form-progress-indicator.active')
			.next('.form-progress-indicator')
			.addClass('active');

		// Set progress bar to the next value
		$progressBar.val(value);
	}

	// Update hidden progress descriptor (for a11y)
	$('.js-form-progress-completion').html($progressBar.val() + '% complete');

	$body.removeClass('freeze');

	return false;
}


function showNextForm($currentForm) {
	var currentFormStep = parseInt($currentForm.attr('data-step')) || false;
	var $nextForm = $('.js-form-step[data-step="' + (currentFormStep + 1) + '"]');

	//console.log('Current step is ' + currentFormStep);
	//console.log('The next form is # ' + $nextForm.attr('data-step'));
	top = $('body').height();
	if (currentFormStep + 1 == 3) {
		$('#newAssignmentCard').css({ "height": "635px" });
		top = top - 645;
	}
	else if (currentFormStep + 1 == 4) {
		$('#newAssignmentCard').css({ "height": "385px" });
		top = top - 362;
	}
	else {
		top = top - 512;
	}
	top = top / 2;
	//$('#newAssignmentCard').css({'top' : top+'px'})

	$body.addClass('freeze');

	// Ensure top of form is in view
	//$('html, body').animate({
	//scrollTop : $progressBar.offset().top
	//}, 'fast');

	// Hide current form fields
	$currentForm.addClass('leaving');
	setTimeout(function () {
		$currentForm.addClass('hidden');
	}, 500);

	// Animate container to height of form
	$animContainer.css({
		'paddingBottom': $nextForm.height() + 'px'
	});

	// Show next form fields
	$nextForm.removeClass('hidden')
		.addClass('coming')
		.one(transitionEnd, function () {
			$nextForm.removeClass('coming waiting');
		});

	// Increment value (based on 4 steps 0 - 100)
	value += 33;

	// Reset if we've reached the end
	if (value >= 100) {
		// if it gets to the last
	} else {
		$('.form-progress')
			.find('.form-progress-indicator.active')
			.next('.form-progress-indicator')
			.addClass('active');

		// Set progress bar to the next value
		$progressBar.val(value);
	}

	// Update hidden progress descriptor (for a11y)
	$('.js-form-progress-completion').html($progressBar.val() + '% complete');

	$body.removeClass('freeze');

	return false;
}


function showThisForm($currentForm, index) {
	var currentFormStep = index + 1;
	var $nextForm = $('.js-form-step[data-step="' + (currentFormStep) + '"]');

	console.log('Current step is ' + currentFormStep);
	console.log($nextForm)
	console.log('The next form is # ' + $nextForm.attr('data-step'));

	$body.addClass('freeze');

	// Ensure top of form is in view
	//$('html, body').animate({
	//scrollTop : $progressBar.offset().top
	//}, 'fast');

	// Hide current form fields

	$('.js-form-step').addClass('leaving').addClass('hidden');


	// Animate container to height of form
	$animContainer.css({
		'paddingBottom': $nextForm.height() + 'px'
	});

	// Show next form fields
	$nextForm.removeClass('hidden').remove('leaving')
		.addClass('coming')
		.one(transitionEnd, function () {
			$nextForm.removeClass('coming waiting');
		});

	// Increment value (based on 4 steps 0 - 100)
	value += 33;

	// Reset if we've reached the end
	if (value >= 100) {
		// if it gets to the last
	} else {
		$('.form-progress')
			.find('.form-progress-indicator.active')
			.next('.form-progress-indicator')
			.addClass('active');

		// Set progress bar to the next value
		$progressBar.val(value);
	}

	// Update hidden progress descriptor (for a11y)
	$('.js-form-progress-completion').html($progressBar.val() + '% complete');

	$body.removeClass('freeze');

	$animContainer.css({
		'paddingBottom': $('.js-form-step[data-step="' + currentFormStep + '"]').height() + 'px'
	});

	return false;
}