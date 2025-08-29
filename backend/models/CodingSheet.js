import mongoose from 'mongoose';

const CodingSheetSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    }, // Name of the sheet (e.g., Striver's SDE Sheet)
     
    description: { 
        type: String, 
        required: true 
    }, // Short description
    
    questions: [
        {
            questionTitle: { 
                type: String, 
                required: true 
            },
            difficulty: { 
                type: String, 
                enum: ['Easy', 'Medium', 'Hard'],
                required: true 
            }, // e.g., Easy, Medium, Hard
            platform: { 
                type: String, 
                required: true 
            }, // e.g., LeetCode, Codeforces
            url: { 
                type: String, 
                required: true 
            }, // URL to the question on the platform
            userProgress: {
                type: String,
                enum: ['unsolved', 'attempted', 'solved'],
                default: 'unsolved', // Default status for the question
            },
        },
    ],
    
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true 
    },
});

const CodingSheet = mongoose.model('CodingSheet', CodingSheetSchema);

export default CodingSheet;