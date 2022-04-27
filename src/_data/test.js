const fields = require("../js/admin/characteristics/characteristicsFields.json")
const characteristics = require("../js/admin/characteristics/characteristics.json")

module.exports = () => {
	let test = characteristics.characteristics.filter(item => {
		let field = fields.characteristicsFields.find(i => i.name === item.type)

		if(field !== undefined) {
			item.label = field.label
			item.type = field.type
			item.unit = field.unit ? field.unit : false
		} else {
			item = false
		}

		return field !== undefined ? item : false
	})
	return test
}
