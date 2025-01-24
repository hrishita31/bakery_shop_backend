import Testimony from '../model/testimonialModel.js';

const addTestimony = async(testimonyData) => {
    const testimony = new Testimony(testimonyData);
    return await testimony.save();
}

export {addTestimony};