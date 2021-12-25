'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class image extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// models.belongsTo(project)
			image.belongsTo(models.project)
		}
	};
	image.init({
		url: DataTypes.TEXT('long'),
		projectId: DataTypes.INTEGER,
		isThumbnail: DataTypes.INTEGER,
	}, {
		sequelize,
		modelName: 'image',
	});
	return image;
};