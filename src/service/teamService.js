import Team from '../model/teamModel.js';

const addTeamMember = async(teamData) => {
    const team = new Team(teamData);
    return await team.save();
}

const showMember = async() => {
    const memberList =await Team.find();
        return memberList;
}

export {addTeamMember,showMember};