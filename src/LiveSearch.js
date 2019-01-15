import Ajax from './Ajax'

class LiveSearch {
    constructor(lsa){
        //Set live search array. 
        //this determines what fields will
        //trigger a live search
        this.lsa = lsa
    }

    getLSA = () => {
        return this.lsa;
    }

    search = (name, value, url) => {
        return new Promise( (resolve, reject) => {
        Ajax.get(url + '/name/' + name + '/value/' + value)
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