document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header')


    function toogleHeaderTransparency(evt) {
        const headerY = header.getBoundingClientRect().height
        if (window.scrollY > headerY)
        {
            header.classList.add('transparent')
        } else {
            header.classList.remove('transparent')
        }
    }

    window.addEventListener('scroll', toogleHeaderTransparency)
})
