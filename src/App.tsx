import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Styles from "./App.module.css";
import { Toaster, toast } from "sonner";

interface Location {
  ip: string;
  isp: string;
  location: {
    city: string;
    region: string;
    timezone: string;
    lat: number;
    lng: number;
  };
}
type LocationType = Location | undefined;
export default function App() {
  const [location, setLocation] = useState<LocationType>(undefined);
  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_ywehIVtFVxwkmx0ZH6Dtqi2bx9lU1&ipAddress=`
      );
      const jsonData = await data.json();
      setLocation(jsonData);
    }
    fetchData();
  }, []);
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ipTest =
      /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/gi;
    if (query.length > 4) {
      const test = ipTest.test(query);
      if (!test) toast.error("Enter a valid IP Address");
      if (test) {
        toast.loading("Loading...");
        const data = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_ywehIVtFVxwkmx0ZH6Dtqi2bx9lU1&ipAddress=${query}`
        );
        toast.success("Success");
        const jsonData = await data.json();
        setLocation(jsonData);
        setQuery("");
      }
    }
  };
  return (
    <>
      <Toaster richColors />
      <header>
        <h1 className={Styles.title}>IP Address Tracker</h1>
        <form onSubmit={(e) => submitHandler(e)}>
          <input
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for any IP address"
            value={query}
          />
          <IoIosArrowForward onClick={submitHandler} className={Styles.icon} />
        </form>
        {location && (
          <div className={Styles.data}>
            <div className={`${Styles.dataBox} ${Styles.borderRight}`}>
              <p className={Styles.dataBoxTitle}>IP address</p>
              <p className={Styles.dataData}>{location.ip}</p>
            </div>
            <div className={`${Styles.dataBox} ${Styles.borderRight}`}>
              <p className={Styles.dataBoxTitle}>location</p>
              <p className={Styles.dataData}>{location?.location?.region}</p>
            </div>
            <div className={`${Styles.dataBox} ${Styles.borderRight}`}>
              <p className={Styles.dataBoxTitle}>timezone</p>
              <p className={Styles.dataData}>
                UTC {` ${location.location?.timezone}`}
              </p>
            </div>
            <div className={`${Styles.dataBox}`}>
              <p className={Styles.dataBoxTitle}>isp</p>
              <p className={Styles.dataData}>{location.isp}</p>
            </div>
          </div>
        )}
      </header>
      {location && (
        <div className={Styles.map}>
          <MapContainer
            center={[location.location?.lat, location.location?.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ width: "100vw", height: "100vh" }}
          >
            <TileLayer
              noWrap={true}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.location?.lat, location.location?.lng]}>
              <Popup>{location.location?.city}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </>
  );
}
