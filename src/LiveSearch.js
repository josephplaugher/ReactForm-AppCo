import Ajax from './Ajax'

class LiveSearch {
    constructor(){
        //live search array for locating these values for the form
        this.lsa = ['acctname','acctno','bankname','bankno','customer','customerid,supplier','supplierid',
        'prop-id','prop-ein','prop-entityname','prop-shortname',
        'prop-type','prop-street','prop-city','prop-state','prop-zip'];
    }

    getLSA = () => {
        return this.lsa;
    }

    search = (name, value, url) => {
        return new Promise( (resolve, reject) => {
        Ajax.get(url + 'name.value')
            .then((res) => {
                resolve(res);
                reject(res.data.error);
                });
        });
    }
}

export default LiveSearch;