document.addEventListener('DOMContentLoaded', function() {
  // Проверяем наличие таблицы на странице
  const tableWrapper = document.querySelector('.tbl-outer-wrap');
  const prevButton = document.querySelector('.tbl-button-prev');
  const nextButton = document.querySelector('.tbl-button-next');
  
  // Если таблица или кнопки не найдены, выходим
  if (!tableWrapper || !prevButton || !nextButton) {
    console.log('Таблица или элементы управления не найдены на странице');
    return;
  }
  
  console.log('Инициализация прокрутки таблицы...');
  
  // Функция для получения ширины одного столбца
  function getColumnWidth() {
    // Пробуем получить ширину через col элементы
    const columns = document.querySelectorAll('col.col-main');
    if (columns.length > 0) {
      const firstColumn = columns[0];
      if (firstColumn.offsetWidth > 0) {
        return firstColumn.offsetWidth;
      }
    }
    
    // Альтернативный способ: ширина первой ячейки в теле таблицы
    const firstCell = document.querySelector('tbody td');
    if (firstCell && firstCell.offsetWidth > 0) {
      return firstCell.offsetWidth;
    }
    
    // Если не удалось определить, используем вычисленную ширину
    const table = document.querySelector('.tbl-outer-wrap table');
    if (table) {
      const mainColumns = table.querySelectorAll('thead th:not(:first-child)');
      if (mainColumns.length > 0) {
        return mainColumns[0].offsetWidth;
      }
    }
    
    // Значение по умолчанию
    return 300;
  }
  
  // Функция проверки возможности прокрутки и обновления состояния кнопок
  function checkScrollability() {
    const scrollLeft = tableWrapper.scrollLeft;
    const scrollWidth = tableWrapper.scrollWidth;
    const clientWidth = tableWrapper.clientWidth;
    
    // Добавляем небольшой допуск для округления
    const epsilon = 5;
    
    // Проверяем возможность прокрутки влево
    if (scrollLeft <= epsilon) {
      prevButton.classList.add('button-disabled');
    } else {
      prevButton.classList.remove('button-disabled');
    }
    
    // Проверяем возможность прокрутки вправо
    if (Math.abs(scrollLeft + clientWidth - scrollWidth) <= epsilon) {
      nextButton.classList.add('button-disabled');
    } else {
      nextButton.classList.remove('button-disabled');
    }
    
    console.log(`Прокрутка: scrollLeft=${scrollLeft}, clientWidth=${clientWidth}, scrollWidth=${scrollWidth}`);
  }
  
  // Функция для прокрутки вправо
  function scrollNext() {
    const columnWidth = getColumnWidth();
    const scrollLeft = tableWrapper.scrollLeft;
    const scrollWidth = tableWrapper.scrollWidth;
    const clientWidth = tableWrapper.clientWidth;
    
    console.log(`Прокрутка вправо: columnWidth=${columnWidth}, scrollLeft=${scrollLeft}, maxScroll=${scrollWidth - clientWidth}`);
    
    // Проверяем, можно ли прокрутить дальше
    if (scrollLeft + clientWidth < scrollWidth - 10) {
      tableWrapper.scrollBy({
        left: columnWidth,
        behavior: 'smooth'
      });
      
      // Обновляем состояние кнопок после анимации
      setTimeout(checkScrollability, 350);
    } else {
      // Если нельзя прокрутить, добавляем класс disabled
      nextButton.classList.add('button-disabled');
    }
  }
  
  // Функция для прокрутки влево
  function scrollPrev() {
    const columnWidth = getColumnWidth();
    const scrollLeft = tableWrapper.scrollLeft;
    
    console.log(`Прокрутка влево: columnWidth=${columnWidth}, scrollLeft=${scrollLeft}`);
    
    // Проверяем, можно ли прокрутить назад
    if (scrollLeft > 10) {
      tableWrapper.scrollBy({
        left: -columnWidth,
        behavior: 'smooth'
      });
      
      // Обновляем состояние кнопок после анимации
      setTimeout(checkScrollability, 350);
    } else {
      // Если нельзя прокрутить, добавляем класс disabled
      prevButton.classList.add('button-disabled');
    }
  }
  
  // Добавляем обработчики событий для кнопок
  prevButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Клик на кнопку "Назад"');
    
    // Проверяем, не отключена ли кнопка
    if (!this.classList.contains('button-disabled')) {
      scrollPrev();
    } else {
      console.log('Кнопка "Назад" отключена');
    }
  });
  
  nextButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Клик на кнопку "Вперед"');
    
    // Проверяем, не отключена ли кнопка
    if (!this.classList.contains('button-disabled')) {
      scrollNext();
    } else {
      console.log('Кнопка "Вперед" отключена');
    }
  });
  
  // Обработчик события прокрутки таблицы
  tableWrapper.addEventListener('scroll', function() {
    // Используем requestAnimationFrame для оптимизации
    requestAnimationFrame(checkScrollability);
  });
  
  // Обработчики для клавиш клавиатуры
  document.addEventListener('keydown', function(e) {
    // Проверяем, активна ли таблица или её элементы
    const activeElement = document.activeElement;
    const isTableRelated = activeElement && (
      tableWrapper.contains(activeElement) || 
      prevButton.contains(activeElement) || 
      nextButton.contains(activeElement) ||
      activeElement.closest('.matrix-box')
    );
    
    if (isTableRelated) {
      if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        if (!prevButton.classList.contains('button-disabled')) {
          scrollPrev();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        if (!nextButton.classList.contains('button-disabled')) {
          scrollNext();
        }
      }
    }
  });
  
  // Обработчик изменения размера окна
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      console.log('Изменение размера окна, обновление состояния кнопок');
      checkScrollability();
    }, 150);
  });
  
  // Инициализация состояния кнопок при загрузке
  console.log('Инициализация состояния кнопок...');
  checkScrollability();
  
  // Дополнительная проверка после полной загрузки контента
  setTimeout(function() {
    console.log('Дополнительная проверка после загрузки...');
    checkScrollability();
  }, 1000);
  
  // Проверяем состояние после полной загрузки всех ресурсов
  window.addEventListener('load', function() {
    setTimeout(checkScrollability, 500);
  });
  
  // Для отладки: логируем начальные параметры
  console.log('Таблица инициализирована успешно');
  console.log('Ширина столбца:', getColumnWidth());
  console.log('Ширина контейнера:', tableWrapper.clientWidth);
  console.log('Полная ширина таблицы:', tableWrapper.scrollWidth);
});