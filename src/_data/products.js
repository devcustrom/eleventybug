const datas = require("./all-data.json")
const prices = require("./api/all-api.json")
const test = require("./test")

module.exports = () => {
	return datas.products.filter(item => {
		console.log("in product", test())
		item.offers.filter(offer => {
			let api = prices.products.find(i => i.code === offer.code)
			if(api !== undefined) {
				offer.price = api.price !== undefined ? api.price : false
				offer.oldPrice = api.oldPrice !== undefined ? api.oldPrice : false
				offer.optPrice = api.optPrice !== undefined ? api.optPrice : false
			} else {
				offer.price = false
			}

			return offer.enabled && offer.price ? offer : false
		})
		return item.enabled && item.offers.length > 0 ? item : false
	})
}
