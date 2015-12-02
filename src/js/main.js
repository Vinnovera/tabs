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
		//$(d).on('click', 'button.toggle-context-menu', onContextMenuClick);

		//Tab clicks
		$(d).on('click', '.tab-content', onTabContentClick);
		$(d).on('click', '.close', onCloseClick);
		$(d).on('click', '.pin', onPinClick);
	}

	function sortTabs(){

		$(tabWrapperClass).sortable({
				axis: "x",
				placeholder: "tab placeholder",
				containment: "parent",
				delay: 180,
				sort: function( event, ui ) {
					$(tabWrapperClass).addClass('sorting-tab');
					ui.item.removeClass('moved');
					ui.item.addClass('sorting');
				},
				stop: function( event, ui ) {
					$(tabWrapperClass).removeClass('sorting-tab');
					ui.item.addClass('moved');
					ui.item.attr('style','');
					ui.item.removeClass('sorting');
				},
				update: function (event, ui){
					setTabIndexOrder();
				}
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
		updatePinCount();
	}

	function updatePinCount(){
		var $pinBtn = $('.close-all-but-pinned');

		$pinBtn.find('span').text(countPins);
		
		if (countPins() == 0 || $(tabClass).not('.pinned').length == 0) {
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
		slideTabBar(2);
	}

	function onPrevClick(e){
		slideTabBar(-2);
	}

	function slideTabBar(steps){
		var 
			tabWidth = $(tabClass).width()-32,
			currentTransformPos,
			targetPos,
			maxTarget = slideToTarget($(tabClass).last(), true) - tabWidth,
			tabsWidth = 0,
			containerWidth = $(tabWrapperClass).parent().width();
			

		$(tabClass).each(function(){
			tabsWidth = ($(this).width() -32) + tabsWidth;
		});
		
		currentTransformPos = $(tabWrapperClass).css('transform').split(/[()]/)[1];
		currentTransformPos = currentTransformPos.split(',')[4];
		targetPos = parseInt(currentTransformPos);

		targetPos = targetPos - (tabWidth*steps);

		if(steps < 0){
			steps = steps *=-1;
			targetPos = targetPos + (tabWidth*steps);
		}

		

		if (targetPos > 0) {
			targetPos = 0;
		}

		if (maxTarget > 0) {
			maxTarget = 0;
		}

			console.log('target: '+targetPos);
			console.log('max:' + maxTarget);

		if (tabsWidth >= containerWidth && maxTarget <= targetPos) {
			positionTabBar(targetPos);
			
		}else if(tabsWidth <= containerWidth){
			slideToTarget($(tabClass).last());
			console.log('you dont need no scroll');
		}else{
			
			slideToTarget($(tabClass).last());
			console.log('sliiiide');
		}

	}

	function slideToTarget($target, returnX){

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

		if (!returnX) {
			if (tabsWidth >= containerWidth && targetXpos < 0) {
				
				positionTabBar(targetXpos);
				console.log('slidetotarget:' + targetXpos);

			} else if(!tabIndex){

				positionTabBar(0);

			}
		
		}else{

			return targetXpos;

		}


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
		removeCondenseClass();
	}

	function onKeepActiveClick(e){
		e.preventDefault();
		closeTabs($(tabClass),'.active');
		removeCondenseClass();
	}

	function onKeepPinnedClick(e){
		e.preventDefault();
		closeTabs($(tabClass),'.pinned');
		if ($(tabClass + '.pinned').length < 6) {
			removeCondenseClass();
		}
	}

	function closeTabs($target,exceptThis) {
		
		$target = chooseTarget($target);

		if (exceptThis) {
			$target = $target.not(exceptThis);
		}

		$target.addClass('closing');
		
		setTabIndexOrder('.closing');
		
		
		var timer = setTimeout( function(){
			$target.remove();
			resizeTabBar();
			updatePinCount();
			clearTimeout(timer);
		}, 400);
	}

	function onAddNewClick(e){
		e.preventDefault();
		cloneRandomTab();
		updatePinCount();
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

	function setTabIndexOrder(exceptThis){
		$(tabClass).not(exceptThis).each(function(index){
			$(this).data('index', index);
		});
	}

	function resizeTabBar(){
		var
			tabsWidth = 0;

		$(tabClass).not('.closing').each(function(){
			tabsWidth = ($(this).width() -32) + tabsWidth;
		});

		toggleCondenseClass(tabsWidth);

		var timer = setTimeout( function(){

				slideToTarget();
	
			clearTimeout(timer);
		}, 50);

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
			removeCondenseClass();

			//console.log('normal: ' + tabsWidth);
		}
	}

	function removeCondenseClass(){
			$(tabWrapperClass)
				.removeClass('condensed super-condensed');

			iAmSuper = false;
			iAmDouble = false;
	}

	function chooseTarget($target) {
		if(!$target.hasClass(tabClass)) {
			$target = $target.closest(tabClass);
		}
		return $target;
	}

	
}(window, document, jQuery);