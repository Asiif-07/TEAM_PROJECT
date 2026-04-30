class ApiFeatures {
  constructor(query, queryStr, allowedFields = []) {
    this.query = query;
    this.queryStr = queryStr;
    this.allowedFields = allowedFields;
  }

  filter() {
    const queryObj = {};

    for (let key in this.queryStr) {
      const baseField = key.split("[")[0];

      if (this.allowedFields.includes(baseField)) {
        const operatorMatch = key.match(/\[(gt|gte|lt|lte)\]/);

        if (operatorMatch) {
          const operator = `$${operatorMatch[1]}`;

          if (!queryObj[baseField]) {
            queryObj[baseField] = {};
          }
          queryObj[baseField][operator] = Number(this.queryStr[key]);
        } else {
          queryObj[baseField] = this.queryStr[key];
        }
      }
    }

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    const allowedSortedFields = ["price", "category", "rating", "createdAt"];

    if (this.queryStr.sort) {
      const sortFields = this.queryStr.sort.split(",");
      const safeFields = sortFields.filter((field) =>
        allowedSortedFields.includes(field.replace("-", "")),
      );
      const sortedQuery = safeFields.join(" ");

      this.query = this.query.sort(sortedQuery);
    }

    return this;
  }

  search() {
    if (this.queryStr.search) {
      const searchValue = this.queryStr.search;
      const searchField = this.queryStr.field;

      if (!searchField || searchField === "all") {
        this.query = this.query.find({ $text: { $search: searchValue } });
      } else {
        this.query = this.query.find({
          [searchField]: { $regex: searchValue, $options: "i" },
        });
      }
    }

    return this;
  }

  paginate(defaultLimit = 10) {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || defaultLimit;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export { ApiFeatures };
