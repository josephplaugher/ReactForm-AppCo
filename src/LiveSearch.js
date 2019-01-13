import Ajax from './Ajax'

class LiveSearch {
    constructor(lsa){
        //set live search array 
        //this determined was fields will
        //trigger a live search
        this.lsa = lsa
        //console.log('live search array in constructor: ',lsa)
    }

    getLSA = () => {
        return this.lsa;
    }

    search = (name, value, url) => {
        //console.log('ls url with rfa: ', url)
        return new Promise( (resolve, reject) => {
        Ajax.get(url + 'name.value')
            .then((res) => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
            })
        });
    }
}

export default LiveSearch;