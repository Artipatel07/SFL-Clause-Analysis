
/* For dynamic annimations */
let currentlyVisible = ".form-log-in";
let currentlyHidden = ".form-sign-up";
$(".info-item .btn").click(function(){
  $(".form-container").toggleClass("active");
  $(currentlyVisible).fadeToggle('750', function() {
    $(currentlyHidden).fadeToggle();
    s = currentlyVisible;
    currentlyVisible = currentlyHidden;
    currentlyHidden = s;
  });
  $(".leaves").addClass("animated tada").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
    $(this).removeClass("animated tada");
  });
});

$('#SignUpTemp').click(function(){
  $('#HaveAccount').delay(400).fadeIn(500);
  $('#LoginTemp').delay(400).fadeIn(500);
  $('.info-item.sign-up').hide();
});

$('#LoginTemp').click(function(){
  $('.info-item.sign-up').delay(400).fadeIn(500);
  $('#HaveAccount').hide();
  $('#LoginTemp').hide();
});

$('input').click(()=>{
  $('#errormessage').slideUp();
})


$('.error').parent().addClass('alert-block alert-danger')
$('.success').parent().addClass('alert-block alert-success')
