let B = require('./TimeBase')
let _ = require('lodash')

class C extends B {
  // 扩展find 机密字段保护
  static async find ({ one, filter, fields, sort, skip, limit }) {
    if (!fields || !fields.length) {
      throw new Error('fields必须明确定义')
    }
    let sect = _.intersection(fields, this.secretFields)
    if (sect.length) {
      throw new Error(`其中${sect}为机密字段 不可直接返回`)
    }
    return super.find({ one, filter, fields, sort, skip, limit })
  }

  // paginate 便于分页场景的find
  static async paginate ({ filter, fields, pagin }) {
    let { sort, skip, limit } = pagin
    let [total, docs] = await Promise.all([
      this.count({ filter }), // 获取总个数
      this.find({ filter, fields, sort, skip, limit })
    ])
    return { total, docs }
  }
}

C.secretFields = []

module.exports = C
