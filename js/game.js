// Unreal Engine HTML5 游戏控制脚本

// 配置项
const CONFIG = {
	loadingText: {
		initial: '正在加载游戏...',
		loading: '正在加载资源...',
		complete: '准备就绪！'
	},
	autoHideLoading: true,
	hideDelay: 800
};

// 加载进度控制
const progressBar = document.getElementById('progress-bar');
const loadingScreen = document.getElementById('loading-screen');
const loadingText = document.querySelector('.loading-text');

// 设置加载监听
function setupLoadMonitoring() {
	if (!window.Module) {
		window.Module = {};
	}

	// 保存原始的monitorRunDependencies
	let originalMonitor = window.Module.monitorRunDependencies;

	window.Module.monitorRunDependencies = function(left, total) {
		if (originalMonitor) {
			originalMonitor(left, total);
		}

		if (total > 0) {
			let percent = ((total - left) / total) * 100;
			progressBar.style.width = percent + '%';
			loadingText.textContent = CONFIG.loadingText.loading + ' ' + Math.round(percent) + '%';
		}
	};

	// 监听画布显示
	const canvasObserver = new MutationObserver(function(mutations) {
		const canvas = document.getElementById('canvas');
		if (canvas && canvas.style.display !== 'none') {
			progressBar.style.width = '100%';
			loadingText.textContent = CONFIG.loadingText.complete;
			
			if (CONFIG.autoHideLoading) {
				setTimeout(() => {
					loadingScreen.classList.add('hidden');
				}, CONFIG.hideDelay);
			}
			
			canvasObserver.disconnect();
		}
	});

	const mainarea = document.getElementById('mainarea');
	if (mainarea) {
		canvasObserver.observe(mainarea, { childList: true, subtree: true, attributes: true });
	}
}

// 全屏功能
function setupFullscreen() {
	const fullscreenBtn = document.getElementById('fullscreen_request');
	
	if (fullscreenBtn) {
		fullscreenBtn.addEventListener('click', function() {
			const elem = document.documentElement;
			
			if (!document.fullscreenElement && !document.webkitFullscreenElement && 
				!document.mozFullScreenElement && !document.msFullscreenElement) {
				if (elem.requestFullscreen) {
					elem.requestFullscreen();
				} else if (elem.webkitRequestFullscreen) {
					elem.webkitRequestFullscreen();
				} else if (elem.mozRequestFullScreen) {
					elem.mozRequestFullScreen();
				} else if (elem.msRequestFullscreen) {
					elem.msRequestFullscreen();
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
		});
	}
}

// 初始化
function init() {
	setupLoadMonitoring();
	setupFullscreen();
}

// 立即初始化
init();
