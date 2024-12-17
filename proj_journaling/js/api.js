import Storage from  './util.js'

export default class Api
{
    static STORAGE_KEY = 'records'

    static getRecords()
    {
        let records = Storage.getArray(Api.STORAGE_KEY)
        records.sort((r1, r2) => r2.timestamp - r1.timestamp)
        return records
    }

    static getRecordsMock()
    {
        Storage.removeItem(Api.STORAGE_KEY)
        return [
            {timestamp: 1734223117, entry: "the next day"},
            {timestamp: 1734125915, entry: "init"},
        ]
    }

    static saveRecord(record)
    {
        const records = Storage.getArray(Api.STORAGE_KEY)

        const idx = records.findIndex(r => r.timestamp === record.timestamp)
        if (idx !== -1)
            records[idx] = record
        else
            records.push(record)

        Storage.setArray(Api.STORAGE_KEY, records)

        return record.id
    }
}
