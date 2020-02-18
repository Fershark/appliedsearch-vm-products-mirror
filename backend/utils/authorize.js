const VM = require("../models/VM");

exports.checkOwnership = async (user_id, vm_id) => {
  let isOwner = await VM.checkOwnership(user_id, vm_id);
  console.log("isOwner: ", isOwner[0][0].result);
  if (isOwner[0][0].result == 0) {
    throw new Error("Ownership does not exist!")
  }
}