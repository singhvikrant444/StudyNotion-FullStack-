const express = require("express");

const { createCourse, showAllCourses } = require("../controllers/Course");
const { createTag, showAlltags } = require("../controllers/Category");
const { createSection, updateSection, deleteSection } = require("../controllers/Section");
const { createSubsection } = require("../controllers/Subsection");
const { auth, isInstructor } = require("../middlewares/auth");

const router = express.Router();

// Fallback to auth-only when role middleware export is currently unavailable.
const instructorOnly = typeof isInstructor === "function" ? [auth, isInstructor] : [auth];

router.post("/createCourse", ...instructorOnly, createCourse);
router.post("/addSection", ...instructorOnly, createSection);
router.post("/updateSection", ...instructorOnly, updateSection);
router.post("/deleteSection", ...instructorOnly, deleteSection);
router.post("/addSubSection", ...instructorOnly, createSubsection);
router.post("/createTag", ...instructorOnly, createTag);

router.get("/showAllTags", showAlltags);
router.get("/showAllCourses", showAllCourses);

module.exports = router;
