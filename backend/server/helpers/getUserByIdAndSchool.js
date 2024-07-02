import User from "../models/user.js";

async function getUserByIdAndSchool(id, school) {
  try {
    const user = await User.findOne({
      id,  // Buscar por id directamente
      school 
    });
    
    if (!user) {
      throw new Error('El usuario con el ID y escuela ingresada no existe');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export default {
  getUserByIdAndSchool
};