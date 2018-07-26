/**
 * index.js
 */
$(function() {


	//初始化
	layui.use([ 'element' ], function() {
		var element = layui.element;
		var layer = layui.layer;

		var tabfilter = 'top-tab';
		var tab = $('.layui-tab[lay-filter=' + tabfilter + ']').eq(0);
		var tabcontent = tab.children('.layui-tab-content').eq(0);
		var tabtitle = tab.children('.layui-tab-title').eq(0);

		/**
		 * iframe自适应
		 */
		$(window).resize(function() {
			//设置顶部切换卡容器度
			tabcontent.height($(this).height() - 60 - 41 - 44); //头部高度 顶部切换卡高度 底部高度
			//设置顶部切换卡容器内每个iframe高度
			tabcontent.find('iframe').each(function() {
				$(this).height(tabcontent.height());
			});
		}).resize();

		// 监听Tab切换，以改变地址hash值
		element.on('tab(' + tabfilter + ')', function() {
			try {
				var id = this.getAttribute('lay-id');
			} catch (e) {
				var id = null;
			}
			if (id != null) {
				location.hash = tabfilter + '=' + id;
				ani(id);
			}
		});

		// 点击左侧链接的时候
		$('[tab-item]')
				.bind(
						'click',
						function() {
							var id = $(this).attr('data-id');
							var title = $(this).text();
							var url = $(this).attr('data-url');

							var iframes = $("[lay-id=" + id + "]").length;
							if (iframes == 0) {
								// 不存在的情况
								var iframe = '<iframe';
								iframe += ' src="' + url + '" iframe-id="'
										+ id + '"';
								iframe += ' style="width: 100%; height: '
										+ tabcontent.height()
										+ 'px; border: 0px;"';
								iframe += '></iframe>';
								//顶部切换卡新增一个卡片
								element.tabAdd(tabfilter, {
									'title' : title,
									'content' : iframe,
									'id' : id
								});
								ani(id);
							}
							// 添加记录
							location.hash = tabfilter + '=' + id;	
							// 改变tab
							element.tabChange(tabfilter, id);
						});

		// 顶部导航选择时
		$('[top-bar]').bind('click', function() {
			var id = $(this).attr('top-id');
			var lefts = $("[left-bar][left-id='" + id + "']").length;
			if (lefts != 0) {
				// top-bar有对应的left-bar的情况下
				$("[left-bar]").hide();
				$("[left-bar][left-id='" + id + "']").fadeIn(500);
			}
		});

		// iframe切换动画
		function ani(id) {
			$("[iframe-id=" + id + "]").hide();
			$("[iframe-id=" + id + "]").fadeIn(127);
		}
		
		
		/**
		 * 初始化点击侧边栏导航
		 */
		var layid = location.hash.replace(/^#top-tab=/, '');
		// layui-this
		if (layid) {
			$('.layui-side-scroll').find('[data-id=' + layid + ']').eq(0)
					.click(); // 根据传入的ID跳转
		} else {
			$('.layui-side-scroll').find('[data-url][data-id]').eq(0)
					.click(); // 点击第一个
		}


	});
})