import Nedb from 'nedb'

export class NedbRepository<T> {
  private readonly nedb: Nedb

  constructor(dbName: string) {
    this.nedb = new Nedb({
      filename: dbName,
      autoload: true,
      timestampData: true
    })
  }

  /**
   * find all 查询全部
   */
  async findAll(): Promise<Array<T>> {
    return this.find({})
  }

  /**
   * find by primary key
   * @param _id primary key
   */
  async findById(_id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.find({ _id })
        .then(res => resolve(res[0]))
        .catch(error => reject(error))
    })
  }

  /**
   * find by options
   * @param options search options
   */
  async find(options): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      this.nedb.find(options, (error, docs) => {
        if (error) {
          reject(error)
        }
        resolve(docs)
      })
    })
  }

  /**
   * insert new data
   * @param data new data
   */
  async insert(data: T): Promise<T> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(data, (error, doc) => {
        if (error) {
          reject(error)
        }
        resolve(doc)
      })
    })
  }

  /**
   * delete by id
   * @param _id
   */
  async deleteById(_id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.nedb.remove({ _id }, (error, removedNum) => {
        if (error) {
          reject(error)
        }
        resolve(removedNum)
      })
    })
  }
}
