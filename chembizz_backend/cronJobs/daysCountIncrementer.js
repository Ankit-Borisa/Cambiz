const packageBookingSchema = require("../models/package_booking");
const cron = require("node-cron");

const getISTTimeString = () => {
    return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

const daysCountCron = async() => {

  // Schedule job at 12:05 AM IST
  cron.schedule(
    "5 0 * * *",
    async () => {
      try {
        console.log(`⏰ [${getISTTimeString()}] Cron job started to increment daysCount`);
        const package_bookings = await packageBookingSchema.find({status:"active"}).populate("plan_id");

        await Promise.all(package_bookings.map(async(booking)=>{

            if (booking.plan_id && booking.plan_id.plan_days > booking.daysCount) {
                booking.daysCount += 1;
                booking.updatedAt = new Date(); 
                await booking.save();
                // console.log(`✅ Updated booking ${booking._id}: daysCount is now ${booking.daysCount}`);
              }

        }))

        console.log(`⏰ [${getISTTimeString()}] Cron job Ended to increment daysCount`);
      } catch (error) {
        console.error("❌ Error in cron job:", error);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

module.exports = {daysCountCron};
