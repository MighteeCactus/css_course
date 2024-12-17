import Api from './api.js'
import JournalDay from './journal.js'


class App {

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupBackToTop()
            this.initRecords()
        })
    }

    initRecords() {

        const main = document.querySelector('main')
        main.innerHTML = ''

        const records = Api.getRecords()

        const today = new Date()
        today.setHours(0,0,0,0)
        const ts = today.getTime() / 1000
        if (records.findIndex(r => r.timestamp === ts) === -1) {
            records.unshift(new JournalDay({timestamp: ts, entry: ""}))
        }

        for (let i in records)
        {
            const jd = new JournalDay(records[i])
            jd.onSave = (data, btn) => { Api.saveRecord(data) }
            main.appendChild(jd.node)
        }
    }

    setupBackToTop() {
        const dist = 10;
        const backBtn = document.querySelector('.btn-back-to-top')

        document.addEventListener('scroll', () => {
            if (window.scrollY > dist) {
                backBtn.classList.remove('hidden-op')
            } else {
                backBtn.classList.add('hidden-op')
            }
        })
    }
}

export default App
