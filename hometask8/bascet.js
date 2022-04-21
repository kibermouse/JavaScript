'use strict';

const bascetEl = document.querySelector('.basket');
const allItems = document.querySelector('.featuredItems');
const bascetImgEl = document.querySelector('.cartIconWrap');
const bascetCounter = document.querySelector('.cartIconWrap span');
const bascetTotalEl = document.querySelector('.basketTotal');
const bascetTotalCount = document.querySelector('.basketTotalValue');

//Обработчик, показывающий/скрывающий окно корзины
bascetImgEl.addEventListener('click', () => {
    bascetEl.classList.toggle('hidden')
});

//Объект для хранения элементов корзины
const bascetMap = new Map();

//Обработчик, добавляющий элемент в корзину по клику на товар
allItems.addEventListener('click', event => {
    if (!event.target.closest('.addToCard')) {
        return;
    }
    const nowItemEl = event.target.closest('.featuredItem');
    const id = +nowItemEl.dataset.id;
    const name = nowItemEl.dataset.name;
    const price = +nowItemEl.dataset.price;

    addToCard(id, name, price);
    bascetCounter.textContent = getTotalBascetCount();
    bascetTotalCount.textContent = getTotalBascetPrice().toFixed(2);
    renderProductInBascet(id);
});

/**
 * Функция, создающая элемент в объекте bascetMap при добавлении товара
 *  в корзину. Также следит за увеличением счетчика count внутри объекта при 
 * повторном добавлении товара.
 * 
 * @param {*} id - уникальный номер товара
 * @param {*} name - название товара
 * @param {*} price - цена товара
 */
function addToCard(id, name, price) {
    if (!bascetMap.has(id)) {
        bascetMap.set(id, { id, name, price, count: 0 });
    }
    bascetMap.get(id).count++;
}

/**
 * Функция без аргументов подсчитывает общее количество товаров, и возвращает
 *  его.
 */
function getTotalBascetCount() {
    return [...bascetMap.values()].reduce((acc, el) => acc += el.count, 0);
}

/**
 * Функция без аргументов подсчитывает общую стоимость всех товаров, и
 *  возвращает ее.
 */
function getTotalBascetPrice() {
    return [...bascetMap.values()]
        .reduce((acc, el) => acc += el.price * el.count, 0);
}

/**
 * Функция принимает html-разметку выбранного элемента в корзине и отдельно 
 * меняет его количество и общую цену в соответствии с данными этого товара в 
 * объекте bascetMap.
 * @param {*} elemBascetMap - html-разметка товара в корзине
 * @param {*} itemNow - данные о товаре в объекте bascetMap
 */
function getBascetItemCountAndPrice(elemBascetMap, itemNow) {
    elemBascetMap
        .querySelector('.productCount').textContent = itemNow.count;
    elemBascetMap
        .querySelector('.productTotalRow')
        .textContent = itemNow.count * itemNow.price;
}

/**
 * Функция обновляет данные о дабавленном товаре в корзине, а при его 
 * отсутствии в корзине вызывает функцию renderNewProductInBascet.
 * @param {*} id - уникальный номер товара
 * @returns Если html-разметка для этого товара уже есть, происходит выход 
 * из функции.
 */
function renderProductInBascet(id) {
    const itemNow = bascetMap.get(id);
    const bascetRowEl = bascetEl
        .querySelector(`.basketRow[data-productId="${id}"]`);
    if (!bascetRowEl) {
        renderNewProductInBascet(id, itemNow);
        return;
    }
    getBascetItemCountAndPrice(bascetRowEl, itemNow);
}

/**
 * Фунция добавляет html-разметку товара в корзину (При первом добавлении).
 * @param {*} productId - уникальный номер товара
 * @param {*} itemNow - данные о товаре в объекте bascetMap
 */
function renderNewProductInBascet(productId, itemNow) {
    const productRow = `
    <div class="basketRow" data-productId="${productId}">
        <div>${itemNow.name}</div>
        <div>
            <span class="productCount">
            ${itemNow.count}
            </span> шт
        </div>
        <div>${itemNow.price}</div>
        <div>
            $<span class="productTotalRow">
            ${itemNow.count * itemNow.price}
            </span> шт
        </div>
        <div class="removeItem"></div>
    </div>`;
    bascetTotalEl.insertAdjacentHTML('beforebegin', productRow);
}

/*Обработчик при клике удаляет товары из корзины по одному. Если товар удален 
полностью, удаляет его html-разметку из корзины.
*/
bascetEl.addEventListener('click', event => {
    if (!event.target.classList.contains('removeItem')) {
        return;
    }
    const nowItemRemEl = event.target.closest('.basketRow');
    const id = +nowItemRemEl.dataset.productid;
    const itemNow = bascetMap.get(id);

    itemNow.count--;
    getBascetItemCountAndPrice(nowItemRemEl, itemNow);
    if (itemNow.count === 0) {
        nowItemRemEl.remove();
    }
    bascetCounter.textContent = getTotalBascetCount();
    bascetTotalCount.textContent = getTotalBascetPrice().toFixed(2);
})