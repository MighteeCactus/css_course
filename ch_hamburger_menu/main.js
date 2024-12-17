document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.ham-btn')
    const menu = document.querySelector('.main-menu')

    btn.addEventListener('click', () => {
        menu.classList.toggle('main-menu-visible')
    })
})
