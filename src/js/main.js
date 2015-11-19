!function(w, d, $) {

	var
		iAmSuper    = false,
		iAmDouble   = false,
		tabClass    = '.tab',
		$tabs       = $(tabClass); //for cloneRandomTab

	$(d).on('ready', function() {
		sortTabs();
		bindEvents();
	});

	function bindEvents() {
		$(d).on('click', '.add-new', onAddNewClick);
		$(d).on('click', '.close-all', onCloseAllClick);
		$(d).on('click', '.close-all-but-active', onKeepActiveClick);
		$(d).on('click', '.close-all-but-pinned', onKeepPinnedClick);

		//Tab clicks
		$(d).on('click', '.tab-content', onTabContentClick);
		$(d).on('click', '.close', onCloseClick);
		$(d).on('click', '.pin', onPinClick);
	}

	function sortTabs(){
		var
			$tabBar = $('.tab-bar');

		$tabBar.sortable({
				axis: "x",
				placeholder: "tab placeholder",
				sort: function( event, ui ) {
					$tabBar.addClass('sorting-tab');
					ui.item.removeClass('moved');
					ui.item.addClass('sorting');
				},
				stop: function( event, ui ) {
					$tabBar.removeClass('sorting-tab');
					ui.item.addClass('moved');
					ui.item.attr('style','');
					ui.item.removeClass('sorting');
				},
		});
	
		$(tabClass).disableSelection();
	}

	function onPinClick(e){
		e.preventDefault();
		togglePinned($(e.target));
	}

	function togglePinned($target) {
		$target = chooseTarget($target);
		$target.toggleClass('pinned');
	}

	function onTabContentClick(e){
		e.preventDefault();
		setActiveTab($(e.target));
	}

	function setActiveTab($target) {
		$(tabClass).removeClass('active');

		$target = chooseTarget($target);

		$target.addClass('active');
		resizeTabBar();
	}

	function onCloseClick(e){
		e.preventDefault();
		closeTab($(e.target));
	}

	function closeTab($target) {
		$target = chooseTarget($target);

		$target.addClass('closing');

		var timer = setTimeout( function(){
			$target.remove();
			clearTimeout(timer);
		}, 500);

		resizeTabBar();
	}

	function onAddNewClick(e){
		e.preventDefault();
		cloneRandomTab();
	}

	function cloneRandomTab() {
		var
			randomIndex     = Math.floor(Math.random() * $(tabClass).length),
			$tabClone       = $tabs.eq(randomIndex),
			$tabBar         = $('.tab-bar');

		$tabClone.clone()
				.removeClass('active pinned closing')
				.appendTo($tabBar);

		resizeTabBar();
	}

	function onCloseAllClick(e){
		e.preventDefault();
		$('.tab').addClass('closing');
		setTimeout(function(){
			$('.tab').remove();
			cleanTabBar();
			//resizeTabBar();
		},500);
	}

	function onKeepActiveClick(e){
		e.preventDefault();
		keepActiveTab();
	}

	function keepActiveTab() {
		$(tabClass + ':not(.active)').addClass('closing');

		var timer = setTimeout(function(){
			$(tabClass + ':not(.active)').remove();

			if (!iAmSuper || !iAmDouble) {
				cleanTabBar();
				resizeTabBar();
			}
			clearTimeout(timer);
		},500);
	}

	function onKeepPinnedClick(e){
			e.preventDefault();
			$('.tab:not(.pinned)').addClass('closing');
			setTimeout(function(){
				$('.tab:not(.pinned)').remove();
				if (!iAmSuper || !iAmDouble) {
					cleanTabBar();
					resizeTabBar();
				}
			},500);
	}

	function cleanTabBar(){
		$tabBar.removeClass('condensed super-condensed');
		iAmSuper = false;
		iAmDouble = false;
	}

	function resizeTabBar(){
		var
			viewportWidth = $(w).width(),
			tabsWidth = ($('.tab').width() - 32) * $('.tab').length,
			doubleWidth = viewportWidth * 2;

		/*var tabsWidth = 0;
		$('.tab').each(function(){
			tabsWidth = tabsWidth + ($(this).width() - 32);
		});*/

		/*console.log('normal: ' + tabsWidth);


		if(tabsWidth >= doubleWidth || iAmSuper) {
			$tabBar.addClass('super-condensed').removeClass('condensed');
			console.log('double: ' + tabsWidth);
			iAmSuper = true;
		} else if(tabsWidth > viewportWidth && tabsWidth < doubleWidth && !iAmSuper) {
			$tabBar.addClass('condensed').removeClass('super-condensed');
			console.log('condensed: ' + tabsWidth);
			iAmDouble = true;
		}else{
			iAmSuper = false;
			iAmDouble = false;
		}*/
		
		$('.tab-bar').width(tabsWidth);
	}

	function chooseTarget($target) {
		if(!$target.hasClass(tabClass)) {
			$target = $target.closest(tabClass);
		}
		return $target;
	}

	
}(window, document, jQuery);