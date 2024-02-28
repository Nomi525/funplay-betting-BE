import { Reward, AdminSetting } from "./../index.js";

export const dataCreate = async (data, model) => {
    return await new model(data).save();
}

export const getSingleData = async (data, model) => {
    return await model.findOne(data);
}

export const getAllData = async (where, model) => {
    return await model.find(where);
}

export const dataUpdated = async (where, data, model) => {
    return await model.findOneAndUpdate(where, { $set: data }, { new: true });
}

export const getAllDataCount = async (where, model) => {
    return await model.find(where).count();
}

export const deleteById = async (body, table) => {
    if (body.id) {
        let deleteData = await table.findByIdAndUpdate(
            { _id: body.id },
            {
                $set: {
                    is_deleted: 1,
                },
            },
            {
                new: true,
            }
        );
        return deleteData;
    }
};

// For rewards
export const createReward = async (userId, title, description) => {
    const adminSetting = await AdminSetting.findOne({}).select("rewardsPoints rewardsPoints joiningBonus");
    const rewardCreate = await dataCreate({ userId, title, points: adminSetting.rewardsPoints, description }, Reward);
    return rewardCreate;
}

export const updateApi = async (body, table) => {
    try {
      if (body.id) {
        let updateData = await table.findByIdAndUpdate(
          { _id: body.id },
          {
            $set: body,
          },
          {
            new: true,
          }
        );
        return updateData;
      }
    } catch (error) {
      console.log(error, "error");
    }
  };