module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Admin', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'admins',
    timestamps: false
  });
};
