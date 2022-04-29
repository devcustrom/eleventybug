const { characteristicsFields } = require("../js/admin/characteristics/characteristicsFields.json")
const { characteristics } = require("../js/admin/characteristics/characteristics.json")

module.exports = () => {
	let test = []
	characteristics.forEach(item => {
		const $item = Object.assign({}, item);
		let field = characteristicsFields.find(i => i.name === $item.type)
		if (field !== undefined) {
			$item.label = field.label
			$item.type = field.type
			$item.unit = field.unit ? field.unit : false
			test.push($item)
		}
	});

	return test
}
