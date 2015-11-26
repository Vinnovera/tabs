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
		positionTabBar(0);
		resizeTabBar();
	});

	function bindEvents() {
		$(d).on('click', '.add-new', onAddNewClick);
		$(d).on('click', '.close-all', onCloseAllClick);
		$(d).on('click', '.close-all-but-active', onKeepActiveClick);
		$(d).on('click', '.close-all-but-pinned', onKeepPinnedClick);
		$(d).on('click', 'button.navigate-right', onNextClick);
		$(d).on('click', 'button.navigate-left', onPrevClick);
		$(d).on('click', 'button.toggle-context-menu', onContextMenuClick);

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
		var $pinBtn = $('.close-all-but-pinned');

		$target = chooseTarget($target);
		$target.toggleClass('pinned');
		$pinBtn.find('span').text(countPins);
		
		if (countPins() == 0) {
			$pinBtn.addClass('hide');
		}else{
			$pinBtn.removeClass('hide');
		}
	}

	function countPins(){
		return $(tabClass + '.pinned').length;
	}

	function onTabContentClick(e){
		e.preventDefault();
		setActiveTab($(e.target),false);
	}

	function setActiveTab($target,slide) {

		$target = chooseTarget($target);

		$(tabClass).removeClass('active');
		$target.addClass('active');

		var timer = setTimeout( function(){
			if (slide) {
				slideToTarget($target);
			}
			clearTimeout(timer);
		}, 200);
		
	}

	function onContextMenuClick(e){
		var
			targetId 	= $(this).attr('aria-contextmenu'),
			$target 	= $(targetId),
			offset 		= $(e.target).offset();

		openContextMenu($target,offset);

		//console.log($target);
	}

	function openContextMenu($target, offset){

		$target.css({
			"top": offset.top,
			"right": offset.right
		});
		$target.toggleClass('open');

	}
	function onNextClick(e){
		slideTabBar('right');
	}

	function onPrevClick(e){
		slideTabBar('left');
	}

	function slideToTarget($target){

		if ($target) {
			$target = chooseTarget($target);
		}else if($(tabClass + '.active').length > 0){
			$target = $(tabClass + '.active');
		}else if($(tabClass + '.pinned').length > 0){
			$target = $(tabClass + '.pinned').eq(0);
		}

		if (!$target) {
			positionTabBar(0);
			return false;
		}

		var 
			tabIndex = $target.data('index'),
			tabsWidth = 0,
			containerWidth = $(tabWrapperClass).parent().width(),
			targetXpos = 0;

		$(tabClass).each(function(){
			tabsWidth = ($(this).width() -32) + tabsWidth;
		});

		$(tabClass).each(function(index){
			if (index < tabIndex) {
				targetXpos = ($(this).width() -32) + targetXpos;
			}
		});

		targetXpos = containerWidth - (targetXpos + $target.width() );

		if (tabsWidth >= containerWidth && targetXpos < 0) {
			
			positionTabBar(targetXpos);

		} else if(!tabIndex){

			positionTabBar(0);
		}


	}

	function slideTabBar(direction){
		var 
			tabWidth = $(tabClass).width() -32,
			currentTransformPos,
			targetPos;
		
		currentTransformPos = $(tabWrapperClass).css('transform').split(/[()]/)[1];
		currentTransformPos = currentTransformPos.split(',')[4];
		targetPos = parseInt(currentTransformPos);

		if (direction == 'right') {
			targetPos = (targetPos) - (tabWidth*3);
		}else if(direction == 'left'){
			targetPos = (targetPos) + (tabWidth*3);
		}else{
			console.log('no direction set');
			return false;
		}

		if (targetPos > 0) {
			targetPos = 0;
		}

		console.log(targetPos);
		positionTabBar(targetPos);

	}

	function positionTabBar(xpos){
		$(tabWrapperClass).css('transform', 'translateX('+xpos+'px)');
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
		
		$(tabClass).not('.closing').each(function(index){
				$(this).data('index',index);
		});
		
		
		var timer = setTimeout( function(){
			$target.remove();
			resizeTabBar();
			clearTimeout(timer);
		}, 400);
	}

	function onAddNewClick(e){
		e.preventDefault();
		cloneRandomTab();
	}

	function cloneRandomTab() {
		var
			randomIndex     = Math.floor(Math.random() * $tabs.length-1),
			$tabClone       = $tabs.eq(randomIndex),
			tabIndex		= $(tabClass).length;

		

		var $newTab = $tabClone.clone()
						.addClass('active')
						.removeClass('pinned closing')
						.attr('data-index', tabIndex)
						.appendTo($(tabWrapperClass));

		setActiveTab($newTab,false);
		
		resizeTabBar();
	}

	function resizeTabBar(){
		var
			tabsWidth = 0;

		$(tabClass).not('.closing').each(function(){
			tabsWidth = ($(this).width() -32) + tabsWidth;
		});

		console.log(tabsWidth);

		//toggleCondenseClass(tabsWidth);
		slideToTarget();

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
			
			//console.log('super-condensed: ' + tabsWidth);

		} else if(tabsWidth > containerWidth && tabsWidth <= doubleWidth && !iAmSuper || iAmDouble ) {
			$(tabWrapperClass)
				.addClass('condensed')
				.removeClass('super-condensed');

			iAmDouble = true;
			iAmSuper = false;

			//console.log('condensed: ' + tabsWidth);
		}else{
			$(tabWrapperClass)
				.removeClass('condensed super-condensed');

			iAmSuper = false;
			iAmDouble = false;

			//console.log('normal: ' + tabsWidth);
		}
	}

	function chooseTarget($target) {
		if(!$target.hasClass(tabClass)) {
			$target = $target.closest(tabClass);
		}
		return $target;
	}

	
}(window, document, jQuery);