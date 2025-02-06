import Testimony from '../model/testimonialModel.js';

const addTestimony = async(testimonyData) => {
    const testimony = new Testimony(testimonyData);
    return await testimony.save();
}

const showTestimony = async() => {
    const testimonyList =await Testimony.find();
            console.log(testimonyList, 1234)
            return testimonyList;
}

export {addTestimony, showTestimony};