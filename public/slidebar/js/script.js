//JavaScript Document
$(document).ready(function() {
    $('#autoWidth').lightSlider({
        autoWidth: true,
        auto: true,
        loop:true,
        onSliderLoad: function() {
            $('#autoWidth').removeClass('cS-hidden');
        } 
    });  
  });