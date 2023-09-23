class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = {...this.queryStr};
       //console.log(queryCopy); -> { keyword: 'product2', category: 'laptop' }
        //
        const removeFields = ["keyword","page","limit"];
        removeFields.forEach(key => delete queryCopy[key]);
        // console.log(queryCopy); ->  { category: 'laptop' }
        //
       
    // Filter using price

    // converting objects into string
    let queryStr = JSON.stringify(queryCopy);
    // adding $ in front of each key in the object
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    
         // converting it back to object

       
      // this.query signifies Product.find means finding by filter {category: laptop}
     this.query = this.query.find(JSON.parse(queryStr));
    //  console.log(queryStr); -> {"price":{"$gt":"1000","$lt":"2000"}}
     return this;
  }
  
    pagination(resultperPage){
                                    // page = 2   or first 
       const currPage = Number(this.queryStr.page) || 1;
       
       const skip = resultperPage*(currPage-1);

        // query has Product find  and limit only those to per page + skipped one
       this.query = this.query.limit(resultperPage).skip(skip);

       return this;
    }

}

module.exports = ApiFeatures;
