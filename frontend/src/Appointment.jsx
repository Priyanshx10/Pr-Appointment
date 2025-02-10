import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "./context/AppContext";
import { assets } from "./assets/assets";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    //getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      //getting days with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      //setting endTime of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + 1);
      endTime.setHours(21, 0, 0, 0);

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleDateString([], {
          hour: "2-digits",
          minute: "2-digit",
        });

        //add slot to array
        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
        });

        //INcrement Current Time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
    }
  };

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              src={docInfo.image}
              alt="Doctor Image"
              className="bg-primary w-full sm:max-w-72 rounded-lg "
            />
          </div>

          <div className="flex-1 border border-gray-400 py-8 rounded-lg p-8 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* Doctor Info Like Name degree And Expericence */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img
                src={assets.verified_icon}
                alt="verified_icons"
                className="w-5"
              />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              {docInfo.degree} - {docInfo.speciality}
              <button className="py-0.5 px-2 border text-sm rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* Doctor About */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="Info icon" />
              </p>
              <p className="text-sm text-gray-500 max-w-[-70p0x] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment Fee :
              <span className="text-gray-900">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default Appointment;
