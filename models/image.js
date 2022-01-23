'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Image.init({
    email: DataTypes.STRING,
    imageId: DataTypes.STRING,
    earth_date: DataTypes.STRING,
    sol: DataTypes.INTEGER,
    url: DataTypes.STRING,
    camera_name: DataTypes.STRING,
    rover_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};