import Team from '../model/teamModel.js';

const addTeamMember = async(teamData) => {
    const team = new Team(teamData);
    return await team.save();
}

export {addTeamMember};