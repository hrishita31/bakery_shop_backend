import {TeamRegister} from '../model/teamModel.js';

const registerToTeam = async(teamData) => {
    const team = new TeamRegister(teamData);
    return await team.save();
}

const addMember = async(memberId) => {
    const member = await TeamRegister.findOneAndUpdate({_id:memberId}, {isApproved:true}, {new:true});
    return member;
}

const showMembers = async() => {
    const memberList =await TeamRegister.find({isApproved:null});
        return memberList;
}

const showTeamMembers = async() => {
    const teamMembers = await TeamRegister.find({isApproved:true})
    return teamMembers;
}

const removeMember = async(memberId) => {
    const member = await TeamRegister.findOneAndUpdate({_id:memberId},  {isApproved:false},{new:true});
    return member;
}

export {registerToTeam, addMember, showMembers, showTeamMembers, removeMember};