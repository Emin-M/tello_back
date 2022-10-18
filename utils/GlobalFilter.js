class GlobalFilter {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    };

    filter() {
        if (this.queryStr.category_slug && !this.queryStr.query) {
            this.query.find({
                "categories.name": this.queryStr.category_slug[0]
            });
        } else if (!this.queryStr.category_slug && this.queryStr.query) {
            this.query.find({
                $or: [{
                    name: {
                        $regex: this.queryStr.query,
                        $options: "i"
                    }
                }, {
                    "categories.name": {
                        $regex: this.queryStr.query,
                        $options: "i"
                    }
                }]
            });
        } else if (this.queryStr.category_slug && this.queryStr.query) {
            let query = this.queryStr.query.split(",");
            let regex = query.join("|");
            this.query.find({
                $and: [{
                    "categories.name": this.queryStr.category_slug[0]
                }, {
                    name: {
                        $regex: regex,
                        $options: "i"
                    }
                }]
            });
        };

        return this;
    };

    sort() {
        if (this.queryStr.sortDirection) {
            const sortQuery = this.queryStr.sortDirection;

            if (this.queryStr.sortBy === "price" && sortQuery === "asc") {
                this.query.sort("price")
            } else if (this.queryStr.sortBy === "price" && sortQuery === "desc") {
                this.query.sort("-price")
            };

        } else {
            this.query.sort("-createdAt");
        };

        return this;
    };

    paginate() {
        const page = parseInt(this.queryStr.page) || 1;
        const limit = parseInt(this.queryStr.limit) || 20;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);

        return this;
    };
};

module.exports = GlobalFilter;