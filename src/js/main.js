$(function() {

	var tabBar = $('.tab-bar'),
		tabs = $('.tab'),
		addNew = $('#add-new');

	
	function tabClick(){
		var tabs = $('.tab');

		tabs.each(function(){
				var me = $(this),
					content = me.find('.tab-content'),
					close = me.find('.close'),
					pin = me.find('.pin');

				content.on('click', function(){
					tabs.removeClass('active');
					me.addClass('active');
				});

				close.on('click', function(){
					me.remove();
				});

				pin.on('click', function(){
					me.toggleClass('pinned');
				});
		});
	}

	function resizeTabBar(){
		var tabsWidth = tabs.outerWidth() * tabs.length;
		tabBar.width(tabsWidth);
	}

	function addnewClick(){
		addNew.on('click', function(){
			var randomIndex = Math.floor(Math.random() * tabs.length),
				tabClone = tabs.eq(randomIndex);
				
			tabClone.clone().removeClass('active').appendTo( '.tab-bar' );
			tabClick();
			resizeTabBar();
		});
	}

	function tabInit(){
		
		$( '.tab-bar' ).sortable({
				axis: "x"
				/*sort: function( event, ui ) {
					console.log(ui);
				}*/
		});
	
		tabs.disableSelection();
		tabClick();
		addnewClick();

	}

	tabInit();




	
});