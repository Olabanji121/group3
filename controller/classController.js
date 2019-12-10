const Class = require("../models/classModel");
const User = require("../models/userModel");

exports.getAllClass = async (req, res) => {
  try {
    const lesson = await Class.find();
    res.status(200).json({
      status: "success",
      NumOFclasses: lesson.length,
      data: {
        lesson
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
};

exports.createClass = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newLesson = await Class.create({
      name: req.body.name,
      location: req.body.location,
      summary: req.body.summary,
      description: req.body.description,
      video: req.body.video,
      coverImage: req.body.coverImage,
      user: req.user.id
    });
    res.status(201).json({
      status: "success",
      createBy: user,
      data: {
        lesson: newLesson
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const lesson = await Class.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        lesson
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const lesson = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      msg: "Class updated!!",
      data: {
        lesson
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
};

exports.deleteMyClass = async (req, res) => {
  try {
    // check if class exist
    const lesson = await Class.findById(req.params.id);
    if (!lesson) return res.status(404).json({ msg: "Class not found" });

    // check if user owns the class

    if (lesson.user.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not Authorized" });
    }

    await lesson.remove();
    res.json({ msg: "Class Deleted" });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
};

// exports.updateMyClass = async (req, res) => {
//   try {
//     const lesson = await Class.findById(req.params.id);

//     if (!lesson) {
//       return res.status(404).json({ msg: "lesson not found" });
//     }

//     if (lesson.user.id.toString() !== req.user.id) {
//       return res.status(401).json({ msg: "User not Authorized" });
//     }

//     await Class.findOneAndUpdate((lesson.name = req.body.name, lesson.location = req.body.location, lesson.summary = req.body.summary,lesson.description = req.body.description, lesson.video = req.body.video, lesson.coverImage = req.body.coverImage));

//     await lesson.save();

//     res.json(lesson);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res.status(404).json({ msg: "Post not found" });
//     }
//     res.status(500).send("Server Error...");
//   }
// };

exports.updateMyClass = async (req, res) => {
  try {
  
    const less = await Class.findById(req.params.id)

    if(less.user.id.toString() !== req.user.id ){
      return res.status(401).json({ msg: "User not Authorized" });
    }
     const lesson = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error...");
  }
};


exports.getAllMyClass = async(req, res)=>{
  try {
    const lesson = await Class.find();

    const myClass = lesson.filter((el)=> el >=  req.user.id )
    console.log(myClass);

    res.status(200).json({
      status: "success",
      NumOFclasses: lesson.length,
      data: {
        myClass
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
}