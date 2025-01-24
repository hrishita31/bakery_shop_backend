import Class from '../model/classModel.js';

const addStudent = async(classData) => {
    const classes = new Class(classData);
    return await classes.save();
}

export {addStudent};