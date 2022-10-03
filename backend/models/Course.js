const mongoose = require("mongoose");
const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required:[true,"Course Title is required"]
    },
    description: {
        type: String,
        required:[true,"Course Description is required"]
    },
    lectures: [{
        title: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required:true
        },
        video: {
            public_id: {
                type: String,
                required:true
            },
            url: {
                type: String,
                required:true
            }
        },
    }],
    poster: {
        public_id: {
            type: String,
            required:true
        },
        url: {
            type: String,
            required:true
        }
    },
    views: {
        type: Number,
        default:0
    },
    numOfVideos: {
        type: Number,
        default:0
    },
    category: {
        type: String,
        required:true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
});

const Course = mongoose.model("Courses", courseSchema);
module.exports = Course;