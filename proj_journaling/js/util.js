
class Storage
{
    static getArray(key)
    {
        const tmp = Storage.getItemOrDefault(key, "[]")
        const tmp1 = JSON.parse(tmp)
        return Array.from(tmp1)
    }

    static setArray(key, array)
    {
        localStorage.setItem(key, JSON.stringify(array))
    }

    static removeItem(key)
    {
        localStorage.removeItem(key)
    }

    static getItemOrDefault(key, defValue)
    {
        let value = localStorage.getItem(key)
        if (value === null)
            value = defValue
        return value
    }
}

export default Storage
