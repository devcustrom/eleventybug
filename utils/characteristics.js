module.exports = (fields, characteristics) => {
	return characteristics.characteristics.filter(item => {
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
}
