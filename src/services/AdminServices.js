//#region Multiple Delete
export const multipleDelete = async (body, table) => {
    try {
       let dd = body.id.filter(async (game) => {
          let deleteGame = await table.findOneAndDelete({ _id: game })
          return deleteGame
       })
    } catch (error) {
       console.log(error, "error");
    }
 };
 
 export const multipleDeleteUpdate = async (body, table) => {
    try {
       let dd = body.id.filter(async (game) => {
          let deleteGame = await table.findByIdAndUpdate({ _id: game }, { $set: { isDeleted: true } }, { new: true })
          return deleteGame
       })
    } catch (error) {
       console.log(error, "error");
    }
 };