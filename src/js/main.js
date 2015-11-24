!function(w, d, $) {

	var
		iAmSuper    	= false,
		iAmDouble	 	= false,
		tabWrapperClass = '.tab-bar',
		tabClass		= '.tab',
		tabClass    	= tabWrapperClass + ' ' +tabClass,
		$tabs       	= $(tabClass); //for cloneRandomTab

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

		$(tabWrapperClass).sortable({
				axis: "x",
				placeholder: "tab placeholder",
				sort: function( event, ui ) {
					$(tabClass).addClass('sorting-tab');
					ui.item.removeClass('moved');
					ui.item.addClass('sorting');
				},
				stop: function( event, ui ) {
					$(tabClass).removeClass('sorting-tab');
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
		var timer = setTimeout( function(){
			resizeTabBar();
			clearTimeout(timer);
		}, 200);
		
	}

	function onCloseClick(e){
		e.preventDefault();
		closeTabs($(e.target));
	}

	function onCloseAllClick(e){
		e.preventDefault();
		closeTabs($(tabClass));
	}

	function onKeepActiveClick(e){
		e.preventDefault();
		closeTabs($(tabClass),'.active');
	}

	function onKeepPinnedClick(e){
		e.preventDefault();
		closeTabs($(tabClass),'.pinned');
	}

	function closeTabs($target,exceptThis) {
		
		$target = chooseTarget($target);

		if (exceptThis) {
			$target = $target.not(exceptThis);
		}

		$target.addClass('closing');

		var timer = setTimeout( function(){
			$target.remove();
			var timer2 = setTimeout(function(){
				resizeTabBar();
				clearTimeout(timer2);
			},200);
			clearTimeout(timer);
		}, 500);
	}

	function onAddNewClick(e){
		e.preventDefault();
		cloneRandomTab();
	}

	function cloneRandomTab() {
		var
			randomIndex     = Math.floor(Math.random() * $(tabClass).length),
			$tabClone       = $tabs.eq(randomIndex);

		$tabClone.clone()
				 .removeClass('active pinned closing')
				 .appendTo($(tabWrapperClass));

		resizeTabBar();
	}

	function resizeTabBar(){
		var
			tabsWidth = 0;

		$(tabClass).each(function(){
			tabsWidth = ($(this).width() -32) + tabsWidth;
		});

		toggleCondenseClass(tabsWidth);

		$(tabWrapperClass).width(tabsWidth);
	}

	function toggleCondenseClass(tabsWidth){
		var
			containerWidth = $(tabWrapperClass).parent().width(),
			doubleWidth = containerWidth * 2;

		if (!tabsWidth) {
			tabsWidth = 0;
			$(tabClass).each(function(){
				tabsWidth = ($(this).width() -32) + tabsWidth;
			});
		}

		if(tabsWidth >= doubleWidth || iAmSuper && !iAmDouble) {
			$(tabWrapperClass)
				.addClass('super-condensed')
				.removeClass('condensed');
			
			iAmDouble = false;
			iAmSuper = true;
			
			console.log('super-condensed: ' + tabsWidth);

		} else if(tabsWidth > containerWidth && tabsWidth <= doubleWidth && !iAmSuper || iAmDouble ) {
			$(tabWrapperClass)
				.addClass('condensed')
				.removeClass('super-condensed');

			iAmDouble = true;
			iAmSuper = false;

			console.log('condensed: ' + tabsWidth);
		}else{
			$(tabWrapperClass)
				.removeClass('condensed super-condensed');

			iAmSuper = false;
			iAmDouble = false;

			console.log('normal: ' + tabsWidth);
		}
	}

	function chooseTarget($target) {
		if(!$target.hasClass(tabClass)) {
			$target = $target.closest(tabClass);
		}
		return $target;
	}

	
}(window, document, jQuery);