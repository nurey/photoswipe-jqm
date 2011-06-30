// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function domloaded() {
    $( "button, input:submit, .button" ).livequery(function() {
        $(this).button();
    });

    $("form.savior").formSavior();

    $(".signin").click(function(e) {
        e.preventDefault();
        $("fieldset#signin_menu").toggle();
        $(".signin").toggleClass("menu-open");
        if ( $(".signin").hasClass("menu-open") ) {
            $("#user_email").focus();
        } else {
            $("#user_email").blur();
        }
    });

    $("fieldset#signin_menu").mouseup(function() {
        return false;
    });
    $(document).mouseup(function(e) {
        if($(e.target).parent("a.signin").length==0) {
            $(".signin").removeClass("menu-open");
            $("fieldset#signin_menu").hide();
        }
    });
    $('.delete_item').live('ajax:success', function() {
        $(this).closest('tr').fadeOut();
    });
    $("#short_url").live('click', function() {
    	$(this).focus().select();
    });
    $('#feature.box').cycle();
    $('#quote.box').cycle({ delay: 3000, timeout: 8000 });
    $('#info_for_home_buyers.box').click(function () {
        location.href = '/qr';
    });
}

function loadTally() {
    $('div#total_count').load('/listings/tally', function() {
        Cufon.replace("#listingholder #total_count");
    });
}


$(function() {
  domloaded();

    // listing
  $( "#master" )
  	.accordion({
  		header: "> div > h3",
  		active: false,
      autoHeight: false,
      collapsible: true
  	});

  var stop = false;
  $( "#accordion h3" ).click(function( event ) {
  	if ( stop ) {
  		event.stopImmediatePropagation();
  		event.preventDefault();
  		stop = false;
  	}
  });
  $( "#accordion" )
  	.accordion({
  		header: "> div > h3",
  		active: false,
      change: function(event, ui) {
          if(ui.newContent.html() == "") {
              ui.newContent.load(ui.newHeader.find('a').attr('href'), function () {
                $(this).closest('div.listing_detail').removeClass('loading');
              });
          }
      },
      autoHeight: false,
      collapsible: true
  	})
  	.sortable({
  		axis: "y",
  		handle: "h3",
  		cancel: "div.toggle_container",
  		containment: 'parent',
  		stop: function() {
  			stop = true;
  		},
  		update: function() {
        $.post('/listings/sort', '_method=put&'+$(this).sortable('serialize'));
      }
  });

  $('input.toggle').iphoneStyle({ checkedLabel: 'Published&nbsp;&nbsp;', uncheckedLabel: 'Unpublished' });
  $('div.toggle_container').click(function(event) {
    // prevent the accordion row from activating
    event.stopPropagation();
    event.preventDefault();
  });
  $('div#accordion input.toggle').change(function(event) {
    var urlAction = this.checked ? 'publish' : 'unpublish';
    var id = this.id.split('_').pop();
    $.get('/listings/'+id+'/'+urlAction, function() {
      loadTally();
    });
  });

    $('.delete_listing_photo').live('ajax:success', function() {
        $(this).closest('div').fadeOut();
    });
    $('.delete_listing').live('ajax:success', function() {
        $(this).closest('div.listingexpand').fadeOut('slow', function() { $(this).remove() });
        loadTally();
    });

    // "contact us" and "support" dialogs
    var $contactUsDialog = $('#contact_us.dialog').dialog({
        resizable: false,
        autoOpen: false,
        modal: true,
        draggable: false,
        width: 500,
        title: 'Contact Us.',
        open: function(e) {
            $("#contact_us.dialog a").first().blur(); //workaround for http://bugs.jqueryui.com/ticket/4731
        }
    });
    $('a#contact_us').click(function(e) {
        $contactUsDialog.dialog('open');
        e.preventDefault();
    });

    var $supportDialog = $('#support.dialog').dialog({
            resizable: false,
            autoOpen: false,
            modal: true,
            draggable: false,
            width: 500,
            title: 'Get support.'
        });
    $('a#support').click(function(e) {
        e.preventDefault();
        $supportDialog.load('/support_tickets/new', function() {
            $supportDialog.dialog('open');
        });
    });
    $('input#get_support').click(function(e) {
        e.preventDefault();
        $contactUsDialog.dialog("close");
        $supportDialog.load('/support_tickets/new', function() {
            $supportDialog.dialog('open');
        });
    });
});
