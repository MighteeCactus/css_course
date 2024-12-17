
class WeatherApi {

    key = '35d1d9377f164fa4aa6215746241012'
    urlNow = 'https://api.weatherapi.com/v1/current.json?key=&q='
    urlThen = 'https://api.weatherapi.com/v1/history.json?key=&q='

    cache = {}

    constructor(lat, lon) {
        this.lat = lat
        this.lon = lon
        console.log(this.lat)
        console.log(this.lon)
    }

    setCoord(lat, lon) {
        this.lat = lat
        this.lon = lon
    }

    getTemperature(isDay, timestamp = null) {
        if (typeof isDay !== typeof true) {
            return new Promise((resolve, reject) => {
                reject('Set isDay arg')
            })
        }

        const date = timestamp === null ?
            new Date() :
            new Date(timestamp)
        date.setHours(0,0,0,0)
        const now = new Date()
        now.setHours(0,0,0,0)

        const isNow = Math.abs(now.getTime() - date.getTime()) < 10000;


        let data = null;
        const cached = this.getCached(date)
        if (cached === null)
        {
            let url = new URL(isNow ? this.urlNow : this.urlThen)

            let search = url.searchParams;
            search.set('q', `${this.lat},${this.lon}`)
            search.set('key', this.key)

            if (!isNow) {
                search.set('dt', date.getTime())
            }

            // url.searchParams = search
            console.log(url.toString())

            return fetch(url.toString()).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json()
            }).then(json => {
                console.log(json)
                this.setCached(date, json)
                return this.getTemperature(isDay, timestamp)
            })
        }

        data = this.cache[date.getTime()]

        return new Promise((resolve) => {
            resolve(data['temp'][isDay ? 'day' : 'night'])
        })
    }

    getCached(key) {
        const val = this.cache[Math.floor(key.getTime())]
        return val === undefined ? null : val
    }

    setCached(key, value) {
        this.cache[Math.floor(key.getTime())] = value
    }
}

export {WeatherApi}


