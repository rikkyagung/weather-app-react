import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
   const [theme, setTheme] = useState(localStorage.theme);
   const colorTheme = theme === "dark" ? "light" : "dark";
   const [location, setLocation] = useState("Jakarta");
   const [search, setSearch] = useState("");
   const [status, setStatus] = useState("idle");
   const isLoading = status === "idle" || status === "pending";
   const isError = status === "reject";
   const [errorMessage, setErrorMessage] = useState("");
   const [placeInfo, setPlaceInfo] = useState({
      name: "",
      country: "",
      condition: "",
      cloud: "",
      icon: "",
      temp_celcius: "",
      feelslike_celcius: "",
      last_updated: "",
   });

   const URL = `https://api.weatherapi.com/v1/current.json?key=`;
   const API_KEY = `ba2541601ff44a9e98734526220805`;
   const place = `&q=${location}&aqi=no`;

   useEffect(() => {
      const fetchWeather = async () => {
         setStatus("pending");

         await axios
            .get(`${URL}${API_KEY}${place}`)
            .then((res) => {
               setStatus("resolved");
               const current = res.data.current;
               const location = res.data.location;

               setPlaceInfo({
                  name: location.name,
                  country: location.country,
                  condition: current.condition.text,
                  cloud: current.cloud,
                  icon: current.condition.icon,
                  temp_celcius: current.temp_c,
                  feelslike_celcius: current.feelslike_c,
                  last_updated: current.last_updated,
               });
            })
            .catch((error) => {
               setErrorMessage(error.response.data.error.message);
               setStatus("reject");
            });
      };

      fetchWeather();
   }, [location]);

   useEffect(() => {
      const root = window.document.documentElement;
      root.classList.add(colorTheme);
      root.classList.remove(theme);

      // keep value theme on local storage
      localStorage.setItem("theme", theme);
   }, [theme, colorTheme]);

   const handleChange = (event) => {
      const target = event.target.value;
      setSearch(target);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      setLocation(search);
      setSearch("");
   };

   return (
      <main className="flex h-screen items-center px-8 transition-all duration-200 ease-linear dark:bg-slate-800">
         <div className="mx-auto w-[28rem] sm:w-[37rem] sm:rounded-xl sm:p-10 sm:shadow-lg dark:sm:shadow-slate-900 md:w-[42rem]">
            <h1 className="text-center text-3xl font-bold leading-10 tracking-wide text-slate-800 dark:text-slate-50">
               Simple Weather App
            </h1>
            <p className="mt-2 mb-4 text-center text-slate-500 dark:text-slate-400">
               based on weatherapi.com
            </p>
            <div className="flex justify-end">
               <span
                  className="flex cursor-pointer items-center justify-center rounded-full bg-slate-200 p-2 shadow-lg dark:bg-slate-500 dark:shadow-slate-700/50"
                  onClick={() => {
                     setTheme(colorTheme);
                  }}
               >
                  {theme === "dark" ? (
                     <svg
                        className="h-6 w-6"
                        fill="#1E293B"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                     </svg>
                  ) : (
                     <svg
                        className="h-6 w-6"
                        fill="#F8FAFC"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           fillRule="evenodd"
                           d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                           clipRule="evenodd"
                        />
                     </svg>
                  )}
               </span>
            </div>

            <form
               method="post"
               onSubmit={handleSubmit}
               className="mt-10 flex gap-2"
            >
               <input
                  type="text"
                  value={search}
                  className="w-full rounded-full border-2 px-4 focus-visible:outline-slate-400"
                  placeholder="Search place..."
                  onChange={handleChange}
               />
               <button
                  disabled={!search}
                  className="rounded-full bg-indigo-500 px-7 py-2 text-slate-50 shadow-lg shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
               >
                  Check
               </button>
            </form>

            {isError ? (
               <p className="mt-8 text-center text-slate-800 dark:text-slate-50">
                  {errorMessage}
               </p>
            ) : (
               <>
                  {isLoading ? (
                     <p className="mt-8 text-center text-slate-800 dark:text-slate-50">
                        Loading...
                     </p>
                  ) : (
                     <>
                        <p className="mt-8 text-center text-slate-800 dark:text-slate-50">
                           Rigth now in{" "}
                           <span className="font-bold">
                              {placeInfo.name} - {placeInfo.country}
                           </span>
                           , it's
                           <span className="font-bold">
                              {" "}
                              {placeInfo.condition.charAt(0).toLowerCase() +
                                 placeInfo.condition.slice(1)}
                           </span>
                        </p>
                        <div className="mt-8 grid grid-cols-2 grid-rows-2 place-items-center overflow-hidden text-slate-800">
                           <div className="row-span-2">
                              <img
                                 src={placeInfo.icon}
                                 alt="weather icon"
                                 className="text-xl"
                              />
                           </div>
                           <p className="text-5xl font-medium dark:text-slate-50">
                              {placeInfo.cloud}
                           </p>
                           <p className="text-slate-500 dark:text-slate-400">
                              {placeInfo.temp_celcius}&#176;C /{" "}
                              {placeInfo.feelslike_celcius}
                              &#176;C
                           </p>
                        </div>
                        <p className="mt-4 text-center text-slate-500 dark:text-slate-400">
                           Last Update: {placeInfo.last_updated}
                        </p>
                     </>
                  )}
               </>
            )}
         </div>
      </main>
   );
}

export default App;
