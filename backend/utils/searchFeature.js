
class searchFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // Pagination
    paginate(page, limit) {
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    // Sort
    sort() {
        if (this.queryStr.sort) {
            const [field, order = "asc"] = this.queryStr.sort.split(",");
            const sortBy = {};
            sortBy[field] = order === "desc" ? -1 : 1;
            this.query = this.query.sort(sortBy);
        }
        return this;
    }

    // Search
    search() {
        if (this.queryStr.keyword) {
            const keyword = this.queryStr.keyword;
            const keywordFilter = {
                $or: [
                    { drivingSchoolName: { $regex: keyword, $options: 'i' } },
                    { about: { $regex: keyword, $options: 'i' } },
                ]
            };
            this.query = this.query.find(keywordFilter);
        }
        return this;
    }

    userSearch(){
        if (this.queryStr.keyword) {
            const keywordFilter = {
                name: { $regex: this.queryStr.keyword, $options: 'i' }
            };
            this.query = this.query.find(keywordFilter); // Apply the search filter
        }
        return this;
    }

        // Search
        courseSearch() {
            if (this.queryStr.keyword) {
                const keyword = this.queryStr.keyword;
                const keywordFilter = {
                    $or: [
                        { title: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } },
                    ]
                };
                this.query = this.query.find(keywordFilter);
            }
            return this;
        }

    // Time-based filtering
    timeFilter() {
        if (this.queryStr.time) {
            const now = new Date();
            let startDate;

            switch (this.queryStr.time) {
                case '24h':
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last week
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); // Last month
                    break;
                default:
                    return this; // If no valid time filter, do nothing
            }
            // Apply the filter correctly
            const typeFilter = { createdAt: { $gte: startDate } };
            this.query = this.query.find(typeFilter);
        }

        return this;
    }

    // Execute the query and return the result
    async exec() {
        return await this.query.exec(); // Ensure the query is executed properly
    }
}

module.exports = searchFeatures;
