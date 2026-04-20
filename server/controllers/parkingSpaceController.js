const ParkingSpace = require("../models/ParkingSpace");
const ParkingSpaceImage = require("../models/ParkingSpaceImage");
const User = require("../models/User");

const getParkingSpaces = async (_req, res) => {
  try {
    const parkingSpaces = await ParkingSpace.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "first_name", "last_name", "email", "user_type_id"],
        },
        {
          model: ParkingSpaceImage,
          attributes: ["id", "img_path"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(parkingSpaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createParkingSpace = async (req, res) => {
  const {
    user_id,
    space_name,
    location,
    latitude,
    longitude,
    price_per_hour,
    slots_available,
    description,
  } = req.body;
  const imageFiles = req.files || [];

  try {
    const provider = await User.findByPk(user_id);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    if (provider.user_type_id !== 2) {
      return res.status(400).json({
        error: "Only approved providers can create parking spaces",
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Map location is required",
      });
    }

    const parkingSpace = await ParkingSpace.create({
      user_id,
      space_name,
      location,
      latitude,
      longitude,
      price_per_hour,
      slots_available,
      description,
    });

    if (imageFiles.length) {
      await ParkingSpaceImage.bulkCreate(
        imageFiles.map((file) => ({
          parking_space_id: parkingSpace.id,
          img_path: `/uploads/parking-spaces/${file.filename}`,
        })),
      );
    }

    const createdParkingSpace = await ParkingSpace.findByPk(parkingSpace.id, {
      include: [
        {
          model: User,
          attributes: ["id", "first_name", "last_name", "email", "user_type_id"],
        },
        {
          model: ParkingSpaceImage,
          attributes: ["id", "img_path"],
        },
      ],
    });

    return res.status(201).json(createdParkingSpace);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateParkingSpace = async (req, res) => {
  const { id } = req.params;
  const {
    user_id,
    space_name,
    location,
    latitude,
    longitude,
    price_per_hour,
    slots_available,
    description,
  } = req.body;
  const imageFiles = req.files || [];

  try {
    const parkingSpace = await ParkingSpace.findByPk(id);

    if (!parkingSpace) {
      return res.status(404).json({ error: "Parking space not found" });
    }

    if (parkingSpace.user_id !== user_id) {
      return res.status(403).json({ error: "You can only edit your own parking spaces" });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Map location is required",
      });
    }

    await parkingSpace.update({
      space_name,
      location,
      latitude,
      longitude,
      price_per_hour,
      slots_available,
      description,
    });

    if (imageFiles.length) {
      await ParkingSpaceImage.destroy({
        where: {
          parking_space_id: parkingSpace.id,
        },
      });

      await ParkingSpaceImage.bulkCreate(
        imageFiles.map((file) => ({
          parking_space_id: parkingSpace.id,
          img_path: `/uploads/parking-spaces/${file.filename}`,
        })),
      );
    }

    const updatedParkingSpace = await ParkingSpace.findByPk(parkingSpace.id, {
      include: [
        {
          model: User,
          attributes: ["id", "first_name", "last_name", "email", "user_type_id"],
        },
        {
          model: ParkingSpaceImage,
          attributes: ["id", "img_path"],
        },
      ],
    });

    return res.json(updatedParkingSpace);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteParkingSpace = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const parkingSpace = await ParkingSpace.findByPk(id);

    if (!parkingSpace) {
      return res.status(404).json({ error: "Parking space not found" });
    }

    if (parkingSpace.user_id !== user_id) {
      return res.status(403).json({ error: "You can only delete your own parking spaces" });
    }

    await ParkingSpaceImage.destroy({
      where: {
        parking_space_id: parkingSpace.id,
      },
    });

    await parkingSpace.destroy();

    return res.json({ message: "Parking space deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getParkingSpaces,
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace,
};
