
export default class JournalDay
{
    DAY_MS = 24 * 60 * 60 * 1000

    tracks = []
    widgets = null
    date = null
    text = null

    regexBlock = new RegExp('\\[(\\d)+;\\s*([\\d:]*);\\s*([\\d:]*);\\s*(.*)\\]', 'gm')

    isInit

    onSave = (data, btn) => { throw new Error('Not implemented') }

    constructor(data)
    {
        const tpl = document.querySelector('template#journal-day')
        this.node = tpl.content.cloneNode(true);
        this.node = this.node.querySelector('section')

        this.tracks = this.node.querySelectorAll('.track')

        this.day = this.node.querySelector('.day-meta .day')
        this.node.setAttribute('timestamp', data.timestamp)
        this.date = new Date(data.timestamp * 1000)
        this.date.setHours(0,0,0,0)
        this.day.textContent = this.date.getDate() + (!this.isToday ? '': ', Today')

        this.text = this.node.querySelector('.day-text')
        this.text.textContent = data.entry

        this.widgets = this.node.querySelector('#widgets')

        if (this.isToday)
            this.runCurrentTimeMark()
        else
            this.node.querySelector('.tracks-current-time').hidden = true

        this.entryChanged(this.text)
        this.text.addEventListener('keyup', () => this.entryChanged())

        this.node.querySelector('.save-day').addEventListener('click', (evt) =>
        {
            this.id = this.onSave(this.export(), evt.target)
            this.setDirty(false)
            this.parseBlocks()
        })

        this.setDirty(false)

        this.isInit = true

        this.parseBlocks()
    }

    entryChanged(text) {
        if (!this.isInit) return

        this.setDirty(true)
    }

    export()
    {
        // normalize date
        const date = new Date(this.node.getAttribute('timestamp') * 1000)
        date.setHours(0 ,0 ,0 ,0)
        const ts = Math.floor(date.getTime() / 1000)
        this.node.setAttribute('timestamp', ts)

        return {
            timestamp: ts,
            entry: this.text.value.trim()
        }
    }

    parseBlocks()
    {
        this.tracks[0].innerHTML = ''
        this.tracks[1].innerHTML = ''

        for (const match of this.text.value.matchAll(this.regexBlock)) {
            this.addBlock(match[1], match[2], match[3], match[4])
        }
    }

    addBlock(trackId, from, to, label)
    {
        if (trackId < 1 || trackId > this.tracks.length) return

        const tpl = document.querySelector('template#track-block')
        const block = tpl.content.cloneNode(true).querySelector('div')
        block.setAttribute('title', label)
        block.setAttribute('data-from-ts', from)
        block.setAttribute('data-to-ts', to)
        block.querySelector('.hint').textContent = label

        block.style.top    = `${this.dayOffset(to)}%`
        block.style.bottom = `${100 - this.dayOffset(from)}%`

        // console.log(`${block.style.top} :: ${block.style.bottom}`)

        this.tracks[trackId - 1].appendChild(block)
    }

    runCurrentTimeMark() {
        const mark = this.node.querySelector('.tracks-current-time')

        const interval = 60 // once a minute
        const self = this
        function moveAndWait() {
            const now = new Date() - new Date().setHours(0, 0, 0, 0)
            let pers = (now / self.DAY_MS) * 100

            pers = 100 - Math.max(1, Math.min(pers, 99))
            mark.style.top = `${pers}%`

            setTimeout(moveAndWait, interval * 1000)
        }

        moveAndWait()
    }

    setDirty(value) {
        if (value)
            this.node.classList.add('has-changes')
        else
            this.node.classList.remove('has-changes')
    }

    get isToday()
    {
        return Date.now() - this.date < this.DAY_MS
    }

    dayOffset(time) {
        let date1 = new Date(`2000-01-01T${time}Z`);
        let date2 = new Date(`2000-01-02T00:00Z`);
        return ((date2 - date1) / this.DAY_MS) * 100
    }
}
