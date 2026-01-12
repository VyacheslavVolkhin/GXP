document.addEventListener("DOMContentLoaded", function() {

	//fancybox
	Fancybox.bind("[data-fancybox]", {
		//settings
	});


	//textarea autoresize
	function autoResizeTextarea(textarea) {
		textarea.style.height = 'auto';
		const totalHeight = textarea.scrollHeight + 30;
		textarea.style.height = totalHeight + 'px';
	}
	const textareas = document.querySelectorAll('.auto-resize-textarea');
	if (textareas) {
		textareas.forEach(textarea => {
		autoResizeTextarea(textarea);
		textarea.addEventListener('input', function() {
			autoResizeTextarea(this);
		});
		window.addEventListener('load', () => autoResizeTextarea(textarea));
		window.addEventListener('resize', () => autoResizeTextarea(textarea));
		});
		function observeTextareas() {
			const observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
				if (mutation.addedNodes.length) {
					mutation.addedNodes.forEach(function(node) {
					if (node.nodeType === 1) { // Element node
						const newTextareas = node.querySelectorAll ? 
						node.querySelectorAll('.auto-resize-textarea') : [];
						if (node.matches && node.matches('.auto-resize-textarea')) {
						newTextareas.push(node);
						}
						newTextareas.forEach(textarea => {
						autoResizeTextarea(textarea);
						textarea.addEventListener('input', function() {
							autoResizeTextarea(this);
						});
						});
					}
					});
				}
				});
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		}
	}
	// Запускаем observer если нужно отслеживать динамически добавленные элементы
	// observeTextareas();


	//video
	const btnVideo = document.querySelectorAll(".js-btn-video");
	for (let i = 0; i < btnVideo.length; i++) {
	  btnVideo[i
		].addEventListener("click", function (e) {
		console.log('test')
		const videoURL = this.closest('.item-tile-video').dataset.video;
		this.closest('.item-tile-video').classList.add("active");
		this.closest('.item-tile-video').innerHTML += `<iframe width="100%" height="100%" src="${videoURL}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>`;
		e.preventDefault();
		});
	}

	//form input clear
	const inputFields = document.querySelectorAll(".frm-field-input .form-input");
	const clearButtons = document.querySelectorAll(".button-field-clear");
	function checkInputStatus(inputField) {
		const form = inputField.closest(".frm-field-input");
		if (inputField.value.length > 0) {
			form.classList.add("inp-valid");
		} else {
			form.classList.remove("inp-valid");
		}
	}
	if (inputFields) {
		inputFields.forEach(inputField => {
			checkInputStatus(inputField);
		});
		for (let i = 0; i < inputFields.length; i++) {
			const inputField = inputFields[i];
			
			inputField.addEventListener("input", function () {
				checkInputStatus(inputField);
			});
		}
		for (let i = 0; i < clearButtons.length; i++) {
			const clearButton = clearButtons[i];
			clearButton.addEventListener("click", function (event) {
				const input = this.closest(".frm-field-input").querySelector(".form-input");
				input.value = "";
				checkInputStatus(input);
				event.preventDefault();
			});
		}
	}


	//btn tgl and add
	let tglButtons = document.querySelectorAll('.js-btn-tgl')
	let addButtons = document.querySelectorAll('.js-btn-add')
	let buttonsTglOne = document.querySelectorAll('.js-btn-tgl-one');
	for (i = 0;i < tglButtons.length;i++) {
		tglButtons[i].addEventListener('click', function(e) {
			this.classList.contains('active') ? this.classList.remove('active') : this.classList.add('active')
			e.preventDefault()
			return false
		})
	}
	for (i = 0;i < addButtons.length;i++) {
		addButtons[i].addEventListener('click', function(e) {
			if (!this.classList.contains('active')) {
				this.classList.add('active');
				e.preventDefault()
				return false
			}
		})
	}
	buttonsTglOne.forEach(function(button) {
		button.addEventListener('click', function(e) {
			e.preventDefault();
			let toggleButtonsWrap = this.closest('.js-toggle-buttons');
	
			if (this.classList.contains('active')) {
				this.classList.remove('active');
			} else {
				toggleButtonsWrap.querySelectorAll('.js-btn-tgl-one').forEach(function(btn) {
					btn.classList.remove('active');
				});
				this.classList.add('active');
			}
			return false;
		});
	});


	//select
	const singleSelects = document.querySelectorAll('.frm-field-input select:not([multiple])');
	const multiSelects = document.querySelectorAll('.frm-field-input select[multiple]');
	if (singleSelects) {
		singleSelects.forEach(function(select) {
			new Choices(select, {
				searchEnabled: true,
				itemSelectText: '',
				shouldSort: false
			});
		});
	}
	if (multiSelects) {
		multiSelects.forEach(function(select) {
			new Choices(select, {
				searchEnabled: true,
				removeItemButton: true, 
				itemSelectText: '',
				shouldSort: false
			});
		});
	}

	//mask phone
	let snInput = document.querySelectorAll('.field-snils input');
	if (snInput) {
		let im = new Inputmask("9 9 9 9 9 9 9 9 9 9");
		im.mask(snInput);
	}
	let telInputs = document.querySelectorAll('input[type="tel"]');
	if (telInputs) {
		let im = new Inputmask("+7 (999) 999-99-99");
		im.mask(telInputs);
	}
    const phoneInput = document.querySelector('input[type="tel"]');
	const emailInput = document.querySelector('input[type="email"]');
    if (phoneInput) {
        const phoneContainer = phoneInput.closest('.frm-field-input');
        
        phoneInput.addEventListener('input', function() {
            let phone = this.value.replace(/[^\d+]/g, '');
            
            if (phone.startsWith('8')) {
                phone = '+7' + phone.slice(1);
            } else if (phone.startsWith('7') && !phone.startsWith('+7')) {
                phone = '+7' + phone.slice(1);
            }
            
            this.value = phone;
            const isValid = phone.replace(/\D/g, '').length === 11;
            
            updateValidationClass(phoneContainer, isValid);
        });
    }
    if (emailInput) {
        const emailContainer = emailInput.closest('.frm-field-input');
        
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            const isValid = validateEmail(email);
            
            updateValidationClass(emailContainer, isValid);
        });
        
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const isValid = validateEmail(email);
            
            updateValidationClass(emailContainer, isValid);
        });
    }
	function updateValidationClass(container, isValid) {
		const input = container.querySelector('input');
		const hasValue = input.value.trim().length > 0;
		const isAutofilled = input.matches(':-webkit-autofill');
		const shouldBeVerified = isValid || isAutofilled;
		if (shouldBeVerified) {
			container.classList.add('inp-verify');
			container.classList.remove('inp-error');
			if (isAutofilled) {
				container.classList.add('inp-autofilled');
			} else {
				container.classList.remove('inp-autofilled');
			}
		} else {
			container.classList.remove('inp-verify', 'inp-autofilled');
			
			if (hasValue) {
				container.classList.add('inp-error');
			} else {
				container.classList.remove('inp-error');
			}
		}
	}
    function validateEmail(email) {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

	//select toggle content visibility
	  const inputs = document.querySelectorAll(
		"input[data-content], input[data-content-check], input[data-content-uncheck]"
	  );
	
	  inputs.forEach(function (input) {
		toggleContent(input);
		});
	
	  inputs.forEach((input) => {
		input.addEventListener("click", function () {
		  document.querySelectorAll(".frm-content").forEach((content) => {
			content.classList.remove("active");
				});
	
		  inputs.forEach(toggleContent);
			});
		});
	
	  document.querySelectorAll(".btn[data-content]").forEach((button) => {
		button.addEventListener("click", function () {
		  let dataContent = this.getAttribute("data-content");
		  this.disabled = true;
		  document
			.querySelectorAll('.frm-content[data-content="' + dataContent + '"]')
			.forEach((content) => {
			  content.classList.add("active");
				});
		  return false;
			});
		});
	
	  function toggleContent(input) {
		let selectContent;
		if (input.checked) {
		  selectContent =
			input.getAttribute("data-content-check") ||
			input.getAttribute("data-content");
			} else {
		  selectContent = input.getAttribute("data-content-uncheck");
			}
		document
		  .querySelectorAll('.frm-content[data-content="' + selectContent + '"]')
		  .forEach((content) => {
			content.classList.add("active");
			});
		}



	//side toggle
	const buttons = document.querySelectorAll('.js-btn-side-toggle');
	buttons.forEach(button => {
		button.addEventListener('click', function(e) {
			document.body.classList.toggle('side-active');
			e.preventDefault();
			return false;
		});
	});


	//js tabs
	const tabsNav = document.querySelectorAll('.js-tabs-nav')
	const tabsBlocks = document.querySelectorAll('.js-tab-block')
	const tabsButtonTitle = document.querySelectorAll('.js-tab-title')
	const tabsButtonContent = document.querySelectorAll('.js-tab-content')
	function tabsActiveStart() {
		for (iTab = 0; iTab < tabsBlocks.length; iTab++) {
			if (tabsBlocks[iTab].classList.contains('active')) {
				tabsBlocks[iTab].classList.remove('active')
			}
		}
		for (i = 0; i < tabsNav.length; i++) {
			let tabsNavElements = tabsNav[i].querySelectorAll('[data-tab]')
			for (iElements = 0; iElements < tabsNavElements.length; iElements++) {
				if (tabsNavElements[iElements].classList.contains('active')) {
					let tabsNavElementActive = tabsNavElements[iElements].dataset.tab
					for (j = 0; j < tabsBlocks.length; j++) {
						if (tabsBlocks[j].dataset.tab.toString().indexOf(tabsNavElementActive) > -1) {
							console.log(tabsBlocks[j].dataset.tab.toString().indexOf(tabsNavElementActive))
							tabsBlocks[j].classList.add('active')
						}
					}
				}
			}
		}
		
	}
	for (i = 0; i < tabsButtonTitle.length; i++) {
		tabsButtonTitle[i].addEventListener('click', function (e) {
			this.classList.toggle('active')
			e.preventDefault()
			e.stopPropagation()
			return false
		})
	}
	for (i = 0; i < tabsNav.length; i++) {
		tabsNav[i].addEventListener('click', function (e) {
			if (e.target.closest('[data-tab]')) {
				let tabsNavElements = this.querySelector('[data-tab].active')
				tabsNavElements ? tabsNavElements.classList.remove('active') : false
				e.target.closest('[data-tab]').classList.add('active')
				tabsActiveStart()
				e.preventDefault()
				e.stopPropagation()
				return false
			}
		})
	}
	tabsActiveStart()

	//js popup wrap
	const togglePopupButtons = document.querySelectorAll('.js-btn-popup-toggle')
	const closePopupButtons = document.querySelectorAll('.js-btn-popup-close')
	const popupElements = document.querySelectorAll('.js-popup-wrap')
	const wrapWidth = document.querySelector('.wrap').offsetWidth
	const bodyElem = document.querySelector('body')
	function popupElementsClear() {
		document.body.classList.remove('menu-show')
		document.body.classList.remove('filter-show')
		document.body.classList.remove('search-show')
		popupElements.forEach(element => element.classList.remove('popup-right'))
	}
	function popupElementsClose() {
		togglePopupButtons.forEach(element => {
			if (window.innerWidth < 1024) {
				if (!element.closest('.no-close-mobile') && !element.closest('.no-close')) {
					element.classList.remove('active')
				}

			} else if  (window.innerWidth > 1023) {
				if (!element.closest('.no-close-desktop') && !element.closest('.no-close')) {
					element.classList.remove('active')
				}
			} else {
				if (!element.closest('.no-close')) {
					element.classList.remove('active')
				}
			}
			
		})
	}
	function popupElementsContentPositionClass() {
		popupElements.forEach(element => {
			let pLeft = element.offsetLeft
			let pWidth = element.querySelector('.js-popup-block').offsetWidth
			let pMax = pLeft + pWidth;
			if (pMax > wrapWidth) {
				element.classList.add('popup-right')
			} else {
				element.classList.remove('popup-right')
			}
		})
	}
	for (i = 0; i < togglePopupButtons.length; i++) {
		togglePopupButtons[i].addEventListener('click', function (e) {
			popupElementsClear()
			if (this.classList.contains('active')) {
				this.classList.remove('active')
			} else {
				popupElementsClose()
				this.classList.add('active')
				if (this.closest('.popup-menu-wrap')) {
					document.body.classList.add('menu-show')
				}
				if (this.closest('.popup-search-wrap')) {
					document.body.classList.add('search-show')
				}
				if (this.closest('.popup-filter-wrap')) {
					document.body.classList.add('filter-show')
				}
				popupElementsContentPositionClass()
			}
			e.preventDefault()
			e.stopPropagation()
			return false
		})
	}
	for (i = 0; i < closePopupButtons.length; i++) {
		closePopupButtons[i].addEventListener('click', function (e) {
			popupElementsClear()
			popupElementsClose()
			e.preventDefault()
			e.stopPropagation()
			return false;
		})
	}
	document.onclick = function (event) {
		if (!event.target.closest('.js-popup-block')) {
			popupElementsClear()
			popupElementsClose()
		}
	}
	popupElements.forEach(element => {
		if (element.classList.contains('js-popup-select')) {
			let popupElementSelectItem = element.querySelectorAll('.js-popup-block li a')
			if (element.querySelector('.js-popup-block .active')) {
				element.classList.add('select-active')
				let popupElementActive = element.querySelector('.js-popup-block .active').innerHTML
				let popupElementButton = element.querySelector('.js-btn-popup-toggle')
				popupElementButton.innerHTML = ''
				popupElementButton.insertAdjacentHTML('beforeend', popupElementActive)
			} else {
				element.classList.remove('select-active')
			}
			for (i = 0; i < popupElementSelectItem.length; i++) {
				popupElementSelectItem[i].addEventListener('click', function (e) {
					this.closest('.js-popup-wrap').classList.add('select-active')
					if (this.closest('.js-popup-wrap').querySelector('.js-popup-block .active')) {
						this.closest('.js-popup-wrap').querySelector('.js-popup-block .active').classList.remove('active')
					}
					this.classList.add('active')
					let popupElementActive = element.querySelector('.js-popup-block .active').innerHTML
					let popupElementButton = element.querySelector('.js-btn-popup-toggle')
					popupElementButton.innerHTML = ''
					popupElementButton.insertAdjacentHTML('beforeend', popupElementActive)
					popupElementsClear()
					popupElementsClose()
					if (!this.closest('.js-tabs-nav')) {
						e.preventDefault()
						e.stopPropagation()
						return false
					}
				})
			}
		}
	})



	// Popups
	let popupCurrent;
	let popupsList = document.querySelectorAll('.popup-outer-box');
	let popupTimer = null;

	document.querySelectorAll(".js-popup-open").forEach(function (element) {
		element.addEventListener("click", function (e) {
			document.querySelector(".popup-outer-box").classList.remove("active");
			document.body.classList.add("popup-open");
			if (popupTimer) {
			clearTimeout(popupTimer);
			popupTimer = null;
			}
			
			for (i = 0; i < popupsList.length; i++) {
			popupsList[i].classList.remove("active");
			}

			popupCurrent = this.getAttribute("data-popup");
			const popupElement = document.querySelector(`.popup-outer-box[id="${popupCurrent}"]`);
			popupElement.classList.add("active");

			const timerValue = this.getAttribute("data-popup-timer");
			if (timerValue) {
			const timerMs = parseInt(timerValue);
			if (!isNaN(timerMs) && timerMs > 0) {
				popupTimer = setTimeout(function() {
				document.body.classList.remove("popup-open");
				document.body.classList.remove("popup-open-scroll");
				popupElement.classList.remove("active");
				popupTimer = null;
				}, timerMs);
			}
			}

			e.preventDefault();
			e.stopPropagation();
			return false;
		});
	});

	document.querySelectorAll(".js-popup-close").forEach(function (element) {
		element.addEventListener("click", function (event) {
			if (popupTimer) {
			clearTimeout(popupTimer);
			popupTimer = null;
			}
			
			document.body.classList.remove("popup-open");
			for (i = 0; i < popupsList.length; i++) {
			popupsList[i].classList.remove("active");
			}
			event.preventDefault();
			event.stopPropagation();
		});
	});

	// document.querySelectorAll(".popup-outer-box").forEach(function (element) {
	// 	element.addEventListener("click", function (event) {
	// 		if (!event.target.closest(".popup-box")) {
	// 		if (popupTimer) {
	// 			clearTimeout(popupTimer);
	// 			popupTimer = null;
	// 		}
			
	// 		document.body.classList.remove("popup-open");
	// 		document.body.classList.remove("popup-open-scroll");
	// 		document.querySelectorAll(".popup-outer-box").forEach(function (e) {
	// 			e.classList.remove("active");
	// 		});
	// 		return false;
	// 		}
	// 	});
	// });



	//slider
	const sliderssection = document.querySelectorAll(".slider-section");
	
	sliderssection.forEach((container) => {
		const swiperEl = container.querySelector(".swiper");
		const nextEl = container.querySelector(".button-slider-section-next");
		const prevEl = container.querySelector(".button-slider-section-prev");
	
		if (!swiperEl) return;
	
		new Swiper(swiperEl, {
			loop: false,
			slidesPerGroup: 1,
			slidesPerView: 'auto',
			spaceBetween: 0,
			autoHeight: false,
			speed: 400,
			pagination: false,
			autoplay: false,
			navigation: {
				nextEl: nextEl,
				prevEl: prevEl,
			},
		});
	});

	//slider tiles
	const sliderstiles = document.querySelectorAll(".slider-tiles");
	
	sliderstiles.forEach((container) => {
		const swiperEl = container.querySelector(".swiper");
		const paginationEl = container.querySelector(".slider-tiles-pagination");
		const nextEl = container.querySelector(".button-slider-tiles-next");
		const prevEl = container.querySelector(".button-slider-tiles-prev");
	
		if (!swiperEl) return;
	
		new Swiper(swiperEl, {
			loop: false,
			slidesPerGroup: 1,
			slidesPerView: 1,
			spaceBetween: 0,
			autoHeight: false,
			speed: 400,
			pagination:false,
			autoplay: false,
			navigation: {
				nextEl: nextEl,
				prevEl: prevEl,
			},
		});
	});

})

