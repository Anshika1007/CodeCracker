import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    contact: String,
    skills: [String],
    experience: [{ company: String, role: String, duration: String }],
    education: [{ school: String, degree: String, year: String }],
    projects: [{ title: String, description: String }],
});

export default mongoose.model("Resume", ResumeSchema);
