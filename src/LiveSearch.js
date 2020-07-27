import React from 'react'
import Ajax from './Ajax'

class LiveSearch {
	constructor(lsa) {
		//Set live search array.
		//this determines what fields will
		//trigger a live search
		this.lsa = lsa
	}

	getLSA = () => {
		//get the list of fields that will trigger a live search
		return this.lsa
	}

	search = (name, value, url, headers, lsrSelect) => {
		// set and return the search promise
		return new Promise((resolve, reject) => {
			if (value === '') {
				// clear the live search result set if the input is blank
				resolve('')
			} else {
				Ajax.get(url + '/name/' + name + '/value/' + value, headers)
					.catch((error) => {
						reject('Live search error ', error)
					})
					.then((res) => {
						var list = res.data.lsrResult
						var newList
						// on the server, set the message desired when no results are found
						// onto the "nr" object
						if (res.data.nr) {
							newList = res.data.nr
						} else {
							// build the result set element
							newList = list.map((item) => (
								<p
									className='lsr'
									onClick={(event) => {
										lsrSelect(event)
									}}
									id={item[Object.keys(item)[0]]}
									key={item[Object.keys(item)[0]]}
								>
									{item[Object.keys(item)[0]]}
								</p>
							))
						}
						resolve(newList)
					})
			}
		})
	}
}

export default LiveSearch
