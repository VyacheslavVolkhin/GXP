class ResponsiveMenu {
	constructor(menuContainer, menuSelector, moreItemSelector, dropdownSelector) {
		this.menuContainer = menuContainer;
		this.menu = menuContainer.querySelector(menuSelector);
		this.moreItem = this.menu.querySelector(moreItemSelector);
		this.dropdown = this.menu.querySelector(dropdownSelector);
		this.menuItems = Array.from(this.menu.children).filter(item => !item.classList.contains('menu-more'));
		
		this.resizeTimeout = null;
		this.RESIZE_DELAY = 100; // Задержка в мс
		
		this.init();
	}

	init() {
		// Выполняем первоначальный расчет после полной загрузки страницы
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				setTimeout(() => this.calculateMenu(), 100);
			});
		} else {
			setTimeout(() => this.calculateMenu(), 100);
		}
		
		window.addEventListener('resize', () => this.handleResize());
		window.addEventListener('load', () => this.calculateMenu()); // На случай если шрифты/изображения грузятся долго
	}

	handleResize() {
		// Очищаем предыдущий таймаут
		if (this.resizeTimeout) {
			clearTimeout(this.resizeTimeout);
		}
		
		// Устанавливаем новый таймаут
		this.resizeTimeout = setTimeout(() => {
			this.calculateMenu();
		}, this.RESIZE_DELAY);
	}

	calculateMenu() {
		// Временно показываем все элементы для корректного измерения
		this.menuItems.forEach(item => {
			item.style.display = 'block';
		});
		this.moreItem.style.display = 'block';
		
		// Очищаем выпадающий список
		this.dropdown.innerHTML = '';
		
		const containerWidth = this.menuContainer.offsetWidth;
		let totalWidth = 0;
		let itemsToMove = [];
		
		// Сначала измеряем ширину кнопки "Еще"
		const moreItemWidth = this.moreItem.offsetWidth;
		
		// Измеряем ширину всех элементов
		for (let i = 0; i < this.menuItems.length; i++) {
			const item = this.menuItems[i];
			const itemWidth = item.offsetWidth;
			
			// Проверяем, помещается ли элемент вместе с кнопкой "Еще"
			if (totalWidth + itemWidth + moreItemWidth <= containerWidth) {
				totalWidth += itemWidth;
			} else {
				// Все последующие элементы перемещаем в выпадающий список
				itemsToMove = this.menuItems.slice(i);
				break;
			}
		}
		
		// Скрываем элементы, которые не поместились
		itemsToMove.forEach(item => {
			item.style.display = 'none';
		});
		
		// Если есть элементы для перемещения - показываем кнопку "Еще"
		if (itemsToMove.length > 0) {
			this.moreItem.classList.add('active');
			this.populateDropdown(itemsToMove);
		} else {
			this.moreItem.classList.remove('active');
		}
	}

	populateDropdown(items) {
		items.forEach(item => {
			const clone = item.cloneNode(true);
			clone.style.display = 'block';
			this.dropdown.appendChild(clone);
		});
	}

	// Метод для принудительного пересчета (можно вызвать извне если нужно)
	refresh() {
		this.calculateMenu();
	}
}

// Инициализация меню
document.addEventListener('DOMContentLoaded', () => {
	const menuContainer = document.querySelector('.js-menu-more-box');
	if (menuContainer) {
		const responsiveMenu = new ResponsiveMenu(menuContainer, '.menu', '.menu-more', '.menu-more-ul');
		
		// Дополнительный пересчет после полной загрузки всех ресурсов
		window.addEventListener('load', () => {
			setTimeout(() => responsiveMenu.refresh(), 300);
		});
	}
});