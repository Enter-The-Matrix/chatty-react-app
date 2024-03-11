import Users from "../model/user.model.js";

export const getUsersForSidebar = async (req, res )=>{
    try {
        const loggedInUser = req.user._id

        const filteredUsers = await Users.find({_id:{$ne:loggedInUser}}).select("-password")

        res.status(200).json(filteredUsers)

    } catch (error) {
        console.log("Error in getUsersForSidebar in user controller",error.message);
        res.status(500).json({error:"Internal server error"})
    }
}