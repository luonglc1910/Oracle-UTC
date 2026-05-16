const oracledb = require('oracledb')

// Tự động convert CLOB -> String (tránh lỗi circular JSON)
oracledb.fetchAsString = [oracledb.CLOB]

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
}

// tạo pool
async function init () {
  await oracledb.createPool({
    ...dbConfig,
    poolMin: 1,
    poolMax: 10,
    poolIncrement: 1
  })

  console.log('Oracle pool connected')
}

// execute chung
async function execute (sql, binds = {}, options = {}) {
  let connection

  try {
    connection = await oracledb.getConnection()

    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      ...options
    })

    return result
  } catch (err) {
    console.error('DB Error:', err)
    throw err
  } finally {
    if (connection) {
      await connection.close()
    }
  }
}

module.exports = {
  init,
  execute
}
