const db = require('../db/oracle')

class UserModel {
  static async findAll () {
    const result = await db.execute(`SELECT ID, USER_NAME, ROLE FROM TRA_OLONG.USER_SEQ`)
    return result.rows
  }

  static async findById (id) {
    const result = await db.execute(`SELECT * FROM TRA_OLONG.USER_SEQ WHERE ID = :id`, { id })
    return result.rows[0]
  }

  static async findByCredentials (username, password) {
    const result = await db.execute(
      `SELECT ID, USER_NAME, ROLE FROM TRA_OLONG.USER_SEQ WHERE USER_NAME = :username AND PASS_WORD = :password`,
      { username, password }
    )
    return result.rows[0]
  }

  static async create (data) {
    return await db.execute(
      `INSERT INTO TRA_OLONG.USER_SEQ(USER_NAME, PASS_WORD, ROLE) VALUES(:name, :password, :role)`,
      { name: data.name, password: data.password, role: data.role || 'customer' }
    )
  }

  static async update (id, data) {
    return await db.execute(
      `UPDATE TRA_OLONG.USER_SEQ SET USER_NAME = :name, PASS_WORD = :password WHERE ID = :id`,
      { id, name: data.name, password: data.password }
    )
  }

  static async delete (id) {
    return await db.execute(`DELETE FROM TRA_OLONG.USER_SEQ WHERE ID = :id`, { id })
  }
}

module.exports = UserModel
