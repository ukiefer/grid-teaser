/**
 * @module grid-teaser
 *
 * @author Uwe Kiefer <uwe.kiefer.dev@gmail.com>
 */

class GridTeaser {
    constructor(el, obj = {}) {
        this.el = el
        this.options = obj
        this.items = $$.qsa('.grid-teaser__item', this.el)

        this.onResizeDebounde = $$.debounce(this.onResize.bind(this), 10)
    }

    initialize() {
        this.onResize()
        this.addEvents()
        $$.log('initialized module grid-teaser', this.el, this.options)
    }

    addEvents() {
        this.el.addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                this.toggleTeaser(e.target.closest('.grid-teaser__item'))
            }
        })
        window.addEventListener('resize', this.onResizeDebounde)
    }

    onResize() {
        let currentOffsetTop = this.items[0].offsetTop
        let columns = 0
        let pos = 0
        let row = 1
        let start = true

        this.el.style.setProperty('--_grid-teaser-item-width', `${Math.floor(this.items[0].clientWidth)}px`)

        this.items.forEach((item, i) => {
            item.removeAttribute('data-start')
            item.removeAttribute('data-end')
            if (columns === 0 && item.offsetTop > currentOffsetTop) {
                columns = i
            }
            if (item.offsetTop !== currentOffsetTop) {
                pos = 0
                row += 1
                start = true
                currentOffsetTop = item.offsetTop
            }
            pos += 1
            item.setAttribute('data-pos', pos)
            item.setAttribute('data-row', row)

            if (start) {
                item.setAttribute('data-start', '')
            }
            start = false
        })

        this.items.forEach((item, i) => {
            if ((i % columns) + 1 === columns) {
                item.setAttribute('data-end', '')
            }
        })

        this.el.setAttribute('data-columns', columns)
    }

    toggleTeaser(item) {
        const current = $$.qs('.on', this.el)
        if (current && current !== item) {
            if (current.dataset.row === item.dataset.row) {
                item.classList.add('stay')
                current.addEventListener('transitionend', () => {
                    item.classList.remove('stay')
                }, {once: true})
            }
            current.classList.remove('on', 'show-more', 'do-clip')
            $$.qs('[aria-expanded]', item).setAttribute('aria-expanded', 'false')
        }

        const isOn = item.classList.contains('on')

        item.classList.toggle('on')

        if (isOn) {
            item.addEventListener('transitionend', () => {
                item.classList.remove('show-more', 'do-clip')
            }, {once: true})
        } else {
            item.classList.add('show-more')
            setTimeout(() => {
                item.classList.add('do-clip')
            }, 1)
        }

        $$.qs('[aria-expanded]', item).setAttribute('aria-expanded', isOn ? 'true' : 'false')
    }
}

// Returns the constructor
export default GridTeaser
